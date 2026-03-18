// // ProfessionalTrainingForm.jsx
// import React, { useState, useEffect } from "react";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { 
//   GraduationCap, 
//   Briefcase, 
//   ArrowLeft, 
//   ArrowRight, 
//   Plus,
//   Trash2,
//   Building,
//   Calendar,
//   DollarSign,
//   Save,
//   CheckCircle,
//   AlertCircle,
//   X,
//   MapPin
// } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// import { useDarkMode } from "@/context/DarkModeContext";
// import { apiRequest } from "../api";

// export default function ProfessionalTrainingForm({ initialData, generatedEmployeeId, onSubmit, onDataUpdate}) {
//   const { darkMode } = useDarkMode();
//   const { toast } = useToast();
//   const [formData, setFormData] = useState(initialData);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const [trainingLoading, setTrainingLoading] = useState(false);
//   const [experienceLoading, setExperienceLoading] = useState(false);
  
//   const [trainingSuccess, setTrainingSuccess] = useState(false);
//   const [experienceSuccess, setExperienceSuccess] = useState(false);
  
//   const [trainingEmployeeId, setTrainingEmployeeId] = useState("");
//   const [experienceEmployeeId, setExperienceEmployeeId] = useState("");
  
//   // Initialize flags from props or default to true
//   const [noTrainingExperience, setNoTrainingExperience] = useState(initialData.has_training === false);
//   const [noProfessionalExperience, setNoProfessionalExperience] = useState(initialData.has_experience === false);

//   useEffect(() => {
//     if (generatedEmployeeId) {
//       setTrainingEmployeeId(generatedEmployeeId);
//       setExperienceEmployeeId(generatedEmployeeId);
//     }
//   }, [generatedEmployeeId]);

//   const handleProfessionalTrainingChange = (index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       professionalTraining: prev.professionalTraining.map((training, i) =>
//         i === index ? { ...training, [field]: value } : training
//       )
//     }));
//   }; 

//   const addProfessionalTraining = () => {
//     setFormData(prev => ({
//       ...prev,
//       professionalTraining: [
//         ...prev.professionalTraining,
//         {
//           instituteName: "",
//           instituteAddress: "",
//           duration: "",
//           areaOfTraining: ""
//         }
//       ]
//     }));
//   };

//   const removeProfessionalTraining = (index) => {
//     if (formData.professionalTraining.length > 1) {
//       setFormData(prev => ({
//         ...prev,
//         professionalTraining: prev.professionalTraining.filter((_, i) => i !== index)
//       }));
//     }
//   };

//   const handleProfessionalExperienceChange = (index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       professionalExperience: prev.professionalExperience.map((exp, i) =>
//         i === index ? { ...exp, [field]: value } : exp
//       )
//     }));
//   };

//   const addProfessionalExperience = () => {
//     setFormData(prev => ({
//       ...prev,
//       professionalExperience: [
//         ...prev.professionalExperience,
//         {
//           companyName: "",           // company_name in backend
//           employerLocation: "",      // employer_location in backend
//           empId: "",                 // employer_id in backend
//           rmContactNo: "",           // rm_contact_no in backend
//           hrEmailId: "",             // hr_email in backend
//           designation: "",           // designation in backend
//           periodFrom: "",            // period_from in backend
//           periodTo: "",              // period_to in backend
//           ctc: "",                   // ctc in backend
//           reasonForLeaving: "",      // reason_for_leaving in backend
//           uanNumber: ""              // uan_number in backend
//         }
//       ]
//     }));
//   };

//   const removeProfessionalExperience = (index) => {
//     if (formData.professionalExperience.length > 1) {
//       setFormData(prev => ({
//         ...prev,
//         professionalExperience: prev.professionalExperience.filter((_, i) => i !== index)
//       }));
//     }
//   };

//   // --- API SUBMIT FUNCTIONS ---

//   const submitProfessionalTraining = async () => {
//     if (!trainingEmployeeId.trim()) {
//       setErrors(prev => ({ ...prev, trainingEmployeeId: "Employee ID is required" }));
//       return;
//     }

//     setTrainingLoading(true);
//     setTrainingSuccess(false);
    
//     try {
//       // Case 1: User claims NO Training Experience
//       if (noTrainingExperience) {
//         const response = await apiRequest(`/users/Professional_Training/${trainingEmployeeId}`, {
//           method: 'POST',
//           body: JSON.stringify({ has_training: false })
//         });

//         if (response && response.message && response.message.includes("already exist")) {
//             setErrors(prev => ({ ...prev, trainingGeneral: response.message }));
//         } else {
//             setTrainingSuccess(true);
//             setErrors(prev => ({ ...prev, trainingGeneral: "" }));
            
//             // CALL PARENT UPDATE
//             if (onDataUpdate) {
//                 onDataUpdate({
//                     has_training: false,
//                     professionalTraining: []
//                 });
//             }
//         }
//       } 
//       // Case 2: User HAS Training Experience
//       else {
//         // Check if at least one training has minimum required fields (institute name, duration, area of training)
//         const hasAnyTraining = formData.professionalTraining.some(training => 
//           training.instituteName?.trim() || training.duration?.trim() || training.areaOfTraining?.trim()
//         );

//         if (!hasAnyTraining) {
//           setErrors(prev => ({ ...prev, trainingGeneral: "Please fill at least one training field or select 'No Training'" }));
//           setTrainingLoading(false);
//           return;
//         }

//         // Send each training record that has at least one field filled
//         for (const training of formData.professionalTraining) {
//           // Only send if at least one field is filled
//           if (training.instituteName?.trim() || training.duration?.trim() || training.areaOfTraining?.trim() || training.instituteAddress?.trim()) {
//             const apiData = {
//               has_training: true,
//               institute_name: training.instituteName || null,
//               duration: training.duration || null,
//               area_of_training: training.areaOfTraining || null,
//               institute_address: training.instituteAddress || null
//             };

//             await apiRequest(`/users/Professional_Training/${trainingEmployeeId}`, {
//               method: 'POST',
//               body: JSON.stringify(apiData)
//             });
//           }
//         }

//         setTrainingSuccess(true);
//         setErrors(prev => ({ ...prev, trainingGeneral: "" }));

//         // CALL PARENT UPDATE
//         if (onDataUpdate) {
//             onDataUpdate({
//                 has_training: true,
//                 professionalTraining: formData.professionalTraining.filter(t => 
//                   t.instituteName?.trim() || t.duration?.trim() || t.areaOfTraining?.trim()
//                 )
//             });
//         }
//       }

//       toast({
//         title: (
//           <div className="flex items-center gap-2">
//             <CheckCircle className="h-5 w-5 text-green-500" />
//             <span>Professional Training Updated</span>
//           </div>
//         ),
//         description: noTrainingExperience ? "No training recorded." : "Training records saved successfully.",
//         className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
//       });

//     } catch (error) {
//       console.error('Training API Error:', error);
//       setErrors(prev => ({ ...prev, trainingGeneral: error.message || 'Failed to update training status' }));
//       toast({
//         title: "Error",
//         description: error.message || "Failed to save professional training. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setTrainingLoading(false);
//     }
//   };

//   const submitProfessionalExperience = async () => {
//     if (!experienceEmployeeId.trim()) {
//       setErrors(prev => ({ ...prev, experienceEmployeeId: "Employee ID is required" }));
//       return;
//     }

//     setExperienceLoading(true);
//     setExperienceSuccess(false);

//     try {
//       // Case 1: User claims NO Professional Experience
//       if (noProfessionalExperience) {
//         const response = await apiRequest(`/users/Professional_Experience/${experienceEmployeeId}`, {
//           method: 'POST',
//           body: JSON.stringify({ has_experience: false })
//         });

