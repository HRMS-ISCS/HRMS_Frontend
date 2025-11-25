// // RegisterPage.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { CheckCircle2, Lock } from "lucide-react";
// import { Toaster } from "@/components/ui/toaster"; // Import Toaster
// import EmploymentApplicationForm from "./EmploymentApplicationForm";
// import PersonalProfileForm from "./PersonalProfileForm";
// import BankAndFamilyForm from "./BankAndFamilyForm";
// import ProfessionalTrainingForm from "./ProfessionalTrainingForm";
// import ProfessionalReferencesForm from "./ProfessionalReferencesForm";
// import DeclarationForm from "./DeclarationForm";

// export default function RegisterPage() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [slideDirection, setSlideDirection] = useState("");
//   const [generatedEmployeeId, setGeneratedEmployeeId] = useState("");
//   const [unlockedSteps, setUnlockedSteps] = useState([1]); // Initially only step 1 is unlocked
//   const [formData, setFormData] = useState({
//     // Employment Application Data
//     employmentApplication: {
//       name: "",
//       employeeId: "",
//       email: "",
//       phone: "",
//       dateOfJoining: "",
//       position: "",
//       clientName: "",
//       skillSet: "",
//       generatedEmployeeId: "",
//     },
//     // Personal Profile Data
//     personalProfile: {
//       firstName: "",
//       middleName: "",
//       lastName: "",
//       dateOfBirth: "",
//       gender: "",
//       bloodGroup: "",
//       nationality: "",
//       currentAddress: "",
//       permanentAddress: "",
//       currentDistrict: "",
//       currentCity: "",
//       currentState: "",
//       currentPinCode: "",
//       permanentDistrict: "",
//       permanentCity: "",
//       permanentState: "",
//       permanentPinCode: "",
//       mobilePhone: "",
//       email: "",
//       telephone: "",
//       emergencyName: "",
//       emergencyRelation: "",
//       emergencyMobile: "",
//       emergencyEmail: "",
//       aadharNumber: "",
//       panNumber: "",
//       passportNumber: "",
//       uanNumber: "",
//       esiNumber: "",
//       photo: null,
//     },
//     // Bank and Family Data
//     bankAndFamily: {
//       // Bank Details
//       bankName: "",
//       branch: "",
//       accountNumber: "",
//       ifscCode: "",
//       // Family Background
//       maritalStatus: "",
//       marriageDate: "",
//       familyMembers: {
//         employee: { name: "", gender: "", dateOfBirth: "", age: "" },
//         spouse: { name: "", gender: "", dateOfBirth: "", age: "" },
//         child1: { name: "", gender: "", dateOfBirth: "", age: "" },
//         child2: { name: "", gender: "", dateOfBirth: "", age: "" },
//         father: { name: "", gender: "", dateOfBirth: "", age: "" },
//         mother: { name: "", gender: "", dateOfBirth: "", age: "" },
//       },
//       // Academic Background
//       academicQualifications: [
//         {
//           qualification: "",
//           specification: "",
//           instituteName: "",
//           instituteAddress: "",
//           yearOfPassing: "",
//           durationFrom: "",
//           durationTo: "",
//           rankGradePercentage: "",
//         },
//       ],
//     },
//     // Professional Training & Experience Data
//     professionalTraining: {
//       // Professional Training
//       professionalTraining: [
//         {
//           instituteName: "",
//           instituteAddress: "",
//           duration: "",
//           areaOfTraining: "",
//         },
//       ],
//       // Professional Experience
//       professionalExperience: [
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
//            uanNumber: "",
//         },
//       ],
//       // Other Interests
//       otherInterests: ["", ""],
//     },
//     // Professional References Data
//     professionalReferences: {
//       // Professional References
//       professionalReferences: [
//         {
//           name: "",
//           designation: "",
//           company: "",
//           address: "",
//           phoneNumber: "",
//           email: "",
//           knownPeriod: "",
//           capacity: "",
//         },
//         {
//           name: "",
//           designation: "",
//           company: "",
//           address: "",
//           phoneNumber: "",
//           email: "",
//           knownPeriod: "",
//           capacity: "",
//         },
//       ],
//       // Employee Referral
//       employeeReferral: {
//         isReferred: "",
//         name: "",
//         phoneNumber: "",
//       },
//       // About Self
//       aboutSelf: {
//         careerAmbition: "",
//         achievements: "",
//         professionalFailures: "",
//       },
//       // Strengths and Weaknesses
//       strengths: ["", "", ""],
//       weaknesses: ["", "", ""],
//     },
//     // Declaration Data
//     declaration: {
//       place: "",
//       date: "",
//       applicantName: "",
//       signature: "",
//     },
//   });

