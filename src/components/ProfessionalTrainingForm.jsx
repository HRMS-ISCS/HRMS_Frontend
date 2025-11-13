// //ProfessionalTrainingForm.jsx
// import React, { useState, useEffect } from "react";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { 
//   GraduationCap, 
//   Briefcase, 
//   Heart, 
//   ArrowLeft, 
//   ArrowRight, 
//   Plus,
//   Trash2,
//   Building,
//   Calendar,
//   DollarSign,
//   Save,
//   CheckCircle,
//   AlertCircle
// } from "lucide-react";

// export default function ProfessionalTrainingForm({ initialData, generatedEmployeeId, onSubmit, onBack }) {
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
//           reasonForLeaving: ""
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

//   const handleOtherInterestsChange = (index, value) => {
//     setFormData(prev => ({
//       ...prev,
//       otherInterests: prev.otherInterests.map((interest, i) =>
//         i === index ? value : interest
//       )
//     }));
//   };

//   // API Submit Functions
//   const submitProfessionalTraining = async () => {
//     if (!trainingEmployeeId.trim()) {
//       setErrors(prev => ({ ...prev, trainingEmployeeId: "Employee ID is required" }));
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

//         const response = await fetch(`http://127.0.0.1:8000/users/Professional_Training/${trainingEmployeeId}`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(apiData)
//         });

//         if (response.ok) {
//           successCount++;
//         }
//       }

//       if (successCount > 0) {
//         setTrainingSuccess(true);
//         setErrors(prev => ({ ...prev, trainingGeneral: "" }));
//         alert(`Professional training saved successfully! (${successCount} training records)`);
//       } else {
//         setErrors(prev => ({ ...prev, trainingGeneral: 'Failed to save training records' }));
//       }
//     } catch (error) {
//       console.error('Training API Error:', error);
//       setErrors(prev => ({ ...prev, trainingGeneral: 'Failed to connect to server' }));
//     } finally {
//       setTrainingLoading(false);
//     }
//   };

//   const submitProfessionalExperience = async () => {
//     if (!experienceEmployeeId.trim()) {
//       setErrors(prev => ({ ...prev, experienceEmployeeId: "Employee ID is required" }));
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
//           company_name: experience.location, // Using location as company name since that seems to be the intent
//           designation: experience.designation,
//           employer_location: experience.location,
//           employer_id: experience.empId || null,
//           rm_contact_no: experience.rmContactNo || null,
//           hr_email: experience.hrEmailId || null,
//           period_from: experience.periodFrom,
//           period_to: experience.periodTo,
//           ctc: parseFloat(experience.ctc),
//           reason_for_leaving: experience.reasonForLeaving || "Not specified"
//         };

//         const response = await fetch(`http://127.0.0.1:8000/users/Professional_Experience/${experienceEmployeeId}`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(apiData)
//         });

//         if (response.ok) {
//           successCount++;
//         }
//       }

//       if (successCount > 0) {
//         setExperienceSuccess(true);
//         setErrors(prev => ({ ...prev, experienceGeneral: "" }));
//         alert(`Professional experience saved successfully! (${successCount} experience records)`);
//       } else {
//         setErrors(prev => ({ ...prev, experienceGeneral: 'Failed to save experience records' }));
//       }
//     } catch (error) {
//       console.error('Experience API Error:', error);
//       setErrors(prev => ({ ...prev, experienceGeneral: 'Failed to connect to server' }));
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

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">Professional Training & Experience</h1>
//         <p className="text-gray-600">Complete your professional training and work experience details</p>
//       </div>

//       {/* Global Employee ID Display if available */}
//       {generatedEmployeeId && (
//         <div className="text-center mb-6">
//           <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full shadow-sm">
//             <CheckCircle size={20} className="text-green-600" />
//             <span className="text-gray-700 font-medium">Auto-filled Employee ID:</span>
//             <span className="text-lg font-bold text-green-700">{generatedEmployeeId}</span>
//           </div>
//         </div>
//       )}

//       <div className="space-y-8">
//         {/* Professional Training Section */}
//         <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-2">
//               <GraduationCap className="text-purple-600" size={20} />
//               <h2 className="text-xl font-semibold text-gray-800">Professional Training</h2>
//             </div>
//             <div className="flex items-center gap-4">
//               {trainingSuccess && <CheckCircle className="text-green-600" size={20} />}
//               <Button
//                 type="button"
//                 onClick={addProfessionalTraining}
//                 variant="outline"
//                 size="sm"
//                 className="flex items-center gap-2"
//               >
//                 <Plus size={16} />
//                 Add Training
//               </Button>
//             </div>
//           </div>
          
