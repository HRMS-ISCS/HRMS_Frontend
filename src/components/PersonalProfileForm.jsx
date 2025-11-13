// // PersonalProfileForm.jsx
// import React, { useState, useEffect } from "react";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   User, Calendar, MapPin, Phone, Mail, CreditCard, FileText, Camera,
//   ArrowLeft, ArrowRight, Globe, Users, Shield, Save, Building, CheckCircle, UploadCloud
// } from "lucide-react";

// export default function PersonalProfileForm({ initialData, generatedEmployeeId, onSubmit, onBack }) {
//   const [formData, setFormData] = useState(initialData);
//   const [employeeId, setEmployeeId] = useState("");
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [submitLoading, setSubmitLoading] = useState(false);

//   // Document upload states
//   const [aadharFile, setAadharFile] = useState(null);
//   const [panFile, setPanFile] = useState(null);
//   const [resumeFile, setResumeFile] = useState(null);
//   const [photoFile, setPhotoFile] = useState(null);
//   const [uploadEmployeeId, setUploadEmployeeId] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   useEffect(() => {
//     if (generatedEmployeeId) {
//       setEmployeeId(generatedEmployeeId);
//       setUploadEmployeeId(generatedEmployeeId);
//     }
//   }, [generatedEmployeeId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
//   };

//   const handleSelectChange = (name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const required = [
//       'firstName', 'lastName', 'dateOfBirth', 'gender', 'nationality',
//       'mobilePhone', 'email', 'aadharNumber', 'panNumber'
//     ];
//     required.forEach(field => {
//       if (!formData[field]?.trim()) {
//         newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
//       }
//     });
//     if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
//     if (formData.mobilePhone && !/^\d{10}$/.test(formData.mobilePhone)) newErrors.mobilePhone = "10-digit number required";
//     if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber)) newErrors.aadharNumber = "12 digits required";
//     if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) newErrors.panNumber = "Invalid PAN format";
//     if (!employeeId.trim()) newErrors.employeeId = "Employee ID required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = async (e) => {
//     e.preventDefault();
//     const tempErrors = {};
//     const required = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'nationality', 'mobilePhone', 'email'];
//     required.forEach(field => {
//       if (!formData[field]?.trim()) {
//         tempErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
//       }
//     });
//     if (Object.keys(tempErrors).length === 0) {
//       setLoading(true);
//       await new Promise(r => setTimeout(r, 1500));
//       onSubmit(formData);
//       setLoading(false);
//     } else {
//       setErrors(tempErrors);
//     }
//   };

