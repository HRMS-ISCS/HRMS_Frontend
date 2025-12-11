
// // ProfessionalTrainingForm.jsx(dark mode)
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
//   X
// } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// import { useDarkMode } from "@/context/DarkModeContext"; // Import dark mode context
// import { apiRequest } from "../api"; // Import API request function

// export default function ProfessionalTrainingForm({ initialData, generatedEmployeeId, onSubmit, onBack, onProfessionalTrainingSubmit }) {
//   const { darkMode } = useDarkMode(); // Get dark mode state
//   const { toast } = useToast(); // Initialize toast
//   const [formData, setFormData] = useState(initialData);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   // API-specific states
//   const [trainingLoading, setTrainingLoading] = useState(false);
//   const [experienceLoading, setExperienceLoading] = useState(false);
  
//   const [trainingSuccess, setTrainingSuccess] = useState(false);
//   const [experienceSuccess, setExperienceSuccess] = useState(false);
  
//   const [trainingEmployeeId, setTrainingEmployeeId] = useState("");
//   const [experienceEmployeeId, setExperienceEmployeeId] = useState("");
  
//   // New states for "No Experience" options
//   const [noTrainingExperience, setNoTrainingExperience] = useState(false);
//   const [noProfessionalExperience, setNoProfessionalExperience] = useState(false);

//   // Set employee IDs from props when component mounts or when generatedEmployeeId changes
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
//           location: "",
//           empId: "",
//           rmContactNo: "",
//           hrEmailId: "",
//           designation: "",
//           periodFrom: "",
//           periodTo: "",
//           ctc: "",
//           reasonForLeaving: "",
//           uanNumber: ""
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

//   // API Submit Functions
//   const submitProfessionalTraining = async () => {
//     if (!trainingEmployeeId.trim()) {
//       setErrors(prev => ({ ...prev, trainingEmployeeId: "Employee ID is required" }));
//       return;
//     }

//     // Skip validation if user has no training experience
//     if (noTrainingExperience) {
//       setTrainingLoading(true);
      
//       try {
//         // Simulate API call for "No Training Experience"
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         setTrainingSuccess(true);
//         setErrors(prev => ({ ...prev, trainingGeneral: "" }));
        
//         // Show success toast
//         toast({
//           title: (
//             <div className="flex items-center gap-2">
//               <CheckCircle className="h-5 w-5 text-green-500" />
//               <span>Professional Training Updated</span>
//             </div>
//           ),
//           description: "No professional training experience has been recorded.",
//           className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
//         });
        
//         // Call callback to unlock step 5
//         if (onProfessionalTrainingSubmit) {
//           onProfessionalTrainingSubmit();
//         }
//       } catch (error) {
//         console.error('Training API Error:', error);
//         setErrors(prev => ({ ...prev, trainingGeneral: error.message || 'Failed to update training status' }));
        
//         // Show error toast
//         toast({
//           title: "Error",
//           description: error.message || "Failed to update training status. Please try again.",
//           variant: "destructive",
//         });
//       } finally {
//         setTrainingLoading(false);
//       }
//       return;
//     }

//     const validTrainings = formData.professionalTraining.filter(training => 
//       training.instituteName?.trim() && training.duration?.trim() && training.areaOfTraining?.trim()
//     );

//     if (validTrainings.length === 0) {
//       setErrors(prev => ({ ...prev, trainingGeneral: "Please fill at least one training record" }));
//       return;
//     }

//     setTrainingLoading(true);
//     setTrainingSuccess(false);
    
//     try {
//       let successCount = 0;

//       for (const training of validTrainings) {
//         const apiData = {
//           institute_name: training.instituteName,
//           duration: training.duration,
//           area_of_training: training.areaOfTraining
//         };

//         // Use apiRequest function instead of direct fetch
//         await apiRequest(`/users/Professional_Training/${trainingEmployeeId}`, {
//           method: 'POST',
//           body: JSON.stringify(apiData)
//         });
        
//         successCount++;
//       }

//       if (successCount > 0) {
//         setTrainingSuccess(true);
//         setErrors(prev => ({ ...prev, trainingGeneral: "" }));
        