//   const navigate = useNavigate();

//   // Scroll to top when component mounts or step changes
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [currentStep]);

//   // Enhanced navigation function with smooth transitions
//   const navigateToStep = (targetStep) => {
//     // Check if the target step is unlocked
//     if (!unlockedSteps.includes(targetStep)) {
//       // Step is locked, don't navigate
//       return;
//     }

//     if (targetStep === currentStep || isTransitioning) return;

//     setIsTransitioning(true);

//     // Determine slide direction
//     if (targetStep > currentStep) {
//       setSlideDirection("slide-left");
//     } else {
//       setSlideDirection("slide-right");
//     }

//     // Start transition
//     setTimeout(() => {
//       setCurrentStep(targetStep);
//       // Scroll to top after changing step
//       window.scrollTo(0, 0);

//       // Complete transition
//       setTimeout(() => {
//         setSlideDirection("");
//         setIsTransitioning(false);
//       }, 50);
//     }, 300);
//   };

//   const handleEmploymentFormSubmit = (data) => {
//     // Extract and store the generated employee ID
//     if (data.generatedEmployeeId) {
//       setGeneratedEmployeeId(data.generatedEmployeeId);
//     }

//     setFormData((prev) => ({
//       ...prev,
//       employmentApplication: data,
//     }));
    
//     // Unlock step 2 and navigate in one go
//     const newUnlockedSteps = [...unlockedSteps, 2];
//     setUnlockedSteps(newUnlockedSteps);
    
//     // Use flushSync to ensure state is updated before navigation
//     setTimeout(() => {
//       navigateToStep(2);
//     }, 0);
//   };

//   const handlePersonalProfileSubmit = (data) => {
//     setFormData((prev) => ({
//       ...prev,
//       personalProfile: data,
//     }));
    
//     // Unlock step 3 and navigate in one go
//     const newUnlockedSteps = [...unlockedSteps, 3];
//     setUnlockedSteps(newUnlockedSteps);
    
//     // Use flushSync to ensure state is updated before navigation
//     setTimeout(() => {
//       navigateToStep(3);
//     }, 0);
//   };

//   const handleBankAndFamilySubmit = (data) => {
//     setFormData((prev) => ({
//       ...prev,
//       bankAndFamily: data,
//     }));
    
//     // Unlock step 4 and navigate in one go
//     const newUnlockedSteps = [...unlockedSteps, 4];
//     setUnlockedSteps(newUnlockedSteps);
    
//     // Use flushSync to ensure state is updated before navigation
//     setTimeout(() => {
//       navigateToStep(4);
//     }, 0);
//   };

//   // New function to handle academic background submission
//   const handleAcademicSubmit = () => {
//     // Unlock step 4 when academic background is submitted
//     if (!unlockedSteps.includes(4)) {
//       const newUnlockedSteps = [...unlockedSteps, 4];
//       setUnlockedSteps(newUnlockedSteps);
//     }
//   };

//   const handleProfessionalTrainingSubmit = (data) => {
//     setFormData((prev) => ({
//       ...prev,
//       professionalTraining: data,
//     }));
    
//     // Unlock step 5 and navigate in one go
//     const newUnlockedSteps = [...unlockedSteps, 5];
//     setUnlockedSteps(newUnlockedSteps);
    
//     // Use flushSync to ensure state is updated before navigation
//     setTimeout(() => {
//       navigateToStep(5);
//     }, 0);
//   };

//   const handleProfessionalReferencesSubmit = (data) => {
//     setFormData((prev) => ({
//       ...prev,
//       professionalReferences: data,
//     }));
    
//     // Unlock step 6 and navigate in one go
//     const newUnlockedSteps = [...unlockedSteps, 6];
//     setUnlockedSteps(newUnlockedSteps);
    
//     // Use flushSync to ensure state is updated before navigation
//     setTimeout(() => {
//       navigateToStep(6);
//     }, 0);
//   };

//   const handleDeclarationSubmit = (data) => {
//     const completeFormData = {
//       ...formData,
//       declaration: data,
//     };

//     // Here you would typically submit the complete form data to your backend
//     console.log("Complete form data:", completeFormData);