//   const handleSubmitToAPI = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setSubmitLoading(true);
//     try {
//       const apiData = {
//         first_name: formData.firstName,
//         middle_name: formData.middleName || null,
//         last_name: formData.lastName,
//         date_of_birth: formData.dateOfBirth,
//         gender: formData.gender,
//         blood_group: formData.bloodGroup || null,
//         nationality: formData.nationality,
//         current_address_district: formData.currentDistrict || null,
//         current_address_city: formData.currentCity || null,
//         current_address_state: formData.currentState || null,
//         current_address_pin_code: formData.currentPinCode || null,
//         permanent_address_district: formData.permanentDistrict || null,
//         permanent_address_city: formData.permanentCity || null,
//         permanent_address_state: formData.permanentState || null,
//         permanent_address_pin_code: formData.permanentPinCode || null,
//         mobile_phone: formData.mobilePhone || null,
//         mail_id: formData.email || null,
//         tel_no: formData.telephone || null,
//         emergency_contact_name: formData.emergencyName || null,
//         emergency_contact_relation: null,
//         emergency_contact_mobile: formData.emergencyMobile || null,
//         emergency_contact_mail_id: formData.emergencyEmail || null,
//         aadhar_no: formData.aadharNumber,
//         pan_card_no: formData.panNumber,
//         passport_no: formData.passportNumber || null,
//         uan_number: formData.uanNumber || null,
//         esi_no: formData.esiNumber || null
//       };
//       const res = await fetch(`http://127.0.0.1:8000/users/Personal_Profile/${employeeId}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(apiData)
//       });
//       const result = await res.json();
//       if (res.ok) {
//         alert(`Profile created for Employee ID: ${result.employee_id}`);
//       } else {
//         setErrors({ submit: result.detail || 'Error occurred' });
//       }
//     } catch (err) {
//       console.error(err);
//       setErrors({ submit: 'Failed to connect to server.' });
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleDocumentUpload = async () => {
//     if (!uploadEmployeeId.trim()) {
//       alert("Please enter Employee ID for upload.");
//       return;
//     }
//     const form = new FormData();
//     if (aadharFile) form.append("aadhar_card", aadharFile);
//     if (panFile) form.append("pan_card", panFile);
//     if (resumeFile) form.append("resume", resumeFile);
//     if (photoFile) form.append("profile_photo", photoFile);

//     setUploadLoading(true);
//     try {
//       const res = await fetch(`http://127.0.0.1:8000/users/Personal_Documents/${uploadEmployeeId}/bulk`, {
//         method: 'PUT',
//         body: form
//       });
//       const result = await res.json();
//       if (res.ok) {
//         alert("Documents uploaded successfully.");
//       } else {
//         alert("Upload failed: " + (result.detail || "Unknown error"));
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to upload documents.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">Personal Profile</h1>
//         <p className="text-gray-600">Complete your personal information and document details</p>
//       </div>

//       {/* Employee ID Card */}
//       <Card className={`p-4 mb-6 bg-gradient-to-r ${generatedEmployeeId ? 'from-green-50 to-emerald-50 border-green-200' : 'from-yellow-50 to-orange-50 border-yellow-200'}`}>
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             {generatedEmployeeId ? <CheckCircle size={16} className="text-green-600" /> : <Building size={16} className="text-orange-600" />}
//             <Label className="text-gray-700 font-medium">Employee ID {generatedEmployeeId ? '(Auto-filled)' : '(for submission)'}:</Label>
//           </div>
//           <Input
//             value={employeeId}
//             onChange={(e) => setEmployeeId(e.target.value)}
//             placeholder="Enter Employee ID (e.g., ISCSI001)"
//             className={`max-w-xs ${generatedEmployeeId ? 'bg-green-50 border-green-300' : ''}`}
//             readOnly={!!generatedEmployeeId}
//           />
//           {errors.employeeId && <p className="text-sm text-red-600">{errors.employeeId}</p>}
//         </div>
//         {generatedEmployeeId && <p className="text-xs text-green-600 mt-2">✓ Employee ID automatically filled from the previous step</p>}
//       </Card>

//       <form className="space-y-8">
//         {/* Personal Information */}
//         <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
//           <div className="flex items-center gap-2 mb-6">
//             <User className="text-blue-600" size={20} />
//             <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Removed Photograph Upload */}
//             <div className="space-y-2">
//               <Label className="text-gray-700 font-medium">First Name *</Label>
//               <Input name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName ? 'border-red-500' : ''} />
//               {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
//             </div>
//             <div className="space-y-2">
//               <Label className="text-gray-700 font-medium">Middle Name</Label>
//               <Input name="middleName" value={formData.middleName} onChange={handleChange} />
//             </div>
//             <div className="space-y-2">
//               <Label className="text-gray-700 font-medium">Last Name *</Label>
//               <Input name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName ? 'border-red-500' : ''} />
//               {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
//             </div>
//             <div className="space-y-2">
//               <Label className="text-gray-700 font-medium flex items-center gap-2"><Calendar size={16} />Date of Birth *</Label>
//               <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className={errors.dateOfBirth ? 'border-red-500' : ''} />
//               {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
//             </div>
//             <div className="space-y-2">
//               <Label className="text-gray-700 font-medium">Gender *</Label>
//               <Select value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v)}>
//                 <SelectTrigger className={errors.gender ? 'border-red-500' : ''}><SelectValue placeholder="Select gender" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Male">Male</SelectItem>
//                   <SelectItem value="Female">Female</SelectItem>
//                   <SelectItem value="Other">Other</SelectItem>
//                 </SelectContent>
//               </Select>
//               {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
//             </div>
//             <div className="space-y-2">
//               <Label className="text-gray-700 font-medium">Blood Group</Label>
//               <Select value={formData.bloodGroup} onValueChange={(v) => handleSelectChange('bloodGroup', v)}>
//                 <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
//                 <SelectContent>
//                   {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label className="text-gray-700 font-medium flex items-center gap-2"><Globe size={16} />Nationality *</Label>
//               <Input name="nationality" value={formData.nationality} onChange={handleChange} placeholder="e.g., Indian" className={errors.nationality ? 'border-red-500' : ''} />
//               {errors.nationality && <p className="text-sm text-red-600">{errors.nationality}</p>}
//             </div>
//           </div>
//         </Card>

//             {/* Address Information Section */}
//         <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
//           <div className="flex items-center gap-2 mb-6">
//             <MapPin className="text-green-600" size={20} />
//             <h2 className="text-xl font-semibold text-gray-800">Address Information</h2>
//           </div>
          
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Current Address */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium text-gray-700">Current Address</h3>
//               <div className="space-y-2">
//                 <Label htmlFor="currentAddress" className="text-gray-700 font-medium">
//                   Address
//                 </Label>
//                 <Textarea
//                   id="currentAddress"
//                   name="currentAddress"
//                   value={formData.currentAddress}
//                   onChange={handleChange}
//                   placeholder="Enter current address"
//                   className={errors.currentAddress ? 'border-red-500' : ''}
//                 />
//                 {errors.currentAddress && <p className="text-sm text-red-600">{errors.currentAddress}</p>}
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="currentDistrict" className="text-gray-700 font-medium">
//                     District
//                   </Label>
//                   <Input
//                     id="currentDistrict"
//                     name="currentDistrict"
//                     value={formData.currentDistrict}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="currentCity" className="text-gray-700 font-medium">
//                     City
//                   </Label>
//                   <Input
//                     id="currentCity"
//                     name="currentCity"
//                     value={formData.currentCity}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="currentState" className="text-gray-700 font-medium">
//                     State
//                   </Label>
//                   <Input
//                     id="currentState"
//                     name="currentState"
//                     value={formData.currentState}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="currentPinCode" className="text-gray-700 font-medium">
//                     Pin Code
//                   </Label>
//                   <Input
//                     id="currentPinCode"
//                     name="currentPinCode"
//                     value={formData.currentPinCode}
//                     onChange={handleChange}
//                     maxLength={6}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Permanent Address */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium text-gray-700">Permanent Address</h3>
//               <div className="space-y-2">
//                 <Label htmlFor="permanentAddress" className="text-gray-700 font-medium">
//                   Address
//                 </Label>
//                 <Textarea
//                   id="permanentAddress"
//                   name="permanentAddress"
//                   value={formData.permanentAddress}
//                   onChange={handleChange}
//                   placeholder="Enter permanent address"
//                   className={errors.permanentAddress ? 'border-red-500' : ''}
//                 />
//                 {errors.permanentAddress && <p className="text-sm text-red-600">{errors.permanentAddress}</p>}
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="permanentDistrict" className="text-gray-700 font-medium">
//                     District
//                   </Label>
//                   <Input
//                     id="permanentDistrict"
//                     name="permanentDistrict"
//                     value={formData.permanentDistrict}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="permanentCity" className="text-gray-700 font-medium">
//                     City
//                   </Label>
//                   <Input
//                     id="permanentCity"
//                     name="permanentCity"
//                     value={formData.permanentCity}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="permanentState" className="text-gray-700 font-medium">
//                     State
//                   </Label>
//                   <Input
//                     id="permanentState"
//                     name="permanentState"
//                     value={formData.permanentState}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="permanentPinCode" className="text-gray-700 font-medium">
//                     Pin Code
//                   </Label>
//                   <Input
//                     id="permanentPinCode"
//                     name="permanentPinCode"
//                     value={formData.permanentPinCode}
//                     onChange={handleChange}
//                     maxLength={6}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Contact Information Section */}
//         <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
//           <div className="flex items-center gap-2 mb-6">
//             <Phone className="text-purple-600" size={20} />
//             <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
//           </div>
          
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Personal Contact */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium text-gray-700">Personal Contact Details</h3>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="mobilePhone" className="text-gray-700 font-medium">
//                     Mobile Phone *
//                   </Label>
//                   <Input
//                     id="mobilePhone"
//                     name="mobilePhone"
//                     value={formData.mobilePhone}
//                     onChange={handleChange}
//                     placeholder="Enter 10-digit mobile number"
//                     maxLength={10}
//                     className={errors.mobilePhone ? 'border-red-500' : ''}
//                   />
//                   {errors.mobilePhone && <p className="text-sm text-red-600">{errors.mobilePhone}</p>}
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-gray-700 font-medium">
//                     Email *
//                   </Label>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="Enter email address"
//                     className={errors.email ? 'border-red-500' : ''}
//                   />
//                   {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="telephone" className="text-gray-700 font-medium">
//                     Telephone
//                   </Label>
//                   <Input
//                     id="telephone"
//                     name="telephone"
//                     value={formData.telephone}
//                     onChange={handleChange}
//                     placeholder="Enter telephone number"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Emergency Contact */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
//                 <Users size={16} className="text-gray-500" />
//                 Emergency Contact Details
//               </h3>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="emergencyName" className="text-gray-700 font-medium">
//                     Name
//                   </Label>
//                   <Input
//                     id="emergencyName"
//                     name="emergencyName"
//                     value={formData.emergencyName}
//                     onChange={handleChange}
//                     placeholder="Enter emergency contact name"
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="emergencyMobile" className="text-gray-700 font-medium">
//                     Mobile Phone
//                   </Label>
//                   <Input
//                     id="emergencyMobile"
//                     name="emergencyMobile"
//                     value={formData.emergencyMobile}
//                     onChange={handleChange}
//                     placeholder="Enter emergency contact mobile"
//                     maxLength={10}
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="emergencyEmail" className="text-gray-700 font-medium">
//                     Email
//                   </Label>
//                   <Input
//                     id="emergencyEmail"
//                     name="emergencyEmail"
//                     type="email"
//                     value={formData.emergencyEmail}
//                     onChange={handleChange}
//                     placeholder="Enter emergency contact email"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Document Information Section */}
//         <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
//           <div className="flex items-center gap-2 mb-6">
//             <Shield className="text-orange-600" size={20} />
//             <h2 className="text-xl font-semibold text-gray-800">Document Information</h2>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="aadharNumber" className="text-gray-700 font-medium">
//                 Aadhar Number *
//               </Label>
//               <Input
//                 id="aadharNumber"
//                 name="aadharNumber"
//                 value={formData.aadharNumber}
//                 onChange={handleChange}
//                 placeholder="Enter 12-digit Aadhar number"
//                 maxLength={12}
//                 className={errors.aadharNumber ? 'border-red-500' : ''}
//               />
//               {errors.aadharNumber && <p className="text-sm text-red-600">{errors.aadharNumber}</p>}
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="panNumber" className="text-gray-700 font-medium">
//                 PAN Card Number *
//               </Label>
//               <Input
//                 id="panNumber"
//                 name="panNumber"
//                 value={formData.panNumber}
//                 onChange={handleChange}
//                 placeholder="Enter PAN number (e.g., ABCDE1234F)"
//                 maxLength={10}
//                 className={errors.panNumber ? 'border-red-500' : ''}
//               />
//               {errors.panNumber && <p className="text-sm text-red-600">{errors.panNumber}</p>}
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="passportNumber" className="text-gray-700 font-medium">
//                 Passport Number
//               </Label>
//               <Input
//                 id="passportNumber"
//                 name="passportNumber"
//                 value={formData.passportNumber}
//                 onChange={handleChange}
//                 placeholder="Enter passport number"
//                 maxLength={8}
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="uanNumber" className="text-gray-700 font-medium">
//                 UAN Number
//               </Label>
//               <Input
//                 id="uanNumber"
//                 name="uanNumber"
//                 value={formData.uanNumber}
//                 onChange={handleChange}
//                 placeholder="Enter 12-digit UAN number"
//                 maxLength={12}
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="esiNumber" className="text-gray-700 font-medium">
//                 ESI Number
//               </Label>
//               <Input
//                 id="esiNumber"
//                 name="esiNumber"
//                 value={formData.esiNumber}
//                 onChange={handleChange}
//                 placeholder="Enter 17-digit ESI number"
//                 maxLength={17}
//               />
//             </div>
//           </div>
//         </Card>

//         {/* Submit Button (Blue) */}
// <div className="flex justify-center mt-4">
//   <Button
//     onClick={handleSubmitToAPI}
//     disabled={submitLoading}
//     className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg"
//   >
//     {submitLoading ? "Submitting..." : <><Save size={16} className="mr-2" />Submit</>}
//   </Button>
// </div>

//         {/* Upload Documents Card */}
//         <Card className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
//           <div className="flex items-center gap-2 mb-6">
//             <UploadCloud className="text-teal-600" size={20} />
//             <h2 className="text-xl font-semibold text-gray-800">Upload Documents</h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div className="space-y-2">
//               <Label className="text-gray-700 font-medium">Aadhar Card (PDF only)</Label>
//               <Input type="file" accept=".pdf" onChange={(e) => setAadharFile(e.target.files[0])} />
//             </div>
//             <div className="space-y-2">
//               <Label className="text-gray-700 font-medium">PAN Card (PDF only)</Label>
//               <Input type="file" accept=".pdf" onChange={(e) => setPanFile(e.target.files[0])} />
//             </div>
//             <div className="space-y-2">
//               <Label className="text-gray-700 font-medium">Resume (PDF only)</Label>
//               <Input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
//             </div>
//             <div className="space-y-2">
//               <Label className="text-gray-700 font-medium">Profile Photo (Image only)</Label>
//               <Input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
//             </div>
//           </div>

//           <div className="mb-4">
//             <Label className="text-gray-700 font-medium">Employee ID for Upload *</Label>
//             <Input
//               value={uploadEmployeeId}
//               onChange={(e) => setUploadEmployeeId(e.target.value)}
//               placeholder="Enter Employee ID for document upload"
//               className="max-w-md"
//             />
//           </div>

//           <Button
//             onClick={handleDocumentUpload}
//             disabled={uploadLoading}
//             className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium rounded-lg shadow"
//           >
//             {uploadLoading ? "Uploading..." : "Submit Documents"}
//           </Button>
//         </Card>

//         {/* Submit Error */}
//         {errors.submit && (
//           <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-sm text-red-600 text-center">{errors.submit}</p>
//           </div>
//         )}

//         {/* Company Info */}
//         <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 p-6">
//           <div className="text-center">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">ISCS Technologies Private Limited</h3>
//             <p className="text-sm text-gray-600">TRUSTED IT CONSULTING PARTNER</p>
//           </div>
//         </Card>

//         {/* Action Buttons */}
//         <div className="flex justify-between pt-6">
//           <div className="flex gap-4">
//             <Button type="button" onClick={onBack} variant="outline" className="px-8 py-3 flex items-center gap-2">
//               <ArrowLeft size={16} /> Back
//             </Button>
//             {/* <Button
//               onClick={handleSubmitToAPI}
//               disabled={submitLoading}
//               className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg"
//             >
//               {submitLoading ? "Submitting..." : <><Save size={16} className="mr-2" />Submit</>}
//             </Button> */}
//           </div>
//           <Button
//             onClick={handleNext}
//             disabled={loading}
//             className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg"
//           >
//             {loading ? "Proceeding..." : <><span>Next</span><ArrowRight size={16} className="ml-2" /></>}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
// PersonalProfileForm.jsx
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  User, Calendar, MapPin, Phone, Mail, CreditCard, FileText, Camera,
  ArrowLeft, ArrowRight, Globe, Users, Shield, Save, Building, CheckCircle, UploadCloud,
  X, AlertCircle
} from "lucide-react";

