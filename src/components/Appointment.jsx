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
//     ChevronDown,
//     ChevronUp,
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

// // ─────────────────────────────────────────────────────────────────────────────
// // SectionHeader is defined OUTSIDE Appointment so React never remounts it
// // on a parent re-render (which was causing inputs to lose focus mid-typing).
// // ─────────────────────────────────────────────────────────────────────────────
// const SectionHeader = ({
//     icon: Icon,
//     title,
//     section,
//     expandedSections,
//     toggleSection,
//     colorClass,
//     darkMode,
//     children,
// }) => {
//     const sectionTitleClass = `text-sm sm:text-base md:text-lg font-semibold ${
//         darkMode ? "text-gray-100" : "text-gray-800"
//     }`;

//     return (
//         <div className="mb-3 sm:mb-4">
//             <button
//                 type="button"
//                 onClick={() => toggleSection(section)}
//                 className="flex items-center justify-between w-full group"
//             >
//                 <div className="flex items-center gap-2">
//                     <Icon
//                         className={`text-${colorClass}-500 dark:text-${colorClass}-400`}
//                         size={18}
//                     />
//                     <h2 className={sectionTitleClass}>{title}</h2>
//                 </div>
//                 <div className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
//                     {expandedSections[section] ? (
//                         <ChevronUp size={18} className="text-gray-500" />
//                     ) : (
//                         <ChevronDown size={18} className="text-gray-500" />
//                     )}
//                 </div>
//             </button>

//             {expandedSections[section] && (
//                 <div className="mt-3 sm:mt-4">{children}</div>
//             )}
//         </div>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Main component
// // ─────────────────────────────────────────────────────────────────────────────
// export default function Appointment() {
//     const { darkMode } = useDarkMode();
//     const { toast } = useToast();

//     const [loading, setLoading] = useState(false);
//     const [generatedFilename, setGeneratedFilename] = useState(null);
//     const [letterType, setLetterType] = useState("appointment");
//     const [expandedSections, setExpandedSections] = useState({
//         identity: true,
//         address: true,
//         details: true,
//         settings: true,
//     });

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
//         relieving_date: "",
//         client_name: "",
//         client_release_date: "",
//         reference_number: "",
//     });

//     const handleChange = (field, value) => {
//         setFormData((prev) => ({ ...prev, [field]: value }));
//     };

//     const toggleSection = (section) => {
//         setExpandedSections((prev) => ({
//             ...prev,
//             [section]: !prev[section],
//         }));
//     };

//     const buildRequestBody = () => {
//         const body = {};

//         if (formData.employee_name.trim()) body.employee_name = formData.employee_name.trim();
//         if (formData.gender_prefix)        body.gender_prefix = formData.gender_prefix;
//         if (formData.father_name.trim())   body.father_name   = formData.father_name.trim();
//         if (formData.address_line1.trim()) body.address_line1 = formData.address_line1.trim();
//         if (formData.address_line2.trim()) body.address_line2 = formData.address_line2.trim();
//         if (formData.address_line3.trim()) body.address_line3 = formData.address_line3.trim();
//         if (formData.designation.trim())   body.designation   = formData.designation.trim();
//         if (formData.date_of_joining)      body.date_of_joining = formData.date_of_joining;
//         if (formData.annual_ctc)           body.annual_ctc    = parseFloat(formData.annual_ctc);
//         if (formData.letter_date)          body.letter_date   = formData.letter_date;

//         if (letterType === "relieving") {
//             if (formData.relieving_date)          body.relieving_date    = formData.relieving_date;
//             if (formData.client_name.trim())      body.client_name       = formData.client_name.trim();
//             if (formData.client_release_date)     body.client_release_date = formData.client_release_date;
//             if (formData.reference_number.trim()) body.reference_number  = formData.reference_number.trim();
//         }

//         return body;
//     };

//     const getEndpoint = () => {
//         switch (letterType) {
//             case "appointment": return `${API_BASE_URL}/appointment-letter/generate`;
//             case "proposed":    return `${API_BASE_URL}/proposed-offer-letter/generate`;
//             case "relieving":   return `${API_BASE_URL}/relieving-experience-letter/generate`;
//             default:            return `${API_BASE_URL}/appointment-letter/generate`;
//         }
//     };

