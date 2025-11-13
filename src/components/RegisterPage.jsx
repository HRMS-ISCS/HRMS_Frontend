//RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Circle, Menu, X } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Enhanced navigation function with smooth transitions
  const navigateToStep = (targetStep) => {
    if (targetStep === currentStep || isTransitioning) return;

    setIsTransitioning(true);
    setSidebarOpen(false); // Close sidebar on mobile when navigating

    // Determine slide direction
    if (targetStep > currentStep) {
      setSlideDirection("slide-left");
    } else {
      setSlideDirection("slide-right");
    }

    // Start transition
    setTimeout(() => {
      setCurrentStep(targetStep);

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
    navigateToStep(2);
  };

  const handlePersonalProfileSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      personalProfile: data,
    }));
    navigateToStep(3);
  };

  const handleBankAndFamilySubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      bankAndFamily: data,
    }));
    navigateToStep(4);
  };

  const handleProfessionalTrainingSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      professionalTraining: data,
    }));
    navigateToStep(5);
  };

  const handleProfessionalReferencesSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      professionalReferences: data,
    }));
    navigateToStep(6);
  };

  const handleDeclarationSubmit = (data) => {
    const completeFormData = {
      ...formData,
      declaration: data,
    };

    // Here you would typically submit the complete form data to your backend
    console.log("Complete form data:", completeFormData);

    // For now, just navigate back to login
    alert(
      "Application submitted successfully! Thank you for registering with ISCS Technologies."
    );
    navigate("/");
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/");
    } else {
      navigateToStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 1, title: "Employment", description: "Basic details" },
    { id: 2, title: "Personal", description: "Personal info" },
    { id: 3, title: "Bank & Family", description: "Banking & family" },
    { id: 4, title: "Training", description: "Work experience" },
    { id: 5, title: "References", description: "References" },
    { id: 6, title: "Declaration", description: "Final signature" },
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

      {/* HEADER NAV */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Left: Back + Menu */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setSidebarOpen(true)}
              variant="outline"
              size="sm"
              className="md:hidden flex items-center gap-1 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <Menu size={16} />
              <span className="hidden xs:inline">Steps</span>
            </Button>

            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
              disabled={isTransitioning}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>
          </div>

          {/* Center: Title */}
          <div className="text-center flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
              ISCS Employee Registration
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Complete your registration process
            </p>
          </div>

          {/* Right: Step Counter */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-green-50 border border-slate-200 px-4 py-2 rounded-full shadow-sm">
            <span className="text-slate-700 text-sm font-semibold">
              Step {currentStep}/{steps.length}
            </span>
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-800">Registration Steps</h3>
              <Button
                onClick={() => setSidebarOpen(false)}
                variant="ghost"
                size="sm"
              >
                <X size={18} />
              </Button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
              {steps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => navigateToStep(step.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer border ${
                    currentStep === step.id
                      ? "bg-blue-100 border-blue-300 text-blue-800 font-semibold"
                      : currentStep > step.id
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-white border-slate-200 hover:bg-blue-50"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      currentStep > step.id
                        ? "bg-green-200 text-green-700"
                        : currentStep === step.id
                        ? "bg-blue-200 text-blue-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}

              {/* Progress */}
              <div className="mt-6 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round((currentStep / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${(currentStep / steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {generatedEmployeeId && (
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-green-100 to-emerald-50 border border-green-300 rounded-full px-5 py-2 flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="text-green-600" size={18} />
              <span className="font-semibold text-green-700">
                Employee ID: {generatedEmployeeId}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-72">
            <Card className="bg-white/70 backdrop-blur-md border border-white/40 shadow-lg p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Registration Progress
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                Complete all steps to finish registration
              </p>

              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    onClick={() => navigateToStep(step.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer border ${
                      currentStep === step.id
                        ? "bg-blue-100 border-blue-300 text-blue-800 font-semibold"
                        : currentStep > step.id
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-white/70 border-slate-200 hover:bg-blue-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold ${
                        currentStep > step.id
                          ? "bg-green-200 text-green-800"
                          : currentStep === step.id
                          ? "bg-blue-200 text-blue-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {currentStep > step.id ? <CheckCircle2 size={18} /> : step.id}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round((currentStep / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${(currentStep / steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Form Panel */}
          <div className="flex-1">
            <Card
              className={`bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-500 ${
                isTransitioning ? "scale-95 opacity-90" : "scale-100 opacity-100"
              }`}
            >
              <div className={`p-6 sm:p-8 page-content ${slideDirection}`}>
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
                    onSubmit={handleProfessionalTrainingSubmit}
                    onBack={() => navigateToStep(3)}
                  />
                )}
                {currentStep === 5 && (
                  <ProfessionalReferencesForm
                    initialData={formData.professionalReferences}
                    generatedEmployeeId={generatedEmployeeId}
                    onSubmit={handleProfessionalReferencesSubmit}
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
      </div>
    </div>
  );

}