//         // Show success toast
//         toast({
//           title: (
//             <div className="flex items-center gap-2">
//               <CheckCircle className="h-5 w-5 text-green-500" />
//               <span>Professional Training Saved</span>
//             </div>
//           ),
//           description: `${successCount} training record(s) have been saved successfully.`,
//           className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
//         });
        
//         // Call callback to unlock step 5
//         if (onProfessionalTrainingSubmit) {
//           onProfessionalTrainingSubmit();
//         }
//       } else {
//         setErrors(prev => ({ ...prev, trainingGeneral: 'Failed to save training records' }));
//       }
//     } catch (error) {
//       console.error('Training API Error:', error);
//       setErrors(prev => ({ ...prev, trainingGeneral: error.message || 'Failed to connect to server' }));
      
//       // Show error toast
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

//     // Skip validation if user has no professional experience
//     if (noProfessionalExperience) {
//       setExperienceLoading(true);
      
//       try {
//         // Simulate API call for "No Professional Experience"
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         setExperienceSuccess(true);
//         setErrors(prev => ({ ...prev, experienceGeneral: "" }));
        
//         // Show success toast
//         toast({
//           title: (
//             <div className="flex items-center gap-2">
//               <CheckCircle className="h-5 w-5 text-green-500" />
//               <span>Professional Experience Updated</span>
//             </div>
//           ),
//           description: "No professional experience has been recorded.",
//           className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
//         });
        
//         // Call callback to unlock step 5
//         if (onProfessionalTrainingSubmit) {
//           onProfessionalTrainingSubmit();
//         }
//       } catch (error) {
//         console.error('Experience API Error:', error);
//         setErrors(prev => ({ ...prev, experienceGeneral: error.message || 'Failed to update experience status' }));
        
//         // Show error toast
//         toast({
//           title: "Error",
//           description: error.message || "Failed to update experience status. Please try again.",
//           variant: "destructive",
//         });
//       } finally {
//         setExperienceLoading(false);
//       }
//       return;
//     }

//     const validExperiences = formData.professionalExperience.filter(exp => 
//       exp.location?.trim() && exp.designation?.trim() && exp.periodFrom && exp.periodTo && exp.ctc?.trim()
//     );

//     if (validExperiences.length === 0) {
//       setErrors(prev => ({ ...prev, experienceGeneral: "Please fill at least one complete experience record" }));
//       return;
//     }

//     setExperienceLoading(true);
//     setExperienceSuccess(false);
    
//     try {
//       let successCount = 0;

//       for (const experience of validExperiences) {
//         const apiData = {
//           company_name: experience.location,
//           designation: experience.designation,
//           employer_location: experience.location,
//           employer_id: experience.empId || null,
//           rm_contact_no: experience.rmContactNo || null,
//           hr_email: experience.hrEmailId || null,
//           period_from: experience.periodFrom,
//           period_to: experience.periodTo,
//           ctc: parseFloat(experience.ctc),
//           reason_for_leaving: experience.reasonForLeaving || "Not specified",
//           uan_number: experience.uanNumber || null
//         };

//         // Use apiRequest function instead of direct fetch
//         await apiRequest(`/users/Professional_Experience/${experienceEmployeeId}`, {
//           method: 'POST',
//           body: JSON.stringify(apiData)
//         });
        
//         successCount++;
//       }

//       if (successCount > 0) {
//         setExperienceSuccess(true);
//         setErrors(prev => ({ ...prev, experienceGeneral: "" }));
        
//         // Show success toast
//         toast({
//           title: (
//             <div className="flex items-center gap-2">
//               <CheckCircle className="h-5 w-5 text-green-500" />
//               <span>Professional Experience Saved</span>
//             </div>
//           ),
//           description: `${successCount} experience record(s) have been saved successfully.`,
//           className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
//         });
        