//     const getDefaultFilename = () => {
//         const name     = formData.employee_name.trim() || "Employee";
//         const safeName = name.replace(/\s+/g, "_");
//         switch (letterType) {
//             case "appointment": return `Appointment_Letter_${safeName}.pdf`;
//             case "proposed":    return `Proposed_Offer_Letter_${safeName}.pdf`;
//             case "relieving":   return `Relieving_Experience_Letter_${safeName}.pdf`;
//             default:            return `Letter_${safeName}.pdf`;
//         }
//     };

//     const getLetterTypeDisplay = () => {
//         switch (letterType) {
//             case "appointment": return "Appointment Letter";
//             case "proposed":    return "Proposed Offer Letter";
//             case "relieving":   return "Relieving/Experience Letter";
//             default:            return "Letter";
//         }
//     };

//     const getLetterTypeIcon = () => {
//         switch (letterType) {
//             case "appointment": return FileCheck;
//             case "proposed":    return FileSignature;
//             case "relieving":   return LogOut;
//             default:            return FileText;
//         }
//     };

//     const getLetterTypeDescription = () => {
//         switch (letterType) {
//             case "appointment": return "Generates full appointment letters with salary breakup table";
//             case "proposed":    return "Generates proposed offer letters with salary breakup table";
//             case "relieving":   return "Generates relieving/experience letters with tenure details";
//             default:            return "Generate letter";
//         }
//     };

//     const getLetterTypeColor = () => {
//         switch (letterType) {
//             case "appointment": return "blue";
//             case "proposed":    return "purple";
//             case "relieving":   return "orange";
//             default:            return "blue";
//         }
//     };

//     const handleGenerate = async () => {
//         setLoading(true);
//         setGeneratedFilename(null);

//         try {
//             const token    = getToken();
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

//             const contentDisposition = response.headers.get("Content-Disposition");
//             let filename = getDefaultFilename();
//             if (contentDisposition) {
//                 const match = contentDisposition.match(/filename="?([^"]+)"?/);
//                 if (match) filename = match[1];
//             }

//             const blob = await response.blob();
//             const url  = window.URL.createObjectURL(blob);
//             const link = document.createElement("a");
//             link.href     = url;
//             link.download = filename;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(url);

//             setGeneratedFilename(filename);

//             toast({
//                 title: "Success",
//                 description: `${getLetterTypeDisplay()} generated: ${filename}`,
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
//             employee_name:      "",
//             gender_prefix:      "",
//             father_name:        "",
//             address_line1:      "",
//             address_line2:      "",
//             address_line3:      "",
//             designation:        "",
//             date_of_joining:    "",
//             annual_ctc:         "",
//             letter_date:        "",
//             relieving_date:     "",
//             client_name:        "",
//             client_release_date:"",
//             reference_number:   "",
//         });
//         setGeneratedFilename(null);
//     };

//     // ── Derived values ────────────────────────────────────────────────────────
//     const letterTypeDisplay = getLetterTypeDisplay();
//     const LetterIcon        = getLetterTypeIcon();
//     const colorClass        = getLetterTypeColor();
//     const isRelieving       = letterType === "relieving";

//     // Stable class strings (not re-created per keystroke since they only
//     // depend on `darkMode`, which changes rarely)
//     const inputClass = `h-10 text-sm w-full ${
//         darkMode
//             ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500 placeholder-gray-400"
//             : "border-gray-300 focus:border-blue-500"
//     }`;

//     const labelClass = `text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1 block`;

//     const sectionCardClass = `p-3 sm:p-4 md:p-5 mb-3 sm:mb-4 md:mb-6 ${
//         darkMode ? "bg-gray-800 border-gray-700" : "bg-white border border-gray-200"
//     } shadow-sm rounded-lg`;

//     // Shared props passed to every SectionHeader
//     const sharedHeaderProps = { expandedSections, toggleSection, colorClass, darkMode };

//     // ─────────────────────────────────────────────────────────────────────────
//     return (
//         <div className={`w-full min-h-screen p-2 sm:p-3 md:p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>

//             {/* ── Header ── */}
//             <div className="mb-4 sm:mb-6">
//                 <div className="flex flex-col gap-3">
//                     <div>
//                         <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
//                             Letter Generator
//                         </h1>
//                         <p className={`text-xs sm:text-sm md:text-base ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
//                             Generate and download {letterTypeDisplay.toLowerCase()} for employees as PDF
//                         </p>
//                     </div>

