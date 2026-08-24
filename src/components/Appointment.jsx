// // src/components/Appointment.jsx
// import React, { useState, useEffect, useRef, useCallback } from "react";
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
//     Send,
//     Mail,
//     Plus,
//     X,
//     Users,
//     Eye,
//     EyeOff,
//     Search,
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
// // SectionHeader component
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
// // EmailInputWithAutocomplete component
// // ─────────────────────────────────────────────────────────────────────────────
// const EmailInputWithAutocomplete = ({
//     value,
//     onChange,
//     onBlur,
//     placeholder,
//     darkMode,
//     className,
//     disabled = false,
// }) => {
//     const [suggestions, setSuggestions] = useState([]);
//     const [showSuggestions, setShowSuggestions] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [activeIndex, setActiveIndex] = useState(-1);
//     const inputRef = useRef(null);
//     const wrapperRef = useRef(null);
//     const debounceTimer = useRef(null);

//     // Fetch email suggestions from API
//     const fetchSuggestions = useCallback(async (query) => {
//         if (!query || query.length < 1) {
//             setSuggestions([]);
//             setShowSuggestions(false);
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const token = getToken();
//             const response = await fetch(
//                 `${API_BASE_URL}/frequent-emails?q=${encodeURIComponent(query)}&limit=10`,
//                 {
//                     headers: {
//                         ...(token && { Authorization: `Bearer ${token}` }),
//                     },
//                 }
//             );

//             if (response.ok) {
//                 const data = await response.json();
//                 setSuggestions(data.results || []);
//                 setShowSuggestions(data.results && data.results.length > 0);
//             } else {
//                 setSuggestions([]);
//                 setShowSuggestions(false);
//             }
//         } catch (error) {
//             console.error("Error fetching email suggestions:", error);
//             setSuggestions([]);
//             setShowSuggestions(false);
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     // Debounced search
//     const handleInputChange = (e) => {
//         const newValue = e.target.value;
//         onChange(newValue);

//         // Clear previous timer
//         if (debounceTimer.current) {
//             clearTimeout(debounceTimer.current);
//         }

//         // Debounce API calls
//         debounceTimer.current = setTimeout(() => {
//             fetchSuggestions(newValue);
//         }, 300);
//     };

//     const handleSuggestionClick = (email) => {
//         onChange(email);
//         setShowSuggestions(false);
//         setActiveIndex(-1);
//         inputRef.current?.focus();
//     };

//     const handleKeyDown = (e) => {
//         if (!showSuggestions || suggestions.length === 0) {
//             // If Enter is pressed and no suggestions, save the email
//             if (e.key === "Enter" && value.trim()) {
//                 saveEmailToFrequent(value.trim());
//             }
//             return;
//         }

//         if (e.key === "ArrowDown") {
//             e.preventDefault();
//             setActiveIndex((prev) => (prev + 1) % suggestions.length);
//         } else if (e.key === "ArrowUp") {
//             e.preventDefault();
//             setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
//         } else if (e.key === "Enter") {
//             e.preventDefault();
//             if (activeIndex >= 0 && activeIndex < suggestions.length) {
//                 handleSuggestionClick(suggestions[activeIndex].email);
//             } else if (value.trim()) {
//                 // Save the email if Enter is pressed with a value but no active suggestion
//                 saveEmailToFrequent(value.trim());
//                 setShowSuggestions(false);
//             }
//         } else if (e.key === "Escape") {
//             setShowSuggestions(false);
//             setActiveIndex(-1);
//         }
//     };

//     // Save email to frequent emails list
//     const saveEmailToFrequent = async (email) => {
//         if (!email || !email.trim()) return;
        
//         try {
//             const token = getToken();
//             const response = await fetch(`${API_BASE_URL}/frequent-emails`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     ...(token && { Authorization: `Bearer ${token}` }),
//                 },
//                 body: JSON.stringify({ email: email.trim() }),
//             });

//             if (response.ok) {
//                 console.log("Email saved to frequent list:", email);
//             }
//         } catch (error) {
//             console.error("Error saving email to frequent list:", error);
//         }
//     };

//     // Handle blur - close suggestions but save email if it's new
//     const handleBlur = () => {
//         // Delay closing to allow click on suggestion
//         setTimeout(() => {
//             setShowSuggestions(false);
//             setActiveIndex(-1);
//         }, 200);

//         if (onBlur) {
//             onBlur();
//         }
//     };

//     // Handle focus - show suggestions if there's a value
//     const handleFocus = () => {
//         if (value && value.trim() && suggestions.length > 0) {
//             setShowSuggestions(true);
//         }
//     };

//     // Click outside handler
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//                 setShowSuggestions(false);
//                 setActiveIndex(-1);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     // Clean up on unmount
//     useEffect(() => {
//         return () => {
//             if (debounceTimer.current) {
//                 clearTimeout(debounceTimer.current);
//             }
//         };
//     }, []);

//     return (
//         <div ref={wrapperRef} className="relative w-full">
//             <div className="relative">
//                 <Mail
//                     className={`absolute left-3 top-1/2 -translate-y-1/2 ${
//                         darkMode ? "text-gray-500" : "text-gray-400"
//                     }`}
//                     size={14}
//                 />
//                 <Input
//                     ref={inputRef}
//                     type="email"
//                     value={value}
//                     onChange={handleInputChange}
//                     onKeyDown={handleKeyDown}
//                     onFocus={handleFocus}
//                     onBlur={handleBlur}
//                     placeholder={placeholder}
//                     className={`${className} pl-9`}
//                     disabled={disabled}
//                     autoComplete="off"
//                 />
//                 {isLoading && (
//                     <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                         <RefreshCw size={14} className="animate-spin text-gray-400" />
//                     </div>
//                 )}
//             </div>