//         // Call callback to unlock step 5
//         if (onProfessionalTrainingSubmit) {
//           onProfessionalTrainingSubmit();
//         }
//       } else {
//         setErrors(prev => ({ ...prev, experienceGeneral: 'Failed to save experience records' }));
//       }
//     } catch (error) {
//       console.error('Experience API Error:', error);
//       setErrors(prev => ({ ...prev, experienceGeneral: error.message || 'Failed to connect to server' }));
      
//       // Show error toast
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
//     onSubmit(formData);
//     setLoading(false);
//   };

//   // Check if any section is completed to enable next button
//   const isAnySectionCompleted = trainingSuccess || experienceSuccess || noTrainingExperience || noProfessionalExperience;

//   return (
//     <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//       <div className="text-center mb-8">
//         <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>Professional Training & Experience</h1>
//         <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Complete your professional training and work experience details</p>
//       </div>

//       {/* Global Employee ID Display if available */}
//       {generatedEmployeeId && (
//         <div className="text-center mb-6">
//           <div className={`inline-flex items-center gap-3 px-6 py-3 ${darkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-200'} rounded-full shadow-sm`}>
//             <CheckCircle size={20} className={darkMode ? "text-green-400" : "text-green-600"} />
//             <span className={`text-gray-700 font-medium ${darkMode ? 'text-gray-200' : ''}`}>Auto-filled Employee ID:</span>
//             <span className={`text-lg font-bold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>{generatedEmployeeId}</span>
//           </div>
//         </div>
//       )}

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
          
//           {/* Employee ID Input for Training */}
//           <div className="mb-4">
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
          
//           {/* "No Professional Training" Button */}
//           <div className="mb-6">
//             <Button
//               type="button"
//               onClick={() => {
//                 setNoTrainingExperience(!noTrainingExperience);
//                 if (!noTrainingExperience) {
//                   // Reset training data
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
//                 {noTrainingExperience ? 'Training Status Recorded' : 'Professional Training Saved'}
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
          
//           {/* Employee ID Input for Experience */}
//           <div className="mb-4">
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
          
//           {/* "No Professional Experience" Button */}
//           <div className="mb-6">
//             <Button
//               type="button"
//               onClick={() => {
//                 setNoProfessionalExperience(!noProfessionalExperience);
//                 if (!noProfessionalExperience) {
//                   // Reset experience data
//                   setFormData(prev => ({
//                     ...prev,
//                     professionalExperience: [{
//                       location: "",
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
          
//           <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>• Beginning with last employment</p>

//           {!noProfessionalExperience && (
//             <div className={`space-y-6 mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg p-4`}>
//               {formData.professionalExperience.map((experience, index) => (
//                 <div key={index} className={`border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
//                   {formData.professionalExperience.length > 1 && (
//                         <Button
//                           type="button"
//                           onClick={() => removeProfessionalExperience(index)}
//                           variant="outline"
//                           size="sm"
//                           className={`absolute top-2 right-2 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
//                         >
//                           <Trash2 size={16} />
//                         </Button>
//                   )}
                  
//                   <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{index + 1}. Employer Details</h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
//                         Company/Location
//                       </Label>
//                       <Input
//                         value={experience.location}
//                         onChange={(e) => handleProfessionalExperienceChange(index, 'location', e.target.value)}
//                         placeholder="Enter company/location"
//                         className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
//                         Emp. ID
//                       </Label>
//                       <Input
//                         value={experience.empId}
//                         onChange={(e) => handleProfessionalExperienceChange(index, 'empId', e.target.value)}
//                         placeholder="Enter employee ID"
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