//                     {/* Letter Type Dropdown */}
//                     <div className="w-full sm:w-auto sm:min-w-[220px]">
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
//                                         <span className="text-sm">Appointment Letter</span>
//                                     </div>
//                                 </SelectItem>
//                                 <SelectItem value="proposed">
//                                     <div className="flex items-center gap-2">
//                                         <FileSignature size={16} />
//                                         <span className="text-sm">Proposed Offer Letter</span>
//                                     </div>
//                                 </SelectItem>
//                                 <SelectItem value="relieving">
//                                     <div className="flex items-center gap-2">
//                                         <LogOut size={16} />
//                                         <span className="text-sm">Relieving/Experience</span>
//                                     </div>
//                                 </SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>
//             </div>

//             {/* ── Info Note ── */}
//             <div
//                 className={`mb-3 sm:mb-4 md:mb-6 p-3 sm:p-4 rounded-lg border flex items-start gap-2 sm:gap-3 ${
//                     darkMode
//                         ? "bg-blue-900/20 border-blue-800 text-blue-300"
//                         : "bg-blue-50 border-blue-200 text-blue-700"
//                 }`}
//             >
//                 <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
//                 <p className="text-xs sm:text-sm">
//                     <strong>Note:</strong> All fields are optional. Omitted fields will be left blank.
//                     {isRelieving ? (
//                         <> If <strong>Generated Date</strong> is omitted, today's date is used.</>
//                     ) : (
//                         <> If <strong>Annual CTC</strong> is provided, salary breakup is auto-calculated.</>
//                     )}
//                 </p>
//             </div>

//             {/* ── Section 1: Employee Identity ── */}
//             <Card className={sectionCardClass}>
//                 <SectionHeader
//                     {...sharedHeaderProps}
//                     icon={User}
//                     title="Employee Identity"
//                     section="identity"
//                 >
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                         <div>
//                             <Label className={labelClass}>Salutation</Label>
//                             <Select
//                                 value={formData.gender_prefix}
//                                 onValueChange={(val) => handleChange("gender_prefix", val)}
//                             >
//                                 <SelectTrigger
//                                     className={`w-full h-10 text-sm ${
//                                         darkMode
//                                             ? "bg-gray-700 text-white border-gray-600"
//                                             : "bg-white border-gray-300"
//                                     }`}
//                                 >
//                                     <SelectValue placeholder="Select" />
//                                 </SelectTrigger>
//                                 <SelectContent
//                                     className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"}
//                                 >
//                                     <SelectItem value="Mr.">Mr.</SelectItem>
//                                     <SelectItem value="Ms.">Ms.</SelectItem>
//                                     <SelectItem value="Mrs.">Mrs.</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         <div>
//                             <Label className={labelClass}>Full Name</Label>
//                             <Input
//                                 value={formData.employee_name}
//                                 onChange={(e) => handleChange("employee_name", e.target.value)}
//                                 placeholder="e.g. Rajesh Kumar Sharma"
//                                 className={inputClass}
//                                 maxLength={100}
//                             />
//                         </div>

//                         {!isRelieving && (
//                             <div>
//                                 <Label className={labelClass}>Father's / Guardian's Name</Label>
//                                 <Input
//                                     value={formData.father_name}
//                                     onChange={(e) => handleChange("father_name", e.target.value)}
//                                     placeholder="e.g. Suresh Kumar Sharma"
//                                     className={inputClass}
//                                     maxLength={100}
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 </SectionHeader>
//             </Card>

//             {/* ── Section 2: Address (hidden for relieving) ── */}
//             {!isRelieving && (
//                 <Card className={sectionCardClass}>
//                     <SectionHeader
//                         {...sharedHeaderProps}
//                         icon={MapPin}
//                         title="Address"
//                         section="address"
//                     >
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
//                             <div>
//                                 <Label className={labelClass}>Address Line 1</Label>
//                                 <Input
//                                     value={formData.address_line1}
//                                     onChange={(e) => handleChange("address_line1", e.target.value)}
//                                     placeholder="Flat 402, Skyline Apartments"
//                                     className={inputClass}
//                                     maxLength={200}
//                                 />
//                             </div>
//                             <div>
//                                 <Label className={labelClass}>Address Line 2</Label>
//                                 <Input
//                                     value={formData.address_line2}
//                                     onChange={(e) => handleChange("address_line2", e.target.value)}
//                                     placeholder="Madhapur, Hyderabad"
//                                     className={inputClass}
//                                     maxLength={200}
//                                 />
//                             </div>
//                             <div>
//                                 <Label className={labelClass}>Address Line 3</Label>
//                                 <Input
//                                     value={formData.address_line3}
//                                     onChange={(e) => handleChange("address_line3", e.target.value)}
//                                     placeholder="Telangana – 500081"
//                                     className={inputClass}
//                                     maxLength={200}
//                                 />
//                             </div>
//                         </div>
//                     </SectionHeader>
//                 </Card>
//             )}