//     // For now, just navigate back to dashboard
//     alert(
//       "Application submitted successfully! Thank you for registering with ISCS Technologies."
//     );
//     navigate("/employees");
//   };

//   const handleBack = () => {
//     if (currentStep === 1) {
//       navigate("/employees");
//     } else {
//       navigateToStep(currentStep - 1);
//     }
//   };

//   const steps = [
//     { id: 1, title: "Employment" },
//     { id: 2, title: "Personal" },
//     { id: 3, title: "Bank & Family" },
//     { id: 4, title: "Training" },
//     { id: 5, title: "References" },
//     { id: 6, title: "Declaration" },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
//       <style jsx>{`
//         .page-container {
//           position: relative;
//           overflow: hidden;
//         }
//         .page-content {
//           transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
//           transform-origin: center;
//         }
//         .slide-left {
//           transform: translateX(-100%) rotateY(-15deg);
//           opacity: 0;
//         }
//         .slide-right {
//           transform: translateX(100%) rotateY(15deg);
//           opacity: 0;
//         }
//       `}</style>

//       {/* Simple Header */}
//       <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             <h1 className="text-lg font-medium text-gray-700">
//               Employee Registration
//             </h1>
            
//             {/* Centered Progress Dots with Numbers */}
//             <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
//               {steps.map((step) => {
//                 const isCompleted = currentStep > step.id;
//                 const isCurrent = currentStep === step.id;
//                 const isUnlocked = unlockedSteps.includes(step.id);
                
//                 return (
//                   <button
//                     key={step.id}
//                     onClick={() => navigateToStep(step.id)}
//                     className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
//                       isCompleted
//                         ? "bg-green-400 text-white"
//                         : isCurrent
//                         ? "bg-blue-500 text-white"
//                         : isUnlocked
//                         ? "bg-gray-200 text-gray-500 hover:bg-gray-300"
//                         : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     }`}
//                     title={isUnlocked ? step.title : `Complete step ${step.id - 1} to unlock`}
//                   >
//                     {isCompleted ? (
//                       <CheckCircle2 size={14} />
//                     ) : isUnlocked ? (
//                       step.id
//                     ) : (
//                       <Lock size={14} className="text-red-500" />
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
            
//             {/* Spacer to balance the layout */}
//             <div className="w-32"></div>
//           </div>
//         </div>
//       </div>

//       {/* Employee ID Display */}
//       {generatedEmployeeId && (
//         <div className="flex justify-center mt-4">
//           <div className="bg-green-50 border border-green-200 rounded-full px-4 py-1.5 flex items-center gap-2 text-sm">
//             <CheckCircle2 className="text-green-600" size={14} />
//             <span className="font-medium text-green-700">
//               Employee ID: {generatedEmployeeId}
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Main Form Content */}
//       <div className="max-w-4xl mx-auto px-4 py-6">
//         <Card
//           className={`bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm transition-all duration-500 ${
//             isTransitioning ? "scale-95 opacity-90" : "scale-100 opacity-100"
//           }`}
//         >
//           <div className={`p-6 page-content ${slideDirection}`}>
//             {currentStep === 1 && (
//               <EmploymentApplicationForm
//                 initialData={formData.employmentApplication}
//                 onSubmit={handleEmploymentFormSubmit}
//               />
//             )}
//             {currentStep === 2 && (
//               <PersonalProfileForm
//                 initialData={formData.personalProfile}
//                 generatedEmployeeId={generatedEmployeeId}
//                 onSubmit={handlePersonalProfileSubmit}
//                 onBack={() => navigateToStep(1)}
//               />
//             )}
//             {currentStep === 3 && (
//               <BankAndFamilyForm
//                 initialData={formData.bankAndFamily}
//                 generatedEmployeeId={generatedEmployeeId}
//                 onSubmit={handleBankAndFamilySubmit}
//                 onAcademicSubmit={handleAcademicSubmit} // Pass the new callback
//                 onBack={() => navigateToStep(2)}
//               />
//             )}
//             {currentStep === 4 && (
//               <ProfessionalTrainingForm
//                 initialData={formData.professionalTraining}
//                 generatedEmployeeId={generatedEmployeeId}
//                 onSubmit={handleProfessionalTrainingSubmit}
//                 onBack={() => navigateToStep(3)}
//               />
//             )}
//             {currentStep === 5 && (
//               <ProfessionalReferencesForm
//                 initialData={formData.professionalReferences}
//                 generatedEmployeeId={generatedEmployeeId}
//                 onSubmit={handleProfessionalReferencesSubmit}
//                 onBack={() => navigateToStep(4)}
//               />
//             )}
//             {currentStep === 6 && (
//               <DeclarationForm
//                 initialData={formData.declaration}
//                 generatedEmployeeId={generatedEmployeeId}
//                 onSubmit={handleDeclarationSubmit}
//                 onBack={() => navigateToStep(5)}
//               />
//             )}
//           </div>
//         </Card>
//       </div>
      