//         {/* Progress Indicator */}
//         <Card className={`p-6 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'}`}>
//           <div className="mb-4">
//             <div className="flex justify-between items-center mb-2">
//               <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Form Completion Status</h3>
//               <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                 {isAnySectionCompleted ? 'At least one section completed!' : 'No sections completed yet'}
//               </span>
//             </div>
//             <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5`}>
//               <div 
//                 className={`bg-blue-600 h-2.5 rounded-full transition-all duration-300 ${darkMode ? '' : ''}`} 
//                 style={{ width: `${([trainingSuccess, experienceSuccess, noTrainingExperience, noProfessionalExperience].filter(Boolean).length / 2) * 100}%` }}
//               ></div>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
//             <div className={`text-center p-3 rounded-lg ${trainingSuccess || noTrainingExperience ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} ${darkMode ? 'bg-gray-700/50 border-gray-600' : ''}`}>
//               <div className="flex justify-center mb-2">
//                 {trainingSuccess || noTrainingExperience ? <CheckCircle className={darkMode ? "text-green-400" : "text-green-600"} size={20} /> : <GraduationCap className={darkMode ? "text-gray-400" : "text-gray-400"} size={20} />}
//               </div>
//               <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Training Details</p>
//               <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{trainingSuccess || noTrainingExperience ? 'Completed' : 'Pending'}</p>
//             </div>
            
//             <div className={`text-center p-3 rounded-lg ${experienceSuccess || noProfessionalExperience ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} ${darkMode ? 'bg-gray-700/50 border-gray-600' : ''}`}>
//               <div className="flex justify-center mb-2">
//                 {experienceSuccess || noProfessionalExperience ? <CheckCircle className={darkMode ? "text-green-400" : "text-green-600"} size={20} /> : <Briefcase className={darkMode ? "text-gray-400" : "text-gray-400"} size={20} />}
//               </div>
//               <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Experience Details</p>
//               <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{experienceSuccess || noProfessionalExperience ? 'Completed' : 'Pending'}</p>
//             </div>
//           </div>
//         </Card>

//         {/* Company Info Card */}
//         <Card className={`bg-gradient-to-r ${darkMode ? 'from-gray-800 to-gray-700 border-gray-600' : 'from-gray-50 to-slate-50 border-gray-200'} p-6`}>
//           <div className="text-center">
//             <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>
//               ISCS Technologies Private Limited
//             </h3>
//             <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>TRUSTED IT CONSULTING PARTNER</p>
//           </div>
//         </Card>

//         {/* Action Buttons */}
//         <div className="flex justify-between pt-6">
//           <Button
//             type="button"
//             onClick={onBack}
//             variant="outline"
//             className={`px-8 py-3 flex items-center gap-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
//           >
//             <ArrowLeft size={16} />
//             Back
//           </Button>
          
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

// ProfessionalTrainingForm.jsx(dark mode)
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  X
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDarkMode } from "@/context/DarkModeContext"; // Import dark mode context
import { apiRequest } from "../api"; // Import API request function