//             {/* ── Section 3: Details ── */}
//             <Card className={sectionCardClass}>
//                 <SectionHeader
//                     {...sharedHeaderProps}
//                     icon={isRelieving ? Building : Briefcase}
//                     title={isRelieving ? "Relieving Details" : "Appointment Details"}
//                     section="details"
//                 >
//                     {isRelieving ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                             <div>
//                                 <Label className={labelClass}>Designation</Label>
//                                 <Input
//                                     value={formData.designation}
//                                     onChange={(e) => handleChange("designation", e.target.value)}
//                                     placeholder="e.g. Senior Software Engineer"
//                                     className={inputClass}
//                                     maxLength={150}
//                                 />
//                             </div>
//                             <div>
//                                 <Label className={labelClass}>Date of Joining</Label>
//                                 <Input
//                                     type="date"
//                                     value={formData.date_of_joining}
//                                     onChange={(e) => handleChange("date_of_joining", e.target.value)}
//                                     className={inputClass}
//                                 />
//                             </div>
//                             <div>
//                                 <Label className={labelClass}>Relieving Date</Label>
//                                 <Input
//                                     type="date"
//                                     value={formData.relieving_date}
//                                     onChange={(e) => handleChange("relieving_date", e.target.value)}
//                                     className={inputClass}
//                                 />
//                             </div>
//                             <div>
//                                 <Label className={labelClass}>Client Name</Label>
//                                 <Input
//                                     value={formData.client_name}
//                                     onChange={(e) => handleChange("client_name", e.target.value)}
//                                     placeholder="e.g. HCL Technologies"
//                                     className={inputClass}
//                                     maxLength={150}
//                                 />
//                             </div>
//                             <div>
//                                 <Label className={labelClass}>Client Release Date</Label>
//                                 <Input
//                                     type="date"
//                                     value={formData.client_release_date}
//                                     onChange={(e) => handleChange("client_release_date", e.target.value)}
//                                     className={inputClass}
//                                 />
//                             </div>
//                             <div>
//                                 <Label className={labelClass}>Reference Number</Label>
//                                 <Input
//                                     value={formData.reference_number}
//                                     onChange={(e) => handleChange("reference_number", e.target.value)}
//                                     placeholder="e.g. ISCS/R/E/EMP/E083/..."
//                                     className={inputClass}
//                                     maxLength={100}
//                                 />
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//                             <div className="sm:col-span-2">
//                                 <Label className={labelClass}>Designation</Label>
//                                 <Input
//                                     value={formData.designation}
//                                     onChange={(e) => handleChange("designation", e.target.value)}
//                                     placeholder="e.g. Senior Software Engineer – Consultant"
//                                     className={inputClass}
//                                     maxLength={150}
//                                 />
//                             </div>
//                             <div>
//                                 <Label className={labelClass}>Date of Joining</Label>
//                                 <Input
//                                     type="date"
//                                     value={formData.date_of_joining}
//                                     onChange={(e) => handleChange("date_of_joining", e.target.value)}
//                                     className={inputClass}
//                                 />
//                             </div>
//                             <div>
//                                 <Label className={labelClass}>Annual CTC (INR)</Label>
//                                 <Input
//                                     type="number"
//                                     value={formData.annual_ctc}
//                                     onChange={(e) => handleChange("annual_ctc", e.target.value)}
//                                     placeholder="e.g. 1200000"
//                                     className={inputClass}
//                                     min={1}
//                                 />
//                                 <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
//                                     Auto-calculates salary breakup
//                                 </p>
//                             </div>
//                         </div>
//                     )}
//                 </SectionHeader>
//             </Card>

