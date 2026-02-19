// src/components/Documents.jsx
import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    FileText,
    CreditCard,
    User,
    Search,
    Eye,
    ExternalLink,
    RefreshCw,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    ChevronDown,
    Users,
    Shield,
    BookOpen,
    Users as DiversityIcon,
    Lock,
    Upload,
    PenTool,
    FileSignature,
    FileCheck
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

export default function Documents() {
    const { darkMode } = useDarkMode();
    const { toast } = useToast();

    // User state
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Documents state
    const [documents, setDocuments] = useState({
        // Personal documents
        aadhar_card: null,
        pan_card: null,
        resume: null,
        profile_photo: null,
        // Policy documents
        signed_abac_policy: null,
        signed_cobec_policy: null,
        signed_diversity_policy: null,
        signed_employee_handbook: null,
        signed_info_security_policy: null,
        // NDA and Joining Letter
        signed_nda: null,
        signed_joining_letter: null
    });

    // Track unsigned documents availability
    const [hasUnsignedNDA, setHasUnsignedNDA] = useState(false);
    const [hasUnsignedJoiningLetter, setHasUnsignedJoiningLetter] = useState(false);

    const [uploadLoading, setUploadLoading] = useState(false);

    const [signLoading, setSignLoading] = useState({
        nda: false,
        joining_letter: false
    });

    const [selectedFiles, setSelectedFiles] = useState({
        nda: null,
        joining_letter: null
    });

    const [signatureFont, setSignatureFont] = useState("SignatureFont");

    const [selectedDoc, setSelectedDoc] = useState(null);
    const [fetchedEmployeeId, setFetchedEmployeeId] = useState("");

    // Employee dropdown states
    const [employees, setEmployees] = useState([]);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef(null);

    const personalDocumentConfig = [
        {
            type: "profile_photo",
            label: "Profile Photo",
            icon: User,
            color: "from-purple-50 to-pink-50",
            iconColor: "text-purple-600",
            borderColor: "border-purple-200",
            darkColor: "from-purple-900/30 to-pink-900/30",
            darkIconColor: "text-purple-400",
            darkBorderColor: "border-purple-700"
        },
        {
            type: "aadhar_card",
            label: "Aadhar Card",
            icon: CreditCard,
            color: "from-blue-50 to-indigo-50",
            iconColor: "text-blue-600",
            borderColor: "border-blue-200",
            darkColor: "from-blue-900/30 to-indigo-900/30",
            darkIconColor: "text-blue-400",
            darkBorderColor: "border-blue-700"
        },
        {
            type: "pan_card",
            label: "PAN Card",
            icon: CreditCard,
            color: "from-green-50 to-emerald-50",
            iconColor: "text-green-600",
            borderColor: "border-green-200",
            darkColor: "from-green-900/30 to-emerald-900/30",
            darkIconColor: "text-green-400",
            darkBorderColor: "border-green-700"
        },
        {
            type: "resume",
            label: "Resume",
            icon: FileText,
            color: "from-orange-50 to-red-50",
            iconColor: "text-orange-600",
            borderColor: "border-orange-200",
            darkColor: "from-orange-900/30 to-red-900/30",
            darkIconColor: "text-orange-400",
            darkBorderColor: "border-orange-700"
        }
    ];

    // Policy Document Configuration with custom order:
    // 1. Joining Letter
    // 2. Employee Handbook
    // 3. NDA
    // 4. ABAC Policy
    // 5. COBEC Policy
    // 6. Diversity Policy
    // 7. Information Security Policy
    const policyDocumentConfig = [
        // 1. Joining Letter
        {
            type: "signed_joining_letter",
            label: "Appointment Letterr",
            icon: FileCheck,
            color: "from-blue-50 to-cyan-50",
            iconColor: "text-blue-600",
            borderColor: "border-blue-200",
            darkColor: "from-blue-900/30 to-cyan-900/30",
            darkIconColor: "text-blue-400",
            darkBorderColor: "border-blue-700",
            documentType: "Joining Letter",
            unsignedType: "joining_letter",
            order: 1
        },
        // 2. Employee Handbook
        {
            type: "signed_employee_handbook",
            label: "Employee Handbook",
            icon: FileText,
            color: "from-amber-50 to-yellow-50",
            iconColor: "text-amber-600",
            borderColor: "border-amber-200",
            darkColor: "from-amber-900/30 to-yellow-900/30",
            darkIconColor: "text-amber-400",
            darkBorderColor: "border-amber-700",
            documentType: "Employee Handbook",
            unsignedType: "employee_handbook",
            order: 2
        },
        // 3. NDA
        {
            type: "signed_nda",
            label: "NDA",
            icon: FileSignature,
            color: "from-purple-50 to-indigo-50",
            iconColor: "text-purple-600",
            borderColor: "border-purple-200",
            darkColor: "from-purple-900/30 to-indigo-900/30",
            darkIconColor: "text-purple-400",
            darkBorderColor: "border-purple-700",
            documentType: "NDA",
            unsignedType: "nda",
            order: 3
        },
        // 4. ABAC Policy
        {
            type: "signed_abac_policy",
            label: "ABAC Policy",
            icon: Shield,
            color: "from-indigo-50 to-purple-50",
            iconColor: "text-indigo-600",
            borderColor: "border-indigo-200",
            darkColor: "from-indigo-900/30 to-purple-900/30",
            darkIconColor: "text-indigo-400",
            darkBorderColor: "border-indigo-700",
            documentType: "ABAC Policy",
            unsignedType: "abac_policy",
            order: 4
        },
        // 5. COBEC Policy
        {
            type: "signed_cobec_policy",
            label: "COBEC Policy",
            icon: BookOpen,
            color: "from-teal-50 to-cyan-50",
            iconColor: "text-teal-600",
            borderColor: "border-teal-200",
            darkColor: "from-teal-900/30 to-cyan-900/30",
            darkIconColor: "text-teal-400",
            darkBorderColor: "border-teal-700",
            documentType: "COBEC Policy",
            unsignedType: "cobec_policy",
            order: 5
        },
        // 6. Diversity Policy
        {
            type: "signed_diversity_policy",
            label: "Diversity Policy",
            icon: DiversityIcon,
            color: "from-pink-50 to-rose-50",
            iconColor: "text-pink-600",
            borderColor: "border-pink-200",
            darkColor: "from-pink-900/30 to-rose-900/30",
            darkIconColor: "text-pink-400",
            darkBorderColor: "border-pink-700",
            documentType: "Diversity Policy",
            unsignedType: "diversity_policy",
            order: 6
        },
        // 7. Information Security Policy
        {
            type: "signed_info_security_policy",
            label: "Information Security",
            icon: Lock,
            color: "from-red-50 to-orange-50",
            iconColor: "text-red-600",
            borderColor: "border-red-200",
            darkColor: "from-red-900/30 to-orange-900/30",
            darkIconColor: "text-red-400",
            darkBorderColor: "border-red-700",
            documentType: "Information Security Policy",
            unsignedType: "info_security_policy",
            order: 7
        }
    ];

    // Sort policy documents by order
    const sortedPolicyDocuments = [...policyDocumentConfig].sort((a, b) => a.order - b.order);

    // Fetch current user on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getCurrentUser();
                setUserData(data);
                setLoading(false);

                // If user is employee, fetch their documents
                if (data.role?.toLowerCase() === 'employee') {
                    const empId = data.employee_id || data.username;
                    setFetchedEmployeeId(empId);
                    await fetchEmployeeDocuments(empId);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data");
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Fetch employees on component mount (only for admin/hr)
    useEffect(() => {
        if (userData && (userData.role?.toLowerCase() === 'superadmin' || userData.role?.toLowerCase() === 'hr')) {
            fetchEmployees();
        }
    }, [userData]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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

    // Fetch documents for a specific employee
    const fetchEmployeeDocuments = async (employeeId) => {
        setLoading(true);
        setError("");
        setSelectedDoc(null);

        try {
            const data = await apiRequest(`/db/generate-sas/${employeeId}`);

            const newDocs = {
                // Personal documents
                aadhar_card: data.personal_documents?.aadhar_card || null,
                pan_card: data.personal_documents?.pan_card || null,
                resume: data.personal_documents?.resume || null,
                profile_photo: data.personal_documents?.profile_photo || null,
                // Policy documents - including NDA and Joining Letter
                signed_nda: data.signed_policy_documents?.signed_nda || null,
                signed_joining_letter: data.signed_policy_documents?.signed_joining_letter || null,
                signed_abac_policy: data.signed_policy_documents?.signed_abac_policy || null,
                signed_cobec_policy: data.signed_policy_documents?.signed_cobec_policy || null,
                signed_diversity_policy: data.signed_policy_documents?.signed_diversity_policy || null,
                signed_employee_handbook: data.signed_policy_documents?.signed_employee_handbook || null,
                signed_info_security_policy: data.signed_policy_documents?.signed_info_security_policy || null
            };

            setDocuments(newDocs);

            // Check sign_status from backend to determine unsigned document availability
            setHasUnsignedNDA(newDocs.signed_nda?.sign_status === 'unsigned');
            setHasUnsignedJoiningLetter(newDocs.signed_joining_letter?.sign_status === 'unsigned');

            const hasAnyDoc = Object.values(newDocs).some(doc => doc && doc.sas_url);
            if (!hasAnyDoc) {
                setError("No documents found for this Employee");
            }
        } catch (err) {
            console.error("Error fetching documents:", err);
            setError(err.message || "Failed to fetch documents. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle file selection for upload
    const handleFileSelect = (documentType, event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFiles(prev => ({
                ...prev,
                [documentType]: file
            }));
        }
    };

    // Upload both documents with single submit button
    const handleUploadDocuments = async () => {
        if (userData?.role?.toLowerCase() !== 'superadmin') {
            toast({
                title: "Error",
                description: "Only superadmin can upload documents",
                variant: "destructive",
            });
            return;
        }

        if (!selectedEmployee) {
            toast({
                title: "Error",
                description: "Please select an employee first",
                variant: "destructive",
            });
            return;
        }

        if (!selectedFiles.nda && !selectedFiles.joining_letter) {
            toast({
                title: "Error",
                description: "Please select at least one file to upload",
                variant: "destructive",
            });
            return;
        }

        setUploadLoading(true);
        let successCount = 0;
        let errorCount = 0;

        // Upload NDA if selected
        if (selectedFiles.nda) {
            try {
                const formData = new FormData();
                // Rename file so backend auto-detects document type correctly
                const renamedNDA = new File([selectedFiles.nda], 'NDA.pdf', { type: 'application/pdf' });
                formData.append('file', renamedNDA);

                const queryParams = new URLSearchParams({
                    employee_id: selectedEmployee.employee_id
                }).toString();

                await apiRequest(`/users/documents/upload-template?${queryParams}`, {
                    method: 'POST',
                    body: formData,
                    headers: {}
                });

                setHasUnsignedNDA(true);
                successCount++;

                // Clear the selected file
                setSelectedFiles(prev => ({ ...prev, nda: null }));
                const fileInput = document.getElementById('file-upload-nda');
                if (fileInput) fileInput.value = '';

            } catch (err) {
                console.error("Error uploading NDA:", err);
                errorCount++;
            }
        }

        // Upload Joining Letter if selected
        if (selectedFiles.joining_letter) {
            try {
                const formData = new FormData();
                // Rename file so backend auto-detects document type correctly
                const renamedJL = new File([selectedFiles.joining_letter], 'Joining_Letter.pdf', { type: 'application/pdf' });
                formData.append('file', renamedJL);

                const queryParams = new URLSearchParams({
                    employee_id: selectedEmployee.employee_id
                }).toString();

                await apiRequest(`/users/documents/upload-template?${queryParams}`, {
                    method: 'POST',
                    body: formData,
                    headers: {}
                });

                setHasUnsignedJoiningLetter(true);
                successCount++;

                // Clear the selected file
                setSelectedFiles(prev => ({ ...prev, joining_letter: null }));
                const fileInput = document.getElementById('file-upload-joining_letter');
                if (fileInput) fileInput.value = '';

            } catch (err) {
                console.error("Error uploading Joining Letter:", err);
                errorCount++;
            }
        }

        setUploadLoading(false);

        // Show toast with results
        if (successCount > 0) {
            toast({
                title: "Success",
                description: `${successCount} document(s) uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
                className: darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800",
            });

            // Refresh documents
            await fetchEmployeeDocuments(selectedEmployee.employee_id);
        } else if (errorCount > 0) {
            toast({
                title: "Upload Failed",
                description: "Failed to upload documents",
                variant: "destructive",
            });
        }
    };

    // Sign document (Only the employee themselves)
    const handleSignDocument = async (documentType, documentTypeName) => {
        if (userData?.role?.toLowerCase() !== 'employee') {
            toast({
                title: "Error",
                description: "Only employees can sign their own documents",
                variant: "destructive",
            });
            return;
        }

        const employeeId = userData?.employee_id || userData?.username;

        setSignLoading(prev => ({ ...prev, [documentType]: true }));

        try {
            const queryParams = new URLSearchParams({
                employee_id: employeeId,
                document_type: documentTypeName,
                signature_font: signatureFont
            }).toString();

            const response = await apiRequest(`/users/documents/sign-document?${queryParams}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Update unsigned status after signing
            if (documentType === 'nda') {
                setHasUnsignedNDA(false);
            } else {
                setHasUnsignedJoiningLetter(false);
            }

            await fetchEmployeeDocuments(employeeId);

            toast({
                title: "Success",
                description: response.message || `${documentTypeName} signed successfully`,
                className: darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800",
            });
        } catch (err) {
            console.error(`Error signing ${documentType}:`, err);
            toast({
                title: "Signing Failed",
                description: err.detail || err.message || `Failed to sign ${documentTypeName}`,
                variant: "destructive",
            });
        } finally {
            setSignLoading(prev => ({ ...prev, [documentType]: false }));
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

    const fetchDocuments = async () => {
        if (!selectedEmployee) {
            setError("Please select an employee");
            return;
        }

        setFetchedEmployeeId(selectedEmployee.employee_id);
        await fetchEmployeeDocuments(selectedEmployee.employee_id);
    };

    const handleViewDocument = (doc) => {
        if (doc && doc.sas_url) {
            setSelectedDoc(doc);
            setTimeout(() => {
                const previewElement = document.getElementById('document-preview');
                if (previewElement) {
                    previewElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    };

    const handleOpenInNewTab = (doc) => {
        if (doc && doc.sas_url) {
            window.open(doc.sas_url, '_blank');
        }
    };

    const formatExpiryTime = (minutes) => {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            return `${hours} hour${hours > 1 ? 's' : ''}`;
        }
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    };

    const getFileType = (doc) => {
        if (doc && doc.content_type) {
            if (doc.content_type.includes('pdf')) return 'pdf';
            if (doc.content_type.includes('image')) return 'image';
        }
        return 'unknown';
    };

    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);
        setDropdownOpen(false);
        setEmployeeSearch(`${employee.name} (${employee.employee_id})`);
        setError("");
        setHighlightedIndex(-1);
    };

    const handleClear = () => {
        setSelectedEmployee(null);
        setEmployeeSearch("");
        setDocuments({
            aadhar_card: null,
            pan_card: null,
            resume: null,
            profile_photo: null,
            signed_nda: null,
            signed_joining_letter: null,
            signed_abac_policy: null,
            signed_cobec_policy: null,
            signed_diversity_policy: null,
            signed_employee_handbook: null,
            signed_info_security_policy: null
        });
        setHasUnsignedNDA(false);
        setHasUnsignedJoiningLetter(false);
        setSelectedFiles({
            nda: null,
            joining_letter: null
        });
        setFetchedEmployeeId("");
        setError("");
        setSelectedDoc(null);
        setHighlightedIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (!dropdownOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < filteredEmployees.length - 1 ? prev + 1 : prev
                );
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

    if (loading) {
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
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
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

    return (
        <div className={`w-full min-h-screen p-3 sm:p-4 md:p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="mb-4 sm:mb-6">
                <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>
                    {userRole === 'employee' ? 'My Documents' : 'Employee Documents'}
                </h1>
                <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {userRole === 'employee'
                        ? 'View and sign your documents securely'
                        : 'View and manage employee documents securely'
                    }
                </p>
            </div>

            {/* Search Section - Only for Superadmin/HR */}
            {(userRole === 'superadmin' || userRole === 'hr') && (
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

                            {/* Dropdown */}
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
                                onClick={fetchDocuments}
                                disabled={loading || !selectedEmployee}
                                className="px-4 py-2 h-10 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw size={14} className="mr-2 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <Search size={14} className="mr-2" />
                                        Get Documents
                                    </>
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

            {/* Upload Section - Only for Superadmin */}
            {userRole === 'superadmin' && fetchedEmployeeId && (
                <Card className={`p-4 sm:p-5 mb-4 sm:mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Upload className={darkMode ? "text-blue-400" : "text-blue-600"} size={16} />
                        <h2 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                            Upload Documents (Superadmin Only)
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
                        {/* NDA Upload */}
                        <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
                            <h3 className={`text-base font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                <FileText size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                                NDA
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="relative">
                                    <Input
                                        id="file-upload-nda"
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileSelect('nda', e)}
                                        className="hidden"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => document.getElementById('file-upload-nda').click()}
                                            className={`flex-1 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            <Upload size={14} className="mr-2" />
                                            Choose File
                                        </Button>
                                        <span className={`text-sm truncate flex-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {selectedFiles.nda ? selectedFiles.nda.name : 'No file chosen'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Joining Letter Upload */}
                        <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
                            <h3 className={`text-base font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                <FileText size={16} className={darkMode ? 'text-green-400' : 'text-green-600'} />
                                Appointment Letter
                            </h3>
                            <div className="flex flex-col gap-2">
                                <div className="relative">
                                    <Input
                                        id="file-upload-joining_letter"
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileSelect('joining_letter', e)}
                                        className="hidden"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => document.getElementById('file-upload-joining_letter').click()}
                                            className={`flex-1 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            <Upload size={14} className="mr-2" />
                                            Choose File
                                        </Button>
                                        <span className={`text-sm truncate flex-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {selectedFiles.joining_letter ? selectedFiles.joining_letter.name : 'No file chosen'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className={`mb-4 p-3 rounded-lg border flex items-start gap-2 text-xs ${darkMode ? 'bg-blue-900/20 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                        <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                        <span>
                            <strong>Note:</strong> The joining date from the Appointment Letter will be automatically used as the signing date for both NDA and Appointment Letter. Please upload the (Appointment Letter) first.
                        </span>
                    </div>

                    {/* Single Submit Button */}
                    <Button
                        onClick={handleUploadDocuments}
                        disabled={uploadLoading || (!selectedFiles.nda && !selectedFiles.joining_letter)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                    >
                        {uploadLoading ? (
                            <>
                                <RefreshCw size={18} className="mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload size={18} className="mr-2" />
                                Upload Selected Documents
                            </>
                        )}
                    </Button>
                </Card>
            )}

            {/* Signature Font Selection - Only for Employees */}
            {userRole === 'employee' && (
                <Card className={`p-4 sm:p-5 mb-4 sm:mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                    <div className="flex items-center gap-2 mb-3">
                        <PenTool className={darkMode ? "text-purple-400" : "text-purple-600"} size={16} />
                        <h2 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                            Signature Settings
                        </h2>
                    </div>

                    <div className="max-w-xs">
                        <Label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Signature Font
                        </Label>
                        <Select value={signatureFont} onValueChange={setSignatureFont}>
                            <SelectTrigger className={`w-full mt-1 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}>
                                <SelectValue placeholder="Select signature font" />
                            </SelectTrigger>
                            <SelectContent className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}>
                                <SelectItem value="SignatureFont">Signature Font</SelectItem>
                                <SelectItem value="Handwriting">Handwriting</SelectItem>
                                <SelectItem value="Calligraphy">Calligraphy</SelectItem>
                                <SelectItem value="Classic">Classic</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Choose the font style for your document signatures
                        </p>
                    </div>
                </Card>
            )}

            {/* Error Message */}
            {error && (
                <div className={`mb-4 sm:mb-6 p-3 sm:p-4 ${darkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'} rounded-lg flex items-start gap-3`}>
                    <AlertCircle className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-600'} flex-shrink-0 mt-0.5`} />
                    <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-800'}`}>{error}</p>
                </div>
            )}

            {/* Documents Grid */}
            {fetchedEmployeeId && !error && (
                <>
                    <div className="mb-4 sm:mb-6">
                        <h3 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                            Documents for Employee:
                            <span className="text-blue-600 ml-2 text-sm sm:text-base">
                                {userRole === 'employee'
                                    ? `${userData?.first_name} ${userData?.last_name} (${fetchedEmployeeId})`
                                    : `${selectedEmployee?.name} (${fetchedEmployeeId})`
                                }
                            </span>
                        </h3>
                    </div>

                    {/* Personal Documents */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <User className={darkMode ? "text-blue-400" : "text-blue-600"} size={16} />
                            <h4 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Personal Documents</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                            {personalDocumentConfig.map((config) => {
                                const doc = documents[config.type];
                                const Icon = config.icon;
                                const isAvailable = doc && doc.sas_url;

                                return (
                                    <Card
                                        key={config.type}
                                        className={`p-3 sm:p-4 md:p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'} ${darkMode ? config.darkBorderColor : config.borderColor} border transition-all hover:shadow-md hover:-translate-y-1 h-full`}
                                    >
                                        <div className="flex flex-col items-center text-center space-y-3 h-full">
                                            <div className={`p-3 rounded-full bg-gradient-to-r ${darkMode ? config.darkColor : config.color} shadow-sm`}>
                                                <Icon className={darkMode ? config.darkIconColor : config.iconColor} size={24} />
                                            </div>

                                            <div>
                                                <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} text-xs sm:text-sm mb-1`}>{config.label}</h3>
                                                <div className="flex items-center justify-center gap-2 text-xs">
                                                    {isAvailable ? (
                                                        <>
                                                            <CheckCircle size={12} className="text-green-600" />
                                                            <span className="text-green-600 font-medium">Available</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle size={12} className={darkMode ? "text-gray-500" : "text-gray-400"} />
                                                            <span className={darkMode ? "text-gray-500" : "text-gray-400"}>Not Found</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {isAvailable && (
                                                <>
                                                    <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        <Clock size={10} />
                                                        <span className="text-xs">Expires in {formatExpiryTime(doc.expires_in_minutes)}</span>
                                                    </div>

                                                    <div className="flex gap-2 w-full mt-auto">
                                                        <Button
                                                            onClick={() => handleViewDocument(doc)}
                                                            className={`flex-1 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'} text-xs py-1.5 px-2 h-8`}
                                                            size="sm"
                                                        >
                                                            <Eye size={12} className="mr-1" />
                                                            <span className="hidden sm:inline">View</span>
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleOpenInNewTab(doc)}
                                                            className={`flex-1 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'} text-xs py-1.5 px-2 h-8`}
                                                            size="sm"
                                                        >
                                                            <ExternalLink size={12} className="mr-1" />
                                                            <span className="hidden sm:inline">Open</span>
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Policy Documents - Now in custom order */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <Shield className={darkMode ? "text-green-400" : "text-green-600"} size={16} />
                            <h4 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Signed Policy Documents</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                            {sortedPolicyDocuments.map((config) => {
                                const doc = documents[config.type];
                                const Icon = config.icon;
                                const hasSasUrl = doc && doc.sas_url;
                                const isSigned = doc?.sign_status === 'signed';
                                const isUnsigned = doc?.sign_status === 'unsigned';

                                // Show sign button only for employees on NDA and Joining Letter cards with unsigned status
                                const showSignButton = userRole === 'employee' &&
                                    (config.type === 'signed_nda' || config.type === 'signed_joining_letter') &&
                                    isUnsigned;

                                return (
                                    <Card
                                        key={config.type}
                                        className={`p-3 sm:p-4 md:p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'} ${darkMode ? config.darkBorderColor : config.borderColor} border transition-all hover:shadow-md hover:-translate-y-1 h-full`}
                                    >
                                        <div className="flex flex-col items-center text-center space-y-3 h-full">
                                            <div className={`p-3 rounded-full bg-gradient-to-r ${darkMode ? config.darkColor : config.color} shadow-sm`}>
                                                <Icon className={darkMode ? config.darkIconColor : config.iconColor} size={24} />
                                            </div>

                                            <div>
                                                <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} text-xs sm:text-sm mb-1`}>{config.label}</h3>
                                                <div className="flex items-center justify-center gap-2 text-xs">
                                                    {isSigned ? (
                                                        <>
                                                            <CheckCircle size={12} className="text-green-600" />
                                                            <span className="text-green-600 font-medium">Signed</span>
                                                        </>
                                                    ) : isUnsigned ? (
                                                        <>
                                                            <Clock size={12} className="text-yellow-600" />
                                                            <span className="text-yellow-600 font-medium">Pending Signature</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* <XCircle size={12} className={darkMode ? "text-gray-500" : "text-gray-400"} />
                                                            <span className={darkMode ? "text-gray-500" : "text-gray-400"}>Not Available</span> */}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {hasSasUrl && (
                                                <>
                                                    <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        <Clock size={10} />
                                                        <span className="text-xs">Expires in {formatExpiryTime(doc.expires_in_minutes)}</span>
                                                    </div>

                                                    <div className="flex gap-2 w-full mt-auto">
                                                        <Button
                                                            onClick={() => handleViewDocument(doc)}
                                                            className={`flex-1 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'} text-xs py-1.5 px-2 h-8`}
                                                            size="sm"
                                                        >
                                                            <Eye size={12} className="mr-1" />
                                                            <span className="hidden sm:inline">View</span>
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleOpenInNewTab(doc)}
                                                            className={`flex-1 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'} text-xs py-1.5 px-2 h-8`}
                                                            size="sm"
                                                        >
                                                            <ExternalLink size={12} className="mr-1" />
                                                            <span className="hidden sm:inline">Open</span>
                                                        </Button>
                                                    </div>
                                                </>
                                            )}

                                            {/* Sign Button - Only for Employees on NDA and Joining Letter */}
                                            {showSignButton && (
                                                <div className="w-full mt-2">
                                                    <Button
                                                        onClick={() => handleSignDocument(config.unsignedType, config.documentType)}
                                                        disabled={signLoading[config.unsignedType]}
                                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1.5 px-2 h-8"
                                                        size="sm"
                                                    >
                                                        {signLoading[config.unsignedType] ? (
                                                            <>
                                                                <RefreshCw size={12} className="mr-1 animate-spin" />
                                                                Signing...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <PenTool size={12} className="mr-1" />
                                                                Sign Now
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {/* Document Preview */}
            {selectedDoc && (
                <Card id="document-preview" className={`p-3 sm:p-4 md:p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'} shadow-sm mb-4 sm:mb-6`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Document Preview</h3>
                            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                {selectedDoc.document_type ? selectedDoc.document_type.replace(/_/g, ' ').replace(/signed_/g, '').toUpperCase() : 'Document'} -
                                {getFileType(selectedDoc) === 'pdf' ? ' PDF Document' :
                                    getFileType(selectedDoc) === 'image' ? ' Image' : ' File'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => handleOpenInNewTab(selectedDoc)}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-2"
                            >
                                <ExternalLink size={14} className="mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Open in New Tab</span>
                                <span className="sm:hidden">Open</span>
                            </Button>
                            <Button
                                onClick={() => setSelectedDoc(null)}
                                variant="outline"
                                className={`text-xs sm:text-sm px-3 sm:px-4 py-2 ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                Close
                            </Button>
                        </div>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-lg p-3 sm:p-4 border`}>
                        {getFileType(selectedDoc) === 'pdf' ? (
                            <iframe
                                src={selectedDoc.sas_url}
                                className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded border border-gray-300"
                                title="Document preview"
                            />
                        ) : getFileType(selectedDoc) === 'image' ? (
                            <div className="flex justify-center">
                                <img
                                    src={selectedDoc.sas_url}
                                    alt="Document"
                                    className="max-w-full max-h-[300px] sm:max-h-[400px] md:max-h-[500px] rounded shadow-lg"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] sm:h-[400px] md:h-[500px]">
                                <div className="text-center">
                                    <FileText size={48} className={`mx-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`} />
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Preview not available for this file type</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`mt-4 p-3 ${darkMode ? 'bg-blue-900/50 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-lg flex items-start gap-3`}>
                        <Clock className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0 mt-0.5`} />
                        <p className={`text-xs sm:text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                            This secure link will expire in {formatExpiryTime(selectedDoc.expires_in_minutes)}.
                        </p>
                    </div>
                </Card>
            )}

            {/* Footer */}
            <Card className={`bg-gradient-to-r ${darkMode ? 'from-gray-800 to-gray-700 border-gray-600' : 'from-gray-50 to-slate-50 border-gray-200'} p-3 sm:p-4 md:p-5`}>
                <div className="text-center">
                    <h3 className={`text-sm sm:text-base font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>
                        ISCS Technologies Private Limited
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>SECURE DOCUMENT MANAGEMENT SYSTEM</p>
                </div>
            </Card>
        </div>
    );
}