//           {/* Employee ID Input for Training */}
//           <div className="mb-4">
//             <Label htmlFor="trainingEmployeeId" className="text-gray-700 font-medium">
//               Employee ID {generatedEmployeeId ? '(Auto-filled)' : '*'}
//             </Label>
//             <Input
//               id="trainingEmployeeId"
//               value={trainingEmployeeId}
//               onChange={(e) => setTrainingEmployeeId(e.target.value)}
//               placeholder="Enter employee ID"
//               className={`${errors.trainingEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 'bg-green-50 border-green-300' : ''}`}
//               readOnly={!!generatedEmployeeId}
//             />
//             {errors.trainingEmployeeId && <p className="text-sm text-red-600">{errors.trainingEmployeeId}</p>}
//             {generatedEmployeeId && (
//               <p className="text-xs text-green-600 mt-1">✓ Auto-filled from previous step</p>
//             )}
//           </div>
          
//           <div className="space-y-6 mb-6">
//             {formData.professionalTraining.map((training, index) => (
//               <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white relative">
//                 {formData.professionalTraining.length > 1 && (
//                   <Button
//                     type="button"
//                     onClick={() => removeProfessionalTraining(index)}
//                     variant="outline"
//                     size="sm"
//                     className="absolute top-2 right-2 text-red-600 hover:text-red-700"
//                   >
//                     <Trash2 size={16} />
//                   </Button>
//                 )}
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label className="text-gray-700 font-medium text-sm">
//                       {index + 1}. Institute Name *
//                     </Label>
//                     <Textarea
//                       value={training.instituteName}
//                       onChange={(e) => handleProfessionalTrainingChange(index, 'instituteName', e.target.value)}
//                       placeholder="Enter institute name"
//                       className="text-sm min-h-[80px]"
//                       rows={3}
//                     />
//                   </div>

//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <Label className="text-gray-700 font-medium text-sm">
//                         Duration *
//                       </Label>
//                       <Input
//                         value={training.duration}
//                         onChange={(e) => handleProfessionalTrainingChange(index, 'duration', e.target.value)}
//                         placeholder="e.g., 3 months, 6 weeks"
//                         className="text-sm"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className="text-gray-700 font-medium text-sm">
//                         Area of Training *
//                       </Label>
//                       <Input
//                         value={training.areaOfTraining}
//                         onChange={(e) => handleProfessionalTrainingChange(index, 'areaOfTraining', e.target.value)}
//                         placeholder="e.g., Web Development, Data Science"
//                         className="text-sm"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {errors.trainingGeneral && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
//               <AlertCircle className="text-red-600" size={16} />
//               <p className="text-sm text-red-600">{errors.trainingGeneral}</p>
//             </div>
//           )}

//           <Button
//             onClick={submitProfessionalTraining}
//             disabled={trainingLoading}
//             className="w-full bg-purple-600 hover:bg-purple-700 text-white"
//           >
//             {trainingLoading ? (
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                 Saving Training Details...
//               </div>
//             ) : (
//               <>
//                 <Save size={16} className="mr-2" />
//                 Save Professional Training
//               </>
//             )}
//           </Button>
//         </Card>

//         {/* Professional Experience Section */}
//         <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-2">
//               <Briefcase className="text-blue-600" size={20} />
//               <h2 className="text-xl font-semibold text-gray-800">Professional Experience</h2>
//             </div>
//             <div className="flex items-center gap-4">
//               {experienceSuccess && <CheckCircle className="text-green-600" size={20} />}
//               <Button
//                 type="button"
//                 onClick={addProfessionalExperience}
//                 variant="outline"
//                 size="sm"
//                 className="flex items-center gap-2"
//               >
//                 <Plus size={16} />
//                 Add Experience
//               </Button>
//             </div>
//           </div>
          
