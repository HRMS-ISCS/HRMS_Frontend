// src/components/RegisterPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useDarkMode } from "@/context/DarkModeContext";
import { apiRequest } from "../api";

// Import Form Components
import EmploymentApplicationForm from "./EmploymentApplicationForm";
import PersonalProfileForm from "./PersonalProfileForm";
import BankAndFamilyForm from "./BankAndFamilyForm";
import ProfessionalTrainingForm from "./ProfessionalTrainingForm";
import ProfessionalReferencesForm from "./ProfessionalReferencesForm";
import DeclarationForm from "./DeclarationForm";

export default function RegisterPage() {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const { toast } = useToast();

  // UI States
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [isLoadingResume, setIsLoadingResume] = useState(true);

  // Form Data State
  const [formData, setFormData] = useState({
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
      // mobilePhone: "",
      // email: "",
      // telephone: "",
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
    bankAndFamily: {
      bankName: "",
      branch: "",
      accountNumber: "",
      ifscCode: "",
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
    professionalTraining: {
      professionalTraining: [
        {
          instituteName: "",
          instituteAddress: "",
          duration: "",
          areaOfTraining: "",
        },
      ],
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
      otherInterests: ["", ""],
      has_training: true, // Added
      has_experience: true, // Added
    },
    professionalReferences: {
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
      employeeReferral: {
        isReferred: "",
        name: "",
        phoneNumber: "",
      },
      aboutSelf: {
        careerAmbition: "",
        achievements: "",
        professionalFailures: "",
      },
      strengths: ["", "", ""],
      weaknesses: ["", "", ""],
    },
    declaration: {
      place: "",
      date: "",
      applicantName: "",
      signature: "",
    },
  });

  const [generatedEmployeeId, setGeneratedEmployeeId] = useState("");

  // ============================================
  // 1. Fetch Progress & Resume Data on Mount
  // ============================================
  useEffect(() => {
    const initializeProgress = async () => {
      try {
        const progressRes = await apiRequest("/application/progress");

        if (progressRes.last_completed_step > 0) {
          const resumeData = await apiRequest("/application/resume-data");

          if (resumeData.has_data) {
            hydrateFormData(resumeData);
            const nextStep =
              progressRes.next_step || progressRes.last_completed_step + 1;
            setCurrentStep(nextStep);

            toast({
              title: "Welcome Back",
              description: `Resuming from Step ${nextStep}`,
              className: darkMode
                ? "bg-blue-900/80 border-blue-700 text-blue-100"
                : "bg-blue-50 border-blue-200 text-blue-800",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setIsLoadingResume(false);
      }
    };

    initializeProgress();
    window.scrollTo(0, 0);
  }, []);

  // Helper: Map Backend Resume Data to Frontend State
  const hydrateFormData = (data) => {
    const steps = data.steps;

    if (steps.step_1?.completed) {
      const s1 = steps.step_1.data;
      setGeneratedEmployeeId(s1.employee_id);
      setFormData((prev) => ({
        ...prev,
        employmentApplication: {
          ...prev.employmentApplication,
          name: s1.name || "",
          email: s1.email || "",
          phone: s1.phone || "",
          position: s1.position || "",
          dateOfJoining: s1.date_of_joining
            ? s1.date_of_joining.split("T")[0]
            : "",
          clientName: s1.client || "",
          skillSet: s1.skill_set || "",
          generatedEmployeeId: s1.employee_id || "",
          employeeId: s1.employee_id || "",
        },
      }));
    }

    if (steps.step_2?.completed) {
      const s2 = steps.step_2.data;
      setFormData((prev) => ({
        ...prev,
        personalProfile: {
          ...prev.personalProfile,
          firstName: s2.firstName || "",
          middleName: s2.middleName || "",
          lastName: s2.lastName || "",
          dateOfBirth: s2.dateOfBirth || "",
          gender: s2.gender || "",
          bloodGroup: s2.bloodGroup || "",
          nationality: s2.nationality || "",
          // email: s2.mail_id || "",
          // mobilePhone: s2.mobile_phone || "",
        },
      }));
    }

    if (steps.step_3?.completed) {
      const s3 = steps.step_3.data;
      const bank = s3.data?.bankDetails || {};
      const academic = s3.data?.academicQualifications || [];

      setFormData((prev) => ({
        ...prev,
        bankAndFamily: {
          ...prev.bankAndFamily,
          bankName: bank.bankName || "",
          branch: bank.branch || "",
          accountNumber: bank.accountNumber || "",
          ifscCode: bank.ifscCode || "",
          maritalStatus: s3.maritalStatus || "",
          marriageDate: s3.marriageDate || "",
          academicQualifications: academic.map((a) => ({
            qualification: a.qualification,
            specification: a.specification,
            instituteName: a.instituteName,
            instituteAddress: a.instituteAddress,
            yearOfPassing: a.yearOfPassing,
            durationFrom: a.durationFrom,
            durationTo: a.durationTo,
            rankGradePercentage: a.rankGradePercentage,
          })),
          familyMembers: prev.bankAndFamily.familyMembers,
        },
      }));
    }

    // Map Step 4: Training (Updated to handle flags)
    if (steps.step_4?.completed) {
      const s4 = steps.step_4.data;
      setFormData((prev) => ({
        ...prev,
        professionalTraining: {
          ...prev.professionalTraining,
          has_training: s4.has_training ?? true, // Default to true if missing
          has_experience: s4.has_experience ?? true, // Default to true if missing
          professionalTraining: (s4.data?.professionalTraining || []).map(
            (t) => ({
              instituteName: t.instituteName,
              instituteAddress: t.instituteAddress,
              duration: t.duration,
              areaOfTraining: t.areaOfTraining,
            }),
          ),
          professionalExperience: (s4.data?.professionalExperience || []).map(
            (e) => ({
              location: e.employerLocation,
              empId: "",
              rmContactNo: "",
              hrEmailId: "",
              designation: e.designation,
              periodFrom: e.periodFrom,
              periodTo: e.periodTo,
              ctc: e.ctc,
              reasonForLeaving: e.reasonForLeaving,
              uanNumber: e.uanNumber,
            }),
          ),
        },
      }));
    }

    if (steps.step_5?.completed) {
      const s5 = steps.step_5.data;
      setFormData((prev) => ({
        ...prev,
        professionalReferences: {
          ...prev.professionalReferences,
          professionalReferences: (s5.data?.professionalReferences || []).map(
            (r) => ({
              name: r.name,
              designation: r.designation,
              company: r.company,
              address: r.address,
              phoneNumber: r.phoneNumber,
              email: r.email,
              knownPeriod: r.knownPeriod,
              capacity: r.capacity,
            }),
          ),
          aboutSelf: s5.data?.aboutSelf
            ? {
                careerAmbition: s5.data.aboutSelf.careerAmbition,
                achievements: s5.data.aboutSelf.achievements,
                professionalFailures: s5.data.aboutSelf.professionalFailures,
              }
            : prev.professionalReferences.aboutSelf,
          strengths: s5.data?.aboutSelf?.strengths || ["", "", ""],
          weaknesses: s5.data?.aboutSelf?.weaknesses || ["", "", ""],
        },
      }));
    }

    if (steps.step_6?.completed) {
      const s6 = steps.step_6.data;
      setFormData((prev) => ({
        ...prev,
        declaration: {
          ...prev.declaration,
          applicantName: s6.data?.applicantName || "",
          date: s6.data?.date_of_declaration || "",
        },
      }));
    }
  };

  const syncBackendProgress = async (stepNumber) => {
    try {
      await apiRequest("/application/progress", {
        method: "PUT",
        body: JSON.stringify({ step: stepNumber, completed: true }),
      });
    } catch (error) {
      console.error("Failed to sync progress:", error);
      toast({
        title: "Warning",
        description: "Data saved, but progress tracking failed to update.",
        variant: "destructive",
      });
    }
  };

  const navigateToStep = (targetStep) => {
    if (targetStep === currentStep || isTransitioning) return;
    setIsTransitioning(true);
    setSlideDirection(targetStep > currentStep ? "slide-left" : "slide-right");

    setTimeout(() => {
      setCurrentStep(targetStep);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setSlideDirection("");
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  // --- Handlers ---

  const handleEmploymentFormSubmit = async (data) => {
    if (data.generatedEmployeeId) {
      setGeneratedEmployeeId(data.generatedEmployeeId);
    }
    setFormData((prev) => ({ ...prev, employmentApplication: data }));
    await syncBackendProgress(1);
    navigateToStep(2);
  };

  const handlePersonalProfileSubmit = async (data) => {
    setFormData((prev) => ({ ...prev, personalProfile: data }));
    await syncBackendProgress(2);
    navigateToStep(3);
  };

  const handleBankAndFamilySubmit = async (data) => {
    setFormData((prev) => ({ ...prev, bankAndFamily: data }));
    await syncBackendProgress(3);
    navigateToStep(4);
  };

  // NEW: Handle Data Update from Child (without navigation)
  const handleProfessionalTrainingDataUpdate = (data) => {
    setFormData((prev) => ({
      ...prev,
      professionalTraining: {
        ...prev.professionalTraining,
        ...data, // Spreads { has_training, has_experience, ...arrays }
      },
    }));
  };

  const handleProfessionalTrainingFormSubmit = async (data) => {
    // Update final state before moving
    setFormData((prev) => ({
      ...prev,
      professionalTraining: {
        ...prev.professionalTraining,
        ...data,
      },
    }));
    await syncBackendProgress(4);
    navigateToStep(5);
  };

  const handleProfessionalReferencesFormSubmit = async (data) => {
    setFormData((prev) => ({ ...prev, professionalReferences: data }));
    await syncBackendProgress(5);
    navigateToStep(6);
  };

  const handleDeclarationSubmit = async (data) => {
    const completeFormData = { ...formData, declaration: data };
    console.log("Complete form data:", completeFormData);

    try {
      await apiRequest("/application/complete", { method: "POST" });

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Application Submitted Successfully</span>
          </div>
        ),
        description: "Thank you for registering with ISCS Technologies.",
        className: darkMode
          ? "bg-green-900/80 border-green-700 text-green-100"
          : "bg-green-50 border-green-200 text-green-800",
      });

      setTimeout(() => navigate("/employees"), 2000);
    } catch (error) {
      toast({
        title: "Completion Error",
        description: error.message || "Failed to finalize application.",
        variant: "destructive",
      });
    }
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

  if (isLoadingResume) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-blue-500" />
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Resuming your application...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-white to-green-50"}`}
    >
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
        /* Adjust steps header position to avoid sidebar on larger screens */
        @media (min-width: 1024px) {
          .steps-header-fixed {
            left: 250px !important; /* Adjust based on sidebar width */
            right: 0 !important;
          }
        }
      `}</style>

      {/* Steps Header - Fixed at top, adjusted for sidebar with LOWER z-index */}
      <div
        className={`fixed top-16 z-20 steps-header-fixed ${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-100"} backdrop-blur-sm border-b`}
        style={{ 
          top: '64px',
          left: 0,
          right: 0,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1
              className={`text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}
            >
              .
            </h1>

            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
              {steps.map((step) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <React.Fragment key={step.id}>
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                              ? "bg-blue-500 text-white shadow-md ring-4 ring-blue-100"
                              : darkMode
                                ? "bg-gray-700 text-gray-400"
                                : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 size={14} /> : step.id}
                      </div>
                      <span
                        className={`ml-2 text-xs hidden md:block font-medium ${
                          isCurrent
                            ? "text-blue-600 dark:text-blue-400"
                            : isCompleted
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    {step.id !== steps.length && (
                      <div
                        className={`w-8 h-0.5 ${step.id < currentStep ? "bg-green-400" : "bg-gray-300"}`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="w-32"></div>
          </div>
        </div>
      </div>

      {/* Main Content - Center aligned, no right shift */}
      <div className="pt-20">
        {/* {generatedEmployeeId && (
          <div className="flex justify-center mt-4">
            <div className={`${darkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-200'} rounded-full px-4 py-1.5 flex items-center gap-2 text-sm`}>
              <CheckCircle2 className={darkMode ? "text-green-400" : "text-green-600"} size={14} />
              <span className={`font-medium ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                Employee ID: {generatedEmployeeId}
              </span>
            </div>
          </div>
        )} */}

        {/* Centered Form Container */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Card
            className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-100"} backdrop-blur-sm rounded-xl shadow-sm transition-all duration-500 ${
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
                  onBack={() => navigateToStep(2)}
                />
              )}
              {currentStep === 4 && (
                <ProfessionalTrainingForm
                  initialData={formData.professionalTraining}
                  generatedEmployeeId={generatedEmployeeId}
                  onSubmit={handleProfessionalTrainingFormSubmit}
                  onDataUpdate={handleProfessionalTrainingDataUpdate}
                  onBack={() => navigateToStep(3)}
                />
              )}
              {currentStep === 5 && (
                <ProfessionalReferencesForm
                  initialData={formData.professionalReferences}
                  generatedEmployeeId={generatedEmployeeId}
                  onSubmit={handleProfessionalReferencesFormSubmit}
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
      </div>

      <Toaster />
    </div>
  );
}