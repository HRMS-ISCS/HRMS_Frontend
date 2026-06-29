// // src/components/Appointment.jsx
// import React, { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import {
//     FileText,
//     Download,
//     RefreshCw,
//     AlertCircle,
//     User,
//     MapPin,
//     Briefcase,
//     Calendar,
//     DollarSign,
//     CheckCircle,
//     FileCheck,
//     FileSignature,
//     LogOut,
//     Building,
//     UserCheck,
// } from "lucide-react";
// import { useDarkMode } from "@/context/DarkModeContext";
// import { getToken } from "../api";
// import { useToast } from "@/components/ui/use-toast";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// export default function Appointment() {
//     const { darkMode } = useDarkMode();
//     const { toast } = useToast();

//     const [loading, setLoading] = useState(false);
//     const [generatedFilename, setGeneratedFilename] = useState(null);
    
//     // Letter type: "appointment", "proposed", or "relieving"
//     const [letterType, setLetterType] = useState("appointment");

//     // Common fields for all letter types
//     const [formData, setFormData] = useState({
//         employee_name: "",
//         gender_prefix: "",
//         father_name: "",
//         address_line1: "",
//         address_line2: "",
//         address_line3: "",
//         designation: "",
//         date_of_joining: "",
//         annual_ctc: "",
//         letter_date: "",
//         // Relieving specific fields
//         relieving_date: "",
//         client_name: "",
//         client_release_date: "",
//         reference_number: "",
//     });

//     const handleChange = (field, value) => {
//         setFormData((prev) => ({ ...prev, [field]: value }));
//     };

//     const buildRequestBody = () => {
//         const body = {};
        
//         // Common fields
//         if (formData.employee_name.trim()) body.employee_name = formData.employee_name.trim();
//         if (formData.gender_prefix) body.gender_prefix = formData.gender_prefix;
//         if (formData.father_name.trim()) body.father_name = formData.father_name.trim();
//         if (formData.address_line1.trim()) body.address_line1 = formData.address_line1.trim();
//         if (formData.address_line2.trim()) body.address_line2 = formData.address_line2.trim();
//         if (formData.address_line3.trim()) body.address_line3 = formData.address_line3.trim();
//         if (formData.designation.trim()) body.designation = formData.designation.trim();
//         if (formData.date_of_joining) body.date_of_joining = formData.date_of_joining;
//         if (formData.annual_ctc) body.annual_ctc = parseFloat(formData.annual_ctc);
//         if (formData.letter_date) body.letter_date = formData.letter_date;
        
//         // Relieving specific fields
//         if (letterType === "relieving") {
//             if (formData.relieving_date) body.relieving_date = formData.relieving_date;
//             if (formData.client_name.trim()) body.client_name = formData.client_name.trim();
//             if (formData.client_release_date) body.client_release_date = formData.client_release_date;
//             if (formData.reference_number.trim()) body.reference_number = formData.reference_number.trim();
//         }
        
//         return body;
//     };

//     const getEndpoint = () => {
//         switch(letterType) {
//             case "appointment":
//                 return `${API_BASE_URL}/appointment-letter/generate`;
//             case "proposed":
//                 return `${API_BASE_URL}/proposed-offer-letter/generate`;
//             case "relieving":
//                 return `${API_BASE_URL}/relieving-experience-letter/generate`;
//             default:
//                 return `${API_BASE_URL}/appointment-letter/generate`;
//         }
//     };

//     const getDefaultFilename = () => {
//         const name = formData.employee_name.trim() || "Employee";
//         const safeName = name.replace(/\s+/g, "_");
//         switch(letterType) {
//             case "appointment":
//                 return `Appointment_Letter_${safeName}.pdf`;
//             case "proposed":
//                 return `Proposed_Offer_Letter_${safeName}.pdf`;
//             case "relieving":
//                 return `Relieving_Experience_Letter_${safeName}.pdf`;
//             default:
//                 return `Letter_${safeName}.pdf`;
//         }
//     };

//     const handleGenerate = async () => {
//         setLoading(true);
//         setGeneratedFilename(null);

//         try {
//             const token = getToken();
//             const endpoint = getEndpoint();
            
//             const response = await fetch(endpoint, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     ...(token && { Authorization: `Bearer ${token}` }),
//                 },
//                 body: JSON.stringify(buildRequestBody()),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 throw new Error(errorData.detail || `Failed to generate ${letterType} letter`);
//             }

//             // Extract filename from Content-Disposition header
//             const contentDisposition = response.headers.get("Content-Disposition");
//             let filename = getDefaultFilename();
//             if (contentDisposition) {
//                 const match = contentDisposition.match(/filename="?([^"]+)"?/);
//                 if (match) filename = match[1];
//             }

//             const blob = await response.blob();
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement("a");
//             link.href = url;
//             link.download = filename;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(url);

//             setGeneratedFilename(filename);