//             {/* ── Section 4: Letter Settings ── */}
//             <Card className={sectionCardClass}>
//                 <SectionHeader
//                     {...sharedHeaderProps}
//                     icon={FileText}
//                     title="Letter Settings"
//                     section="settings"
//                 >
//                     <div className="max-w-xs w-full">
//                         <Label className={labelClass}>
//                             {isRelieving ? "Generated Date" : "Letter Date"}
//                         </Label>
//                         <Input
//                             type="date"
//                             value={formData.letter_date}
//                             onChange={(e) => handleChange("letter_date", e.target.value)}
//                             className={inputClass}
//                         />
//                         <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
//                             Defaults to today's date if left blank
//                         </p>
//                     </div>
//                 </SectionHeader>
//             </Card>

//             {/* ── Success Banner ── */}
//             {generatedFilename && (
//                 <div
//                     className={`mb-3 sm:mb-4 md:mb-6 p-3 sm:p-4 rounded-lg border flex items-start gap-2 sm:gap-3 ${
//                         darkMode
//                             ? "bg-green-900/30 border-green-700 text-green-300"
//                             : "bg-green-50 border-green-200 text-green-700"
//                     }`}
//                 >
//                     <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
//                     <div className="min-w-0 flex-1">
//                         <p className="text-sm font-medium">Successfully generated!</p>
//                         <p className={`text-xs mt-0.5 truncate ${darkMode ? "text-green-400" : "text-green-600"}`}>
//                             {generatedFilename}
//                         </p>
//                     </div>
//                 </div>
//             )}

//             {/* ── Action Buttons ── */}
//             <div className="flex flex-col sm:flex-row gap-3 mb-6">
//                 <Button
//                     onClick={handleGenerate}
//                     disabled={loading}
//                     className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 sm:py-6 text-sm sm:text-base font-medium rounded-lg"
//                 >
//                     {loading ? (
//                         <>
//                             <RefreshCw size={18} className="mr-2 animate-spin flex-shrink-0" />
//                             <span>Generating...</span>
//                         </>
//                     ) : (
//                         <>
//                             <Download size={18} className="mr-2 flex-shrink-0" />
//                             <span>Generate &amp; Download</span>
//                         </>
//                     )}
//                 </Button>

//                 <Button
//                     onClick={handleReset}
//                     variant="outline"
//                     disabled={loading}
//                     className={`w-full sm:w-auto px-6 py-4 sm:py-6 text-sm sm:text-base font-medium rounded-lg ${
//                         darkMode
//                             ? "border-gray-600 hover:bg-gray-700 text-gray-300"
//                             : "border-gray-300 hover:bg-gray-50"
//                     }`}
//                 >
//                     Reset
//                 </Button>
//             </div>

//             {/* ── Footer ── */}
//             <Card
//                 className={`bg-gradient-to-r ${
//                     darkMode
//                         ? "from-gray-800 to-gray-700 border-gray-600"
//                         : "from-gray-50 to-slate-50 border-gray-200"
//                 } p-3 sm:p-4 md:p-5 rounded-lg`}
//             >
//                 <div className="text-center">
//                     <div className="flex items-center justify-center gap-2 mb-1">
//                         {React.createElement(LetterIcon, {
//                             size: 18,
//                             className: darkMode ? `text-${colorClass}-400` : `text-${colorClass}-600`,
//                         })}
//                         <h3 className={`text-sm sm:text-base font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
//                             {letterTypeDisplay}
//                         </h3>
//                     </div>
//                     <p className={`text-[10px] sm:text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
//                         ISCS Technologies Private Limited
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
    Send,
    Mail,
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