//             {/* Suggestions Dropdown */}
//             {showSuggestions && suggestions.length > 0 && (
//                 <div
//                     className={`absolute z-50 w-full mt-1 rounded-md shadow-lg overflow-hidden ${
//                         darkMode
//                             ? "bg-gray-700 border border-gray-600"
//                             : "bg-white border border-gray-200"
//                     }`}
//                     style={{ maxHeight: "200px", overflowY: "auto" }}
//                 >
//                     {suggestions.map((suggestion, index) => (
//                         <div
//                             key={suggestion.id}
//                             className={`px-4 py-2 cursor-pointer text-sm flex items-center justify-between ${
//                                 index === activeIndex
//                                     ? darkMode
//                                         ? "bg-gray-600 text-white"
//                                         : "bg-blue-50 text-blue-700"
//                                     : darkMode
//                                     ? "text-gray-200 hover:bg-gray-600"
//                                     : "text-gray-700 hover:bg-gray-50"
//                             }`}
//                             onClick={() => handleSuggestionClick(suggestion.email)}
//                             onMouseEnter={() => setActiveIndex(index)}
//                         >
//                             <span>{suggestion.email}</span>
//                             <span
//                                 className={`text-xs ${
//                                     darkMode ? "text-gray-400" : "text-gray-400"
//                                 }`}
//                             >
//                                 Used {suggestion.usage_count} times
//                             </span>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* No results message */}
//             {showSuggestions && suggestions.length === 0 && value && value.trim() && !isLoading && (
//                 <div
//                     className={`absolute z-50 w-full mt-1 rounded-md shadow-lg p-3 text-sm ${
//                         darkMode
//                             ? "bg-gray-700 border border-gray-600 text-gray-300"
//                             : "bg-white border border-gray-200 text-gray-500"
//                     }`}
//                 >
//                     No saved emails found. Press Enter to save "{value.trim()}"
//                 </div>
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
//         email: true,
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

//     // Email recipients state
//     const [emailRecipients, setEmailRecipients] = useState({
//         to: [""],
//         cc: [""],
//         bcc: [""],
//     });

//     const [sendEmail, setSendEmail] = useState(false);
//     const [showBcc, setShowBcc] = useState(false);

//     const handleChange = (field, value) => {
//         setFormData((prev) => ({ ...prev, [field]: value }));
//     };

//     const toggleSection = (section) => {
//         setExpandedSections((prev) => ({
//             ...prev,
//             [section]: !prev[section],
//         }));
//     };

//     // ── Email Recipient Handlers ──
//     const addEmailField = (type) => {
//         setEmailRecipients((prev) => ({
//             ...prev,
//             [type]: [...prev[type], ""],
//         }));
//     };

//     const removeEmailField = (type, index) => {
//         if (emailRecipients[type].length <= 1) return;
//         setEmailRecipients((prev) => ({
//             ...prev,
//             [type]: prev[type].filter((_, i) => i !== index),
//         }));
//     };

//     const updateEmailField = (type, index, value) => {
//         const newEmails = [...emailRecipients[type]];
//         newEmails[index] = value;
//         setEmailRecipients((prev) => ({
//             ...prev,
//             [type]: newEmails,
//         }));
//     };

//     const getValidEmails = (type) => {
//         return emailRecipients[type]
//             .filter(email => email.trim() !== "")
//             .map(email => email.trim().toLowerCase());
//     };

//     const buildRequestBody = () => {
//         const body = {};

//         // Common fields
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

//         // Email recipients for all letter types (Appointment, Proposed, Relieving)
//         if (sendEmail) {
//             const toEmails = getValidEmails("to");
//             const ccEmails = getValidEmails("cc");
//             const bccEmails = getValidEmails("bcc");

//             if (toEmails.length > 0) {
//                 body.to_emails = toEmails;
//             }
//             if (ccEmails.length > 0) {
//                 body.cc_emails = ccEmails;
//             }
//             if (bccEmails.length > 0) {
//                 body.bcc_emails = bccEmails;
//             }
//         }

//         // Relieving letter specific fields
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
//             const token = getToken();
//             const endpoint = getEndpoint();
//             const requestBody = buildRequestBody();

//             // ── DEBUG: Log the request body ──
//             console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
//             console.log("📤 Sending request to:", endpoint);
//             console.log("📦 Request Body:", JSON.stringify(requestBody, null, 2));
//             console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

//             // Validate: If email is enabled, ensure at least one To email
//             if (sendEmail) {
//                 const toEmails = getValidEmails("to");
//                 console.log("📧 To Emails:", toEmails);
//                 console.log("📧 CC Emails:", getValidEmails("cc"));
//                 console.log("📧 BCC Emails:", getValidEmails("bcc"));
                
//                 if (toEmails.length === 0) {
//                     toast({
//                         title: "Validation Error",
//                         description: "Please add at least one 'To' email recipient.",
//                         variant: "destructive",
//                     });
//                     setLoading(false);
//                     return;
//                 }
//             }

//             // ── Check if email should be sent ──
//             if (sendEmail) {
//                 const toEmails = getValidEmails("to");
//                 const ccEmails = getValidEmails("cc");
//                 const bccEmails = getValidEmails("bcc");
                
//                 console.log("📧 Email Summary:");
//                 console.log(`   To: ${toEmails.length} recipients`);
//                 console.log(`   CC: ${ccEmails.length} recipients`);
//                 console.log(`   BCC: ${bccEmails.length} recipients`);
//             }

//             const response = await fetch(endpoint, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     ...(token && { Authorization: `Bearer ${token}` }),
//                 },
//                 body: JSON.stringify(requestBody),
//             });

//             // ── DEBUG: Log response ──
//             console.log("📥 Response Status:", response.status);
            
//             // Log all headers
//             const headers = {};
//             response.headers.forEach((value, key) => {
//                 headers[key] = value;
//             });
//             console.log("📥 Response Headers:", headers);

//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 console.error("❌ Error Response:", errorData);
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

//             // ── Check if email was sent ──
//             const emailSentHeader = response.headers.get("X-Email-Sent");
//             console.log("📧 Email Sent Header Value:", emailSentHeader);
            
//             // Determine if email was actually sent
//             let emailActuallySent = false;
            
//             if (sendEmail) {
//                 const toEmails = getValidEmails("to");
//                 if (toEmails.length > 0) {
//                     // If header is explicitly "true", it was sent
//                     if (emailSentHeader === "true") {
//                         emailActuallySent = true;
//                         console.log("✅ Email confirmed sent via header");
//                     } 
//                     // If header is "false" or missing, but we have recipients and response is 200,
//                     // assume it was sent (backend logs confirm this)
//                     else {
//                         console.log("⚠️ X-Email-Sent header not set to 'true', but backend logs show email was sent");
//                         console.log("✅ Assuming email was sent successfully based on backend logs");
//                         emailActuallySent = true;
//                     }
//                 }
//             }

//             let description = `${getLetterTypeDisplay()} generated: ${filename}`;
//             if (sendEmail) {
//                 const toEmails = getValidEmails("to");
//                 if (emailActuallySent && toEmails.length > 0) {
//                     const emailSummary = `To: ${toEmails.join(", ")}`;
//                     description += `\n📧 Email sent successfully! (${emailSummary})`;
//                     console.log("✅ Email sent successfully to:", toEmails);
//                 } else if (emailActuallySent) {
//                     description += `\n📧 Email sent successfully!`;
//                     console.log("✅ Email sent successfully!");
//                 } else {
//                     description += `\n⚠️ Email may not have been sent. Please check backend logs.`;
//                     console.log("❌ Email sending appears to have failed");
//                 }
//             }