//         if (response && response.message && response.message.includes("already exist")) {
//             setErrors(prev => ({ ...prev, experienceGeneral: response.message }));
//         } else {
//             setExperienceSuccess(true);
//             setErrors(prev => ({ ...prev, experienceGeneral: "" }));

//             // CALL PARENT UPDATE
//             if (onDataUpdate) {
//                 onDataUpdate({
//                     has_experience: false,
//                     professionalExperience: []
//                 });
//             }
//         }
//       } 
//       // Case 2: User HAS Professional Experience
//       else {
//         // Check if at least one experience has any field filled
//         const hasAnyExperience = formData.professionalExperience.some(exp => 
//           exp.companyName?.trim() || 
//           exp.employerLocation?.trim() || 
//           exp.designation?.trim() || 
//           exp.periodFrom || 
//           exp.periodTo || 
//           exp.ctc?.trim()
//         );

//         if (!hasAnyExperience) {
//           setErrors(prev => ({ ...prev, experienceGeneral: "Please fill at least one experience field or select 'No Experience'" }));
//           setExperienceLoading(false);
//           return;
//         }

//         // Send each experience record that has at least one field filled
//         for (const experience of formData.professionalExperience) {
//           // Only send if at least one field is filled
//           if (experience.companyName?.trim() || 
//               experience.employerLocation?.trim() || 
//               experience.empId?.trim() || 
//               experience.rmContactNo?.trim() || 
//               experience.hrEmailId?.trim() || 
//               experience.designation?.trim() || 
//               experience.periodFrom || 
//               experience.periodTo || 
//               experience.ctc?.trim() || 
//               experience.reasonForLeaving?.trim() || 
//               experience.uanNumber?.trim()) {
            
//             const apiData = {
//               has_experience: true,
//               company_name: experience.companyName || null,
//               employer_location: experience.employerLocation || null,
//               employer_id: experience.empId || null,
//               rm_contact_no: experience.rmContactNo || null,
//               hr_email: experience.hrEmailId || null,
//               designation: experience.designation || null,
//               period_from: experience.periodFrom || null,
//               period_to: experience.periodTo || null,
//               ctc: experience.ctc ? parseFloat(experience.ctc) : null,
//               reason_for_leaving: experience.reasonForLeaving || null,
//               uan_number: experience.uanNumber || null
//             };

//             await apiRequest(`/users/Professional_Experience/${experienceEmployeeId}`, {
//               method: 'POST',
//               body: JSON.stringify(apiData)
//             });
//           }
//         }

//         setExperienceSuccess(true);
//         setErrors(prev => ({ ...prev, experienceGeneral: "" }));

//         // CALL PARENT UPDATE
//         if (onDataUpdate) {
//             onDataUpdate({
//                 has_experience: true,
//                 professionalExperience: formData.professionalExperience.filter(exp => 
//                   exp.companyName?.trim() || 
//                   exp.employerLocation?.trim() || 
//                   exp.designation?.trim() || 
//                   exp.periodFrom || 
//                   exp.periodTo || 
//                   exp.ctc?.trim()
//                 )
//             });
//         }
//       }

//       toast({
//         title: (
//           <div className="flex items-center gap-2">
//             <CheckCircle className="h-5 w-5 text-green-500" />
//             <span>Professional Experience Updated</span>
//           </div>
//         ),
//         description: noProfessionalExperience ? "No experience recorded." : "Experience records saved successfully.",
//         className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
//       });

//     } catch (error) {
//       console.error('Experience API Error:', error);
//       setErrors(prev => ({ ...prev, experienceGeneral: error.message || 'Failed to update experience status' }));
//       toast({
//         title: "Error",
//         description: error.message || "Failed to save professional experience. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setExperienceLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     // Just trigger parent navigation (Parent already has state from onDataUpdate)
//     onSubmit({
//         ...formData,
//         has_training: noTrainingExperience ? false : true,
//         has_experience: noProfessionalExperience ? false : true
//     });
    
//     setLoading(false);
//   };

//   const isAnySectionCompleted = trainingSuccess || experienceSuccess || noTrainingExperience || noProfessionalExperience;

//   return (
//     <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//       <div className="text-center mb-8">
//         <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>Professional Training & Experience</h1>
//         <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Complete your professional training and work experience details</p>
//       </div>

//       {/* Global Employee ID Display - HIDDEN */}
//       <div className="hidden text-center mb-6">
//         <div className={`inline-flex items-center gap-3 px-6 py-3 ${darkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-200'} rounded-full shadow-sm`}>
//           <CheckCircle size={20} className={darkMode ? "text-green-400" : "text-green-600"} />
//           <span className={`text-gray-700 font-medium ${darkMode ? 'text-gray-200' : ''}`}>Auto-filled Employee ID:</span>
//           <span className={`text-lg font-bold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>{generatedEmployeeId}</span>
//         </div>
//       </div>

//       <div className="space-y-8">
//         {/* Professional Training Section */}
//         <Card className={`p-6 ${trainingSuccess || noTrainingExperience ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'} ${darkMode ? 'from-gray-800 to-gray-700 border-gray-600' : ''}`}>
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-2">
//               <GraduationCap className={darkMode ? "text-purple-400" : "text-purple-600"} size={20} />
//               <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Professional Training</h2>
//             </div>
//             <div className="flex items-center gap-4">
//               {trainingSuccess && <CheckCircle className={darkMode ? "text-green-400" : "text-green-600"} size={20} />}
//               {!noTrainingExperience && (
//                 <Button
//                   type="button"
//                   onClick={addProfessionalTraining}
//                   variant="outline"
//                   size="sm"
//                   className={`flex items-center gap-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
//                 >
//                   <Plus size={16} />
//                   Add Training
//                 </Button>
//               )}
//             </div>
//           </div>
          
//           {/* Employee ID Input for Training - HIDDEN */}
//           <div className="hidden mb-4">
//             <Label htmlFor="trainingEmployeeId" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
//               Employee ID {generatedEmployeeId ? '(Auto-filled)' : ''}
//             </Label>
//             <Input
//               id="trainingEmployeeId"
//               value={trainingEmployeeId}
//               onChange={(e) => setTrainingEmployeeId(e.target.value)}
//               placeholder="Enter employee ID"
//               className={`${errors.trainingEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 
//                 darkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-300'
//                 : ''
//               } ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//               readOnly={!!generatedEmployeeId}
//             />
//             {errors.trainingEmployeeId && <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.trainingEmployeeId}</p>}
//             {generatedEmployeeId && (
//               <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} mt-1`}>✓ Auto-filled from previous step</p>
//             )}
//           </div>
          
//           <div className="mb-6">
//             <Button
//               type="button"
//               onClick={() => {
//                 setNoTrainingExperience(!noTrainingExperience);
//                 if (!noTrainingExperience) {
//                   setFormData(prev => ({
//                     ...prev,
//                     professionalTraining: [{
//                       instituteName: "",
//                       instituteAddress: "",
//                       duration: "",
//                       areaOfTraining: ""
//                     }]
//                   }));
//                 }
//               }}
//               variant={noTrainingExperience ? "default" : "outline"}
//               className={`flex items-center gap-2 ${noTrainingExperience ? 
//                 darkMode ? 'bg-green-100 border-green-300 text-green-700' : 'bg-green-100 border-green-300 text-green-700'
//                 : darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               {noTrainingExperience ? (
//                 <>
//                   <CheckCircle size={16} />
//                   I don't have any Professional Training experience
//                 </>
//               ) : (
//                 <>
//                   <X size={16} />
//                   I don't have any Professional Training experience
//                 </>
//               )}
//             </Button>
//             {noTrainingExperience && (
//               <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'} mt-2`}>
//                 ✓ Professional training status has been recorded. You can proceed to the next step.
//               </p>
//             )}
//           </div>
          