export default function PersonalProfileForm({ initialData, generatedEmployeeId, onSubmit, onBack }) {
  const [formData, setFormData] = useState(initialData);
  const [employeeId, setEmployeeId] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadError, setUploadError] = useState("");

  // Document upload states
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadEmployeeId, setUploadEmployeeId] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    if (generatedEmployeeId) {
      setEmployeeId(generatedEmployeeId);
      setUploadEmployeeId(generatedEmployeeId);
    }
  }, [generatedEmployeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const required = [
      'firstName', 'lastName', 'dateOfBirth', 'gender', 'nationality',
      'mobilePhone', 'email', 'aadharNumber', 'panNumber'
    ];
    required.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (formData.mobilePhone && !/^\d{10}$/.test(formData.mobilePhone)) newErrors.mobilePhone = "10-digit number required";
    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber)) newErrors.aadharNumber = "12 digits required";
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) newErrors.panNumber = "Invalid PAN format";
    if (!employeeId.trim()) newErrors.employeeId = "Employee ID required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    const tempErrors = {};
    const required = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'nationality', 'mobilePhone', 'email'];
    required.forEach(field => {
      if (!formData[field]?.trim()) {
        tempErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });
    if (Object.keys(tempErrors).length === 0) {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1500));
      onSubmit(formData);
      setLoading(false);
    } else {
      setErrors(tempErrors);
    }
  };

  const handleSubmitToAPI = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitLoading(true);
    try {
      const apiData = {
        first_name: formData.firstName,
        middle_name: formData.middleName || null,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        blood_group: formData.bloodGroup || null,
        nationality: formData.nationality,
        current_address_district: formData.currentDistrict || null,
        current_address_city: formData.currentCity || null,
        current_address_state: formData.currentState || null,
        current_address_pin_code: formData.currentPinCode || null,
        permanent_address_district: formData.permanentDistrict || null,
        permanent_address_city: formData.permanentCity || null,
        permanent_address_state: formData.permanentState || null,
        permanent_address_pin_code: formData.permanentPinCode || null,
        mobile_phone: formData.mobilePhone || null,
        mail_id: formData.email || null,
        tel_no: formData.telephone || null,
        emergency_contact_name: formData.emergencyName || null,
        emergency_contact_relation: null,
        emergency_contact_mobile: formData.emergencyMobile || null,
        emergency_contact_mail_id: formData.emergencyEmail || null,
        aadhar_no: formData.aadharNumber,
        pan_card_no: formData.panNumber,
        passport_no: formData.passportNumber || null,
        uan_number: formData.uanNumber || null,
        esi_no: formData.esiNumber || null
      };
      const res = await fetch(`http://127.0.0.1:8000/users/Personal_Profile/${employeeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });
      const result = await res.json();
      if (res.ok) {
        alert(`Profile created for Employee ID: ${result.employee_id}`);
      } else {
        setErrors({ submit: result.detail || 'Error occurred' });
      }
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Failed to connect to server.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDocumentUpload = async () => {
    if (!uploadEmployeeId.trim()) {
      setUploadError("Please enter Employee ID for upload.");
      setUploadSuccess("");
      return;
    }
    
    const hasFiles = aadharFile || panFile || resumeFile || photoFile;
    if (!hasFiles) {
      setUploadError("Please select at least one document to upload.");
      setUploadSuccess("");
      return;
    }
    
    const form = new FormData();
    if (aadharFile) form.append("aadhar_card", aadharFile);
    if (panFile) form.append("pan_card", panFile);
    if (resumeFile) form.append("resume", resumeFile);
    if (photoFile) form.append("profile_photo", photoFile);

    setUploadLoading(true);
    setUploadError("");
    setUploadSuccess("");
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/users/Personal_Documents/${uploadEmployeeId}/bulk`, {
        method: 'PUT',
        body: form
      });
      const result = await res.json();
      if (res.ok) {
        setUploadSuccess("Documents uploaded successfully!");
        if (result.uploaded_files && Object.keys(result.uploaded_files).length > 0) {
          const uploadedDetails = Object.entries(result.uploaded_files)
            .map(([key, value]) => `${key}: ${value.file_name} (${value.size_MB}MB)`)
            .join(', ');
          setUploadSuccess(prev => prev + ` - ${uploadedDetails}`);
        }
        
        // Clear files after successful upload
        setAadharFile(null);
        setPanFile(null);
        setResumeFile(null);
        setPhotoFile(null);
        setPhotoPreview(null);
      } else {
        setUploadError("Upload failed: " + (result.detail || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      setUploadError("Failed to upload documents.");
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle profile photo selection and preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError("Please select an image file for profile photo.");
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Profile photo size should not exceed 5MB.");
        return;
      }
      
      setPhotoFile(file);
      setUploadError("");
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile photo
  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Personal Profile</h1>
        <p className="text-gray-600">Complete your personal information and document details</p>
      </div>

      {/* Employee ID Card */}
      <Card className={`p-4 mb-6 bg-gradient-to-r ${generatedEmployeeId ? 'from-green-50 to-emerald-50 border-green-200' : 'from-yellow-50 to-orange-50 border-yellow-200'}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {generatedEmployeeId ? <CheckCircle size={16} className="text-green-600" /> : <Building size={16} className="text-orange-600" />}
            <Label className="text-gray-700 font-medium">Employee ID {generatedEmployeeId ? '(Auto-filled)' : '(for submission)'}:</Label>
          </div>
          <Input
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Enter Employee ID (e.g., ISCSI001)"
            className={`max-w-xs ${generatedEmployeeId ? 'bg-green-50 border-green-300' : ''}`}
            readOnly={!!generatedEmployeeId}
          />
          {errors.employeeId && <p className="text-sm text-red-600">{errors.employeeId}</p>}
        </div>
        {generatedEmployeeId && <p className="text-xs text-green-600 mt-2">✓ Employee ID automatically filled from previous step</p>}
      </Card>

      <form className="space-y-8">
        {/* Personal Information */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-2 mb-6">
            <User className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Removed Photograph Upload */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">First Name *</Label>
              <Input name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName ? 'border-red-500' : ''} />
              {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Middle Name</Label>
              <Input name="middleName" value={formData.middleName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Last Name *</Label>
              <Input name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName ? 'border-red-500' : ''} />
              {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center gap-2"><Calendar size={16} />Date of Birth *</Label>
              <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className={errors.dateOfBirth ? 'border-red-500' : ''} />
              {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Gender *</Label>
              <Select value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v)}>
                <SelectTrigger className={errors.gender ? 'border-red-500' : ''}><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Blood Group</Label>
              <Select value={formData.bloodGroup} onValueChange={(v) => handleSelectChange('bloodGroup', v)}>
                <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center gap-2"><Globe size={16} />Nationality *</Label>
              <Input name="nationality" value={formData.nationality} onChange={handleChange} placeholder="e.g., Indian" className={errors.nationality ? 'border-red-500' : ''} />
              {errors.nationality && <p className="text-sm text-red-600">{errors.nationality}</p>}
            </div>
          </div>
        </Card>

            {/* Address Information Section */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="text-green-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Address Information</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Current Address</h3>
              <div className="space-y-2">
                <Label htmlFor="currentAddress" className="text-gray-700 font-medium">
                  Address
                </Label>
                <Textarea
                  id="currentAddress"
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleChange}
                  placeholder="Enter current address"
                  className={errors.currentAddress ? 'border-red-500' : ''}
                />
                {errors.currentAddress && <p className="text-sm text-red-600">{errors.currentAddress}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentDistrict" className="text-gray-700 font-medium">
                    District
                  </Label>
                  <Input
                    id="currentDistrict"
                    name="currentDistrict"
                    value={formData.currentDistrict}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentCity" className="text-gray-700 font-medium">
                    City
                  </Label>
                  <Input
                    id="currentCity"
                    name="currentCity"
                    value={formData.currentCity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentState" className="text-gray-700 font-medium">
                    State
                  </Label>
                  <Input
                    id="currentState"
                    name="currentState"
                    value={formData.currentState}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPinCode" className="text-gray-700 font-medium">
                    Pin Code
                  </Label>
                  <Input
                    id="currentPinCode"
                    name="currentPinCode"
                    value={formData.currentPinCode}
                    onChange={handleChange}
                    maxLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Permanent Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Permanent Address</h3>
              <div className="space-y-2">
                <Label htmlFor="permanentAddress" className="text-gray-700 font-medium">
                  Address
                </Label>
                <Textarea
                  id="permanentAddress"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  placeholder="Enter permanent address"
                  className={errors.permanentAddress ? 'border-red-500' : ''}
                />
                {errors.permanentAddress && <p className="text-sm text-red-600">{errors.permanentAddress}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="permanentDistrict" className="text-gray-700 font-medium">
                    District
                  </Label>
                  <Input
                    id="permanentDistrict"
                    name="permanentDistrict"
                    value={formData.permanentDistrict}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permanentCity" className="text-gray-700 font-medium">
                    City
                  </Label>
                  <Input
                    id="permanentCity"
                    name="permanentCity"
                    value={formData.permanentCity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="permanentState" className="text-gray-700 font-medium">
                    State
                  </Label>
                  <Input
                    id="permanentState"
                    name="permanentState"
                    value={formData.permanentState}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permanentPinCode" className="text-gray-700 font-medium">
                    Pin Code
                  </Label>
                  <Input
                    id="permanentPinCode"
                    name="permanentPinCode"
                    value={formData.permanentPinCode}
                    onChange={handleChange}
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Information Section */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center gap-2 mb-6">
            <Phone className="text-purple-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Personal Contact Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobilePhone" className="text-gray-700 font-medium">
                    Mobile Phone *
                  </Label>
                  <Input
                    id="mobilePhone"
                    name="mobilePhone"
                    value={formData.mobilePhone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    className={errors.mobilePhone ? 'border-red-500' : ''}
                  />
                  {errors.mobilePhone && <p className="text-sm text-red-600">{errors.mobilePhone}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telephone" className="text-gray-700 font-medium">
                    Telephone
                  </Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="Enter telephone number"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                Emergency Contact Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName" className="text-gray-700 font-medium">
                    Name
                  </Label>
                  <Input
                    id="emergencyName"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleChange}
                    placeholder="Enter emergency contact name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyMobile" className="text-gray-700 font-medium">
                    Mobile Phone
                  </Label>
                  <Input
                    id="emergencyMobile"
                    name="emergencyMobile"
                    value={formData.emergencyMobile}
                    onChange={handleChange}
                    placeholder="Enter emergency contact mobile"
                    maxLength={10}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyEmail" className="text-gray-700 font-medium">
                    Email
                  </Label>
                  <Input
                    id="emergencyEmail"
                    name="emergencyEmail"
                    type="email"
                    value={formData.emergencyEmail}
                    onChange={handleChange}
                    placeholder="Enter emergency contact email"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Document Information Section */}
        <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="text-orange-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Document Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="aadharNumber" className="text-gray-700 font-medium">
                Aadhar Number *
              </Label>
              <Input
                id="aadharNumber"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                placeholder="Enter 12-digit Aadhar number"
                maxLength={12}
                className={errors.aadharNumber ? 'border-red-500' : ''}
              />
              {errors.aadharNumber && <p className="text-sm text-red-600">{errors.aadharNumber}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="panNumber" className="text-gray-700 font-medium">
                PAN Card Number *
              </Label>
              <Input
                id="panNumber"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="Enter PAN number (e.g., ABCDE1234F)"
                maxLength={10}
                className={errors.panNumber ? 'border-red-500' : ''}
              />
              {errors.panNumber && <p className="text-sm text-red-600">{errors.panNumber}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passportNumber" className="text-gray-700 font-medium">
                Passport Number
              </Label>
              <Input
                id="passportNumber"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
                placeholder="Enter passport number"
                maxLength={8}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="uanNumber" className="text-gray-700 font-medium">
                UAN Number
              </Label>
              <Input
                id="uanNumber"
                name="uanNumber"
                value={formData.uanNumber}
                onChange={handleChange}
                placeholder="Enter 12-digit UAN number"
                maxLength={12}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="esiNumber" className="text-gray-700 font-medium">
                ESI Number
              </Label>
              <Input
                id="esiNumber"
                name="esiNumber"
                value={formData.esiNumber}
                onChange={handleChange}
                placeholder="Enter 17-digit ESI number"
                maxLength={17}
              />
            </div>
          </div>
        </Card>

        {/* Submit Button (Blue) */}
<div className="flex justify-center mt-4">
  <Button
    onClick={handleSubmitToAPI}
    disabled={submitLoading}
    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg"
  >
    {submitLoading ? "Submitting..." : <><Save size={16} className="mr-2" />Submit</>}
  </Button>
</div>

        {/* Upload Documents Card */}
        <Card className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
          <div className="flex items-center gap-2 mb-6">
            <UploadCloud className="text-teal-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Upload Documents</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Aadhar Card (PDF only)</Label>
              <Input type="file" accept=".pdf" onChange={(e) => setAadharFile(e.target.files[0])} />
              {aadharFile && <p className="text-sm text-green-600">Selected: {aadharFile.name}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">PAN Card (PDF only)</Label>
              <Input type="file" accept=".pdf" onChange={(e) => setPanFile(e.target.files[0])} />
              {panFile && <p className="text-sm text-green-600">Selected: {panFile.name}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Resume (PDF only)</Label>
              <Input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
              {resumeFile && <p className="text-sm text-green-600">Selected: {resumeFile.name}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Profile Photo (Image only)</Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={handlePhotoChange} />
                {photoFile && (
                  <Button type="button" variant="outline" size="sm" onClick={removePhoto}>
                    <X size={14} />
                  </Button>
                )}
              </div>
              {photoPreview && (
                <div className="mt-2">
                  <img 
                    src={photoPreview} 
                    alt="Profile preview" 
                    className="w-20 h-20 object-cover rounded-md border border-gray-300" 
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <Label className="text-gray-700 font-medium">Employee ID for Upload *</Label>
            <Input
              value={uploadEmployeeId}
              onChange={(e) => setUploadEmployeeId(e.target.value)}
              placeholder="Enter Employee ID for document upload"
              className="max-w-md"
            />
          </div>

          <Button
            onClick={handleDocumentUpload}
            disabled={uploadLoading}
            className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium rounded-lg shadow"
          >
            {uploadLoading ? "Uploading..." : "Submit Documents"}
          </Button>

          {/* Upload Success/Error Messages */}
          {uploadSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800 text-sm">{uploadSuccess}</p>
            </div>
          )}

          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{uploadError}</p>
            </div>
          )}
        </Card>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">{errors.submit}</p>
          </div>
        )}

        {/* Company Info */}
        <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">ISCS Technologies Private Limited</h3>
            <p className="text-sm text-gray-600">TRUSTED IT CONSULTING PARTNER</p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <div className="flex gap-4">
            <Button type="button" onClick={onBack} variant="outline" className="px-8 py-3 flex items-center gap-2">
              <ArrowLeft size={16} /> Back
            </Button>
            {/* <Button
              onClick={handleSubmitToAPI}
              disabled={submitLoading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg"
            >
              {submitLoading ? "Submitting..." : <><Save size={16} className="mr-2" />Submit</>}
            </Button> */}
          </div>
          <Button
            onClick={handleNext}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg"
          >
            {loading ? "Proceeding..." : <><span>Next</span><ArrowRight size={16} className="ml-2" /></>}
          </Button>
        </div>
      </form>
    </div>
  );
}