//       {/* Add Toaster component here */}
//       <Toaster />
//     </div>
//   );
// }
// RegisterPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lock } from "lucide-react";
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { useToast } from "@/components/ui/use-toast"; // Import useToast
import EmploymentApplicationForm from "./EmploymentApplicationForm";
import PersonalProfileForm from "./PersonalProfileForm";
import BankAndFamilyForm from "./BankAndFamilyForm";
import ProfessionalTrainingForm from "./ProfessionalTrainingForm";
import ProfessionalReferencesForm from "./ProfessionalReferencesForm";
import DeclarationForm from "./DeclarationForm";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [generatedEmployeeId, setGeneratedEmployeeId] = useState("");
  const [unlockedSteps, setUnlockedSteps] = useState([1]); // Initially only step 1 is unlocked
  const [formData, setFormData] = useState({
    // Employment Application Data
    employmentApplication: {
      name: "",
      employeeId: "",
      email: "",
      phone: "",
      dateOfJoining: "",
      position: "",
      clientName: "",
      skillSet: "",
      generatedEmployeeId: "",
    },
    // Personal Profile Data
    personalProfile: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      nationality: "",
      currentAddress: "",
      permanentAddress: "",
      currentDistrict: "",
      currentCity: "",
      currentState: "",
      currentPinCode: "",
      permanentDistrict: "",
      permanentCity: "",
      permanentState: "",
      permanentPinCode: "",
      mobilePhone: "",
      email: "",
      telephone: "",
      emergencyName: "",
      emergencyRelation: "",
      emergencyMobile: "",
      emergencyEmail: "",
      aadharNumber: "",
      panNumber: "",
      passportNumber: "",
      uanNumber: "",
      esiNumber: "",
      photo: null,
    },
    // Bank and Family Data
    bankAndFamily: {
      // Bank Details
      bankName: "",
      branch: "",
      accountNumber: "",
      ifscCode: "",
      // Family Background
      maritalStatus: "",
      marriageDate: "",
      familyMembers: {
        employee: { name: "", gender: "", dateOfBirth: "", age: "" },
        spouse: { name: "", gender: "", dateOfBirth: "", age: "" },
        child1: { name: "", gender: "", dateOfBirth: "", age: "" },
        child2: { name: "", gender: "", dateOfBirth: "", age: "" },
        father: { name: "", gender: "", dateOfBirth: "", age: "" },
        mother: { name: "", gender: "", dateOfBirth: "", age: "" },
      },
      // Academic Background
      academicQualifications: [
        {
          qualification: "",
          specification: "",
          instituteName: "",
          instituteAddress: "",
          yearOfPassing: "",
          durationFrom: "",
          durationTo: "",
          rankGradePercentage: "",
        },
      ],
    },
    // Professional Training & Experience Data
    professionalTraining: {
      // Professional Training
      professionalTraining: [
        {
          instituteName: "",
          instituteAddress: "",
          duration: "",
          areaOfTraining: "",
        },
      ],
      // Professional Experience
      professionalExperience: [
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
           uanNumber: "",
        },
      ],
      // Other Interests
      otherInterests: ["", ""],
    },
    // Professional References Data
    professionalReferences: {
      // Professional References
      professionalReferences: [
        {
          name: "",
          designation: "",
          company: "",
          address: "",
          phoneNumber: "",
          email: "",
          knownPeriod: "",
          capacity: "",
        },
        {
          name: "",
          designation: "",
          company: "",
          address: "",
          phoneNumber: "",
          email: "",
          knownPeriod: "",
          capacity: "",
        },
      ],
      // Employee Referral
      employeeReferral: {
        isReferred: "",
        name: "",
        phoneNumber: "",
      },
      // About Self
      aboutSelf: {
        careerAmbition: "",
        achievements: "",
        professionalFailures: "",
      },
      // Strengths and Weaknesses
      strengths: ["", "", ""],
      weaknesses: ["", "", ""],
    },
    // Declaration Data
    declaration: {
      place: "",
      date: "",
      applicantName: "",
      signature: "",
    },
  });

  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize toast

  // Scroll to top when component mounts or step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  // Enhanced navigation function with smooth transitions
  const navigateToStep = (targetStep) => {
    // Check if target step is unlocked
    if (!unlockedSteps.includes(targetStep)) {
      // Step is locked, don't navigate
      return;
    }

    if (targetStep === currentStep || isTransitioning) return;

    setIsTransitioning(true);

    // Determine slide direction
    if (targetStep > currentStep) {
      setSlideDirection("slide-left");
    } else {
      setSlideDirection("slide-right");
    }

    // Start transition
    setTimeout(() => {
      setCurrentStep(targetStep);
      // Scroll to top after changing step
      window.scrollTo(0, 0);

      // Complete transition
      setTimeout(() => {
        setSlideDirection("");
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleEmploymentFormSubmit = (data) => {
    // Extract and store the generated employee ID
    if (data.generatedEmployeeId) {
      setGeneratedEmployeeId(data.generatedEmployeeId);
    }

    setFormData((prev) => ({
      ...prev,
      employmentApplication: data,
    }));
    
    // Unlock step 2 and navigate in one go
    const newUnlockedSteps = [...unlockedSteps, 2];
    setUnlockedSteps(newUnlockedSteps);
    
    // Use flushSync to ensure state is updated before navigation
    setTimeout(() => {
      navigateToStep(2);
    }, 0);
  };

  const handlePersonalProfileSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      personalProfile: data,
    }));
    
    // Unlock step 3 and navigate in one go
    const newUnlockedSteps = [...unlockedSteps, 3];
    setUnlockedSteps(newUnlockedSteps);
    
    // Use flushSync to ensure state is updated before navigation
    setTimeout(() => {
      navigateToStep(3);
    }, 0);
  };

  const handleBankAndFamilySubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      bankAndFamily: data,
    }));
    
    // Unlock step 4 and navigate in one go
    const newUnlockedSteps = [...unlockedSteps, 4];
    setUnlockedSteps(newUnlockedSteps);
    
    // Use flushSync to ensure state is updated before navigation
    setTimeout(() => {
      navigateToStep(4);
    }, 0);
  };

  // New function to handle academic background submission
  const handleAcademicSubmit = () => {
    // Unlock step 4 when academic background is submitted
    if (!unlockedSteps.includes(4)) {
      const newUnlockedSteps = [...unlockedSteps, 4];
      setUnlockedSteps(newUnlockedSteps);
    }
  };

  // New function to handle professional training or experience submission
  const handleProfessionalTrainingSubmit = () => {
    // Unlock step 5 when professional training or experience is submitted
    if (!unlockedSteps.includes(5)) {
      const newUnlockedSteps = [...unlockedSteps, 5];
      setUnlockedSteps(newUnlockedSteps);
    }
  };

  const handleProfessionalTrainingFormSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      professionalTraining: data,
    }));
    
    // Don't automatically unlock step 5 here - it will be unlocked when either training or experience is submitted
    setTimeout(() => {
      navigateToStep(5);
    }, 0);
  };

  // New function to handle about self submission
  const handleAboutSelfSubmit = () => {
    // Unlock step 6 when about self is submitted
    if (!unlockedSteps.includes(6)) {
      const newUnlockedSteps = [...unlockedSteps, 6];
      setUnlockedSteps(newUnlockedSteps);
    }
  };

  const handleProfessionalReferencesFormSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      professionalReferences: data,
    }));
    
    // Don't automatically unlock step 6 here - it will be unlocked when about self is submitted
    setTimeout(() => {
      navigateToStep(6);
    }, 0);
  };

  const handleProfessionalReferencesSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      professionalReferences: data,
    }));
    
    // Unlock step 6 and navigate in one go
    const newUnlockedSteps = [...unlockedSteps, 6];
    setUnlockedSteps(newUnlockedSteps);
    
    // Use flushSync to ensure state is updated before navigation
    setTimeout(() => {
      navigateToStep(6);
    }, 0);
  };

  const handleDeclarationSubmit = (data) => {
    const completeFormData = {
      ...formData,
      declaration: data,
    };

    // Here you would typically submit the complete form data to your backend
    console.log("Complete form data:", completeFormData);

    // Show success toast instead of alert
    toast({
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span>Application Submitted Successfully</span>
        </div>
      ),
      description: "Thank you for registering with ISCS Technologies.",
      className: "bg-green-50 border-green-200 text-green-800",
    });

    // For now, just navigate back to dashboard
    navigate("/employees");
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/employees");
    } else {
      navigateToStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 1, title: "Employment" },
    { id: 2, title: "Personal" },
    { id: 3, title: "Bank & Family" },
    { id: 4, title: "Training" },
    { id: 5, title: "References" },
    { id: 6, title: "Declaration" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <style jsx>{`
        .page-container {
          position: relative;
          overflow: hidden;
        }
        .page-content {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }
        .slide-left {
          transform: translateX(-100%) rotateY(-15deg);
          opacity: 0;
        }
        .slide-right {
          transform: translateX(100%) rotateY(15deg);
          opacity: 0;
        }
      `}</style>

      {/* Simple Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium text-gray-700">
              Employee Registration
            </h1>
            
            {/* Centered Progress Dots with Numbers */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
              {steps.map((step) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                const isUnlocked = unlockedSteps.includes(step.id);
                
                return (
                  <button
                    key={step.id}
                    onClick={() => navigateToStep(step.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-400 text-white"
                        : isCurrent
                        ? "bg-blue-500 text-white"
                        : isUnlocked
                        ? "bg-gray-200 text-gray-500 hover:bg-gray-300"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    title={isUnlocked ? step.title : `Complete step ${step.id - 1} to unlock`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={14} />
                    ) : isUnlocked ? (
                      step.id
                    ) : (
                      <Lock size={14} className="text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Spacer to balance the layout */}
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      {/* Employee ID Display */}
      {generatedEmployeeId && (
        <div className="flex justify-center mt-4">
          <div className="bg-green-50 border border-green-200 rounded-full px-4 py-1.5 flex items-center gap-2 text-sm">
            <CheckCircle2 className="text-green-600" size={14} />
            <span className="font-medium text-green-700">
              Employee ID: {generatedEmployeeId}
            </span>
          </div>
        </div>
      )}

      {/* Main Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card
          className={`bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm transition-all duration-500 ${
            isTransitioning ? "scale-95 opacity-90" : "scale-100 opacity-100"
          }`}
        >
          <div className={`p-6 page-content ${slideDirection}`}>
            {currentStep === 1 && (
              <EmploymentApplicationForm
                initialData={formData.employmentApplication}
                onSubmit={handleEmploymentFormSubmit}
              />
            )}
            {currentStep === 2 && (
              <PersonalProfileForm
                initialData={formData.personalProfile}
                generatedEmployeeId={generatedEmployeeId}
                onSubmit={handlePersonalProfileSubmit}
                onBack={() => navigateToStep(1)}
              />
            )}
            {currentStep === 3 && (
              <BankAndFamilyForm
                initialData={formData.bankAndFamily}
                generatedEmployeeId={generatedEmployeeId}
                onSubmit={handleBankAndFamilySubmit}
                onAcademicSubmit={handleAcademicSubmit} // Pass the new callback
                onBack={() => navigateToStep(2)}
              />
            )}
            {currentStep === 4 && (
              <ProfessionalTrainingForm
                initialData={formData.professionalTraining}
                generatedEmployeeId={generatedEmployeeId}
                onSubmit={handleProfessionalTrainingFormSubmit}
                onProfessionalTrainingSubmit={handleProfessionalTrainingSubmit} // Pass the new callback
                onBack={() => navigateToStep(3)}
              />
            )}
            {currentStep === 5 && (
              <ProfessionalReferencesForm
                initialData={formData.professionalReferences}
                generatedEmployeeId={generatedEmployeeId}
                onSubmit={handleProfessionalReferencesFormSubmit}
                onAboutSelfSubmit={handleAboutSelfSubmit} // Pass the new callback
                onBack={() => navigateToStep(4)}
              />
            )}
            {currentStep === 6 && (
              <DeclarationForm
                initialData={formData.declaration}
                generatedEmployeeId={generatedEmployeeId}
                onSubmit={handleDeclarationSubmit}
                onBack={() => navigateToStep(5)}
              />
            )}
          </div>
        </Card>
      </div>
      
      {/* Add Toaster component here */}
      <Toaster />
    </div>
  );
}