//           {!noTrainingExperience && (
//             <div className={`space-y-6 mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg p-4`}>
//               {formData.professionalTraining.map((training, index) => (
//                 <div key={index} className={`border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
//                   {formData.professionalTraining.length > 1 && (
//                     <Button
//                       type="button"
//                       onClick={() => removeProfessionalTraining(index)}
//                       variant="outline"
//                       size="sm"
//                       className={`absolute top-2 right-2 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
//                     >
//                       <Trash2 size={16} />
//                     </Button>
//                   )}
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
//                         {index + 1}. Institute Name
//                       </Label>
//                       <Input
//                         value={training.instituteName}
//                         onChange={(e) => handleProfessionalTrainingChange(index, 'instituteName', e.target.value)}
//                         placeholder="Enter institute name"
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
//                         Duration
//                       </Label>
//                       <Input
//                         value={training.duration}
//                         onChange={(e) => handleProfessionalTrainingChange(index, 'duration', e.target.value)}
//                         placeholder="e.g., 3 months, 6 weeks"
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
//                         Area of Training
//                       </Label>
//                       <Input
//                         value={training.areaOfTraining}
//                         onChange={(e) => handleProfessionalTrainingChange(index, 'areaOfTraining', e.target.value)}
//                         placeholder="e.g., Web Development, Data Science"
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>

