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
  Download, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Users
} from "lucide-react";
import { apiRequest } from "../api"; // Import the API request function

export default function Documents() {
  const [documents, setDocuments] = useState({
    aadhar_card: null,
    pan_card: null,
    resume: null,
    profile_photo: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [fetchedEmployeeId, setFetchedEmployeeId] = useState("");
  
  // New states for employee dropdown
  const [employees, setEmployees] = useState([]);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const documentConfig = [
    {
      type: "profile_photo",
      label: "Profile Photo",
      icon: User,
      color: "from-purple-50 to-pink-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200"
    },
    {
      type: "aadhar_card",
      label: "Aadhar Card",
      icon: CreditCard,
      color: "from-blue-50 to-indigo-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      type: "pan_card",
      label: "PAN Card",
      icon: CreditCard,
      color: "from-green-50 to-emerald-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200"
    },
    {
      type: "resume",
      label: "Resume",
      icon: FileText,
      color: "from-orange-50 to-red-50",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200"
    }
  ];

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

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
      // Use apiRequest function instead of direct fetch
      const data = await apiRequest("/db/employment-applications");
      setEmployees(data || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoadingEmployees(false);
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

    setLoading(true);
    setError("");
    setSelectedDoc(null);
    
    try {
      // Use apiRequest function instead of direct fetch
      const data = await apiRequest(`/db/generate-sas/${selectedEmployee.employee_id}`);
      
      // Extract document data from response
      const newDocs = {
        aadhar_card: data.documents.aadhar_card,
        pan_card: data.documents.pan_card,
        resume: data.documents.resume,
        profile_photo: data.documents.profile_photo
      };
      
      setDocuments(newDocs);
      setFetchedEmployeeId(selectedEmployee.employee_id);
      
      // Check if any documents were found
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

  const handleViewDocument = (doc) => {
    if (doc && doc.sas_url) {
      setSelectedDoc(doc);
      // Scroll to the preview section
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
      profile_photo: null
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Employee Documents</h1>
        <p className="text-gray-600">View and download employee documents securely</p>
      </div>

      {/* Search Section */}
      <Card className="p-5 mb-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-blue-600" size={18} />
          <h2 className="text-lg font-semibold text-gray-800">Select Employee</h2>
        </div>
        
        <div className="space-y-4">
          <div className="relative" ref={dropdownRef}>
            <Label className="text-sm font-medium text-gray-700 mb-1 block">Search Employee *</Label>
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
                className="pr-10 h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              />
              <ChevronDown 
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform pointer-events-none ${dropdownOpen ? 'rotate-180' : ''}`}
                size={18}
              />
            </div>
            
            {/* Compact Dropdown */}
            {dropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                <div className="max-h-36 overflow-y-auto">
                  {loadingEmployees ? (
                    <div className="px-3 py-2 text-center text-gray-500 text-sm">
                      <RefreshCw className="animate-spin inline-block mr-2" size={14} />
                      Loading...
                    </div>
                  ) : filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee, index) => (
                      <div
                        key={employee.employee_id}
                        onClick={() => handleSelectEmployee(employee)}
                        className={`px-3 py-2 cursor-pointer transition-colors text-sm ${
                          index === highlightedIndex 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'hover:bg-gray-50 text-gray-700'
                        } ${index !== filteredEmployees.length - 1 ? 'border-b border-gray-100' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{employee.name}</p>
                            <p className="text-xs text-gray-500">ID: {employee.employee_id}</p>
                          </div>
                          <User size={14} className="text-gray-400 ml-2 flex-shrink-0" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-center text-gray-500 text-sm">
                      {employeeSearch ? "No employees found" : "No employees available"}
                    </div>
                  )}
                </div>
                {filteredEmployees.length > 3 && (
                  <div className="px-3 py-1 bg-gray-50 text-xs text-gray-500 text-center border-t border-gray-200">
                    Scroll for more employees
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
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
                className="px-4 py-2 h-10 text-sm font-medium border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Clear
              </Button>
            )}
          </div>
          
          {selectedEmployee && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Selected:</strong> {selectedEmployee.name} ({selectedEmployee.employee_id})
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Documents Grid */}
      {fetchedEmployeeId && !error && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Documents for Employee: <span className="text-blue-600">{selectedEmployee?.name} ({fetchedEmployeeId})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {documentConfig.map((config) => {
              const doc = documents[config.type];
              const Icon = config.icon;
              const isAvailable = doc && doc.sas_url;

              return (
                <Card
                  key={config.type}
                  className={`p-5 bg-white border ${config.borderColor} transition-all hover:shadow-md hover:-translate-y-1`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${config.color} shadow-sm`}>
                      <Icon className={config.iconColor} size={28} />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">{config.label}</h3>
                      <div className="flex items-center justify-center gap-2 text-xs">
                        {isAvailable ? (
                          <>
                            <CheckCircle size={12} className="text-green-600" />
                            <span className="text-green-600 font-medium">Available</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={12} className="text-gray-400" />
                            <span className="text-gray-500">Not Found</span>
                          </>
                        )}
                      </div>
                    </div>

                    {isAvailable && (
                      <>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={10} />
                          <span>Expires in {formatExpiryTime(doc.expires_in_minutes)}</span>
                        </div>

                        <div className="flex gap-2 w-full">
                          <Button
                            onClick={() => handleViewDocument(doc)}
                            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs py-1.5 px-2 h-8"
                            size="sm"
                          >
                            <Eye size={12} className="mr-1" />
                            View
                          </Button>
                          <Button
                            onClick={() => handleOpenInNewTab(doc)}
                            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs py-1.5 px-2 h-8"
                            size="sm"
                          >
                            <ExternalLink size={12} className="mr-1" />
                            Open
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Document Preview Section */}
      {selectedDoc && (
        <Card id="document-preview" className="p-5 bg-white border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Document Preview</h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedDoc.document_type ? selectedDoc.document_type.replace(/_/g, ' ').toUpperCase() : 'Document'} - 
                {getFileType(selectedDoc) === 'pdf' ? ' PDF Document' : 
                 getFileType(selectedDoc) === 'image' ? ' Image' : ' File'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleOpenInNewTab(selectedDoc)}
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2"
              >
                <ExternalLink size={14} className="mr-2" />
                Open in New Tab
              </Button>
              <Button
                onClick={() => setSelectedDoc(null)}
                variant="outline"
                className="text-sm px-4 py-2 border-gray-300 hover:bg-gray-50"
              >
                Close Preview
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            {getFileType(selectedDoc) === 'pdf' ? (
              <iframe
                src={selectedDoc.sas_url}
                className="w-full h-[500px] rounded border border-gray-300"
                title={`${selectedDoc.document_type || 'Document'} preview`}
              />
            ) : getFileType(selectedDoc) === 'image' ? (
              <div className="flex justify-center">
                <img
                  src={selectedDoc.sas_url}
                  alt={selectedDoc.document_type || 'Document'}
                  className="max-w-full max-h-[500px] rounded shadow-lg"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[500px]">
                <div className="text-center">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Preview not available for this file type</p>
                  <Button
                    onClick={() => handleOpenInNewTab(selectedDoc)}
                    className="mt-4"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <Clock className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-blue-800 text-sm">
              This secure link will expire in {formatExpiryTime(selectedDoc.expires_in_minutes)}. 
              Please download the document if you need to keep it.
            </p>
          </div>
        </Card>
      )}

      {/* Company Info Footer */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 p-5">
        <div className="text-center">
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            ISCS Technologies Private Limited
          </h3>
          <p className="text-xs text-gray-600">SECURE DOCUMENT MANAGEMENT SYSTEM</p>
        </div>
      </Card>
    </div>
  );
}