//           {/* Employee ID Input for Experience */}
//           <div className="mb-4">
//             <Label htmlFor="experienceEmployeeId" className="text-gray-700 font-medium">
//               Employee ID {generatedEmployeeId ? '(Auto-filled)' : '*'}
//             </Label>
//             <Input
//               id="experienceEmployeeId"
//               value={experienceEmployeeId}
//               onChange={(e) => setExperienceEmployeeId(e.target.value)}
//               placeholder="Enter employee ID"
//               className={`${errors.experienceEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 'bg-green-50 border-green-300' : ''}`}
//               readOnly={!!generatedEmployeeId}
//             />
//             {errors.experienceEmployeeId && <p className="text-sm text-red-600">{errors.experienceEmployeeId}</p>}
//             {generatedEmployeeId && (
//               <p className="text-xs text-green-600 mt-1">✓ Auto-filled from previous step</p>
//             )}
//           </div>
          
//           <p className="text-sm text-gray-600 mb-6">• Beginning with last employment</p>

//           <div className="space-y-6 mb-6">
//             {formData.professionalExperience.map((experience, index) => (
//               <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white relative">
//                 {formData.professionalExperience.length > 1 && (
//                   <Button
//                     type="button"
//                     onClick={() => removeProfessionalExperience(index)}
//                     variant="outline"
//                     size="sm"
//                     className="absolute top-2 right-2 text-red-600 hover:text-red-700"
//                   >
//                     <Trash2 size={16} />
//                   </Button>
//                 )}
                
//                 <h3 className="text-lg font-medium text-gray-800 mb-4">{index + 1}. Employer Details</h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   <div className="space-y-2">
//                     <Label className="text-gray-700 font-medium text-sm">
//                       Company/Location *
//                     </Label>
//                     <Input
//                       value={experience.location}
//                       onChange={(e) => handleProfessionalExperienceChange(index, 'location', e.target.value)}
//                       placeholder="Enter company/location"
//                       className="text-sm"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-gray-700 font-medium text-sm">
//                       Emp. ID
//                     </Label>
//                     <Input
//                       value={experience.empId}
//                       onChange={(e) => handleProfessionalExperienceChange(index, 'empId', e.target.value)}
//                       placeholder="Enter employee ID"
//                       className="text-sm"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-gray-700 font-medium text-sm">
//                       R.M Contact No.
//                     </Label>
//                     <Input
//                       value={experience.rmContactNo}
//                       onChange={(e) => handleProfessionalExperienceChange(index, 'rmContactNo', e.target.value)}
//                       placeholder="Enter contact number"
//                       className="text-sm"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-gray-700 font-medium text-sm">
//                       HR Email ID
//                     </Label>
//                     <Input
//                       type="email"
//                       value={experience.hrEmailId}
//                       onChange={(e) => handleProfessionalExperienceChange(index, 'hrEmailId', e.target.value)}
//                       placeholder="Enter HR email"
//                       className="text-sm"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-gray-700 font-medium text-sm">
//                       Designation *
//                     </Label>
//                     <Input
//                       value={experience.designation}
//                       onChange={(e) => handleProfessionalExperienceChange(index, 'designation', e.target.value)}
//                       placeholder="Enter designation"
//                       className="text-sm"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-gray-700 font-medium text-sm flex items-center gap-2">
//                       <DollarSign size={16} className="text-gray-500" />
//                       CTC *
//                     </Label>
//                     <Input
//                       type="number"
//                       step="0.01"
//                       value={experience.ctc}
//                       onChange={(e) => handleProfessionalExperienceChange(index, 'ctc', e.target.value)}
//                       placeholder="Enter CTC amount"
//                       className="text-sm"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-gray-700 font-medium text-sm flex items-center gap-2">
//                       <Calendar size={16} className="text-gray-500" />
//                       Period From *
//                     </Label>
//                     <Input
//                       type="date"
//                       value={experience.periodFrom}
//                       onChange={(e) => handleProfessionalExperienceChange(index, 'periodFrom', e.target.value)}
//                       className="text-sm"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-gray-700 font-medium text-sm flex items-center gap-2">
//                       <Calendar size={16} className="text-gray-500" />
//                       Period To *
//                     </Label>
//                     <Input
//                       type="date"
//                       value={experience.periodTo}
//                       onChange={(e) => handleProfessionalExperienceChange(index, 'periodTo', e.target.value)}
//                       className="text-sm"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-gray-700 font-medium text-sm">
//                       Reason For Leaving
//                     </Label>
//                     <Input
//                       value={experience.reasonForLeaving}
//                       onChange={(e) => handleProfessionalExperienceChange(index, 'reasonForLeaving', e.target.value)}
//                       placeholder="Enter reason"
//                       className="text-sm"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {errors.experienceGeneral && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
//               <AlertCircle className="text-red-600" size={16} />
//               <p className="text-sm text-red-600">{errors.experienceGeneral}</p>
//             </div>
//           )}

