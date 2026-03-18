// src/components/Payroll.jsx
import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    FileText,
    User,
    Search,
    Eye,
    RefreshCw,
    AlertCircle,
    ChevronDown,
    Users,
    Upload,
    X,
    Download,
    Calendar,
    DollarSign,
    FileUp,
    FileDown,
    Archive
} from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";
import { apiRequest, getCurrentUser } from "../api";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function Payroll() {
    const { darkMode } = useDarkMode();
    const { toast } = useToast();

    // User state
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Payslips state
    const [payslips, setPayslips] = useState([]);
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [fetchedEmployeeId, setFetchedEmployeeId] = useState("");

    // Upload states
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [zipFile, setZipFile] = useState(null);
    const [zipUploadLoading, setZipUploadLoading] = useState(false);

    // Filter states
    const [filterYear, setFilterYear] = useState(null);

    // Employee dropdown states
    const [employees, setEmployees] = useState([]);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef(null);

    // Months for dropdown
    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" }
    ];

    // Generate years (current year - 5 to current year + 1)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 7 }, (_, i) => currentYear - 2 + i);

    // Fetch current user on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getCurrentUser();
                setUserData(data);
                setLoading(false);
                if (data.role?.toLowerCase() === 'employee') {
                    const empId = data.employee_id || data.username;
                    setFetchedEmployeeId(empId);
                    await fetchEmployeePayslips(empId);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data");
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    // Fetch employees on mount (admin/hr/superadmin only)
    useEffect(() => {
        if (userData && (userData.role?.toLowerCase() === 'superadmin' || 
            userData.role?.toLowerCase() === 'hr' || 
            userData.role?.toLowerCase() === 'admin')) {
            fetchEmployees();
        }
    }, [userData]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchEmployees = async () => {
        setLoadingEmployees(true);
        try {
            const data = await apiRequest("/db/employment-applications");
            setEmployees(data || []);
        } catch (err) {
            console.error("Error fetching employees:", err);
        } finally {
            setLoadingEmployees(false);
        }
    };

    const fetchEmployeePayslips = async (employeeId, year = null) => {
        setLoading(true);
        setError("");
        setSelectedPayslip(null);

        try {
            let url = `/payslips/${employeeId}`;
            if (year) {
                url += `?year=${year}`;
            }
            const data = await apiRequest(url);
            setPayslips(data.payslips || []);
            
            if (data.payslips.length === 0) {
                setError("No payslips found for this employee");
            }
        } catch (err) {
            console.error("Error fetching payslips:", err);
            setError(err.message || "Failed to fetch payslips. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadAll = async () => {
        if (!selectedEmployee && userRole === 'employee') {
            setError("No employee selected");
            return;
        }

        const empId = userRole === 'employee' 
            ? (userData?.employee_id || userData?.username)
            : selectedEmployee?.employee_id;

        if (!empId) {
            toast({
                title: "Error",
                description: "No employee selected",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);
            const url = filterYear 
                ? `/payslips/${empId}/download-all?year=${filterYear}`
                : `/payslips/${empId}/download-all`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to download payslips');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            const yearLabel = filterYear || 'all';
            link.download = `payslips_${empId}_${yearLabel}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            toast({
                title: "Success",
                description: "Payslips downloaded successfully",
                className: darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800",
            });
        } catch (err) {
            console.error("Error downloading payslips:", err);
            toast({
                title: "Download Failed",
                description: err.message || "Failed to download payslips",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadSingle = async (payslip) => {
        const empId = userRole === 'employee' 
            ? (userData?.employee_id || userData?.username)
            : selectedEmployee?.employee_id;

        try {
            const response = await apiRequest(`/payslips/${empId}/${payslip.year}/${payslip.month}`);
            
            if (response.download_url) {
                window.open(response.download_url, '_blank');
                
                toast({
                    title: "Success",
                    description: "Payslip opened in new tab",
                    className: darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800",
                });
            }
        } catch (err) {
            console.error("Error downloading payslip:", err);
            toast({
                title: "Download Failed",
                description: err.message || "Failed to download payslip",
                variant: "destructive",
            });
        }
    };

    const handleDeletePayslip = async (payslip) => {
        if (!selectedEmployee && userRole === 'employee') return;
        
        if (!window.confirm(`Are you sure you want to delete payslip for ${payslip.month}/${payslip.year}?`)) {
            return;
        }

        const empId = selectedEmployee?.employee_id;

        try {
            await apiRequest(`/payslips/${empId}/${payslip.id}`, {
                method: 'DELETE'
            });

            toast({
                title: "Success",
                description: "Payslip deleted successfully",
                className: darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800",
            });

            // Refresh payslips
            await fetchEmployeePayslips(empId, filterYear);
        } catch (err) {
            console.error("Error deleting payslip:", err);
            toast({
                title: "Delete Failed",
                description: err.message || "Failed to delete payslip",
                variant: "destructive",
            });
        }
    };

    const handleSingleUpload = async () => {
        if (!selectedEmployee && userRole === 'employee') {
            toast({
                title: "Error",
                description: "No employee selected",
                variant: "destructive",
            });
            return;
        }

        if (!selectedFile) {
            toast({
                title: "Error",
                description: "Please select a PDF file to upload",
                variant: "destructive",
            });
            return;
        }

        if (selectedFile.type !== 'application/pdf') {
            toast({
                title: "Error",
                description: "Only PDF files are allowed",
                variant: "destructive",
            });
            return;
        }

        const empId = selectedEmployee?.employee_id;

        setUploadLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const queryParams = new URLSearchParams({
                month: selectedMonth,
                year: selectedYear
            }).toString();

            await apiRequest(`/payslips/${empId}?${queryParams}`, {
                method: 'POST',
                body: formData,
                headers: {}
            });

            toast({
                title: "Success",
                description: `Payslip for ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear} uploaded successfully`,
                className: darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800",
            });

            // Reset form
            setSelectedFile(null);
            const fileInput = document.getElementById('single-payslip-upload');
            if (fileInput) fileInput.value = '';

            // Refresh payslips
            await fetchEmployeePayslips(empId, filterYear);
        } catch (err) {
            console.error("Error uploading payslip:", err);
            toast({
                title: "Upload Failed",
                description: err.detail || err.message || "Failed to upload payslip",
                variant: "destructive",
            });
        } finally {
            setUploadLoading(false);
        }
    };

    const handleZipUpload = async () => {
        if (!zipFile) {
            toast({
                title: "Error",
                description: "Please select a ZIP file to upload",
                variant: "destructive",
            });
            return;
        }

        setZipUploadLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', zipFile);

            const result = await apiRequest('/payslips/upload-zip', {
                method: 'POST',
                body: formData,
                headers: {}
            });

            toast({
                title: "Upload Complete",
                description: `${result.total_uploaded} payslips uploaded, ${result.total_skipped} skipped, ${result.total_errors} errors`,
                className: darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800",
            });

            // Reset
            setZipFile(null);
            const fileInput = document.getElementById('zip-payslip-upload');
            if (fileInput) fileInput.value = '';

            // Refresh payslips if an employee is selected
            if (selectedEmployee) {
                await fetchEmployeePayslips(selectedEmployee.employee_id, filterYear);
            }

            // Show errors if any
            if (result.errors.length > 0) {
                console.warn('Upload errors:', result.errors);
            }
        } catch (err) {
            console.error("Error uploading ZIP:", err);
            toast({
                title: "Upload Failed",
                description: err.detail || err.message || "Failed to upload ZIP file",
                variant: "destructive",
            });
        } finally {
            setZipUploadLoading(false);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleZipFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setZipFile(file);
        }
    };

    const handleClearFile = () => {
        setSelectedFile(null);
        const fileInput = document.getElementById('single-payslip-upload');
        if (fileInput) fileInput.value = '';
    };

    const handleClearZipFile = () => {
        setZipFile(null);
        const fileInput = document.getElementById('zip-payslip-upload');
        if (fileInput) fileInput.value = '';
    };

    const handleViewPayslip = (payslip) => {
        setSelectedPayslip(payslip);
        handleDownloadSingle(payslip);
    };

    const handleFilterByYear = (year) => {
        setFilterYear(year);
        if (selectedEmployee || userRole === 'employee') {
            const empId = userRole === 'employee' 
                ? (userData?.employee_id || userData?.username)
                : selectedEmployee?.employee_id;
            if (empId) {
                fetchEmployeePayslips(empId, year);
            }
        }
    };

    const handleClearFilter = () => {
        setFilterYear(null);
        if (selectedEmployee || userRole === 'employee') {
            const empId = userRole === 'employee' 
                ? (userData?.employee_id || userData?.username)
                : selectedEmployee?.employee_id;
            if (empId) {
                fetchEmployeePayslips(empId);
            }
        }
    };

    // Filter employees based on search
    const filteredEmployees = employees.filter(emp => {
        const searchLower = employeeSearch.toLowerCase();
        return (
            emp.name?.toLowerCase().includes(searchLower) ||
            emp.employee_id?.toLowerCase().includes(searchLower)
        );
    });

    const fetchPayslips = async () => {
        if (!selectedEmployee) {
            setError("Please select an employee");
            return;
        }
        setFetchedEmployeeId(selectedEmployee.employee_id);
        await fetchEmployeePayslips(selectedEmployee.employee_id, filterYear);
    };

    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);
        setDropdownOpen(false);
        setEmployeeSearch(`${employee.name} (${employee.employee_id})`);
        setError("");
        setHighlightedIndex(-1);
        setFetchedEmployeeId(employee.employee_id);
        setPayslips([]);
        setFilterYear(null);
        setSelectedFile(null);
        setZipFile(null);
    };

    const handleClear = () => {
        setSelectedEmployee(null);
        setEmployeeSearch("");
        setPayslips([]);
        setFetchedEmployeeId("");
        setError("");
        setSelectedPayslip(null);
        setFilterYear(null);
        setHighlightedIndex(-1);
        setSelectedFile(null);
        setZipFile(null);
        const fileInput = document.getElementById('single-payslip-upload');
        if (fileInput) fileInput.value = '';
        const zipInput = document.getElementById('zip-payslip-upload');
        if (zipInput) zipInput.value = '';
    };

    const handleKeyDown = (e) => {
        if (!dropdownOpen) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => prev < filteredEmployees.length - 1 ? prev + 1 : prev);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && filteredEmployees[highlightedIndex]) {
                    handleSelectEmployee(filteredEmployees[highlightedIndex]);
                }
                break;
            case 'Escape':
                setDropdownOpen(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    // Loading guard
    if (loading && !userData) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (error && !userData) {
        return (
            <div className="w-full min-h-screen flex items-start justify-center p-6">
                <div className="w-full max-w-4xl">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="w-full min-h-screen flex items-start justify-center p-6">
                <div className="w-full max-w-4xl">
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                        No user data available
                    </div>
                </div>
            </div>
        );
    }

    const userRole = userData?.role?.toLowerCase();
    const canUpload = userRole === 'superadmin' || userRole === 'hr' || userRole === 'admin';
    const canDelete = userRole === 'superadmin' || userRole === 'hr';

    return (
        <div className={`w-full min-h-screen p-3 sm:p-4 md:p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="mb-4 sm:mb-6">
                <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>
                    {userRole === 'employee' ? 'My Payslips' : 'Payroll Management'}
                </h1>
                <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {userRole === 'employee'
                        ? 'View and download your payslips'
                        : 'Manage employee payslips'
                    }
                </p>
            </div>

            {/* Search Section - Only for Superadmin/HR/Admin */}
            {canUpload && (
                <Card className={`p-4 sm:p-5 mb-4 sm:mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Users className={darkMode ? "text-blue-400" : "text-blue-600"} size={16} />
                        <h2 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Select Employee</h2>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <div className="relative" ref={dropdownRef}>
                            <Label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 block`}>Search Employee *</Label>
                            <div className="relative">
                                <Input
                                    value={employeeSearch}
                                    onChange={(e) => {
                                        setEmployeeSearch(e.target.value);
                                        setDropdownOpen(true);
                                        setHighlightedIndex(-1);
                                    }}
                                    onFocus={() => setDropdownOpen(true)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type to search by name or ID..."
                                    className={`pr-10 h-10 text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                                />
                                <ChevronDown
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-400'} ${dropdownOpen ? 'rotate-180' : ''}`}
                                    size={18}
                                />
                            </div>

                            {dropdownOpen && (
                                <div className={`absolute z-50 w-full mt-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'} rounded-lg shadow-xl overflow-hidden`}>
                                    <div className="max-h-36 sm:max-h-48 overflow-y-auto">
                                        {loadingEmployees ? (
                                            <div className={`px-3 py-2 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                                                <RefreshCw className="animate-spin inline-block mr-2" size={14} />
                                                Loading...
                                            </div>
                                        ) : filteredEmployees.length > 0 ? (
                                            filteredEmployees.map((employee, index) => (
                                                <div
                                                    key={employee.employee_id}
                                                    onClick={() => handleSelectEmployee(employee)}
                                                    className={`px-3 py-2 cursor-pointer transition-colors text-sm ${index === highlightedIndex
                                                        ? darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700'
                                                        : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                                                        } ${index !== filteredEmployees.length - 1 ? (darkMode ? 'border-b border-gray-700' : 'border-b border-gray-100') : ''}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium truncate">{employee.name}</p>
                                                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ID: {employee.employee_id}</p>
                                                        </div>
                                                        <User size={14} className={`${darkMode ? "text-gray-400" : "text-gray-400"} ml-2 flex-shrink-0`} />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className={`px-3 py-2 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                                                {employeeSearch ? "No employees found" : "No employees available"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                                onClick={fetchPayslips}
                                disabled={loading || !selectedEmployee}
                                className="px-4 py-2 h-10 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                            >
                                {loading ? (
                                    <><RefreshCw size={14} className="mr-2 animate-spin" />Loading...</>
                                ) : (
                                    <><Search size={14} className="mr-2" />Get Payslips</>
                                )}
                            </Button>

                            {selectedEmployee && (
                                <Button
                                    onClick={handleClear}
                                    variant="outline"
                                    className={`px-4 py-2 h-10 text-sm font-medium ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}
                                >
                                    Clear
                                </Button>
                            )}
                        </div>

                        {selectedEmployee && (
                            <div className={`p-3 ${darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'} rounded-lg`}>
                                <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                                    <strong>Selected:</strong> {selectedEmployee.name} ({selectedEmployee.employee_id})
                                </p>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {/* Upload Sections - Only for Superadmin/HR/Admin */}
            {canUpload && fetchedEmployeeId && (
                <>
                    {/* Single Payslip Upload */}
                    <Card className={`p-4 sm:p-5 mb-4 sm:mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <FileUp className={darkMode ? "text-green-400" : "text-green-600"} size={16} />
                            <h2 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                Upload Single Payslip
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <Label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Month</Label>
                                <Select value={selectedMonth ? selectedMonth.toString() : "1"} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
                                    <SelectTrigger className={`w-full mt-1 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}>
                                        <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}>
                                        {months.map(month => (
                                            <SelectItem key={month.value} value={month.value.toString()}>
                                                {month.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Year</Label>
                                <Select value={selectedYear ? selectedYear.toString() : currentYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                                    <SelectTrigger className={`w-full mt-1 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}>
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}>
                                        {years.map(year => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>PDF File</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Input
                                        id="single-payslip-upload"
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById('single-payslip-upload').click()}
                                        className={`flex-1 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        <Upload size={14} className="mr-2" />
                                        Choose File
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {selectedFile && (
                            <div className={`mb-4 p-3 rounded-lg flex items-center justify-between ${darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
                                <div className="flex items-center gap-2">
                                    <FileText size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                                    <span className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                                    </span>
                                </div>
                                <button
                                    onClick={handleClearFile}
                                    className={`p-1 rounded-full ${darkMode ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-100 text-red-500'}`}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <Button
                            onClick={handleSingleUpload}
                            disabled={uploadLoading || !selectedFile}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                        >
                            {uploadLoading ? (
                                <><RefreshCw size={18} className="mr-2 animate-spin" />Uploading...</>
                            ) : (
                                <><Upload size={18} className="mr-2" />Upload Payslip</>
                            )}
                        </Button>
                    </Card>

                    {/* ZIP Bulk Upload */}
                    <Card className={`p-4 sm:p-5 mb-4 sm:mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <Archive className={darkMode ? "text-purple-400" : "text-purple-600"} size={16} />
                            <h2 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                Bulk Upload Payslips (ZIP)
                            </h2>
                        </div>

                        <div className="mb-4">
                            <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                ZIP file should contain PDF files named in format: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">ISCSI001_2025_03.pdf</span> or <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">ISCSE004_2025_12.pdf</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="zip-payslip-upload"
                                    type="file"
                                    accept=".zip"
                                    onChange={handleZipFileSelect}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('zip-payslip-upload').click()}
                                    className={`flex-1 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
                                >
                                    <Archive size={14} className="mr-2" />
                                    Choose ZIP File
                                </Button>
                            </div>
                        </div>

                        {zipFile && (
                            <div className={`mb-4 p-3 rounded-lg flex items-center justify-between ${darkMode ? 'bg-purple-900/30 border border-purple-700' : 'bg-purple-50 border border-purple-200'}`}>
                                <div className="flex items-center gap-2">
                                    <Archive size={16} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
                                    <span className={`text-sm font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                                        {zipFile.name} ({(zipFile.size / (1024 * 1024)).toFixed(2)} MB)
                                    </span>
                                </div>
                                <button
                                    onClick={handleClearZipFile}
                                    className={`p-1 rounded-full ${darkMode ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-100 text-red-500'}`}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <Button
                            onClick={handleZipUpload}
                            disabled={zipUploadLoading || !zipFile}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
                        >
                            {zipUploadLoading ? (
                                <><RefreshCw size={18} className="mr-2 animate-spin" />Processing ZIP...</>
                            ) : (
                                <><Archive size={18} className="mr-2" />Upload ZIP</>
                            )}
                        </Button>
                    </Card>
                </>
            )}

            {/* Error Message */}
            {error && (
                <div className={`mb-4 sm:mb-6 p-3 sm:p-4 ${darkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'} rounded-lg flex items-start gap-3`}>
                    <AlertCircle className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-600'} flex-shrink-0 mt-0.5`} />
                    <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-800'}`}>{error}</p>
                </div>
            )}

            {/* Payslips List */}
            {(fetchedEmployeeId || userRole === 'employee') && !error && (
                <>
                    <div className="mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <h3 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                Payslips for:
                                <span className="text-blue-600 ml-2 text-sm sm:text-base">
                                    {userRole === 'employee'
                                        ? `${userData?.first_name} ${userData?.last_name} (${fetchedEmployeeId})`
                                        : `${selectedEmployee?.name} (${fetchedEmployeeId})`
                                    }
                                </span>
                            </h3>

                            <div className="flex flex-col sm:flex-row gap-2">
                                {/* Year Filter */}
                                <div className="flex items-center gap-2">
                                    <Select 
                                        value={filterYear?.toString() || ""} 
                                        onValueChange={(v) => {
                                            if (v === "") {
                                                handleClearFilter();
                                            } else {
                                                handleFilterByYear(parseInt(v));
                                            }
                                        }}
                                    >
                                        <SelectTrigger className={`w-32 h-9 text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}>
                                            <SelectValue placeholder="Filter year" />
                                        </SelectTrigger>
                                        <SelectContent className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}>
                                            <SelectItem value="all">All Years</SelectItem>
                                            {years.map(year => (
                                                <SelectItem key={year} value={year.toString()}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {filterYear && (
                                        <Button
                                            onClick={handleClearFilter}
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 px-2"
                                        >
                                            <X size={14} />
                                        </Button>
                                    )}
                                </div>

                                {/* Download All Button */}
                                <Button
                                    onClick={handleDownloadAll}
                                    disabled={payslips.length === 0}
                                    className="bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm"
                                >
                                    <FileDown size={14} className="mr-2" />
                                    Download All {filterYear ? `(${filterYear})` : ''}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Payslips Grid */}
                    {payslips.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
                            {payslips.map((payslip) => {
                                const monthName = months.find(m => m.value === payslip.month)?.label;
                                
                                return (
                                    <Card
                                        key={payslip.id}
                                        className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-md transition-all`}
                                    >
                                        <div className="flex flex-col h-full">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className={`p-2 rounded-full ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                                                    <DollarSign className={darkMode ? 'text-green-400' : 'text-green-600'} size={20} />
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        onClick={() => handleDownloadSingle(payslip)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        title="Download"
                                                    >
                                                        <Download size={16} />
                                                    </Button>
                                                    {canDelete && (
                                                        <Button
                                                            onClick={() => handleDeletePayslip(payslip)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                            title="Delete"
                                                        >
                                                            <X size={16} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <h4 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                                    {monthName} {payslip.year}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Calendar size={12} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        Uploaded: {new Date(payslip.uploaded_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                {payslip.uploaded_by && (
                                                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        By: {payslip.uploaded_by}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="mt-auto">
                                                <Button
                                                    onClick={() => handleViewPayslip(payslip)}
                                                    variant="outline"
                                                    size="sm"
                                                    className={`w-full ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                                                >
                                                    <Eye size={14} className="mr-2" />
                                                    View Payslip
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className={`p-8 text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <FileText size={48} className={`mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                            <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                No payslips found for this employee
                            </p>
                            {canUpload && (
                                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Upload payslips using the form above
                                </p>
                            )}
                        </Card>
                    )}
                </>
            )}

            {/* Footer */}
            <Card className={`bg-gradient-to-r ${darkMode ? 'from-gray-800 to-gray-700 border-gray-600' : 'from-gray-50 to-slate-50 border-gray-200'} p-3 sm:p-4 md:p-5 mt-6`}>
                <div className="text-center">
                    <h3 className={`text-sm sm:text-base font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>
                        ISCS Technologies Private Limited
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>PAYROLL MANAGEMENT SYSTEM</p>
                </div>
            </Card>
        </div>
    );
}