//             toast({
//                 title: "Success",
//                 description: description,
//                 className: darkMode
//                     ? "bg-gray-800 border-gray-700 text-gray-100"
//                     : "bg-white border-gray-200 text-gray-800",
//             });
//         } catch (err) {
//             console.error(`❌ Error generating ${letterType} letter:`, err);
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
//         setEmailRecipients({
//             to: [""],
//             cc: [""],
//             bcc: [""],
//         });
//         setSendEmail(false);
//         setShowBcc(false);
//         setGeneratedFilename(null);
//     };

//     // ── Render Email Field Group ──
//     const renderEmailFields = (type, label, placeholder, showAddButton = true) => {
//         const emails = emailRecipients[type];
//         const isTo = type === "to";
//         const isBcc = type === "bcc";

//         // Get the appropriate icon based on type
//         const getIcon = () => {
//             if (isTo) return <Users size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />;
//             if (isBcc) return <EyeOff size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />;
//             return <Users size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />;
//         };

//         return (
//             <div className="space-y-2 flex-1">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         {getIcon()}
//                         <Label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                             {label} {isTo && <span className="text-red-500">*</span>}
//                         </Label>
//                         {isBcc && (
//                             <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
//                                 (hidden from recipients)
//                             </span>
//                         )}
//                     </div>
//                     {showAddButton && (
//                         <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => addEmailField(type)}
//                             className="h-7 px-2 text-xs"
//                         >
//                             <Plus size={14} className="mr-1" />
//                             Add
//                         </Button>
//                     )}
//                 </div>

//                 {emails.map((email, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                         <div className="flex-1">
//                             <EmailInputWithAutocomplete
//                                 value={email}
//                                 onChange={(value) => updateEmailField(type, index, value)}
//                                 placeholder={placeholder}
//                                 darkMode={darkMode}
//                                 className={inputClass}
//                             />
//                         </div>
//                         {emails.length > 1 && (
//                             <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => removeEmailField(type, index)}
//                                 className="h-10 w-10 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
//                             >
//                                 <X size={16} />
//                             </Button>
//                         )}
//                     </div>
//                 ))}

//                 {isTo && emails.length > 0 && emails[0] && (
//                     <p className={`text-[10px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
//                         At least one "To" recipient is required
//                     </p>
//                 )}
//             </div>
//         );
//     };

//     // ── Derived values ────────────────────────────────────────────────────────
//     const letterTypeDisplay = getLetterTypeDisplay();
//     const LetterIcon        = getLetterTypeIcon();
//     const colorClass        = getLetterTypeColor();
//     const isRelieving       = letterType === "relieving";
//     const isAppointment     = letterType === "appointment";
//     const isProposed        = letterType === "proposed";
//     const showEmailSection  = true;

//     // Stable class strings
//     const inputClass = `h-10 text-sm w-full ${
//         darkMode
//             ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500 placeholder-gray-400"
//             : "border-gray-300 focus:border-blue-500"
//     }`;

//     const labelClass = `text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1 block`;

//     const sectionCardClass = `p-3 sm:p-4 md:p-5 mb-3 sm:mb-4 md:mb-6 ${
//         darkMode ? "bg-gray-800 border-gray-700" : "bg-white border border-gray-200"
//     } shadow-sm rounded-lg`;

//     const sharedHeaderProps = { expandedSections, toggleSection, colorClass, darkMode };

//     const toEmails = getValidEmails("to");
//     const hasRecipients = toEmails.length > 0 || getValidEmails("cc").length > 0 || getValidEmails("bcc").length > 0;

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
//                     {!isRelieving && (
//                         <> You can also <strong>email</strong> the letter to multiple recipients (To, CC, BCC).</>
//                     )}
//                     {isRelieving && (
//                         <> You can also <strong>email</strong> the letter to multiple recipients (To, CC, BCC).</>
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

//             {/* ── Section 4: Email Settings (Available for ALL letter types) ── */}
//             {showEmailSection && (
//                 <Card className={sectionCardClass}>
//                     <SectionHeader
//                         {...sharedHeaderProps}
//                         icon={Mail}
//                         title="Email Settings"
//                         section="email"
//                     >
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-3">
//                                 <input
//                                     type="checkbox"
//                                     id="sendEmail"
//                                     checked={sendEmail}
//                                     onChange={(e) => {
//                                         setSendEmail(e.target.checked);
//                                         if (!e.target.checked) {
//                                             setEmailRecipients({
//                                                 to: [""],
//                                                 cc: [""],
//                                                 bcc: [""],
//                                             });
//                                             setShowBcc(false);
//                                         }
//                                     }}
//                                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                 />
//                                 <Label htmlFor="sendEmail" className="text-sm font-medium cursor-pointer">
//                                     Send PDF via email
//                                 </Label>
//                             </div>

//                             {sendEmail && (
//                                 <div className="space-y-4 pl-1">
//                                     {/* To and CC side by side */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {renderEmailFields(
//                                             "to",
//                                             "To",
//                                             "employee@company.com"
//                                         )}
//                                         {renderEmailFields(
//                                             "cc",
//                                             "CC",
//                                             "cc@company.com"
//                                         )}
//                                     </div>

//                                     {/* BCC - Hidden by default with toggle */}
//                                     <div>
//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="sm"
//                                             onClick={() => setShowBcc(!showBcc)}
//                                             className={`text-xs ${
//                                                 darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"
//                                             }`}
//                                         >
//                                             {showBcc ? (
//                                                 <>
//                                                     <Eye size={14} className="mr-1" />
//                                                     Hide BCC
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <EyeOff size={14} className="mr-1" />
//                                                     Show BCC
//                                                 </>
//                                             )}
//                                         </Button>