//           <Button
//             onClick={submitProfessionalExperience}
//             disabled={experienceLoading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             {experienceLoading ? (
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                 Saving Experience Details...
//               </div>
//             ) : (
//               <>
//                 <Save size={16} className="mr-2" />
//                 Save Professional Experience
//               </>
//             )}
//           </Button>
//         </Card>

//         {/* Other Interests Section */}
//         <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
//           <div className="flex items-center gap-2 mb-6">
//             <Heart className="text-green-600" size={20} />
//             <h2 className="text-xl font-semibold text-gray-800">Other Interests</h2>
//           </div>
          
//           <p className="text-sm text-gray-600 mb-6">Hobbies, Extra-Curricular activities, Leisure during & after education</p>

//           <div className="space-y-4">
//             {formData.otherInterests.map((interest, index) => (
//               <div key={index} className="space-y-2">
//                 <Label className="text-gray-700 font-medium text-sm">
//                   {index + 1}.
//                 </Label>
//                 <Textarea
//                   value={interest}
//                   onChange={(e) => handleOtherInterestsChange(index, e.target.value)}
//                   placeholder={`Enter interest/hobby ${index + 1}`}
//                   className="text-sm"
//                   rows={3}
//                 />
//               </div>
//             ))}
//           </div>
//         </Card>

//         {/* Company Info Card */}
//         <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 p-6">
//           <div className="text-center">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">
//               ISCS Technologies Private Limited
//             </h3>
//             <p className="text-sm text-gray-600">TRUSTED IT CONSULTING PARTNER</p>
//           </div>
//         </Card>

//         {/* Action Buttons */}
//         <div className="flex justify-between pt-6">
//           <Button
//             type="button"
//             onClick={onBack}
//             variant="outline"
//             className="px-8 py-3 flex items-center gap-2"
//           >
//             <ArrowLeft size={16} />
//             Back
//           </Button>
          