// ─────────────────────────────────────────────────────────────────────────────
// SectionHeader component
// ─────────────────────────────────────────────────────────────────────────────
const SectionHeader = ({
    icon: Icon,
    title,
    section,
    expandedSections,
    toggleSection,
    colorClass,
    darkMode,
    children,
}) => {
    const sectionTitleClass = `text-sm sm:text-base md:text-lg font-semibold ${
        darkMode ? "text-gray-100" : "text-gray-800"
    }`;

    return (
        <div className="mb-3 sm:mb-4">
            <button
                type="button"
                onClick={() => toggleSection(section)}
                className="flex items-center justify-between w-full group"
            >
                <div className="flex items-center gap-2">
                    <Icon
                        className={`text-${colorClass}-500 dark:text-${colorClass}-400`}
                        size={18}
                    />
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
                <div className="mt-3 sm:mt-4">{children}</div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
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
        email: true,
    });

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
        employee_email: "", // New field for email
    });

    const [sendEmail, setSendEmail] = useState(false);

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
        if (formData.gender_prefix)        body.gender_prefix = formData.gender_prefix;
        if (formData.father_name.trim())   body.father_name   = formData.father_name.trim();
        if (formData.address_line1.trim()) body.address_line1 = formData.address_line1.trim();
        if (formData.address_line2.trim()) body.address_line2 = formData.address_line2.trim();
        if (formData.address_line3.trim()) body.address_line3 = formData.address_line3.trim();
        if (formData.designation.trim())   body.designation   = formData.designation.trim();
        if (formData.date_of_joining)      body.date_of_joining = formData.date_of_joining;
        if (formData.annual_ctc)           body.annual_ctc    = parseFloat(formData.annual_ctc);
        if (formData.letter_date)          body.letter_date   = formData.letter_date;

        // Add email for proposed offer letter
        if (letterType === "proposed" && sendEmail && formData.employee_email.trim()) {
            body.employee_email = formData.employee_email.trim();
        }

        if (letterType === "relieving") {
            if (formData.relieving_date)          body.relieving_date    = formData.relieving_date;
            if (formData.client_name.trim())      body.client_name       = formData.client_name.trim();
            if (formData.client_release_date)     body.client_release_date = formData.client_release_date;
            if (formData.reference_number.trim()) body.reference_number  = formData.reference_number.trim();
        }

        return body;
    };

    const getEndpoint = () => {
        switch (letterType) {
            case "appointment": return `${API_BASE_URL}/appointment-letter/generate`;
            case "proposed":    return `${API_BASE_URL}/proposed-offer-letter/generate`;
            case "relieving":   return `${API_BASE_URL}/relieving-experience-letter/generate`;
            default:            return `${API_BASE_URL}/appointment-letter/generate`;
        }
    };

    const getDefaultFilename = () => {
        const name     = formData.employee_name.trim() || "Employee";
        const safeName = name.replace(/\s+/g, "_");
        switch (letterType) {
            case "appointment": return `Appointment_Letter_${safeName}.pdf`;
            case "proposed":    return `Proposed_Offer_Letter_${safeName}.pdf`;
            case "relieving":   return `Relieving_Experience_Letter_${safeName}.pdf`;
            default:            return `Letter_${safeName}.pdf`;
        }
    };

    const getLetterTypeDisplay = () => {
        switch (letterType) {
            case "appointment": return "Appointment Letter";
            case "proposed":    return "Proposed Offer Letter";
            case "relieving":   return "Relieving/Experience Letter";
            default:            return "Letter";
        }
    };

    const getLetterTypeIcon = () => {
        switch (letterType) {
            case "appointment": return FileCheck;
            case "proposed":    return FileSignature;
            case "relieving":   return LogOut;
            default:            return FileText;
        }
    };

    const getLetterTypeDescription = () => {
        switch (letterType) {
            case "appointment": return "Generates full appointment letters with salary breakup table";
            case "proposed":    return "Generates proposed offer letters with salary breakup table";
            case "relieving":   return "Generates relieving/experience letters with tenure details";
            default:            return "Generate letter";
        }
    };

    const getLetterTypeColor = () => {
        switch (letterType) {
            case "appointment": return "blue";
            case "proposed":    return "purple";
            case "relieving":   return "orange";
            default:            return "blue";
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        setGeneratedFilename(null);

        try {
            const token    = getToken();
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
            const url  = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href     = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setGeneratedFilename(filename);

            // Check if email was sent
            const emailSent = response.headers.get("X-Email-Sent") === "true";

            let description = `${getLetterTypeDisplay()} generated: ${filename}`;
            if (letterType === "proposed" && sendEmail && formData.employee_email.trim()) {
                if (emailSent) {
                    description += `\n📧 Email sent to ${formData.employee_email}`;
                } else {
                    description += `\n⚠️ Email could not be sent. Please check email address.`;
                }
            }

            toast({
                title: "Success",
                description: description,
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
            employee_name:      "",
            gender_prefix:      "",
            father_name:        "",
            address_line1:      "",
            address_line2:      "",
            address_line3:      "",
            designation:        "",
            date_of_joining:    "",
            annual_ctc:         "",
            letter_date:        "",
            relieving_date:     "",
            client_name:        "",
            client_release_date:"",
            reference_number:   "",
            employee_email:     "",
        });
        setSendEmail(false);
        setGeneratedFilename(null);
    };

    // ── Derived values ────────────────────────────────────────────────────────
    const letterTypeDisplay = getLetterTypeDisplay();
    const LetterIcon        = getLetterTypeIcon();
    const colorClass        = getLetterTypeColor();
    const isRelieving       = letterType === "relieving";
    const isProposed        = letterType === "proposed";
    const showEmailSection  = isProposed;

    // Stable class strings
    const inputClass = `h-10 text-sm w-full ${
        darkMode
            ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500 placeholder-gray-400"
            : "border-gray-300 focus:border-blue-500"
    }`;

    const labelClass = `text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1 block`;

    const sectionCardClass = `p-3 sm:p-4 md:p-5 mb-3 sm:mb-4 md:mb-6 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border border-gray-200"
    } shadow-sm rounded-lg`;

    const sharedHeaderProps = { expandedSections, toggleSection, colorClass, darkMode };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className={`w-full min-h-screen p-2 sm:p-3 md:p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>

            {/* ── Header ── */}
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

                    {/* Letter Type Dropdown */}
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
                                        <span className="text-sm">Relieving/Experience</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* ── Info Note ── */}
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
                    {isProposed && (
                        <> You can also <strong>email</strong> the letter directly to the employee.</>
                    )}
                </p>
            </div>

            {/* ── Section 1: Employee Identity ── */}
            <Card className={sectionCardClass}>
                <SectionHeader
                    {...sharedHeaderProps}
                    icon={User}
                    title="Employee Identity"
                    section="identity"
                >
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

            {/* ── Section 2: Address (hidden for relieving) ── */}
            {!isRelieving && (
                <Card className={sectionCardClass}>
                    <SectionHeader
                        {...sharedHeaderProps}
                        icon={MapPin}
                        title="Address"
                        section="address"
                    >
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
                    {...sharedHeaderProps}
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

            {/* ── Section 4: Email Settings (Only for Proposed Offer Letter) ── */}
            {showEmailSection && (
                <Card className={sectionCardClass}>
                    <SectionHeader
                        {...sharedHeaderProps}
                        icon={Mail}
                        title="Email Settings"
                        section="email"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="sendEmail"
                                    checked={sendEmail}
                                    onChange={(e) => setSendEmail(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <Label htmlFor="sendEmail" className="text-sm font-medium cursor-pointer">
                                    Send PDF via email to employee
                                </Label>
                            </div>

                            {sendEmail && (
                                <div className="max-w-md w-full">
                                    <Label className={labelClass}>Employee Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <Input
                                            type="email"
                                            value={formData.employee_email}
                                            onChange={(e) => handleChange("employee_email", e.target.value)}
                                            placeholder="employee@company.com"
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                    <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                                        The PDF will be attached to the email sent to this address
                                    </p>
                                </div>
                            )}
                        </div>
                    </SectionHeader>
                </Card>
            )}

            {/* ── Section 5: Letter Settings ── */}
            <Card className={sectionCardClass}>
                <SectionHeader
                    {...sharedHeaderProps}
                    icon={FileText}
                    title="Letter Settings"
                    section="settings"
                >
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
                            {sendEmail && formData.employee_email && (
                                <span className="ml-2 inline-flex items-center gap-1">
                                    <Send size={12} />
                                    Sent to {formData.employee_email}
                                </span>
                            )}
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
                            {sendEmail && isProposed ? (
                                <Send size={18} className="mr-2 flex-shrink-0" />
                            ) : (
                                <Download size={18} className="mr-2 flex-shrink-0" />
                            )}
                            <span>
                                {sendEmail && isProposed ? "Generate & Send Email" : "Generate & Download"}
                            </span>
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

            {/* ── Footer ── */}
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
                            className: darkMode ? `text-${colorClass}-400` : `text-${colorClass}-600`,
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
                        {isProposed && sendEmail && " — Email delivery enabled"}
                    </p>
                </div>
            </Card>
        </div>
    );
}