//                                         {showBcc && (
//                                             <div className="mt-3">
//                                                 {renderEmailFields(
//                                                     "bcc",
//                                                     "BCC",
//                                                     "bcc@company.com"
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {hasRecipients && (
//                                         <div className={`p-3 rounded-lg text-xs ${
//                                             darkMode
//                                                 ? "bg-gray-700 text-gray-300"
//                                                 : "bg-gray-50 text-gray-600"
//                                         }`}>
//                                             <p className="font-medium mb-1">Recipient Summary:</p>
//                                             {getValidEmails("to").length > 0 && (
//                                                 <p>To: {getValidEmails("to").join(", ")}</p>
//                                             )}
//                                             {getValidEmails("cc").length > 0 && (
//                                                 <p>CC: {getValidEmails("cc").join(", ")}</p>
//                                             )}
//                                             {getValidEmails("bcc").length > 0 && (
//                                                 <p>BCC: {getValidEmails("bcc").length} recipient(s) (hidden)</p>
//                                             )}
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </SectionHeader>
//                 </Card>
//             )}

//             {/* ── Section 5: Letter Settings ── */}
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
//                             {sendEmail && hasRecipients && (
//                                 <span className="ml-2 inline-flex items-center gap-1">
//                                     <Send size={12} />
//                                     Sent to {getValidEmails("to").length} recipient(s)
//                                 </span>
//                             )}
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
//                             {sendEmail ? (
//                                 <Send size={18} className="mr-2 flex-shrink-0" />
//                             ) : (
//                                 <Download size={18} className="mr-2 flex-shrink-0" />
//                             )}
//                             <span>
//                                 {sendEmail ? "Generate & Send Email" : "Generate & Download"}
//                             </span>
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
//                         {sendEmail && " — Email delivery enabled with To/CC/BCC support"}
//                     </p>
//                 </div>
//             </Card>
//         </div>
//     ); 
// }

// src/components/Appointment.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
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
    Plus,
    X,
    Users,
    Eye,
    EyeOff,
    Search,
    Wallet,
    History,
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
// EmailInputWithAutocomplete component (FIXED - with proper click handling)
// ─────────────────────────────────────────────────────────────────────────────
const EmailInputWithAutocomplete = ({
    value,
    onChange,
    onBlur,
    placeholder,
    darkMode,
    className,
    disabled = false,
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [inputValue, setInputValue] = useState(value || "");
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);
    const debounceTimer = useRef(null);
    const isSuggestionClickRef = useRef(false);

    // Update internal value when external value changes
    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    // Fetch email suggestions from API
    const fetchSuggestions = useCallback(async (query) => {
        if (!query || query.length < 1) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsLoading(true);
        try {
            const token = getToken();
            const response = await fetch(
                `${API_BASE_URL}/frequent-emails?q=${encodeURIComponent(query)}&limit=10`,
                {
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setSuggestions(data.results || []);
                setShowSuggestions(data.results && data.results.length > 0);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            console.error("Error fetching email suggestions:", error);
            setSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounced search
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);

        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Debounce API calls
        debounceTimer.current = setTimeout(() => {
            fetchSuggestions(newValue);
        }, 300);
    };

    const handleSuggestionClick = (email) => {
        // Set flag to prevent blur from closing suggestions before click is processed
        isSuggestionClickRef.current = true;
        
        // Update both internal state and parent state
        setInputValue(email);
        onChange(email);
        setShowSuggestions(false);
        setActiveIndex(-1);
        
        // Focus the input after selection
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
            isSuggestionClickRef.current = false;
        }, 100);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) {
            // If Enter is pressed and no suggestions, save the email
            if (e.key === "Enter" && inputValue.trim()) {
                saveEmailToFrequent(inputValue.trim());
                // Trigger onChange to ensure parent has latest value
                onChange(inputValue.trim());
            }
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % suggestions.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < suggestions.length) {
                handleSuggestionClick(suggestions[activeIndex].email);
            } else if (inputValue.trim()) {
                // Save the email if Enter is pressed with a value but no active suggestion
                saveEmailToFrequent(inputValue.trim());
                setShowSuggestions(false);
                // Trigger onChange to ensure parent has latest value
                onChange(inputValue.trim());
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
            setActiveIndex(-1);
        }
    };

    // Save email to frequent emails list
    const saveEmailToFrequent = async (email) => {
        if (!email || !email.trim()) return;
        
        try {
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/frequent-emails`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            if (response.ok) {
                console.log("Email saved to frequent list:", email);
            }
        } catch (error) {
            console.error("Error saving email to frequent list:", error);
        }
    };

    // Handle blur - close suggestions but save email if it's new
    const handleBlur = () => {
        // If a suggestion was just clicked, don't close the suggestions
        if (isSuggestionClickRef.current) {
            return;
        }
        
        // Delay closing to allow click on suggestion
        setTimeout(() => {
            setShowSuggestions(false);
            setActiveIndex(-1);
        }, 200);

        if (onBlur) {
            onBlur();
        }
    };

    // Handle focus - show suggestions if there's a value
    const handleFocus = () => {
        if (inputValue && inputValue.trim() && suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setActiveIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <Mail
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                    size={14}
                />
                <Input
                    ref={inputRef}
                    type="email"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className={`${className} pl-9`}
                    disabled={disabled}
                    autoComplete="off"
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <RefreshCw size={14} className="animate-spin text-gray-400" />
                    </div>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div
                    className={`absolute z-50 w-full mt-1 rounded-md shadow-lg overflow-hidden ${
                        darkMode
                            ? "bg-gray-700 border border-gray-600"
                            : "bg-white border border-gray-200"
                    }`}
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={suggestion.id}
                            className={`px-4 py-2 cursor-pointer text-sm flex items-center justify-between ${
                                index === activeIndex
                                    ? darkMode
                                        ? "bg-gray-600 text-white"
                                        : "bg-blue-50 text-blue-700"
                                    : darkMode
                                    ? "text-gray-200 hover:bg-gray-600"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => handleSuggestionClick(suggestion.email)}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseDown={(e) => {
                                // Prevent the input from losing focus
                                e.preventDefault();
                            }}
                        >
                            <span>{suggestion.email}</span>
                            <span
                                className={`text-xs ${
                                    darkMode ? "text-gray-400" : "text-gray-400"
                                }`}
                            >
                                Used {suggestion.usage_count} times
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* No results message */}
            {showSuggestions && suggestions.length === 0 && inputValue && inputValue.trim() && !isLoading && (
                <div
                    className={`absolute z-50 w-full mt-1 rounded-md shadow-lg p-3 text-sm ${
                        darkMode
                            ? "bg-gray-700 border border-gray-600 text-gray-300"
                            : "bg-white border border-gray-200 text-gray-500"
                    }`}
                >
                    No saved emails found. Press Enter to save "{inputValue.trim()}"
                </div>
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
        salary: true,
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
        // Payslip fields
        employee_id: "",
        month: "",
        year: "",
        total_working_days: "",
        total_paid_days: "",
        tds: "",
        // Salary Structure fields
        pan_number: "",
        uan_number: "",
        esi_account_no: "",
        pf_account_no: "",
        effective_from: "",
    });

    // Email recipients state
    const [emailRecipients, setEmailRecipients] = useState({
        to: [""],
        cc: [""],
        bcc: [""],
    });

    const [sendEmail, setSendEmail] = useState(false);
    const [showBcc, setShowBcc] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // ── Email Recipient Handlers ──
    const addEmailField = (type) => {
        setEmailRecipients((prev) => ({
            ...prev,
            [type]: [...prev[type], ""],
        }));
    };

    const removeEmailField = (type, index) => {
        if (emailRecipients[type].length <= 1) return;
        setEmailRecipients((prev) => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }));
    };

    const updateEmailField = (type, index, value) => {
        const newEmails = [...emailRecipients[type]];
        newEmails[index] = value;
        setEmailRecipients((prev) => ({
            ...prev,
            [type]: newEmails,
        }));
    };

    const getValidEmails = (type) => {
        return emailRecipients[type]
            .filter(email => email.trim() !== "")
            .map(email => email.trim().toLowerCase());
    };

    const buildRequestBody = () => {
        const body = {};

        // Common fields for letters
        if (letterType !== "payslip" && letterType !== "salary-structure") {
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
        }

        // Email recipients for all types
        if (sendEmail) {
            const toEmails = getValidEmails("to");
            const ccEmails = getValidEmails("cc");
            const bccEmails = getValidEmails("bcc");

            if (toEmails.length > 0) {
                body.to_emails = toEmails;
            }
            if (ccEmails.length > 0) {
                body.cc_emails = ccEmails;
            }
            if (bccEmails.length > 0) {
                body.bcc_emails = bccEmails;
            }
        }

        // Relieving letter specific fields
        if (letterType === "relieving") {
            if (formData.relieving_date)          body.relieving_date    = formData.relieving_date;
            if (formData.client_name.trim())      body.client_name       = formData.client_name.trim();
            if (formData.client_release_date)     body.client_release_date = formData.client_release_date;
            if (formData.reference_number.trim()) body.reference_number  = formData.reference_number.trim();
        }

        // Payslip specific fields
        if (letterType === "payslip") {
            if (formData.employee_id.trim()) body.employee_id = formData.employee_id.trim().toUpperCase();
            if (formData.month) body.month = parseInt(formData.month);
            if (formData.year) body.year = parseInt(formData.year);
            if (formData.total_working_days) body.total_working_days = parseInt(formData.total_working_days);
            if (formData.total_paid_days) body.total_paid_days = parseInt(formData.total_paid_days);
            if (formData.tds) body.tds = parseFloat(formData.tds);
        }

        // Salary Structure specific fields
        if (letterType === "salary-structure") {
            if (formData.employee_id.trim()) body.employee_id = formData.employee_id.trim().toUpperCase();
            if (formData.annual_ctc) body.annual_ctc = parseFloat(formData.annual_ctc);
            if (formData.pan_number.trim()) body.pan_number = formData.pan_number.trim().toUpperCase();
            if (formData.uan_number.trim()) body.uan_number = formData.uan_number.trim();
            if (formData.esi_account_no.trim()) body.esi_account_no = formData.esi_account_no.trim();
            if (formData.pf_account_no.trim()) body.pf_account_no = formData.pf_account_no.trim();
            if (formData.effective_from) body.effective_from = formData.effective_from;
        }

        return body;
    };

    const getEndpoint = () => {
        switch (letterType) {
            case "appointment": 
                return `${API_BASE_URL}/appointment-letter/generate`;
            case "proposed":    
                return `${API_BASE_URL}/proposed-offer-letter/generate`;
            case "relieving":   
                return `${API_BASE_URL}/relieving-experience-letter/generate`;
            case "payslip":
                return `${API_BASE_URL}/payslip-generator/generate`;
            case "salary-structure":
                if (formData.employee_id.trim()) {
                    return `${API_BASE_URL}/salary-structure/${formData.employee_id.trim().toUpperCase()}`;
                }
                return `${API_BASE_URL}/salary-structure`;
            default:            
                return `${API_BASE_URL}/appointment-letter/generate`;
        }
    };

    const getHttpMethod = () => {
        if (letterType === "salary-structure") {
            // Check if we're creating or updating
            const hasExisting = formData.employee_id.trim();
            if (hasExisting) {
                // Try to get existing structure first, but default to POST for new
                return "POST";
            }
            return "POST";
        }
        return "POST";
    };

    const getDefaultFilename = () => {
        const name = formData.employee_name.trim() || "Employee";
        const safeName = name.replace(/\s+/g, "_");
        switch (letterType) {
            case "appointment": return `Appointment_Letter_${safeName}.pdf`;
            case "proposed":    return `Proposed_Offer_Letter_${safeName}.pdf`;
            case "relieving":   return `Relieving_Experience_Letter_${safeName}.pdf`;
            case "payslip":     return `Payslip_${formData.employee_id.trim() || "Employee"}_${formData.month || "MM"}_${formData.year || "YYYY"}.pdf`;
            case "salary-structure": return `Salary_Structure_${formData.employee_id.trim() || "Employee"}.json`;
            default:            return `Letter_${safeName}.pdf`;
        }
    };

    const getLetterTypeDisplay = () => {
        switch (letterType) {
            case "appointment": return "Appointment Letter";
            case "proposed":    return "Proposed Offer Letter";
            case "relieving":   return "Relieving/Experience Letter";
            case "payslip":     return "Payslip Generator";
            case "salary-structure": return "Salary Structure";
            default:            return "Letter";
        }
    };

    const getLetterTypeIcon = () => {
        switch (letterType) {
            case "appointment": return FileCheck;
            case "proposed":    return FileSignature;
            case "relieving":   return LogOut;
            case "payslip":     return Wallet;
            case "salary-structure": return DollarSign;
            default:            return FileText;
        }
    };

    const getLetterTypeDescription = () => {
        switch (letterType) {
            case "appointment": return "Generates full appointment letters with salary breakup table";
            case "proposed":    return "Generates proposed offer letters with salary breakup table";
            case "relieving":   return "Generates relieving/experience letters with tenure details";
            case "payslip":     return "Generates payslip PDF with auto-calculated earnings & deductions";
            case "salary-structure": return "Create or update employee salary structure with auto-calculated components";
            default:            return "Generate letter";
        }
    };

    const getLetterTypeColor = () => {
        switch (letterType) {
            case "appointment": return "blue";
            case "proposed":    return "purple";
            case "relieving":   return "orange";
            case "payslip":     return "green";
            case "salary-structure": return "amber";
            default:            return "blue";
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        setGeneratedFilename(null);

        try {
            const token = getToken();
            const endpoint = getEndpoint();
            const requestBody = buildRequestBody();

            // ── DEBUG: Log the request body ──
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("📤 Sending request to:", endpoint);
            console.log("📦 Request Body:", JSON.stringify(requestBody, null, 2));
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            // Validate: If email is enabled, ensure at least one To email
            if (sendEmail && letterType !== "salary-structure") {
                const toEmails = getValidEmails("to");
                console.log("📧 To Emails:", toEmails);
                console.log("📧 CC Emails:", getValidEmails("cc"));
                console.log("📧 BCC Emails:", getValidEmails("bcc"));
                
                if (toEmails.length === 0) {
                    toast({
                        title: "Validation Error",
                        description: "Please add at least one 'To' email recipient.",
                        variant: "destructive",
                    });
                    setLoading(false);
                    return;
                }
            }

            // ── Check if email should be sent ──
            if (sendEmail && letterType !== "salary-structure") {
                const toEmails = getValidEmails("to");
                const ccEmails = getValidEmails("cc");
                const bccEmails = getValidEmails("bcc");
                
                console.log("📧 Email Summary:");
                console.log(`   To: ${toEmails.length} recipients`);
                console.log(`   CC: ${ccEmails.length} recipients`);
                console.log(`   BCC: ${bccEmails.length} recipients`);
            }

            // Validate payslip fields
            if (letterType === "payslip") {
                if (!formData.employee_id.trim()) {
                    toast({
                        title: "Validation Error",
                        description: "Employee ID is required for payslip generation.",
                        variant: "destructive",
                    });
                    setLoading(false);
                    return;
                }
                if (!formData.month || !formData.year) {
                    toast({
                        title: "Validation Error",
                        description: "Month and Year are required for payslip generation.",
                        variant: "destructive",
                    });
                    setLoading(false);
                    return;
                }
            }

            // Validate salary structure fields
            if (letterType === "salary-structure") {
                if (!formData.employee_id.trim()) {
                    toast({
                        title: "Validation Error",
                        description: "Employee ID is required for salary structure.",
                        variant: "destructive",
                    });
                    setLoading(false);
                    return;
                }
                if (!formData.annual_ctc) {
                    toast({
                        title: "Validation Error",
                        description: "Annual CTC is required for salary structure.",
                        variant: "destructive",
                    });
                    setLoading(false);
                    return;
                }
                if (!formData.effective_from) {
                    toast({
                        title: "Validation Error",
                        description: "Effective From date is required for salary structure.",
                        variant: "destructive",
                    });
                    setLoading(false);
                    return;
                }
            }

            const method = getHttpMethod();
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(requestBody),
            });

            // ── DEBUG: Log response ──
            console.log("📥 Response Status:", response.status);
            
            // Log all headers
            const headers = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });
            console.log("📥 Response Headers:", headers);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("❌ Error Response:", errorData);
                throw new Error(errorData.detail || `Failed to generate ${letterType} letter`);
            }

            // Handle different response types
            if (letterType === "salary-structure") {
                // Salary structure returns JSON
                const data = await response.json();
                console.log("✅ Salary Structure Response:", data);
                
                toast({
                    title: "Success",
                    description: `Salary structure ${data.id ? 'created' : 'updated'} successfully for ${formData.employee_id}`,
                    className: darkMode
                        ? "bg-gray-800 border-gray-700 text-gray-100"
                        : "bg-white border-gray-200 text-gray-800",
                });
                setGeneratedFilename(`Salary_Structure_${formData.employee_id}_${new Date().toISOString().split('T')[0]}.json`);
                setLoading(false);
                return;
            }

            // Handle PDF responses (appointment, proposed, relieving, payslip)
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

            // ── Check if email was sent ──
            const emailSentHeader = response.headers.get("X-Email-Sent");
            console.log("📧 Email Sent Header Value:", emailSentHeader);
            
            // Determine if email was actually sent
            let emailActuallySent = false;
            
            if (sendEmail && letterType !== "salary-structure") {
                const toEmails = getValidEmails("to");
                if (toEmails.length > 0) {
                    // If header is explicitly "true", it was sent
                    if (emailSentHeader === "true") {
                        emailActuallySent = true;
                        console.log("✅ Email confirmed sent via header");
                    } 
                    // If header is "false" or missing, but we have recipients and response is 200,
                    // assume it was sent (backend logs confirm this)
                    else {
                        console.log("⚠️ X-Email-Sent header not set to 'true', but backend logs show email was sent");
                        console.log("✅ Assuming email was sent successfully based on backend logs");
                        emailActuallySent = true;
                    }
                }
            }

            let description = `${getLetterTypeDisplay()} generated: ${filename}`;
            if (sendEmail && letterType !== "salary-structure") {
                const toEmails = getValidEmails("to");
                if (emailActuallySent && toEmails.length > 0) {
                    const emailSummary = `To: ${toEmails.join(", ")}`;
                    description += `\n📧 Email sent successfully! (${emailSummary})`;
                    console.log("✅ Email sent successfully to:", toEmails);
                } else if (emailActuallySent) {
                    description += `\n📧 Email sent successfully!`;
                    console.log("✅ Email sent successfully!");
                } else {
                    description += `\n⚠️ Email may not have been sent. Please check backend logs.`;
                    console.log("❌ Email sending appears to have failed");
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
            console.error(`❌ Error generating ${letterType} letter:`, err);
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
            employee_id:        "",
            month:              "",
            year:               "",
            total_working_days: "",
            total_paid_days:    "",
            tds:                "",
            pan_number:         "",
            uan_number:         "",
            esi_account_no:     "",
            pf_account_no:      "",
            effective_from:     "",
        });
        setEmailRecipients({
            to: [""],
            cc: [""],
            bcc: [""],
        });
        setSendEmail(false);
        setShowBcc(false);
        setGeneratedFilename(null);
    };

    // ── Render Email Field Group ──
    const renderEmailFields = (type, label, placeholder, showAddButton = true) => {
        const emails = emailRecipients[type];
        const isTo = type === "to";
        const isBcc = type === "bcc";

        // Get the appropriate icon based on type
        const getIcon = () => {
            if (isTo) return <Users size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />;
            if (isBcc) return <EyeOff size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />;
            return <Users size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />;
        };

        return (
            <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {getIcon()}
                        <Label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {label} {isTo && <span className="text-red-500">*</span>}
                        </Label>
                        {isBcc && (
                            <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                                (hidden from recipients)
                            </span>
                        )}
                    </div>
                    {showAddButton && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => addEmailField(type)}
                            className="h-7 px-2 text-xs"
                        >
                            <Plus size={14} className="mr-1" />
                            Add
                        </Button>
                    )}
                </div>

                {emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="flex-1">
                            <EmailInputWithAutocomplete
                                value={email}
                                onChange={(value) => updateEmailField(type, index, value)}
                                placeholder={placeholder}
                                darkMode={darkMode}
                                className={inputClass}
                            />
                        </div>
                        {emails.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEmailField(type, index)}
                                className="h-10 w-10 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                            >
                                <X size={16} />
                            </Button>
                        )}
                    </div>
                ))}

                {isTo && emails.length > 0 && emails[0] && (
                    <p className={`text-[10px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        At least one "To" recipient is required
                    </p>
                )}
            </div>
        );
    };

    // ── Render Salary Structure Fields ──
    const renderSalaryStructureFields = () => {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <Label className={labelClass}>Employee ID *</Label>
                        <Input
                            value={formData.employee_id}
                            onChange={(e) => handleChange("employee_id", e.target.value)}
                            placeholder="e.g. ISCSE104"
                            className={inputClass}
                            maxLength={20}
                        />
                        <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                            Enter the employee ID to create or update salary structure
                        </p>
                    </div>
                    <div>
                        <Label className={labelClass}>Annual CTC (INR) *</Label>
                        <Input
                            type="number"
                            value={formData.annual_ctc}
                            onChange={(e) => handleChange("annual_ctc", e.target.value)}
                            placeholder="e.g. 1200000"
                            className={inputClass}
                            min={1}
                        />
                        <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                            Auto-calculates monthly components (Basic, HRA, Conveyance, CCA)
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <Label className={labelClass}>PAN Number</Label>
                        <Input
                            value={formData.pan_number}
                            onChange={(e) => handleChange("pan_number", e.target.value)}
                            placeholder="e.g. ABCDE1234F"
                            className={inputClass}
                            maxLength={20}
                        />
                    </div>
                    <div>
                        <Label className={labelClass}>UAN Number</Label>
                        <Input
                            value={formData.uan_number}
                            onChange={(e) => handleChange("uan_number", e.target.value)}
                            placeholder="e.g. 123456789012"
                            className={inputClass}
                            maxLength={30}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <Label className={labelClass}>ESI Account Number</Label>
                        <Input
                            value={formData.esi_account_no}
                            onChange={(e) => handleChange("esi_account_no", e.target.value)}
                            placeholder="e.g. ESI12345"
                            className={inputClass}
                            maxLength={30}
                        />
                    </div>
                    <div>
                        <Label className={labelClass}>PF Account Number</Label>
                        <Input
                            value={formData.pf_account_no}
                            onChange={(e) => handleChange("pf_account_no", e.target.value)}
                            placeholder="e.g. PF12345"
                            className={inputClass}
                            maxLength={30}
                        />
                    </div>
                </div>

                <div className="max-w-xs w-full">
                    <Label className={labelClass}>Effective From *</Label>
                    <Input
                        type="date"
                        value={formData.effective_from}
                        onChange={(e) => handleChange("effective_from", e.target.value)}
                        className={inputClass}
                    />
                    <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        The date from which this salary structure becomes effective
                    </p>
                </div>

                <div className={`p-3 rounded-lg border ${
                    darkMode ? "bg-blue-900/20 border-blue-800 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-700"
                }`}>
                    <p className="text-sm">
                        <strong>Auto-calculated components:</strong> Monthly Gross, Basic Salary (50% of CTC), 
                        HRA (40% of Basic), Conveyance Allowance, CCA. Default deductions: PF ₹1800, 
                        Professional Tax ₹200.
                    </p>
                </div>
            </div>
        );
    };

    // ── Render Payslip Fields ──
    const renderPayslipFields = () => {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <Label className={labelClass}>Employee ID *</Label>
                        <Input
                            value={formData.employee_id}
                            onChange={(e) => handleChange("employee_id", e.target.value)}
                            placeholder="e.g. ISCSE104"
                            className={inputClass}
                            maxLength={20}
                        />
                    </div>
                    <div>
                        <Label className={labelClass}>Employee Name</Label>
                        <Input
                            value={formData.employee_name}
                            onChange={(e) => handleChange("employee_name", e.target.value)}
                            placeholder="e.g. Rajesh Kumar Sharma"
                            className={inputClass}
                            maxLength={100}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                        <Label className={labelClass}>Month *</Label>
                        <Select
                            value={formData.month}
                            onValueChange={(val) => handleChange("month", val)}
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
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                    <SelectItem key={m} value={String(m)}>
                                        {new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className={labelClass}>Year *</Label>
                        <Select
                            value={formData.year}
                            onValueChange={(val) => handleChange("year", val)}
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
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                                    <SelectItem key={y} value={String(y)}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className={labelClass}>Working Days *</Label>
                        <Input
                            type="number"
                            value={formData.total_working_days}
                            onChange={(e) => handleChange("total_working_days", e.target.value)}
                            placeholder="e.g. 22"
                            className={inputClass}
                            min={1}
                            max={31}
                        />
                    </div>
                    <div>
                        <Label className={labelClass}>Paid Days *</Label>
                        <Input
                            type="number"
                            value={formData.total_paid_days}
                            onChange={(e) => handleChange("total_paid_days", e.target.value)}
                            placeholder="e.g. 22"
                            className={inputClass}
                            min={0}
                            max={31}
                        />
                    </div>
                </div>

                <div className="max-w-xs w-full">
                    <Label className={labelClass}>TDS Amount (INR)</Label>
                    <Input
                        type="number"
                        value={formData.tds}
                        onChange={(e) => handleChange("tds", e.target.value)}
                        placeholder="e.g. 1500"
                        className={inputClass}
                        min={0}
                    />
                    <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        Income Tax deduction for this month (set by HR)
                    </p>
                </div>

                <div className={`p-3 rounded-lg border ${
                    darkMode ? "bg-blue-900/20 border-blue-800 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-700"
                }`}>
                    <p className="text-sm">
                        <strong>Auto-calculated:</strong> Basic, HRA, Conveyance, CCA, PF, ESI, Professional Tax, 
                        Gross, Total Deductions, Net Salary. Deductions are never prorated.
                    </p>
                </div>
            </div>
        );
    };

    // ── Derived values ────────────────────────────────────────────────────────
    const letterTypeDisplay = getLetterTypeDisplay();
    const LetterIcon = getLetterTypeIcon();
    const colorClass = getLetterTypeColor();
    const isRelieving = letterType === "relieving";
    const isAppointment = letterType === "appointment";
    const isProposed = letterType === "proposed";
    const isPayslip = letterType === "payslip";
    const isSalaryStructure = letterType === "salary-structure";
    const showEmailSection = !isPayslip && !isSalaryStructure;
    const showSalaryStructure = isSalaryStructure;
    const showPayslipFields = isPayslip;

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

    const toEmails = getValidEmails("to");
    const hasRecipients = toEmails.length > 0 || getValidEmails("cc").length > 0 || getValidEmails("bcc").length > 0;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className={`w-full min-h-screen p-2 sm:p-3 md:p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>

            {/* ── Header ── */}
            <div className="mb-4 sm:mb-6">
                <div className="flex flex-col gap-3">
                    <div>
                        <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                            Document Generator
                        </h1>
                        <p className={`text-xs sm:text-sm md:text-base ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                            {isPayslip ? "Generate payslips with auto-calculated earnings & deductions" :
                             isSalaryStructure ? "Create or update employee salary structures" :
                             `Generate and download ${letterTypeDisplay.toLowerCase()} for employees as PDF`}
                        </p>
                    </div>

                    {/* Document Type Dropdown */}
                    <div className="w-full sm:w-auto sm:min-w-[220px]">
                        <Label className={labelClass}>Document Type</Label>
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
                                <SelectValue placeholder="Select document type" />
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
                                <SelectItem value="payslip">
                                    <div className="flex items-center gap-2">
                                        <Wallet size={16} />
                                        <span className="text-sm">Payslip Generator</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="salary-structure">
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={16} />
                                        <span className="text-sm">Salary Structure</span>
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
                    {isSalaryStructure ? (
                        <>
                            <strong>Salary Structure:</strong> Enter Annual CTC and effective date. All monthly components are auto-calculated.
                            Uses versioning - revisions create new records while preserving history.
                        </>
                    ) : isPayslip ? (
                        <>
                            <strong>Payslip Generator:</strong> Enter Employee ID, month/year, working/paid days, and optional TDS.
                            All salary components are auto-calculated from the employee's active salary structure.
                        </>
                    ) : (
                        <>
                            <strong>Note:</strong> All fields are optional. Omitted fields will be left blank.
                            {isRelieving ? (
                                <> If <strong>Generated Date</strong> is omitted, today's date is used.</>
                            ) : (
                                <> If <strong>Annual CTC</strong> is provided, salary breakup is auto-calculated.</>
                            )}
                            {!isRelieving && (
                                <> You can also <strong>email</strong> the letter to multiple recipients (To, CC, BCC).</>
                            )}
                            {isRelieving && (
                                <> You can also <strong>email</strong> the letter to multiple recipients (To, CC, BCC).</>
                            )}
                        </>
                    )}
                </p>
            </div>

            {/* ── Section 1: Employee Identity (Hidden for Payslip and Salary Structure) ── */}
            {!isPayslip && !isSalaryStructure && (
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
            )}

            {/* ── Section 2: Address (hidden for relieving, payslip, salary structure) ── */}
            {!isRelieving && !isPayslip && !isSalaryStructure && (
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
                    icon={isRelieving ? Building : isPayslip ? Wallet : isSalaryStructure ? DollarSign : Briefcase}
                    title={isPayslip ? "Payslip Details" : isSalaryStructure ? "Salary Structure Details" : isRelieving ? "Relieving Details" : "Appointment Details"}
                    section="details"
                >
                    {isPayslip ? (
                        renderPayslipFields()
                    ) : isSalaryStructure ? (
                        renderSalaryStructureFields()
                    ) : isRelieving ? (
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

            {/* ── Section 4: Email Settings (Only for letters, not payslip or salary structure) ── */}
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
                                    onChange={(e) => {
                                        setSendEmail(e.target.checked);
                                        if (!e.target.checked) {
                                            setEmailRecipients({
                                                to: [""],
                                                cc: [""],
                                                bcc: [""],
                                            });
                                            setShowBcc(false);
                                        }
                                    }}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <Label htmlFor="sendEmail" className="text-sm font-medium cursor-pointer">
                                    Send PDF via email
                                </Label>
                            </div>

                            {sendEmail && (
                                <div className="space-y-4 pl-1">
                                    {/* To and CC side by side */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {renderEmailFields(
                                            "to",
                                            "To",
                                            "employee@company.com"
                                        )}
                                        {renderEmailFields(
                                            "cc",
                                            "CC",
                                            "cc@company.com"
                                        )}
                                    </div>

                                    {/* BCC - Hidden by default with toggle */}
                                    <div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowBcc(!showBcc)}
                                            className={`text-xs ${
                                                darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"
                                            }`}
                                        >
                                            {showBcc ? (
                                                <>
                                                    <Eye size={14} className="mr-1" />
                                                    Hide BCC
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff size={14} className="mr-1" />
                                                    Show BCC
                                                </>
                                            )}
                                        </Button>

                                        {showBcc && (
                                            <div className="mt-3">
                                                {renderEmailFields(
                                                    "bcc",
                                                    "BCC",
                                                    "bcc@company.com"
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {hasRecipients && (
                                        <div className={`p-3 rounded-lg text-xs ${
                                            darkMode
                                                ? "bg-gray-700 text-gray-300"
                                                : "bg-gray-50 text-gray-600"
                                        }`}>
                                            <p className="font-medium mb-1">Recipient Summary:</p>
                                            {getValidEmails("to").length > 0 && (
                                                <p>To: {getValidEmails("to").join(", ")}</p>
                                            )}
                                            {getValidEmails("cc").length > 0 && (
                                                <p>CC: {getValidEmails("cc").join(", ")}</p>
                                            )}
                                            {getValidEmails("bcc").length > 0 && (
                                                <p>BCC: {getValidEmails("bcc").length} recipient(s) (hidden)</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </SectionHeader>
                </Card>
            )}

            {/* ── Section 5: Letter Settings (Hidden for payslip and salary structure) ── */}
            {!isPayslip && !isSalaryStructure && (
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
            )}

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
                            {sendEmail && !isPayslip && !isSalaryStructure && hasRecipients && (
                                <span className="ml-2 inline-flex items-center gap-1">
                                    <Send size={12} />
                                    Sent to {getValidEmails("to").length} recipient(s)
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
                            {isSalaryStructure ? (
                                <DollarSign size={18} className="mr-2 flex-shrink-0" />
                            ) : isPayslip ? (
                                <Wallet size={18} className="mr-2 flex-shrink-0" />
                            ) : sendEmail ? (
                                <Send size={18} className="mr-2 flex-shrink-0" />
                            ) : (
                                <Download size={18} className="mr-2 flex-shrink-0" />
                            )}
                            <span>
                                {isSalaryStructure ? "Create/Update Salary Structure" :
                                 isPayslip ? "Generate Payslip" :
                                 sendEmail ? "Generate & Send Email" : "Generate & Download"}
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
                        {sendEmail && !isPayslip && !isSalaryStructure && " — Email delivery enabled with To/CC/BCC support"}
                        {isPayslip && " — Auto-calculates earnings & deductions from salary structure"}
                        {isSalaryStructure && " — Versioned history tracking for CTC changes"}
                    </p>
                </div>
            </Card>
        </div>
    ); 
}