//           <Button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
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
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  GraduationCap, 
  Briefcase, 
  Heart, 
  ArrowLeft, 
  ArrowRight, 
  Plus,
  Trash2,
  Building,
  Calendar,
  DollarSign,
  Save,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function ProfessionalTrainingForm({ initialData, generatedEmployeeId, onSubmit, onBack }) {
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
          uanNumber: "" // Added UAN field
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

  const handleOtherInterestsChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      otherInterests: prev.otherInterests.map((interest, i) =>
        i === index ? value : interest
      )
    }));
  };

  // API Submit Functions
  const submitProfessionalTraining = async () => {
    if (!trainingEmployeeId.trim()) {
      setErrors(prev => ({ ...prev, trainingEmployeeId: "Employee ID is required" }));
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

        const response = await fetch(`http://127.0.0.1:8000/users/Professional_Training/${trainingEmployeeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData)
        });

        if (response.ok) {
          successCount++;
        }
      }

      if (successCount > 0) {
        setTrainingSuccess(true);
        setErrors(prev => ({ ...prev, trainingGeneral: "" }));
        alert(`Professional training saved successfully! (${successCount} training records)`);
      } else {
        setErrors(prev => ({ ...prev, trainingGeneral: 'Failed to save training records' }));
      }
    } catch (error) {
      console.error('Training API Error:', error);
      setErrors(prev => ({ ...prev, trainingGeneral: 'Failed to connect to server' }));
    } finally {
      setTrainingLoading(false);
    }
  };

  const submitProfessionalExperience = async () => {
    if (!experienceEmployeeId.trim()) {
      setErrors(prev => ({ ...prev, experienceEmployeeId: "Employee ID is required" }));
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
          company_name: experience.location, // Using location as company name since that seems to be the intent
          designation: experience.designation,
          employer_location: experience.location,
          employer_id: experience.empId || null,
          rm_contact_no: experience.rmContactNo || null,
          hr_email: experience.hrEmailId || null,
          period_from: experience.periodFrom,
          period_to: experience.periodTo,
          ctc: parseFloat(experience.ctc),
          reason_for_leaving: experience.reasonForLeaving || "Not specified",
          uan_number: experience.uanNumber || null // Added UAN field
        };

        const response = await fetch(`http://127.0.0.1:8000/users/Professional_Experience/${experienceEmployeeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData)
        });

        if (response.ok) {
          successCount++;
        }
      }

      if (successCount > 0) {
        setExperienceSuccess(true);
        setErrors(prev => ({ ...prev, experienceGeneral: "" }));
        alert(`Professional experience saved successfully! (${successCount} experience records)`);
      } else {
        setErrors(prev => ({ ...prev, experienceGeneral: 'Failed to save experience records' }));
      }
    } catch (error) {
      console.error('Experience API Error:', error);
      setErrors(prev => ({ ...prev, experienceGeneral: 'Failed to connect to server' }));
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Professional Training & Experience</h1>
        <p className="text-gray-600">Complete your professional training and work experience details</p>
      </div>

      {/* Global Employee ID Display if available */}
      {generatedEmployeeId && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full shadow-sm">
            <CheckCircle size={20} className="text-green-600" />
            <span className="text-gray-700 font-medium">Auto-filled Employee ID:</span>
            <span className="text-lg font-bold text-green-700">{generatedEmployeeId}</span>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Professional Training Section */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="text-purple-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Professional Training</h2>
            </div>
            <div className="flex items-center gap-4">
              {trainingSuccess && <CheckCircle className="text-green-600" size={20} />}
              <Button
                type="button"
                onClick={addProfessionalTraining}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Training
              </Button>
            </div>
          </div>
          
          {/* Employee ID Input for Training */}
          <div className="mb-4">
            <Label htmlFor="trainingEmployeeId" className="text-gray-700 font-medium">
              Employee ID {generatedEmployeeId ? '(Auto-filled)' : '*'}
            </Label>
            <Input
              id="trainingEmployeeId"
              value={trainingEmployeeId}
              onChange={(e) => setTrainingEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              className={`${errors.trainingEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 'bg-green-50 border-green-300' : ''}`}
              readOnly={!!generatedEmployeeId}
            />
            {errors.trainingEmployeeId && <p className="text-sm text-red-600">{errors.trainingEmployeeId}</p>}
            {generatedEmployeeId && (
              <p className="text-xs text-green-600 mt-1">✓ Auto-filled from previous step</p>
            )}
          </div>
          
          <div className="space-y-6 mb-6">
            {formData.professionalTraining.map((training, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white relative">
                {formData.professionalTraining.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeProfessionalTraining(index)}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      {index + 1}. Institute Name *
                    </Label>
                    <Textarea
                      value={training.instituteName}
                      onChange={(e) => handleProfessionalTrainingChange(index, 'instituteName', e.target.value)}
                      placeholder="Enter institute name"
                      className="text-sm min-h-[80px]"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Duration *
                      </Label>
                      <Input
                        value={training.duration}
                        onChange={(e) => handleProfessionalTrainingChange(index, 'duration', e.target.value)}
                        placeholder="e.g., 3 months, 6 weeks"
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Area of Training *
                      </Label>
                      <Input
                        value={training.areaOfTraining}
                        onChange={(e) => handleProfessionalTrainingChange(index, 'areaOfTraining', e.target.value)}
                        placeholder="e.g., Web Development, Data Science"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.trainingGeneral && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-red-600" size={16} />
              <p className="text-sm text-red-600">{errors.trainingGeneral}</p>
            </div>
          )}

          <Button
            onClick={submitProfessionalTraining}
            disabled={trainingLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {trainingLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving Training Details...
              </div>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Professional Training
              </>
            )}
          </Button>
        </Card>

        {/* Professional Experience Section */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Briefcase className="text-blue-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Professional Experience</h2>
            </div>
            <div className="flex items-center gap-4">
              {experienceSuccess && <CheckCircle className="text-green-600" size={20} />}
              <Button
                type="button"
                onClick={addProfessionalExperience}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Experience
              </Button>
            </div>
          </div>
          
          {/* Employee ID Input for Experience */}
          <div className="mb-4">
            <Label htmlFor="experienceEmployeeId" className="text-gray-700 font-medium">
              Employee ID {generatedEmployeeId ? '(Auto-filled)' : '*'}
            </Label>
            <Input
              id="experienceEmployeeId"
              value={experienceEmployeeId}
              onChange={(e) => setExperienceEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              className={`${errors.experienceEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 'bg-green-50 border-green-300' : ''}`}
              readOnly={!!generatedEmployeeId}
            />
            {errors.experienceEmployeeId && <p className="text-sm text-red-600">{errors.experienceEmployeeId}</p>}
            {generatedEmployeeId && (
              <p className="text-xs text-green-600 mt-1">✓ Auto-filled from previous step</p>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-6">• Beginning with last employment</p>

          <div className="space-y-6 mb-6">
            {formData.professionalExperience.map((experience, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white relative">
                {formData.professionalExperience.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeProfessionalExperience(index)}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
                
                <h3 className="text-lg font-medium text-gray-800 mb-4">{index + 1}. Employer Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Company/Location *
                    </Label>
                    <Input
                      value={experience.location}
                      onChange={(e) => handleProfessionalExperienceChange(index, 'location', e.target.value)}
                      placeholder="Enter company/location"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Emp. ID
                    </Label>
                    <Input
                      value={experience.empId}
                      onChange={(e) => handleProfessionalExperienceChange(index, 'empId', e.target.value)}
                      placeholder="Enter employee ID"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      R.M Contact No.
                    </Label>
                    <Input
                      value={experience.rmContactNo}
                      onChange={(e) => handleProfessionalExperienceChange(index, 'rmContactNo', e.target.value)}
                      placeholder="Enter contact number"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      HR Email ID
                    </Label>
                    <Input
                      type="email"
                      value={experience.hrEmailId}
                      onChange={(e) => handleProfessionalExperienceChange(index, 'hrEmailId', e.target.value)}
                      placeholder="Enter HR email"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Designation *
                    </Label>
                    <Input
                      value={experience.designation}
                      onChange={(e) => handleProfessionalExperienceChange(index, 'designation', e.target.value)}
                      placeholder="Enter designation"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-500" />
                      CTC *
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={experience.ctc}
                      onChange={(e) => handleProfessionalExperienceChange(index, 'ctc', e.target.value)}
                      placeholder="Enter CTC amount"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      Period From *
                    </Label>
                    <Input
                      type="date"
                      value={experience.periodFrom}
                      onChange={(e) => handleProfessionalExperienceChange(index, 'periodFrom', e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      Period To *
                    </Label>
                    <Input
                      type="date"
                      value={experience.periodTo}
                      onChange={(e) => handleProfessionalExperienceChange(index, 'periodTo', e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      UAN Number
                    </Label>
                    <Input
                      value={experience.uanNumber}
                      onChange={(e) => handleProfessionalExperienceChange(index, 'uanNumber', e.target.value)}
                      placeholder="Enter UAN number"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2 lg:col-span-3">
                    <Label className="text-gray-700 font-medium text-sm">
                      Reason For Leaving
                    </Label>
                    <Input
                      value={experience.reasonForLeaving}
                      onChange={(e) => handleProfessionalExperienceChange(index, 'reasonForLeaving', e.target.value)}
                      placeholder="Enter reason"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.experienceGeneral && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-red-600" size={16} />
              <p className="text-sm text-red-600">{errors.experienceGeneral}</p>
            </div>
          )}

          <Button
            onClick={submitProfessionalExperience}
            disabled={experienceLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {experienceLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving Experience Details...
              </div>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Professional Experience
              </>
            )}
          </Button>
        </Card>

        {/* Other Interests Section */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <div className="flex items-center gap-2 mb-6">
            <Heart className="text-green-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Other Interests</h2>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">Hobbies, Extra-Curricular activities, Leisure during & after education</p>

          <div className="space-y-4">
            {formData.otherInterests.map((interest, index) => (
              <div key={index} className="space-y-2">
                <Label className="text-gray-700 font-medium text-sm">
                  {index + 1}.
                </Label>
                <Textarea
                  value={interest}
                  onChange={(e) => handleOtherInterestsChange(index, e.target.value)}
                  placeholder={`Enter interest/hobby ${index + 1}`}
                  className="text-sm"
                  rows={3}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Company Info Card */}
        <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ISCS Technologies Private Limited
            </h3>
            <p className="text-sm text-gray-600">TRUSTED IT CONSULTING PARTNER</p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="px-8 py-3 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
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