export default function ProfessionalTrainingForm({ initialData, generatedEmployeeId, onSubmit, onBack, onProfessionalTrainingSubmit }) {
  const { darkMode } = useDarkMode(); // Get dark mode state
  const { toast } = useToast(); // Initialize toast
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // API-specific states
  const [trainingLoading, setTrainingLoading] = useState(false);
  const [experienceLoading, setExperienceLoading] = useState(false);
  
  const [trainingSuccess, setTrainingSuccess] = useState(false);
  const [experienceSuccess, setExperienceSuccess] = useState(false);
  
  const [trainingEmployeeId, setTrainingEmployeeId] = useState("");
  const [experienceEmployeeId, setExperienceEmployeeId] = useState("");
  
  // New states for "No Experience" options
  const [noTrainingExperience, setNoTrainingExperience] = useState(false);
  const [noProfessionalExperience, setNoProfessionalExperience] = useState(false);

  // Set employee IDs from props when component mounts or when generatedEmployeeId changes
  useEffect(() => {
    if (generatedEmployeeId) {
      setTrainingEmployeeId(generatedEmployeeId);
      setExperienceEmployeeId(generatedEmployeeId);
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
          location: "",
          empId: "",
          rmContactNo: "",
          hrEmailId: "",
          designation: "",
          periodFrom: "",
          periodTo: "",
          ctc: "",
          reasonForLeaving: "",
          uanNumber: ""
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

  // API Submit Functions
  const submitProfessionalTraining = async () => {
    if (!trainingEmployeeId.trim()) {
      setErrors(prev => ({ ...prev, trainingEmployeeId: "Employee ID is required" }));
      return;
    }

    // Skip validation if user has no training experience
    if (noTrainingExperience) {
      setTrainingLoading(true);
      
      try {
        // Simulate API call for "No Training Experience"
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTrainingSuccess(true);
        setErrors(prev => ({ ...prev, trainingGeneral: "" }));
        
        // Show success toast
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Professional Training Updated</span>
            </div>
          ),
          description: "No professional training experience has been recorded.",
          className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
        });
        
        // Call callback to unlock step 5
        if (onProfessionalTrainingSubmit) {
          onProfessionalTrainingSubmit();
        }
      } catch (error) {
        console.error('Training API Error:', error);
        setErrors(prev => ({ ...prev, trainingGeneral: error.message || 'Failed to update training status' }));
        
        // Show error toast
        toast({
          title: "Error",
          description: error.message || "Failed to update training status. Please try again.",
          variant: "destructive",
        });
      } finally {
        setTrainingLoading(false);
      }
      return;
    }

    const validTrainings = formData.professionalTraining.filter(training => 
      training.instituteName?.trim() && training.duration?.trim() && training.areaOfTraining?.trim()
    );

    if (validTrainings.length === 0) {
      setErrors(prev => ({ ...prev, trainingGeneral: "Please fill at least one training record" }));
      return;
    }

    setTrainingLoading(true);
    setTrainingSuccess(false);
    
    try {
      let successCount = 0;

      for (const training of validTrainings) {
        const apiData = {
          institute_name: training.instituteName,
          duration: training.duration,
          area_of_training: training.areaOfTraining
        };

        // Use apiRequest function instead of direct fetch
        await apiRequest(`/users/Professional_Training/${trainingEmployeeId}`, {
          method: 'POST',
          body: JSON.stringify(apiData)
        });
        
        successCount++;
      }

      if (successCount > 0) {
        setTrainingSuccess(true);
        setErrors(prev => ({ ...prev, trainingGeneral: "" }));
        
        // Show success toast
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Professional Training Saved</span>
            </div>
          ),
          description: `${successCount} training record(s) have been saved successfully.`,
          className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
        });
        
        // Call callback to unlock step 5
        if (onProfessionalTrainingSubmit) {
          onProfessionalTrainingSubmit();
        }
      } else {
        setErrors(prev => ({ ...prev, trainingGeneral: 'Failed to save training records' }));
      }
    } catch (error) {
      console.error('Training API Error:', error);
      setErrors(prev => ({ ...prev, trainingGeneral: error.message || 'Failed to connect to server' }));
      
      // Show error toast
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

    // Skip validation if user has no professional experience
    if (noProfessionalExperience) {
      setExperienceLoading(true);
      
      try {
        // Simulate API call for "No Professional Experience"
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setExperienceSuccess(true);
        setErrors(prev => ({ ...prev, experienceGeneral: "" }));
        
        // Show success toast
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Professional Experience Updated</span>
            </div>
          ),
          description: "No professional experience has been recorded.",
          className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
        });
        
        // Call callback to unlock step 5
        if (onProfessionalTrainingSubmit) {
          onProfessionalTrainingSubmit();
        }
      } catch (error) {
        console.error('Experience API Error:', error);
        setErrors(prev => ({ ...prev, experienceGeneral: error.message || 'Failed to update experience status' }));
        
        // Show error toast
        toast({
          title: "Error",
          description: error.message || "Failed to update experience status. Please try again.",
          variant: "destructive",
        });
      } finally {
        setExperienceLoading(false);
      }
      return;
    }

    const validExperiences = formData.professionalExperience.filter(exp => 
      exp.location?.trim() && exp.designation?.trim() && exp.periodFrom && exp.periodTo && exp.ctc?.trim()
    );

    if (validExperiences.length === 0) {
      setErrors(prev => ({ ...prev, experienceGeneral: "Please fill at least one complete experience record" }));
      return;
    }

    setExperienceLoading(true);
    setExperienceSuccess(false);
    
    try {
      let successCount = 0;

      for (const experience of validExperiences) {
        const apiData = {
          company_name: experience.location,
          designation: experience.designation,
          employer_location: experience.location,
          employer_id: experience.empId || null,
          rm_contact_no: experience.rmContactNo || null,
          hr_email: experience.hrEmailId || null,
          period_from: experience.periodFrom,
          period_to: experience.periodTo,
          ctc: parseFloat(experience.ctc),
          reason_for_leaving: experience.reasonForLeaving || "Not specified",
          uan_number: experience.uanNumber || null
        };

        // Use apiRequest function instead of direct fetch
        await apiRequest(`/users/Professional_Experience/${experienceEmployeeId}`, {
          method: 'POST',
          body: JSON.stringify(apiData)
        });
        
        successCount++;
      }

      if (successCount > 0) {
        setExperienceSuccess(true);
        setErrors(prev => ({ ...prev, experienceGeneral: "" }));
        
        // Show success toast
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Professional Experience Saved</span>
            </div>
          ),
          description: `${successCount} experience record(s) have been saved successfully.`,
          className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
        });
        
        // Call callback to unlock step 5
        if (onProfessionalTrainingSubmit) {
          onProfessionalTrainingSubmit();
        }
      } else {
        setErrors(prev => ({ ...prev, experienceGeneral: 'Failed to save experience records' }));
      }
    } catch (error) {
      console.error('Experience API Error:', error);
      setErrors(prev => ({ ...prev, experienceGeneral: error.message || 'Failed to connect to server' }));
      
      // Show error toast
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
    onSubmit(formData);
    setLoading(false);
  };

  // Check if any section is completed to enable next button
  const isAnySectionCompleted = trainingSuccess || experienceSuccess || noTrainingExperience || noProfessionalExperience;

  return (
    <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>Professional Training & Experience</h1>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Complete your professional training and work experience details</p>
      </div>

      {/* Global Employee ID Display if available */}
      {generatedEmployeeId && (
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-3 px-6 py-3 ${darkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-200'} rounded-full shadow-sm`}>
            <CheckCircle size={20} className={darkMode ? "text-green-400" : "text-green-600"} />
            <span className={`text-gray-700 font-medium ${darkMode ? 'text-gray-200' : ''}`}>Auto-filled Employee ID:</span>
            <span className={`text-lg font-bold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>{generatedEmployeeId}</span>
          </div>
        </div>
      )}

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
          
          {/* Employee ID Input for Training */}
          <div className="mb-4">
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
          
          {/* "No Professional Training" Button */}
          <div className="mb-6">
            <Button
              type="button"
              onClick={() => {
                setNoTrainingExperience(!noTrainingExperience);
                if (!noTrainingExperience) {
                  // Reset training data
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
                {noTrainingExperience ? 'Training Status Recorded' : 'Professional Training Saved'}
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
          
          {/* Employee ID Input for Experience */}
          <div className="mb-4">
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
          
          {/* "No Professional Experience" Button */}
          <div className="mb-6">
            <Button
              type="button"
              onClick={() => {
                setNoProfessionalExperience(!noProfessionalExperience);
                if (!noProfessionalExperience) {
                  // Reset experience data
                  setFormData(prev => ({
                    ...prev,
                    professionalExperience: [{
                      location: "",
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
          
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>• Beginning with last employment</p>

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
                  
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{index + 1}. Employer Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
                        Company/Location
                      </Label>
                      <Input
                        value={experience.location}
                        onChange={(e) => handleProfessionalExperienceChange(index, 'location', e.target.value)}
                        placeholder="Enter company/location"
                        className={`text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
                        Emp. ID
                      </Label>
                      <Input
                        value={experience.empId}
                        onChange={(e) => handleProfessionalExperienceChange(index, 'empId', e.target.value)}
                        placeholder="Enter employee ID"
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

        {/* Company Info Card */}
        <Card className={`bg-gradient-to-r ${darkMode ? 'from-gray-800 to-gray-700 border-gray-600' : 'from-gray-50 to-slate-50 border-gray-200'} p-6`}>
          <div className="text-center">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>
              ISCS Technologies Private Limited
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>TRUSTED IT CONSULTING PARTNER</p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className={`px-8 py-3 flex items-center gap-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          
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