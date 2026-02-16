// // // ProfessionalTrainingForm.jsx
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
//         const validTrainings = formData.professionalTraining.filter(training => 
//           training.instituteName?.trim() && training.duration?.trim() && training.areaOfTraining?.trim()
//         );

//         if (validTrainings.length === 0) {
//           setErrors(prev => ({ ...prev, trainingGeneral: "Please fill at least one training record" }));
//           setTrainingLoading(false);
//           return;
//         }

//         for (const training of validTrainings) {
//           const apiData = {
//             has_training: true,
//             institute_name: training.instituteName,
//             duration: training.duration,
//             area_of_training: training.areaOfTraining
//           };

//           await apiRequest(`/users/Professional_Training/${trainingEmployeeId}`, {
//             method: 'POST',
//             body: JSON.stringify(apiData)
//           });
//         }

//         setTrainingSuccess(true);
//         setErrors(prev => ({ ...prev, trainingGeneral: "" }));

//         // CALL PARENT UPDATE
//         if (onDataUpdate) {
//             onDataUpdate({
//                 has_training: true,
//                 professionalTraining: validTrainings
//             });
//         }
//       }

//       if (trainingSuccess || (!errors.trainingGeneral)) {
//         toast({
//           title: (
//             <div className="flex items-center gap-2">
//               <CheckCircle className="h-5 w-5 text-green-500" />
//               <span>Professional Training Updated</span>
//             </div>
//           ),
//           description: noTrainingExperience ? "No training recorded." : "Training records saved successfully.",
//           className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
//         });
//       }

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
//         const validExperiences = formData.professionalExperience.filter(exp => 
//           exp.location?.trim() && exp.designation?.trim() && exp.periodFrom && exp.periodTo && exp.ctc?.trim()
//         );

//         if (validExperiences.length === 0) {
//           setErrors(prev => ({ ...prev, experienceGeneral: "Please fill at least one complete experience record" }));
//           setExperienceLoading(false);
//           return;
//         }

//         for (const experience of validExperiences) {
//           const apiData = {
//             has_experience: true,
//             company_name: experience.location,
//             designation: experience.designation,
//             employer_location: experience.location,
//             employer_id: experience.empId || null,
//             rm_contact_no: experience.rmContactNo || null,
//             hr_email: experience.hrEmailId || null,
//             period_from: experience.periodFrom,
//             period_to: experience.periodTo,
//             ctc: parseFloat(experience.ctc),
//             reason_for_leaving: experience.reasonForLeaving || "Not specified",
//             uan_number: experience.uanNumber || null
//           };

//           await apiRequest(`/users/Professional_Experience/${experienceEmployeeId}`, {
//             method: 'POST',
//             body: JSON.stringify(apiData)
//           });
//         }

//         setExperienceSuccess(true);
//         setErrors(prev => ({ ...prev, experienceGeneral: "" }));

//         // CALL PARENT UPDATE
//         if (onDataUpdate) {
//             onDataUpdate({
//                 has_experience: true,
//                 professionalExperience: validExperiences
//             });
//         }
//       }

//       if (experienceSuccess || (!errors.experienceGeneral)) {
//         toast({
//           title: (
//             <div className="flex items-center gap-2">
//               <CheckCircle className="h-5 w-5 text-green-500" />
//               <span>Professional Experience Updated</span>
//             </div>
//           ),
//           description: noProfessionalExperience ? "No experience recorded." : "Experience records saved successfully.",
//           className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
//         });
//       }

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
//                         Company
//                       </Label>
//                       <Input
//                         value={experience.location}
//                         onChange={(e) => handleProfessionalExperienceChange(index, 'location', e.target.value)}
//                         placeholder="Enter company"
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

//         <Card className={`bg-gradient-to-r ${darkMode ? 'from-gray-800 to-gray-700 border-gray-600' : 'from-gray-50 to-slate-50 border-gray-200'} p-6`}>
//           <div className="text-center">
//             <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>
//               ISCS Technologies Private Limited
//             </h3>
//             <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>TRUSTED IT CONSULTING PARTNER</p>
//           </div>
//         </Card>

//         {/* <div className="flex justify-between pt-6">
//           <Button
//             type="button"
//             onClick={onBack}
//             variant="outline"
//             className={`px-8 py-3 flex items-center gap-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
//           >
//             <ArrowLeft size={16} />
//             Back
//           </Button> */}
//               <div className="flex justify-between pt-6">
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
  X,
  MapPin
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
  
  const [trainingSuccess, setTrainingSuccess] = useState(false);
  const [experienceSuccess, setExperienceSuccess] = useState(false);
  
  const [trainingEmployeeId, setTrainingEmployeeId] = useState("");
  const [experienceEmployeeId, setExperienceEmployeeId] = useState("");
  
  // Initialize flags from props or default to true
  const [noTrainingExperience, setNoTrainingExperience] = useState(initialData.has_training === false);
  const [noProfessionalExperience, setNoProfessionalExperience] = useState(initialData.has_experience === false);

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

  const isAnySectionCompleted = trainingSuccess || experienceSuccess || noTrainingExperience || noProfessionalExperience;

  return (
    <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>Professional Training & Experience</h1>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Complete your professional training and work experience details</p>
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