//                     <div className="space-y-2 md:col-span-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
//                         Institute Address
//                       </Label>
//                       <Input
//                         value={training.instituteAddress}
//                         onChange={(e) => handleProfessionalTrainingChange(index, 'instituteAddress', e.target.value)}
//                         placeholder="Enter institute address"
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {errors.trainingGeneral && (
//             <div className={`mb-4 p-3 ${darkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'} rounded-lg flex items-center gap-2`}>
//               <AlertCircle className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
//               <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{errors.trainingGeneral}</p>
//             </div>
//           )}

//           <Button
//             onClick={submitProfessionalTraining}
//             disabled={trainingLoading}
//             className={`w-full ${trainingSuccess || noTrainingExperience ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
//           >
//             {trainingLoading ? (
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                 Saving Training Details...
//               </div>
//             ) : trainingSuccess || noTrainingExperience ? (
//               <>
//                 <CheckCircle size={16} className="mr-2" />
//                 {noTrainingExperience ? 'Record your training status' : 'Professional Training Saved'}
//               </>
//             ) : (
//               <>
//                 <Save size={16} className="mr-2" />
//                 Save Professional Training
//               </>
//             )}
//           </Button>
//         </Card>

//         {/* Professional Experience Section */}
//         <Card className={`p-6 ${experienceSuccess || noProfessionalExperience ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'} ${darkMode ? 'from-gray-800 to-gray-700 border-gray-600' : ''}`}>
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-2">
//               <Briefcase className={darkMode ? "text-blue-400" : "text-blue-600"} size={20} />
//               <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Professional Experience</h2>
//             </div>
//             <div className="flex items-center gap-4">
//               {experienceSuccess && <CheckCircle className={darkMode ? "text-green-400" : "text-green-600"} size={20} />}
//               {!noProfessionalExperience && (
//                 <Button
//                   type="button"
//                   onClick={addProfessionalExperience}
//                   variant="outline"
//                   size="sm"
//                   className={`flex items-center gap-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
//                 >
//                   <Plus size={16} />
//                   Add Experience
//                 </Button>
//               )}
//             </div>
//           </div>
          
//           {/* Employee ID Input for Experience - HIDDEN */}
//           <div className="hidden mb-4">
//             <Label htmlFor="experienceEmployeeId" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
//               Employee ID {generatedEmployeeId ? '(Auto-filled)' : ''}
//             </Label>
//             <Input
//               id="experienceEmployeeId"
//               value={experienceEmployeeId}
//               onChange={(e) => setExperienceEmployeeId(e.target.value)}
//               placeholder="Enter employee ID"
//               className={`${errors.experienceEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 
//                 darkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-300'
//                 : ''
//               } ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//               readOnly={!!generatedEmployeeId}
//             />
//             {errors.experienceEmployeeId && <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.experienceEmployeeId}</p>}
//             {generatedEmployeeId && (
//               <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} mt-1`}>✓ Auto-filled from previous step</p>
//             )}
//           </div>
          
//           <div className="mb-6">
//             <Button
//               type="button"
//               onClick={() => {
//                 setNoProfessionalExperience(!noProfessionalExperience);
//                 if (!noProfessionalExperience) {
//                   setFormData(prev => ({
//                     ...prev,
//                     professionalExperience: [{
//                       companyName: "",
//                       employerLocation: "",
//                       empId: "",
//                       rmContactNo: "",
//                       hrEmailId: "",
//                       designation: "",
//                       periodFrom: "",
//                       periodTo: "",
//                       ctc: "",
//                       reasonForLeaving: "",
//                       uanNumber: ""
//                     }]
//                   }));
//                 }
//               }}
//               variant={noProfessionalExperience ? "default" : "outline"}
//               className={`flex items-center gap-2 ${noProfessionalExperience ? 
//                 darkMode ? 'bg-green-100 border-green-300 text-green-700' : 'bg-green-100 border-green-300 text-green-700'
//                 : darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               {noProfessionalExperience ? (
//                 <>
//                   <CheckCircle size={16} />
//                   I don't have any Professional Experience
//                 </>
//               ) : (
//                 <>
//                   <X size={16} />
//                   I don't have any Professional Experience
//                 </>
//               )}
//             </Button>
//             {noProfessionalExperience && (
//               <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'} mt-2`}>
//                 ✓ Professional experience status has been recorded. You can proceed to the next step.
//               </p>
//             )}
//           </div>
          
//           <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>• Beginning with last employment (all fields are optional)</p>

//           {!noProfessionalExperience && (
//             <div className={`space-y-6 mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg p-4`}>
//               {formData.professionalExperience.map((experience, index) => (
//                 <div key={index} className={`border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
//                   {formData.professionalExperience.length > 1 && (
//                     <Button
//                       type="button"
//                       onClick={() => removeProfessionalExperience(index)}
//                       variant="outline"
//                       size="sm"
//                       className={`absolute top-2 right-2 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
//                     >
//                       <Trash2 size={16} />
//                     </Button>
//                   )}
                  
//                   <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Experience {index + 1}</h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm flex items-center gap-2`}>
//                         <Building size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
//                         Company Name
//                       </Label>
//                       <Input
//                         value={experience.companyName}
//                         onChange={(e) => handleProfessionalExperienceChange(index, 'companyName', e.target.value)}
//                         placeholder="Enter company name"
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm flex items-center gap-2`}>
//                         <MapPin size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
//                         Employer Location
//                       </Label>
//                       <Input
//                         value={experience.employerLocation}
//                         onChange={(e) => handleProfessionalExperienceChange(index, 'employerLocation', e.target.value)}
//                         placeholder="Enter employer location"
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
//                         Employer ID
//                       </Label>
//                       <Input
//                         value={experience.empId}
//                         onChange={(e) => handleProfessionalExperienceChange(index, 'empId', e.target.value)}
//                         placeholder="Enter employer ID"
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
//                         R.M Contact No.
//                       </Label>
//                       <Input
//                         value={experience.rmContactNo}
//                         onChange={(e) => handleProfessionalExperienceChange(index, 'rmContactNo', e.target.value)}
//                         placeholder="Enter contact number"
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
//                         HR Email ID
//                       </Label>
//                       <Input
//                         type="email"
//                         value={experience.hrEmailId}
//                         onChange={(e) => handleProfessionalExperienceChange(index, 'hrEmailId', e.target.value)}
//                         placeholder="Enter HR email"
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
//                         Designation
//                       </Label>
//                       <Input
//                         value={experience.designation}
//                         onChange={(e) => handleProfessionalExperienceChange(index, 'designation', e.target.value)}
//                         placeholder="Enter designation"
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm flex items-center gap-2`}>
//                         <Calendar size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
//                         Period From
//                       </Label>
//                       <Input
//                         type="date"
//                         value={experience.periodFrom}
//                         onChange={(e) => handleProfessionalExperienceChange(index, 'periodFrom', e.target.value)}
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm flex items-center gap-2`}>
//                         <Calendar size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
//                         Period To
//                       </Label>
//                       <Input
//                         type="date"
//                         value={experience.periodTo}
//                         onChange={(e) => handleProfessionalExperienceChange(index, 'periodTo', e.target.value)}
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm flex items-center gap-2`}>
//                         <DollarSign size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
//                         CTC
//                       </Label>
//                       <Input
//                         type="number"
//                         step="0.01"
//                         value={experience.ctc}
//                         onChange={(e) => handleProfessionalExperienceChange(index, 'ctc', e.target.value)}
//                         placeholder="Enter CTC"
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
//                         Reason For Leaving
//                       </Label>
//                       <Input
//                         value={experience.reasonForLeaving}
//                         onChange={(e) => handleProfessionalExperienceChange(index, 'reasonForLeaving', e.target.value)}
//                         placeholder="Enter reason for leaving"
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
//                         UAN Number
//                       </Label>
//                       <Input
//                         value={experience.uanNumber}
//                         onChange={(e) => handleProfessionalExperienceChange(index, 'uanNumber', e.target.value)}
//                         placeholder="Enter UAN number"
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {errors.experienceGeneral && (
//             <div className={`mb-4 p-3 ${darkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'} rounded-lg flex items-center gap-2`}>
//               <AlertCircle className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
//               <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{errors.experienceGeneral}</p>
//             </div>
//           )}

//           <Button
//             onClick={submitProfessionalExperience}
//             disabled={experienceLoading}
//             className={`w-full ${experienceSuccess || noProfessionalExperience ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
//           >
//             {experienceLoading ? (
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                 Saving Experience Details...
//               </div>
//             ) : experienceSuccess || noProfessionalExperience ? (
//               <>
//                 <CheckCircle size={16} className="mr-2" />
//                 {noProfessionalExperience ? 'Experience Status Recorded' : 'Professional Experience Saved'}
//               </>
//             ) : (
//               <>
//                 <Save size={16} className="mr-2" />
//                 Save Professional Experience
//               </>
//             )}
//           </Button>
//         </Card>

//         <Card className={`bg-gradient-to-r ${darkMode ? 'from-gray-800 to-gray-700 border-gray-600' : 'from-gray-50 to-slate-50 border-gray-200'} p-6`}>
//           <div className="text-center">
//             <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>
//               ISCS Technologies Private Limited
//             </h3>
//             <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>TRUSTED IT CONSULTING PARTNER</p>
//           </div>
//         </Card>

//         <div className="flex justify-between pt-6">
//           <div className="flex gap-4">
//             {/* <Button type="button" onClick={onBack} variant="outline" className={`px-8 py-3 flex items-center gap-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
//               <ArrowLeft size={16} />
//               Back
//             </Button> */}
//           </div>
          
//           <Button
//             onClick={handleSubmit}
//             disabled={loading || !isAnySectionCompleted}
//             className={`px-8 py-3 font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${
//               isAnySectionCompleted 
//                 ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
//                 : "bg-gray-400 text-white cursor-not-allowed"
//             }`}
//           >
//             {loading ? (
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                 Proceeding...
//               </div>
//             ) : (
//               <>
//                 Continue to References
//                 <ArrowRight size={16} className="ml-2" />
//               </>
//             )}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// ProfessionalTrainingForm.jsx
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  GraduationCap, 
  Briefcase, 
  ArrowLeft, 
  ArrowRight, 
  Plus,
  Trash2,
  Building,
  Calendar,
  DollarSign,
  Save,
  CheckCircle,
  AlertCircle,
  X,
  MapPin,
  Upload,
  FileText,
  RefreshCw,
  Eye,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDarkMode } from "@/context/DarkModeContext";
import { apiRequest } from "../api";

export default function ProfessionalTrainingForm({ initialData, generatedEmployeeId, onSubmit, onDataUpdate}) {
  const { darkMode } = useDarkMode();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [trainingLoading, setTrainingLoading] = useState(false);
  const [experienceLoading, setExperienceLoading] = useState(false);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  
  const [trainingSuccess, setTrainingSuccess] = useState(false);
  const [experienceSuccess, setExperienceSuccess] = useState(false);
  const [documentsSuccess, setDocumentsSuccess] = useState(false);
  
  const [trainingEmployeeId, setTrainingEmployeeId] = useState("");
  const [experienceEmployeeId, setExperienceEmployeeId] = useState("");
  const [documentsEmployeeId, setDocumentsEmployeeId] = useState("");
  
  // Experience Documents states
  const [documentFiles, setDocumentFiles] = useState({
    experience_letter: null,
    relieving_letter: null,
    last_payslip: null,
    offer_letter: null
  });
  
  const [documentPreviews, setDocumentPreviews] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [documentErrors, setDocumentErrors] = useState({});
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  
  // Initialize flags from props or default to true
  const [noTrainingExperience, setNoTrainingExperience] = useState(initialData.has_training === false);
  const [noProfessionalExperience, setNoProfessionalExperience] = useState(initialData.has_experience === false);

  // Experience Documents configuration
  const documentConfig = [
    { key: 'experience_letter', label: 'Experience Letter', accept: '.pdf', maxSize: 5 },
    { key: 'relieving_letter', label: 'Relieving Letter', accept: '.pdf', maxSize: 5 },
    { key: 'last_payslip', label: 'Last Payslip', accept: '.pdf', maxSize: 5 },
    { key: 'offer_letter', label: 'Offer Letter', accept: '.pdf', maxSize: 5 }
  ];

  useEffect(() => {
    if (generatedEmployeeId) {
      setTrainingEmployeeId(generatedEmployeeId);
      setExperienceEmployeeId(generatedEmployeeId);
      setDocumentsEmployeeId(generatedEmployeeId);
    }
  }, [generatedEmployeeId]);

  const handleProfessionalTrainingChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      professionalTraining: prev.professionalTraining.map((training, i) =>
        i === index ? { ...training, [field]: value } : training
      )
    }));
  }; 

  const addProfessionalTraining = () => {
    setFormData(prev => ({
      ...prev,
      professionalTraining: [
        ...prev.professionalTraining,
        {
          instituteName: "",
          instituteAddress: "",
          duration: "",
          areaOfTraining: ""
        }
      ]
    }));
  };

  const removeProfessionalTraining = (index) => {
    if (formData.professionalTraining.length > 1) {
      setFormData(prev => ({
        ...prev,
        professionalTraining: prev.professionalTraining.filter((_, i) => i !== index)
      }));
    }
  };

  const handleProfessionalExperienceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      professionalExperience: prev.professionalExperience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addProfessionalExperience = () => {
    setFormData(prev => ({
      ...prev,
      professionalExperience: [
        ...prev.professionalExperience,
        {
          companyName: "",           // company_name in backend
          employerLocation: "",      // employer_location in backend
          empId: "",                 // employer_id in backend
          rmContactNo: "",           // rm_contact_no in backend
          hrEmailId: "",             // hr_email in backend
          designation: "",           // designation in backend
          periodFrom: "",            // period_from in backend
          periodTo: "",              // period_to in backend
          ctc: "",                   // ctc in backend
          reasonForLeaving: "",      // reason_for_leaving in backend
          uanNumber: ""              // uan_number in backend
        }
      ]
    }));
  };

  const removeProfessionalExperience = (index) => {
    if (formData.professionalExperience.length > 1) {
      setFormData(prev => ({
        ...prev,
        professionalExperience: prev.professionalExperience.filter((_, i) => i !== index)
      }));
    }
  };

  // --- DOCUMENT HANDLERS ---
  const handleDocumentFileSelect = (docKey, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      setDocumentErrors(prev => ({
        ...prev,
        [docKey]: 'Only PDF files are allowed.'
      }));
      
      toast({
        title: "Invalid File Type",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
      
      event.target.value = '';
      return;
    }

    // Validate file size (5MB max)
    const fileSizeMB = file.size / (1024 * 1024);
    const config = documentConfig.find(c => c.key === docKey);
    
    if (fileSizeMB > config.maxSize) {
      setDocumentErrors(prev => ({
        ...prev,
        [docKey]: `File size must be under ${config.maxSize}MB. Current file is ${fileSizeMB.toFixed(1)}MB.`
      }));
      
      toast({
        title: "File Too Large",
        description: `${config.label} must be under ${config.maxSize}MB.`,
        variant: "destructive",
      });
      
      event.target.value = '';
      return;
    }

    // Clear any previous error
    setDocumentErrors(prev => ({ ...prev, [docKey]: null }));

    // Update files
    setDocumentFiles(prev => ({ ...prev, [docKey]: file }));

    // Create preview URL for PDF (using blob URL)
    const previewUrl = URL.createObjectURL(file);
    setDocumentPreviews(prev => ({ ...prev, [docKey]: previewUrl }));
  };

  const handleClearDocumentFile = (docKey) => {
    setDocumentFiles(prev => ({ ...prev, [docKey]: null }));
    
    // Revoke preview URL if exists
    if (documentPreviews[docKey]) {
      URL.revokeObjectURL(documentPreviews[docKey]);
      setDocumentPreviews(prev => ({ ...prev, [docKey]: null }));
    }
    
    const fileInput = document.getElementById(`doc-${docKey}`);
    if (fileInput) fileInput.value = '';
  };

  const submitExperienceDocuments = async () => {
    if (!documentsEmployeeId.trim()) {
      setErrors(prev => ({ ...prev, documentsEmployeeId: "Employee ID is required" }));
      return;
    }

    // Check if at least one file is selected
    const hasFiles = Object.values(documentFiles).some(file => file !== null);
    if (!hasFiles) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one document to upload.",
        variant: "destructive",
      });
      return;
    }

    setDocumentsLoading(true);
    setDocumentsSuccess(false);

    try {
      const formData = new FormData();
      
      // Append files to form data
      Object.entries(documentFiles).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      // Build URL with optional company_name query param
      let url = `/users/ExperienceDocuments/${documentsEmployeeId}`;
      if (selectedCompanyName && selectedCompanyName.trim()) {
        url += `?company_name=${encodeURIComponent(selectedCompanyName.trim())}`;
      }

      const result = await apiRequest(url, {
        method: 'PUT',
        body: formData,
        headers: {} // Let browser set content-type with boundary
      });

      setDocumentsSuccess(true);
      
      // Mark uploaded documents as completed
      const uploaded = {};
      Object.keys(documentFiles).forEach(key => {
        if (documentFiles[key]) {
          uploaded[key] = true;
        }
      });
      setUploadedDocuments(uploaded);

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Experience Documents Uploaded Successfully</span>
          </div>
        ),
        description: `${Object.values(documentFiles).filter(f => f !== null).length} document(s) have been uploaded.${selectedCompanyName ? ` Linked to company: ${selectedCompanyName}` : ''}`,
        className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
      });

      // Clear files after successful upload
      setDocumentFiles({
        experience_letter: null,
        relieving_letter: null,
        last_payslip: null,
        offer_letter: null
      });
      
      // Clear previews
      Object.keys(documentPreviews).forEach(key => {
        if (documentPreviews[key]) {
          URL.revokeObjectURL(documentPreviews[key]);
        }
      });
      setDocumentPreviews({});
      setSelectedCompanyName("");

    } catch (error) {
      console.error('Experience Documents API Error:', error);
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDocumentsLoading(false);
    }
  };

  // --- API SUBMIT FUNCTIONS ---

  const submitProfessionalTraining = async () => {
    if (!trainingEmployeeId.trim()) {
      setErrors(prev => ({ ...prev, trainingEmployeeId: "Employee ID is required" }));
      return;
    }

    setTrainingLoading(true);
    setTrainingSuccess(false);
    
    try {
      // Case 1: User claims NO Training Experience
      if (noTrainingExperience) {
        const response = await apiRequest(`/users/Professional_Training/${trainingEmployeeId}`, {
          method: 'POST',
          body: JSON.stringify({ has_training: false })
        });

        if (response && response.message && response.message.includes("already exist")) {
            setErrors(prev => ({ ...prev, trainingGeneral: response.message }));
        } else {
            setTrainingSuccess(true);
            setErrors(prev => ({ ...prev, trainingGeneral: "" }));
            
            // CALL PARENT UPDATE
            if (onDataUpdate) {
                onDataUpdate({
                    has_training: false,
                    professionalTraining: []
                });
            }
        }
      } 
      // Case 2: User HAS Training Experience
      else {
        // Check if at least one training has minimum required fields (institute name, duration, area of training)
        const hasAnyTraining = formData.professionalTraining.some(training => 
          training.instituteName?.trim() || training.duration?.trim() || training.areaOfTraining?.trim()
        );

        if (!hasAnyTraining) {
          setErrors(prev => ({ ...prev, trainingGeneral: "Please fill at least one training field or select 'No Training'" }));
          setTrainingLoading(false);
          return;
        }

        // Send each training record that has at least one field filled
        for (const training of formData.professionalTraining) {
          // Only send if at least one field is filled
          if (training.instituteName?.trim() || training.duration?.trim() || training.areaOfTraining?.trim() || training.instituteAddress?.trim()) {
            const apiData = {
              has_training: true,
              institute_name: training.instituteName || null,
              duration: training.duration || null,
              area_of_training: training.areaOfTraining || null,
              institute_address: training.instituteAddress || null
            };

            await apiRequest(`/users/Professional_Training/${trainingEmployeeId}`, {
              method: 'POST',
              body: JSON.stringify(apiData)
            });
          }
        }

        setTrainingSuccess(true);
        setErrors(prev => ({ ...prev, trainingGeneral: "" }));

        // CALL PARENT UPDATE
        if (onDataUpdate) {
            onDataUpdate({
                has_training: true,
                professionalTraining: formData.professionalTraining.filter(t => 
                  t.instituteName?.trim() || t.duration?.trim() || t.areaOfTraining?.trim()
                )
            });
        }
      }

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Professional Training Updated</span>
          </div>
        ),
        description: noTrainingExperience ? "No training recorded." : "Training records saved successfully.",
        className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
      });

    } catch (error) {
      console.error('Training API Error:', error);
      setErrors(prev => ({ ...prev, trainingGeneral: error.message || 'Failed to update training status' }));
      toast({
        title: "Error",
        description: error.message || "Failed to save professional training. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTrainingLoading(false);
    }
  };

  const submitProfessionalExperience = async () => {
    if (!experienceEmployeeId.trim()) {
      setErrors(prev => ({ ...prev, experienceEmployeeId: "Employee ID is required" }));
      return;
    }

    setExperienceLoading(true);
    setExperienceSuccess(false);

    try {
      // Case 1: User claims NO Professional Experience
      if (noProfessionalExperience) {
        const response = await apiRequest(`/users/Professional_Experience/${experienceEmployeeId}`, {
          method: 'POST',
          body: JSON.stringify({ has_experience: false })
        });

        if (response && response.message && response.message.includes("already exist")) {
            setErrors(prev => ({ ...prev, experienceGeneral: response.message }));
        } else {
            setExperienceSuccess(true);
            setErrors(prev => ({ ...prev, experienceGeneral: "" }));

            // CALL PARENT UPDATE
            if (onDataUpdate) {
                onDataUpdate({
                    has_experience: false,
                    professionalExperience: []
                });
            }
        }
      } 
      // Case 2: User HAS Professional Experience
      else {
        // Check if at least one experience has any field filled
        const hasAnyExperience = formData.professionalExperience.some(exp => 
          exp.companyName?.trim() || 
          exp.employerLocation?.trim() || 
          exp.designation?.trim() || 
          exp.periodFrom || 
          exp.periodTo || 
          exp.ctc?.trim()
        );

        if (!hasAnyExperience) {
          setErrors(prev => ({ ...prev, experienceGeneral: "Please fill at least one experience field or select 'No Experience'" }));
          setExperienceLoading(false);
          return;
        }

        // Send each experience record that has at least one field filled
        for (const experience of formData.professionalExperience) {
          // Only send if at least one field is filled
          if (experience.companyName?.trim() || 
              experience.employerLocation?.trim() || 
              experience.empId?.trim() || 
              experience.rmContactNo?.trim() || 
              experience.hrEmailId?.trim() || 
              experience.designation?.trim() || 
              experience.periodFrom || 
              experience.periodTo || 
              experience.ctc?.trim() || 
              experience.reasonForLeaving?.trim() || 
              experience.uanNumber?.trim()) {
            
            const apiData = {
              has_experience: true,
              company_name: experience.companyName || null,
              employer_location: experience.employerLocation || null,
              employer_id: experience.empId || null,
              rm_contact_no: experience.rmContactNo || null,
              hr_email: experience.hrEmailId || null,
              designation: experience.designation || null,
              period_from: experience.periodFrom || null,
              period_to: experience.periodTo || null,
              ctc: experience.ctc ? parseFloat(experience.ctc) : null,
              reason_for_leaving: experience.reasonForLeaving || null,
              uan_number: experience.uanNumber || null
            };

            await apiRequest(`/users/Professional_Experience/${experienceEmployeeId}`, {
              method: 'POST',
              body: JSON.stringify(apiData)
            });
          }
        }

        setExperienceSuccess(true);
        setErrors(prev => ({ ...prev, experienceGeneral: "" }));

        // CALL PARENT UPDATE
        if (onDataUpdate) {
            onDataUpdate({
                has_experience: true,
                professionalExperience: formData.professionalExperience.filter(exp => 
                  exp.companyName?.trim() || 
                  exp.employerLocation?.trim() || 
                  exp.designation?.trim() || 
                  exp.periodFrom || 
                  exp.periodTo || 
                  exp.ctc?.trim()
                )
            });
        }
      }

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Professional Experience Updated</span>
          </div>
        ),
        description: noProfessionalExperience ? "No experience recorded." : "Experience records saved successfully.",
        className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
      });

    } catch (error) {
      console.error('Experience API Error:', error);
      setErrors(prev => ({ ...prev, experienceGeneral: error.message || 'Failed to update experience status' }));
      toast({
        title: "Error",
        description: error.message || "Failed to save professional experience. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExperienceLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Just trigger parent navigation (Parent already has state from onDataUpdate)
    onSubmit({
        ...formData,
        has_training: noTrainingExperience ? false : true,
        has_experience: noProfessionalExperience ? false : true
    });
    
    setLoading(false);
  };

  const isAnySectionCompleted = trainingSuccess || experienceSuccess || noTrainingExperience || noProfessionalExperience || documentsSuccess;

  return (
    <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>Professional Training & Experience</h1>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Complete your professional training, work experience details and upload supporting documents</p>
      </div>

      {/* Global Employee ID Display - HIDDEN */}
      <div className="hidden text-center mb-6">
        <div className={`inline-flex items-center gap-3 px-6 py-3 ${darkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-200'} rounded-full shadow-sm`}>
          <CheckCircle size={20} className={darkMode ? "text-green-400" : "text-green-600"} />
          <span className={`text-gray-700 font-medium ${darkMode ? 'text-gray-200' : ''}`}>Auto-filled Employee ID:</span>
          <span className={`text-lg font-bold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>{generatedEmployeeId}</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Professional Training Section */}
        <Card className={`p-6 ${trainingSuccess || noTrainingExperience ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'} ${darkMode ? 'from-gray-800 to-gray-700 border-gray-600' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <GraduationCap className={darkMode ? "text-purple-400" : "text-purple-600"} size={20} />
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Professional Training</h2>
            </div>
            <div className="flex items-center gap-4">
              {trainingSuccess && <CheckCircle className={darkMode ? "text-green-400" : "text-green-600"} size={20} />}
              {!noTrainingExperience && (
                <Button
                  type="button"
                  onClick={addProfessionalTraining}
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  <Plus size={16} />
                  Add Training
                </Button>
              )}
            </div>
          </div>
          
          {/* Employee ID Input for Training - HIDDEN */}
          <div className="hidden mb-4">
            <Label htmlFor="trainingEmployeeId" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
              Employee ID {generatedEmployeeId ? '(Auto-filled)' : ''}
            </Label>
            <Input
              id="trainingEmployeeId"
              value={trainingEmployeeId}
              onChange={(e) => setTrainingEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              className={`${errors.trainingEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 
                darkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-300'
                : ''
              } ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
              readOnly={!!generatedEmployeeId}
            />
            {errors.trainingEmployeeId && <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.trainingEmployeeId}</p>}
            {generatedEmployeeId && (
              <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} mt-1`}>✓ Auto-filled from previous step</p>
            )}
          </div>
          
          <div className="mb-6">
            <Button
              type="button"
              onClick={() => {
                setNoTrainingExperience(!noTrainingExperience);
                if (!noTrainingExperience) {
                  setFormData(prev => ({
                    ...prev,
                    professionalTraining: [{
                      instituteName: "",
                      instituteAddress: "",
                      duration: "",
                      areaOfTraining: ""
                    }]
                  }));
                }
              }}
              variant={noTrainingExperience ? "default" : "outline"}
              className={`flex items-center gap-2 ${noTrainingExperience ? 
                darkMode ? 'bg-green-100 border-green-300 text-green-700' : 'bg-green-100 border-green-300 text-green-700'
                : darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {noTrainingExperience ? (
                <>
                  <CheckCircle size={16} />
                  I don't have any Professional Training experience
                </>
              ) : (
                <>
                  <X size={16} />
                  I don't have any Professional Training experience
                </>
              )}
            </Button>
            {noTrainingExperience && (
              <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'} mt-2`}>
                ✓ Professional training status has been recorded. You can proceed to the next step.
              </p>
            )}
          </div>
          
          {!noTrainingExperience && (
            <div className={`space-y-6 mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg p-4`}>
              {formData.professionalTraining.map((training, index) => (
                <div key={index} className={`border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
                  {formData.professionalTraining.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeProfessionalTraining(index)}
                      variant="outline"
                      size="sm"
                      className={`absolute top-2 right-2 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
                        {index + 1}. Institute Name
                      </Label>
                      <Input
                        value={training.instituteName}
                        onChange={(e) => handleProfessionalTrainingChange(index, 'instituteName', e.target.value)}
                        placeholder="Enter institute name"
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
                        Duration
                      </Label>
                      <Input
                        value={training.duration}
                        onChange={(e) => handleProfessionalTrainingChange(index, 'duration', e.target.value)}
                        placeholder="e.g., 3 months, 6 weeks"
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
                        Area of Training
                      </Label>
                      <Input
                        value={training.areaOfTraining}
                        onChange={(e) => handleProfessionalTrainingChange(index, 'areaOfTraining', e.target.value)}
                        placeholder="e.g., Web Development, Data Science"
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
                        Institute Address
                      </Label>
                      <Input
                        value={training.instituteAddress}
                        onChange={(e) => handleProfessionalTrainingChange(index, 'instituteAddress', e.target.value)}
                        placeholder="Enter institute address"
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {errors.trainingGeneral && (
            <div className={`mb-4 p-3 ${darkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'} rounded-lg flex items-center gap-2`}>
              <AlertCircle className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{errors.trainingGeneral}</p>
            </div>
          )}

          <Button
            onClick={submitProfessionalTraining}
            disabled={trainingLoading}
            className={`w-full ${trainingSuccess || noTrainingExperience ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
          >
            {trainingLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving Training Details...
              </div>
            ) : trainingSuccess || noTrainingExperience ? (
              <>
                <CheckCircle size={16} className="mr-2" />
                {noTrainingExperience ? 'Record your training status' : 'Professional Training Saved'}
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Professional Training
              </>
            )}
          </Button>
        </Card>

        {/* Professional Experience Section */}
        <Card className={`p-6 ${experienceSuccess || noProfessionalExperience ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'} ${darkMode ? 'from-gray-800 to-gray-700 border-gray-600' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Briefcase className={darkMode ? "text-blue-400" : "text-blue-600"} size={20} />
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Professional Experience</h2>
            </div>
            <div className="flex items-center gap-4">
              {experienceSuccess && <CheckCircle className={darkMode ? "text-green-400" : "text-green-600"} size={20} />}
              {!noProfessionalExperience && (
                <Button
                  type="button"
                  onClick={addProfessionalExperience}
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  <Plus size={16} />
                  Add Experience
                </Button>
              )}
            </div>
          </div>
          
          {/* Employee ID Input for Experience - HIDDEN */}
          <div className="hidden mb-4">
            <Label htmlFor="experienceEmployeeId" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
              Employee ID {generatedEmployeeId ? '(Auto-filled)' : ''}
            </Label>
            <Input
              id="experienceEmployeeId"
              value={experienceEmployeeId}
              onChange={(e) => setExperienceEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              className={`${errors.experienceEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 
                darkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-300'
                : ''
              } ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
              readOnly={!!generatedEmployeeId}
            />
            {errors.experienceEmployeeId && <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.experienceEmployeeId}</p>}
            {generatedEmployeeId && (
              <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} mt-1`}>✓ Auto-filled from previous step</p>
            )}
          </div>
          
          <div className="mb-6">
            <Button
              type="button"
              onClick={() => {
                setNoProfessionalExperience(!noProfessionalExperience);
                if (!noProfessionalExperience) {
                  setFormData(prev => ({
                    ...prev,
                    professionalExperience: [{
                      companyName: "",
                      employerLocation: "",
                      empId: "",
                      rmContactNo: "",
                      hrEmailId: "",
                      designation: "",
                      periodFrom: "",
                      periodTo: "",
                      ctc: "",
                      reasonForLeaving: "",
                      uanNumber: ""
                    }]
                  }));
                }
              }}
              variant={noProfessionalExperience ? "default" : "outline"}
              className={`flex items-center gap-2 ${noProfessionalExperience ? 
                darkMode ? 'bg-green-100 border-green-300 text-green-700' : 'bg-green-100 border-green-300 text-green-700'
                : darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {noProfessionalExperience ? (
                <>
                  <CheckCircle size={16} />
                  I don't have any Professional Experience
                </>
              ) : (
                <>
                  <X size={16} />
                  I don't have any Professional Experience
                </>
              )}
            </Button>
            {noProfessionalExperience && (
              <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'} mt-2`}>
                ✓ Professional experience status has been recorded. You can proceed to the next step.
              </p>
            )}
          </div>
          
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>• Beginning with last employment (all fields are optional)</p>

          {!noProfessionalExperience && (
            <div className={`space-y-6 mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg p-4`}>
              {formData.professionalExperience.map((experience, index) => (
                <div key={index} className={`border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
                  {formData.professionalExperience.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeProfessionalExperience(index)}
                      variant="outline"
                      size="sm"
                      className={`absolute top-2 right-2 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                  
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Experience {index + 1}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm flex items-center gap-2`}>
                        <Building size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                        Company Name
                      </Label>
                      <Input
                        value={experience.companyName}
                        onChange={(e) => handleProfessionalExperienceChange(index, 'companyName', e.target.value)}
                        placeholder="Enter company name"
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm flex items-center gap-2`}>
                        <MapPin size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                        Employer Location
                      </Label>
                      <Input
                        value={experience.employerLocation}
                        onChange={(e) => handleProfessionalExperienceChange(index, 'employerLocation', e.target.value)}
                        placeholder="Enter employer location"
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
                        Employer ID
                      </Label>
                      <Input
                        value={experience.empId}
                        onChange={(e) => handleProfessionalExperienceChange(index, 'empId', e.target.value)}
                        placeholder="Enter employer ID"
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
                        R.M Contact No.
                      </Label>
                      <Input
                        value={experience.rmContactNo}
                        onChange={(e) => handleProfessionalExperienceChange(index, 'rmContactNo', e.target.value)}
                        placeholder="Enter contact number"
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
                        HR Email ID
                      </Label>
                      <Input
                        type="email"
                        value={experience.hrEmailId}
                        onChange={(e) => handleProfessionalExperienceChange(index, 'hrEmailId', e.target.value)}
                        placeholder="Enter HR email"
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
                        Designation
                      </Label>
                      <Input
                        value={experience.designation}
                        onChange={(e) => handleProfessionalExperienceChange(index, 'designation', e.target.value)}
                        placeholder="Enter designation"
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm flex items-center gap-2`}>
                        <Calendar size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                        Period From
                      </Label>
                      <Input
                        type="date"
                        value={experience.periodFrom}
                        onChange={(e) => handleProfessionalExperienceChange(index, 'periodFrom', e.target.value)}
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm flex items-center gap-2`}>
                        <Calendar size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                        Period To
                      </Label>
                      <Input
                        type="date"
                        value={experience.periodTo}
                        onChange={(e) => handleProfessionalExperienceChange(index, 'periodTo', e.target.value)}
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm flex items-center gap-2`}>
                        <DollarSign size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                        CTC
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={experience.ctc}
                        onChange={(e) => handleProfessionalExperienceChange(index, 'ctc', e.target.value)}
                        placeholder="Enter CTC"
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
                        Reason For Leaving
                      </Label>
                      <Input
                        value={experience.reasonForLeaving}
                        onChange={(e) => handleProfessionalExperienceChange(index, 'reasonForLeaving', e.target.value)}
                        placeholder="Enter reason for leaving"
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
                        UAN Number
                      </Label>
                      <Input
                        value={experience.uanNumber}
                        onChange={(e) => handleProfessionalExperienceChange(index, 'uanNumber', e.target.value)}
                        placeholder="Enter UAN number"
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {errors.experienceGeneral && (
            <div className={`mb-4 p-3 ${darkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'} rounded-lg flex items-center gap-2`}>
              <AlertCircle className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{errors.experienceGeneral}</p>
            </div>
          )}

          <Button
            onClick={submitProfessionalExperience}
            disabled={experienceLoading}
            className={`w-full ${experienceSuccess || noProfessionalExperience ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {experienceLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving Experience Details...
              </div>
            ) : experienceSuccess || noProfessionalExperience ? (
              <>
                <CheckCircle size={16} className="mr-2" />
                {noProfessionalExperience ? 'Experience Status Recorded' : 'Professional Experience Saved'}
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Professional Experience
              </>
            )}
          </Button>
        </Card>

        {/* Experience Documents Upload Section - NEW */}
        <Card className={`p-6 ${documentsSuccess ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'} ${darkMode ? 'from-gray-800 to-gray-700 border-gray-600' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Upload className={darkMode ? "text-amber-400" : "text-amber-600"} size={20} />
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Experience Documents</h2>
            </div>
            {documentsSuccess && <CheckCircle className={darkMode ? "text-green-400" : "text-green-600"} size={20} />}
          </div>

          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            Upload your previous company documents. Each document is optional. Supported format: PDF (Max 5MB each)
          </p>

          {/* Company Name Input (Optional) */}
          <div className="mb-6">
            <Label htmlFor="companyName" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-2 block`}>
              Company Name (Optional)
            </Label>
            <Input
              id="companyName"
              value={selectedCompanyName}
              onChange={(e) => setSelectedCompanyName(e.target.value)}
              placeholder="Enter company name to auto-link documents to a specific experience record"
              className={`max-w-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
            />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              If provided, documents will be linked to the experience record with this company name.
            </p>
          </div>

          {/* Document Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {documentConfig.map((doc) => (
              <div key={doc.key} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
                <Label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 block`}>
                  {doc.label}
                </Label>
                
                <div className="space-y-3">
                  {/* File Input (Hidden) */}
                  <Input
                    id={`doc-${doc.key}`}
                    type="file"
                    accept={doc.accept}
                    onChange={(e) => handleDocumentFileSelect(doc.key, e)}
                    className="hidden"
                  />

                  {/* File Selection Button */}
                  {!documentFiles[doc.key] && !uploadedDocuments[doc.key] && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById(`doc-${doc.key}`).click()}
                      className={`w-full ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                      <Upload size={14} className="mr-2" />
                      Choose File
                    </Button>
                  )}

                  {/* Selected File Display */}
                  {documentFiles[doc.key] && (
                    <div className={`p-3 rounded-lg flex items-center justify-between ${darkMode ? 'bg-amber-900/30 border border-amber-700' : 'bg-amber-50 border border-amber-200'}`}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText size={16} className={darkMode ? 'text-amber-400' : 'text-amber-600'} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                            {documentFiles[doc.key].name}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-amber-400/70' : 'text-amber-600/70'}`}>
                            {(documentFiles[doc.key].size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleClearDocumentFile(doc.key)}
                        className={`p-1 rounded-full flex-shrink-0 ${darkMode ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-100 text-red-500'}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* Uploaded Indicator */}
                  {uploadedDocuments[doc.key] && (
                    <div className={`p-3 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                      <CheckCircle size={16} className={darkMode ? 'text-green-400' : 'text-green-600'} />
                      <span className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                        Uploaded successfully
                      </span>
                    </div>
                  )}

                  {/* Error Message */}
                  {documentErrors[doc.key] && (
                    <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{documentErrors[doc.key]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <Button
            onClick={submitExperienceDocuments}
            disabled={documentsLoading || !Object.values(documentFiles).some(f => f !== null)}
            className={`w-full ${documentsSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'} text-white py-6 text-lg`}
          >
            {documentsLoading ? (
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Uploading Documents...
              </div>
            ) : documentsSuccess ? (
              <>
                <CheckCircle size={18} className="mr-2" />
                Experience Documents Uploaded Successfully
              </>
            ) : (
              <>
                <Upload size={18} className="mr-2" />
                Upload Selected Documents
              </>
            )}
          </Button>
        </Card>

        {/* Progress Indicator */}
        <Card className={`p-6 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'}`}>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Form Completion Status</h3>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {isAnySectionCompleted ? 'At least one section completed!' : 'No sections completed yet'}
              </span>
            </div>
            <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5`}>
              <div 
                className={`bg-blue-600 h-2.5 rounded-full transition-all duration-300`} 
                style={{ width: `${((trainingSuccess || noTrainingExperience ? 1 : 0) + 
                                   (experienceSuccess || noProfessionalExperience ? 1 : 0) + 
                                   (documentsSuccess ? 1 : 0)) * 33.33}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`text-center p-3 rounded-lg ${trainingSuccess || noTrainingExperience ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} ${darkMode ? 'bg-gray-700/50 border-gray-600' : ''}`}>
              <div className="flex justify-center mb-2">
                {trainingSuccess || noTrainingExperience ? 
                  <CheckCircle className={darkMode ? "text-green-400" : "text-green-600"} size={20} /> : 
                  <GraduationCap className={darkMode ? "text-gray-400" : "text-gray-400"} size={20} />
                }
              </div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Training</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                {trainingSuccess || noTrainingExperience ? '✓ Completed' : 'Pending'}
              </p>
            </div>
            
            <div className={`text-center p-3 rounded-lg ${experienceSuccess || noProfessionalExperience ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} ${darkMode ? 'bg-gray-700/50 border-gray-600' : ''}`}>
              <div className="flex justify-center mb-2">
                {experienceSuccess || noProfessionalExperience ? 
                  <CheckCircle className={darkMode ? "text-green-400" : "text-green-600"} size={20} /> : 
                  <Briefcase className={darkMode ? "text-gray-400" : "text-gray-400"} size={20} />
                }
              </div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Experience</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                {experienceSuccess || noProfessionalExperience ? '✓ Completed' : 'Pending'}
              </p>
            </div>
            
            <div className={`text-center p-3 rounded-lg ${documentsSuccess ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} ${darkMode ? 'bg-gray-700/50 border-gray-600' : ''}`}>
              <div className="flex justify-center mb-2">
                {documentsSuccess ? 
                  <CheckCircle className={darkMode ? "text-green-400" : "text-green-600"} size={20} /> : 
                  <FileText className={darkMode ? "text-gray-400" : "text-gray-400"} size={20} />
                }
              </div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Documents</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                {documentsSuccess ? '✓ Completed' : 'Pending'}
              </p>
            </div>
          </div>
        </Card>

        <Card className={`bg-gradient-to-r ${darkMode ? 'from-gray-800 to-gray-700 border-gray-600' : 'from-gray-50 to-slate-50 border-gray-200'} p-6`}>
          <div className="text-center">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>
              ISCS Technologies Private Limited
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>TRUSTED IT CONSULTING PARTNER</p>
          </div>
        </Card>

        <div className="flex justify-between pt-6">
          <div className="flex gap-4">
            {/* <Button type="button" onClick={onBack} variant="outline" className={`px-8 py-3 flex items-center gap-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
              <ArrowLeft size={16} />
              Back
            </Button> */}
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={loading || !isAnySectionCompleted}
            className={`px-8 py-3 font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${
              isAnySectionCompleted 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Proceeding...
              </div>
            ) : (
              <>
                Continue to References
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}