//             const letterTypeDisplay = getLetterTypeDisplay();
//             toast({
//                 title: "Success",
//                 description: `${letterTypeDisplay} generated: ${filename}`,
//                 className: darkMode
//                     ? "bg-gray-800 border-gray-700 text-gray-100"
//                     : "bg-white border-gray-200 text-gray-800",
//             });
//         } catch (err) {
//             console.error(`Error generating ${letterType} letter:`, err);
//             toast({
//                 title: "Generation Failed",
//                 description: err.message || `Failed to generate ${letterType} letter. Please try again.`,
//                 variant: "destructive",
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleReset = () => {
//         setFormData({
//             employee_name: "",
//             gender_prefix: "",
//             father_name: "",
//             address_line1: "",
//             address_line2: "",
//             address_line3: "",
//             designation: "",
//             date_of_joining: "",
//             annual_ctc: "",
//             letter_date: "",
//             relieving_date: "",
//             client_name: "",
//             client_release_date: "",
//             reference_number: "",
//         });
//         setGeneratedFilename(null);
//     };

//     const getLetterTypeDisplay = () => {
//         switch(letterType) {
//             case "appointment":
//                 return "Appointment Letter";
//             case "proposed":
//                 return "Proposed Offer Letter";
//             case "relieving":
//                 return "Relieving & Experience Letter";
//             default:
//                 return "Letter";
//         }
//     };

//     const getLetterTypeIcon = () => {
//         switch(letterType) {
//             case "appointment":
//                 return FileCheck;
//             case "proposed":
//                 return FileSignature;
//             case "relieving":
//                 return LogOut;
//             default:
//                 return FileText;
//         }
//     };

//     const getLetterTypeDescription = () => {
//         switch(letterType) {
//             case "appointment":
//                 return "Generates full appointment letters with salary breakup table";
//             case "proposed":
//                 return "Generates proposed offer letters with salary breakup table";
//             case "relieving":
//                 return "Generates relieving & experience letters with tenure details";
//             default:
//                 return "Generate letter";
//         }
//     };

//     const inputClass = `h-10 text-sm ${
//         darkMode
//             ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500 placeholder-gray-400"
//             : "border-gray-300 focus:border-blue-500"
//     }`;

//     const labelClass = `text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1 block`;

//     const sectionCardClass = `p-4 sm:p-5 mb-4 sm:mb-6 ${
//         darkMode ? "bg-gray-800 border-gray-700" : "bg-white border border-gray-200"
//     } shadow-sm`;

//     const sectionTitleClass = `text-base sm:text-lg font-semibold ${
//         darkMode ? "text-gray-100" : "text-gray-800"
//     }`;

//     const letterTypeDisplay = getLetterTypeDisplay();
//     const LetterIcon = getLetterTypeIcon();
//     const isRelieving = letterType === "relieving";

//     return (
//         <div className={`w-full min-h-screen p-3 sm:p-4 md:p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
//             {/* Header */}
//             <div className="mb-4 sm:mb-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                     <div>
//                         <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"} mb-2`}>
//                             Letter Generator
//                         </h1>
//                         <p className={`text-sm sm:text-base ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
//                             Generate and download {letterTypeDisplay.toLowerCase()} for employees as PDF
//                         </p>
//                     </div>
//                     {/* Letter Type Dropdown */}
//                     <div className="min-w-[220px]">
//                         <Label className={labelClass}>Letter Type</Label>
//                         <Select
//                             value={letterType}
//                             onValueChange={(val) => {
//                                 setLetterType(val);
//                                 setGeneratedFilename(null);
//                             }}
//                         >
//                             <SelectTrigger
//                                 className={`w-full h-10 text-sm ${
//                                     darkMode
//                                         ? "bg-gray-700 text-white border-gray-600"
//                                         : "bg-white border-gray-300"
//                                 }`}
//                             >
//                                 <SelectValue placeholder="Select letter type" />
//                             </SelectTrigger>
//                             <SelectContent
//                                 className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"}
//                             >
//                                 <SelectItem value="appointment">
//                                     <div className="flex items-center gap-2">
//                                         <FileCheck size={16} />
//                                         <span>Appointment Letter</span>
//                                     </div>
//                                 </SelectItem>
//                                 <SelectItem value="proposed">
//                                     <div className="flex items-center gap-2">
//                                         <FileSignature size={16} />
//                                         <span>Proposed Offer Letter</span>
//                                     </div>
//                                 </SelectItem>
//                                 <SelectItem value="relieving">
//                                     <div className="flex items-center gap-2">
//                                         <LogOut size={16} />
//                                         <span>Relieving & Experience Letter</span>
//                                     </div>
//                                 </SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>
//             </div>

//             {/* Info Note */}
//             <div
//                 className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border flex items-start gap-3 ${
//                     darkMode
//                         ? "bg-blue-900/20 border-blue-800 text-blue-300"
//                         : "bg-blue-50 border-blue-200 text-blue-700"
//                 }`}
//             >
//                 <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
//                 <p className="text-xs sm:text-sm">
//                     <strong>Note:</strong> All fields are optional. Omitted fields will be left blank in
//                     the generated PDF. {isRelieving ? (
//                         <>If <strong>Generated Date</strong> is omitted, today's date is used.</>
//                     ) : (
//                         <>If <strong>Annual CTC</strong> is provided, the full salary breakup is auto-calculated. 
//                         If <strong>Letter Date</strong> is omitted, today's date is used.</>
//                     )}
//                 </p>
//             </div>

//             {/* ── Section 1: Employee Identity ── */}
//             <Card className={sectionCardClass}>
//                 <div className="flex items-center gap-2 mb-3 sm:mb-4">
//                     <User className={darkMode ? "text-blue-400" : "text-blue-600"} size={16} />
//                     <h2 className={sectionTitleClass}>Employee Identity</h2>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {/* Gender Prefix */}
//                     <div>
//                         <Label className={labelClass}>Salutation</Label>
//                         <Select
//                             value={formData.gender_prefix}
//                             onValueChange={(val) => handleChange("gender_prefix", val)}
//                         >
//                             <SelectTrigger
//                                 className={`w-full h-10 text-sm ${
//                                     darkMode
//                                         ? "bg-gray-700 text-white border-gray-600"
//                                         : "bg-white border-gray-300"
//                                 }`}
//                             >
//                                 <SelectValue placeholder="Select salutation" />
//                             </SelectTrigger>
//                             <SelectContent
//                                 className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"}
//                             >
//                                 <SelectItem value="Mr.">Mr.</SelectItem>
//                                 <SelectItem value="Ms.">Ms.</SelectItem>
//                                 <SelectItem value="Mrs.">Mrs.</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* Employee Name */}
//                     <div>
//                         <Label className={labelClass}>Employee Full Name</Label>
//                         <Input
//                             value={formData.employee_name}
//                             onChange={(e) => handleChange("employee_name", e.target.value)}
//                             placeholder="e.g. Rajesh Kumar Sharma"
//                             className={inputClass}
//                             maxLength={100}
//                         />
//                     </div>

//                     {/* Father Name - Hide for Relieving */}
//                     {!isRelieving && (
//                         <div>
//                             <Label className={labelClass}>Father's / Guardian's Name</Label>
//                             <Input
//                                 value={formData.father_name}
//                                 onChange={(e) => handleChange("father_name", e.target.value)}
//                                 placeholder="e.g. Suresh Kumar Sharma"
//                                 className={inputClass}
//                                 maxLength={100}
//                             />
//                         </div>
//                     )}
//                 </div>
//             </Card>

//             {/* ── Section 2: Address ── */}
//             {!isRelieving && (
//                 <Card className={sectionCardClass}>
//                     <div className="flex items-center gap-2 mb-3 sm:mb-4">
//                         <MapPin className={darkMode ? "text-green-400" : "text-green-600"} size={16} />
//                         <h2 className={sectionTitleClass}>Address</h2>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                         <div>
//                             <Label className={labelClass}>Address Line 1</Label>
//                             <Input
//                                 value={formData.address_line1}
//                                 onChange={(e) => handleChange("address_line1", e.target.value)}
//                                 placeholder="e.g. Flat 402, Skyline Apartments"
//                                 className={inputClass}
//                                 maxLength={200}
//                             />
//                         </div>
//                         <div>
//                             <Label className={labelClass}>Address Line 2</Label>
//                             <Input
//                                 value={formData.address_line2}
//                                 onChange={(e) => handleChange("address_line2", e.target.value)}
//                                 placeholder="e.g. Madhapur, Hyderabad"
//                                 className={inputClass}
//                                 maxLength={200}
//                             />
//                         </div>
//                         <div>
//                             <Label className={labelClass}>Address Line 3</Label>
//                             <Input
//                                 value={formData.address_line3}
//                                 onChange={(e) => handleChange("address_line3", e.target.value)}
//                                 placeholder="e.g. Telangana – 500081"
//                                 className={inputClass}
//                                 maxLength={200}
//                             />
//                         </div>
//                     </div>
//                 </Card>
//             )}

//             {/* ── Section 3: Appointment/Relieving Details ── */}
//             <Card className={sectionCardClass}>
//                 <div className="flex items-center gap-2 mb-3 sm:mb-4">
//                     {isRelieving ? (
//                         <Building className={darkMode ? "text-orange-400" : "text-orange-600"} size={16} />
//                     ) : (
//                         <Briefcase className={darkMode ? "text-purple-400" : "text-purple-600"} size={16} />
//                     )}
//                     <h2 className={sectionTitleClass}>
//                         {isRelieving ? "Relieving Details" : "Appointment Details"}
//                     </h2>
//                 </div>

//                 {isRelieving ? (
//                     // ── Relieving Letter Fields ──
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <Label className={labelClass}>Designation</Label>
//                             <Input
//                                 value={formData.designation}
//                                 onChange={(e) => handleChange("designation", e.target.value)}
//                                 placeholder="e.g. Senior Software Engineer"
//                                 className={inputClass}
//                                 maxLength={150}
//                             />
//                         </div>
//                         <div>
//                             <Label className={labelClass}>Date of Joining</Label>
//                             <Input
//                                 type="date"
//                                 value={formData.date_of_joining}
//                                 onChange={(e) => handleChange("date_of_joining", e.target.value)}
//                                 className={inputClass}
//                             />
//                         </div>
//                         <div>
//                             <Label className={labelClass}>Relieving Date</Label>
//                             <Input
//                                 type="date"
//                                 value={formData.relieving_date}
//                                 onChange={(e) => handleChange("relieving_date", e.target.value)}
//                                 className={inputClass}
//                             />
//                         </div>
//                         <div>
//                             <Label className={labelClass}>Client Name</Label>
//                             <Input
//                                 value={formData.client_name}
//                                 onChange={(e) => handleChange("client_name", e.target.value)}
//                                 placeholder="e.g. HCL Technologies"
//                                 className={inputClass}
//                                 maxLength={150}
//                             />
//                         </div>
//                         <div>
//                             <Label className={labelClass}>Client Release Date</Label>
//                             <Input
//                                 type="date"
//                                 value={formData.client_release_date}
//                                 onChange={(e) => handleChange("client_release_date", e.target.value)}
//                                 className={inputClass}
//                             />
//                         </div>
//                         <div>
//                             <Label className={labelClass}>Reference Number</Label>
//                             <Input
//                                 value={formData.reference_number}
//                                 onChange={(e) => handleChange("reference_number", e.target.value)}
//                                 placeholder="e.g. ISCS/R/E/EMP/E083/1411/2025/10"
//                                 className={inputClass}
//                                 maxLength={100}
//                             />
//                         </div>
//                     </div>
//                 ) : (
//                     // ── Appointment/Proposed Offer Fields ──
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                         {/* Designation */}
//                         <div className="sm:col-span-2">
//                             <Label className={labelClass}>Designation</Label>
//                             <Input
//                                 value={formData.designation}
//                                 onChange={(e) => handleChange("designation", e.target.value)}
//                                 placeholder="e.g. Senior Software Engineer – Consultant"
//                                 className={inputClass}
//                                 maxLength={150}
//                             />
//                         </div>

//                         {/* Date of Joining */}
//                         <div>
//                             <Label className={labelClass}>Date of Joining</Label>
//                             <Input
//                                 type="date"
//                                 value={formData.date_of_joining}
//                                 onChange={(e) => handleChange("date_of_joining", e.target.value)}
//                                 className={inputClass}
//                             />
//                         </div>

//                         {/* Annual CTC */}
//                         <div>
//                             <Label className={labelClass}>Annual CTC (INR)</Label>
//                             <Input
//                                 type="number"
//                                 value={formData.annual_ctc}
//                                 onChange={(e) => handleChange("annual_ctc", e.target.value)}
//                                 placeholder="e.g. 1200000"
//                                 className={inputClass}
//                                 min={1}
//                             />
//                             <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
//                                 Salary breakup auto-calculated if provided
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             </Card>

//             {/* ── Section 4: Letter Date ── */}
//             <Card className={sectionCardClass}>
//                 <div className="flex items-center gap-2 mb-3 sm:mb-4">
//                     <FileText className={darkMode ? "text-amber-400" : "text-amber-600"} size={16} />
//                     <h2 className={sectionTitleClass}>Letter Settings</h2>
//                 </div>

//                 <div className="max-w-xs">
//                     <Label className={labelClass}>
//                         {isRelieving ? "Generated Date (optional)" : "Letter Date (optional)"}
//                     </Label>
//                     <Input
//                         type="date"
//                         value={formData.letter_date}
//                         onChange={(e) => handleChange("letter_date", e.target.value)}
//                         className={inputClass}
//                     />
//                     <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
//                         Defaults to today's date if left blank
//                     </p>
//                 </div>
//             </Card>

//             {/* ── Success Banner ── */}
//             {generatedFilename && (
//                 <div
//                     className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border flex items-start gap-3 ${
//                         darkMode
//                             ? "bg-green-900/30 border-green-700 text-green-300"
//                             : "bg-green-50 border-green-200 text-green-700"
//                     }`}
//                 >
//                     <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
//                     <div>
//                         <p className="text-sm font-medium">{letterTypeDisplay} generated successfully!</p>
//                         <p className={`text-xs mt-0.5 ${darkMode ? "text-green-400" : "text-green-600"}`}>
//                             Downloaded as: <span className="font-mono">{generatedFilename}</span>
//                         </p>
//                     </div>
//                 </div>
//             )}

//             {/* ── Action Buttons ── */}
//             <div className="flex flex-col sm:flex-row gap-3 mb-6">
//                 <Button
//                     onClick={handleGenerate}
//                     disabled={loading}
//                     className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-medium"
//                 >
//                     {loading ? (
//                         <>
//                             <RefreshCw size={18} className="mr-2 animate-spin" />
//                             Generating PDF...
//                         </>
//                     ) : (
//                         <>
//                             <Download size={18} className="mr-2" />
//                             Generate & Download {letterTypeDisplay}
//                         </>
//                     )}
//                 </Button>

//                 <Button
//                     onClick={handleReset}
//                     variant="outline"
//                     disabled={loading}
//                     className={`px-6 py-6 text-base font-medium ${
//                         darkMode
//                             ? "border-gray-600 hover:bg-gray-700 text-gray-300"
//                             : "border-gray-300 hover:bg-gray-50"
//                     }`}
//                 >
//                     Reset
//                 </Button>
//             </div>

//             {/* Current Letter Type Info */}
//             <Card
//                 className={`bg-gradient-to-r ${
//                     darkMode
//                         ? "from-gray-800 to-gray-700 border-gray-600"
//                         : "from-gray-50 to-slate-50 border-gray-200"
//                 } p-3 sm:p-4 md:p-5`}
//             >
//                 <div className="text-center">
//                     <div className="flex items-center justify-center gap-2 mb-2">
//                         {React.createElement(LetterIcon, { 
//                             size: 20, 
//                             className: darkMode ? "text-blue-400" : "text-blue-600" 
//                         })}
//                         <h3 className={`text-sm sm:text-base font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
//                             {letterTypeDisplay} Generator
//                         </h3>
//                     </div>
//                     <p className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
//                         ISCS Technologies Private Limited — {letterTypeDisplay} Management System
//                     </p>
//                     <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
//                         {getLetterTypeDescription()}
//                     </p>
//                 </div>
//             </Card>
//         </div>
//     );
// }

// src/components/Appointment.jsx
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Download,
    RefreshCw,
    AlertCircle,
    User,
    MapPin,
    Briefcase,
    Calendar,
    DollarSign,
    CheckCircle,
    FileCheck,
    FileSignature,
    LogOut,
    Building,
    UserCheck,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";
import { getToken } from "../api";
import { useToast } from "@/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function Appointment() {
    const { darkMode } = useDarkMode();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [generatedFilename, setGeneratedFilename] = useState(null);
    const [letterType, setLetterType] = useState("appointment");
    const [expandedSections, setExpandedSections] = useState({
        identity: true,
        address: true,
        details: true,
        settings: true,
    });

    // Common fields for all letter types
    const [formData, setFormData] = useState({
        employee_name: "",
        gender_prefix: "",
        father_name: "",
        address_line1: "",
        address_line2: "",
        address_line3: "",
        designation: "",
        date_of_joining: "",
        annual_ctc: "",
        letter_date: "",
        relieving_date: "",
        client_name: "",
        client_release_date: "",
        reference_number: "",
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const buildRequestBody = () => {
        const body = {};
        
        if (formData.employee_name.trim()) body.employee_name = formData.employee_name.trim();
        if (formData.gender_prefix) body.gender_prefix = formData.gender_prefix;
        if (formData.father_name.trim()) body.father_name = formData.father_name.trim();
        if (formData.address_line1.trim()) body.address_line1 = formData.address_line1.trim();
        if (formData.address_line2.trim()) body.address_line2 = formData.address_line2.trim();
        if (formData.address_line3.trim()) body.address_line3 = formData.address_line3.trim();
        if (formData.designation.trim()) body.designation = formData.designation.trim();
        if (formData.date_of_joining) body.date_of_joining = formData.date_of_joining;
        if (formData.annual_ctc) body.annual_ctc = parseFloat(formData.annual_ctc);
        if (formData.letter_date) body.letter_date = formData.letter_date;
        
        if (letterType === "relieving") {
            if (formData.relieving_date) body.relieving_date = formData.relieving_date;
            if (formData.client_name.trim()) body.client_name = formData.client_name.trim();
            if (formData.client_release_date) body.client_release_date = formData.client_release_date;
            if (formData.reference_number.trim()) body.reference_number = formData.reference_number.trim();
        }
        
        return body;
    };

    const getEndpoint = () => {
        switch(letterType) {
            case "appointment":
                return `${API_BASE_URL}/appointment-letter/generate`;
            case "proposed":
                return `${API_BASE_URL}/proposed-offer-letter/generate`;
            case "relieving":
                return `${API_BASE_URL}/relieving-experience-letter/generate`;
            default:
                return `${API_BASE_URL}/appointment-letter/generate`;
        }
    };

    const getDefaultFilename = () => {
        const name = formData.employee_name.trim() || "Employee";
        const safeName = name.replace(/\s+/g, "_");
        switch(letterType) {
            case "appointment":
                return `Appointment_Letter_${safeName}.pdf`;
            case "proposed":
                return `Proposed_Offer_Letter_${safeName}.pdf`;
            case "relieving":
                return `Relieving_Experience_Letter_${safeName}.pdf`;
            default:
                return `Letter_${safeName}.pdf`;
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        setGeneratedFilename(null);

        try {
            const token = getToken();
            const endpoint = getEndpoint();
            
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(buildRequestBody()),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Failed to generate ${letterType} letter`);
            }

            const contentDisposition = response.headers.get("Content-Disposition");
            let filename = getDefaultFilename();
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match) filename = match[1];
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setGeneratedFilename(filename);

            const letterTypeDisplay = getLetterTypeDisplay();
            toast({
                title: "Success",
                description: `${letterTypeDisplay} generated: ${filename}`,
                className: darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-100"
                    : "bg-white border-gray-200 text-gray-800",
            });
        } catch (err) {
            console.error(`Error generating ${letterType} letter:`, err);
            toast({
                title: "Generation Failed",
                description: err.message || `Failed to generate ${letterType} letter. Please try again.`,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            employee_name: "",
            gender_prefix: "",
            father_name: "",
            address_line1: "",
            address_line2: "",
            address_line3: "",
            designation: "",
            date_of_joining: "",
            annual_ctc: "",
            letter_date: "",
            relieving_date: "",
            client_name: "",
            client_release_date: "",
            reference_number: "",
        });
        setGeneratedFilename(null);
    };

    const getLetterTypeDisplay = () => {
        switch(letterType) {
            case "appointment":
                return "Appointment Letter";
            case "proposed":
                return "Proposed Offer Letter";
            case "relieving":
                return "Relieving & Experience Letter";
            default:
                return "Letter";
        }
    };

    const getLetterTypeIcon = () => {
        switch(letterType) {
            case "appointment":
                return FileCheck;
            case "proposed":
                return FileSignature;
            case "relieving":
                return LogOut;
            default:
                return FileText;
        }
    };

    const getLetterTypeDescription = () => {
        switch(letterType) {
            case "appointment":
                return "Generates full appointment letters with salary breakup table";
            case "proposed":
                return "Generates proposed offer letters with salary breakup table";
            case "relieving":
                return "Generates relieving & experience letters with tenure details";
            default:
                return "Generate letter";
        }
    };

    const getLetterTypeColor = () => {
        switch(letterType) {
            case "appointment":
                return "blue";
            case "proposed":
                return "purple";
            case "relieving":
                return "orange";
            default:
                return "blue";
        }
    };

    const inputClass = `h-10 text-sm w-full ${
        darkMode
            ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500 placeholder-gray-400"
            : "border-gray-300 focus:border-blue-500"
    }`;

    const labelClass = `text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1 block`;

    const sectionCardClass = `p-3 sm:p-4 md:p-5 mb-3 sm:mb-4 md:mb-6 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border border-gray-200"
    } shadow-sm rounded-lg`;

    const sectionTitleClass = `text-sm sm:text-base md:text-lg font-semibold ${
        darkMode ? "text-gray-100" : "text-gray-800"
    }`;

    const letterTypeDisplay = getLetterTypeDisplay();
    const LetterIcon = getLetterTypeIcon();
    const isRelieving = letterType === "relieving";
    const colorClass = getLetterTypeColor();

    const SectionHeader = ({ icon: Icon, title, section, children }) => (
        <div className="mb-3 sm:mb-4">
            <button
                onClick={() => toggleSection(section)}
                className="flex items-center justify-between w-full group"
            >
                <div className="flex items-center gap-2">
                    <Icon className={`text-${colorClass}-500 dark:text-${colorClass}-400`} size={18} />
                    <h2 className={sectionTitleClass}>{title}</h2>
                </div>
                <div className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    {expandedSections[section] ? (
                        <ChevronUp size={18} className="text-gray-500" />
                    ) : (
                        <ChevronDown size={18} className="text-gray-500" />
                    )}
                </div>
            </button>
            {expandedSections[section] && (
                <div className="mt-3 sm:mt-4">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className={`w-full min-h-screen p-2 sm:p-3 md:p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            {/* Header */}
            <div className="mb-4 sm:mb-6">
                <div className="flex flex-col gap-3">
                    <div>
                        <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                            Letter Generator
                        </h1>
                        <p className={`text-xs sm:text-sm md:text-base ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                            Generate and download {letterTypeDisplay.toLowerCase()} for employees as PDF
                        </p>
                    </div>
                    
                    {/* Letter Type Dropdown - Mobile Optimized */}
                    <div className="w-full sm:w-auto sm:min-w-[220px]">
                        <Label className={labelClass}>Letter Type</Label>
                        <Select
                            value={letterType}
                            onValueChange={(val) => {
                                setLetterType(val);
                                setGeneratedFilename(null);
                            }}
                        >
                            <SelectTrigger
                                className={`w-full h-10 text-sm ${
                                    darkMode
                                        ? "bg-gray-700 text-white border-gray-600"
                                        : "bg-white border-gray-300"
                                }`}
                            >
                                <SelectValue placeholder="Select letter type" />
                            </SelectTrigger>
                            <SelectContent
                                className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"}
                            >
                                <SelectItem value="appointment">
                                    <div className="flex items-center gap-2">
                                        <FileCheck size={16} />
                                        <span className="text-sm">Appointment Letter</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="proposed">
                                    <div className="flex items-center gap-2">
                                        <FileSignature size={16} />
                                        <span className="text-sm">Proposed Offer Letter</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="relieving">
                                    <div className="flex items-center gap-2">
                                        <LogOut size={16} />
                                        <span className="text-sm">Relieving & Experience</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Info Note - Mobile Optimized */}
            <div
                className={`mb-3 sm:mb-4 md:mb-6 p-3 sm:p-4 rounded-lg border flex items-start gap-2 sm:gap-3 ${
                    darkMode
                        ? "bg-blue-900/20 border-blue-800 text-blue-300"
                        : "bg-blue-50 border-blue-200 text-blue-700"
                }`}
            >
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm">
                    <strong>Note:</strong> All fields are optional. Omitted fields will be left blank.
                    {isRelieving ? (
                        <> If <strong>Generated Date</strong> is omitted, today's date is used.</>
                    ) : (
                        <> If <strong>Annual CTC</strong> is provided, salary breakup is auto-calculated.</>
                    )}
                </p>
            </div>

            {/* ── Section 1: Employee Identity ── */}
            <Card className={sectionCardClass}>
                <SectionHeader icon={User} title="Employee Identity" section="identity">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                            <Label className={labelClass}>Salutation</Label>
                            <Select
                                value={formData.gender_prefix}
                                onValueChange={(val) => handleChange("gender_prefix", val)}
                            >
                                <SelectTrigger
                                    className={`w-full h-10 text-sm ${
                                        darkMode
                                            ? "bg-gray-700 text-white border-gray-600"
                                            : "bg-white border-gray-300"
                                    }`}
                                >
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent
                                    className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"}
                                >
                                    <SelectItem value="Mr.">Mr.</SelectItem>
                                    <SelectItem value="Ms.">Ms.</SelectItem>
                                    <SelectItem value="Mrs.">Mrs.</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className={labelClass}>Full Name</Label>
                            <Input
                                value={formData.employee_name}
                                onChange={(e) => handleChange("employee_name", e.target.value)}
                                placeholder="e.g. Rajesh Kumar Sharma"
                                className={inputClass}
                                maxLength={100}
                            />
                        </div>

                        {!isRelieving && (
                            <div>
                                <Label className={labelClass}>Father's / Guardian's Name</Label>
                                <Input
                                    value={formData.father_name}
                                    onChange={(e) => handleChange("father_name", e.target.value)}
                                    placeholder="e.g. Suresh Kumar Sharma"
                                    className={inputClass}
                                    maxLength={100}
                                />
                            </div>
                        )}
                    </div>
                </SectionHeader>
            </Card>

            {/* ── Section 2: Address ── */}
            {!isRelieving && (
                <Card className={sectionCardClass}>
                    <SectionHeader icon={MapPin} title="Address" section="address">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            <div>
                                <Label className={labelClass}>Address Line 1</Label>
                                <Input
                                    value={formData.address_line1}
                                    onChange={(e) => handleChange("address_line1", e.target.value)}
                                    placeholder="Flat 402, Skyline Apartments"
                                    className={inputClass}
                                    maxLength={200}
                                />
                            </div>
                            <div>
                                <Label className={labelClass}>Address Line 2</Label>
                                <Input
                                    value={formData.address_line2}
                                    onChange={(e) => handleChange("address_line2", e.target.value)}
                                    placeholder="Madhapur, Hyderabad"
                                    className={inputClass}
                                    maxLength={200}
                                />
                            </div>
                            <div>
                                <Label className={labelClass}>Address Line 3</Label>
                                <Input
                                    value={formData.address_line3}
                                    onChange={(e) => handleChange("address_line3", e.target.value)}
                                    placeholder="Telangana – 500081"
                                    className={inputClass}
                                    maxLength={200}
                                />
                            </div>
                        </div>
                    </SectionHeader>
                </Card>
            )}

            {/* ── Section 3: Details ── */}
            <Card className={sectionCardClass}>
                <SectionHeader 
                    icon={isRelieving ? Building : Briefcase} 
                    title={isRelieving ? "Relieving Details" : "Appointment Details"} 
                    section="details"
                >
                    {isRelieving ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <Label className={labelClass}>Designation</Label>
                                <Input
                                    value={formData.designation}
                                    onChange={(e) => handleChange("designation", e.target.value)}
                                    placeholder="e.g. Senior Software Engineer"
                                    className={inputClass}
                                    maxLength={150}
                                />
                            </div>
                            <div>
                                <Label className={labelClass}>Date of Joining</Label>
                                <Input
                                    type="date"
                                    value={formData.date_of_joining}
                                    onChange={(e) => handleChange("date_of_joining", e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <Label className={labelClass}>Relieving Date</Label>
                                <Input
                                    type="date"
                                    value={formData.relieving_date}
                                    onChange={(e) => handleChange("relieving_date", e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <Label className={labelClass}>Client Name</Label>
                                <Input
                                    value={formData.client_name}
                                    onChange={(e) => handleChange("client_name", e.target.value)}
                                    placeholder="e.g. HCL Technologies"
                                    className={inputClass}
                                    maxLength={150}
                                />
                            </div>
                            <div>
                                <Label className={labelClass}>Client Release Date</Label>
                                <Input
                                    type="date"
                                    value={formData.client_release_date}
                                    onChange={(e) => handleChange("client_release_date", e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <Label className={labelClass}>Reference Number</Label>
                                <Input
                                    value={formData.reference_number}
                                    onChange={(e) => handleChange("reference_number", e.target.value)}
                                    placeholder="e.g. ISCS/R/E/EMP/E083/..."
                                    className={inputClass}
                                    maxLength={100}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <div className="sm:col-span-2">
                                <Label className={labelClass}>Designation</Label>
                                <Input
                                    value={formData.designation}
                                    onChange={(e) => handleChange("designation", e.target.value)}
                                    placeholder="e.g. Senior Software Engineer – Consultant"
                                    className={inputClass}
                                    maxLength={150}
                                />
                            </div>
                            <div>
                                <Label className={labelClass}>Date of Joining</Label>
                                <Input
                                    type="date"
                                    value={formData.date_of_joining}
                                    onChange={(e) => handleChange("date_of_joining", e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <Label className={labelClass}>Annual CTC (INR)</Label>
                                <Input
                                    type="number"
                                    value={formData.annual_ctc}
                                    onChange={(e) => handleChange("annual_ctc", e.target.value)}
                                    placeholder="e.g. 1200000"
                                    className={inputClass}
                                    min={1}
                                />
                                <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                                    Auto-calculates salary breakup
                                </p>
                            </div>
                        </div>
                    )}
                </SectionHeader>
            </Card>

            {/* ── Section 4: Letter Settings ── */}
            <Card className={sectionCardClass}>
                <SectionHeader icon={FileText} title="Letter Settings" section="settings">
                    <div className="max-w-xs w-full">
                        <Label className={labelClass}>
                            {isRelieving ? "Generated Date" : "Letter Date"}
                        </Label>
                        <Input
                            type="date"
                            value={formData.letter_date}
                            onChange={(e) => handleChange("letter_date", e.target.value)}
                            className={inputClass}
                        />
                        <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                            Defaults to today's date if left blank
                        </p>
                    </div>
                </SectionHeader>
            </Card>

            {/* ── Success Banner ── */}
            {generatedFilename && (
                <div
                    className={`mb-3 sm:mb-4 md:mb-6 p-3 sm:p-4 rounded-lg border flex items-start gap-2 sm:gap-3 ${
                        darkMode
                            ? "bg-green-900/30 border-green-700 text-green-300"
                            : "bg-green-50 border-green-200 text-green-700"
                    }`}
                >
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">Successfully generated!</p>
                        <p className={`text-xs mt-0.5 truncate ${darkMode ? "text-green-400" : "text-green-600"}`}>
                            {generatedFilename}
                        </p>
                    </div>
                </div>
            )}

            {/* ── Action Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 sm:py-6 text-sm sm:text-base font-medium rounded-lg"
                >
                    {loading ? (
                        <>
                            <RefreshCw size={18} className="mr-2 animate-spin flex-shrink-0" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <Download size={18} className="mr-2 flex-shrink-0" />
                            <span>Generate & Download</span>
                        </>
                    )}
                </Button>

                <Button
                    onClick={handleReset}
                    variant="outline"
                    disabled={loading}
                    className={`w-full sm:w-auto px-6 py-4 sm:py-6 text-sm sm:text-base font-medium rounded-lg ${
                        darkMode
                            ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                            : "border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    Reset
                </Button>
            </div>

            {/* Footer - Mobile Optimized */}
            <Card
                className={`bg-gradient-to-r ${
                    darkMode
                        ? "from-gray-800 to-gray-700 border-gray-600"
                        : "from-gray-50 to-slate-50 border-gray-200"
                } p-3 sm:p-4 md:p-5 rounded-lg`}
            >
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        {React.createElement(LetterIcon, { 
                            size: 18, 
                            className: darkMode ? `text-${colorClass}-400` : `text-${colorClass}-600` 
                        })}
                        <h3 className={`text-sm sm:text-base font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                            {letterTypeDisplay}
                        </h3>
                    </div>
                    <p className={`text-[10px] sm:text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        ISCS Technologies Private Limited
                    </p>
                    <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {getLetterTypeDescription()}
                    </p>
                </div>
            </Card>
        </div>
    );
}