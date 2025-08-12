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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
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

        .step-indicator {
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .step-indicator:hover {
          transform: translateX(4px);
        }

        .step-indicator:hover .step-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateX(8px);
        }

        .step-tooltip {
          position: absolute;
          top: 50%;
          left: 100%;
          transform: translateY(-50%) translateX(4px);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .step-line {
          transition: all 0.5s ease;
        }

        .form-card {
          perspective: 1000px;
        }

        .book-shadow {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24), 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .page-turn-effect {
          background: linear-gradient(45deg, #f8fafc 0%, #ffffff 100%);
          border: 1px solid rgba(148, 163, 184, 0.1);
        }

        .steps-container {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-right: 1px solid rgba(148, 163, 184, 0.1);
        }

        .navbar {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .navbar-content {
          backdrop-filter: blur(10px);
        }

        @media (max-width: 768px) {
          .step-indicator:hover {
            transform: none;
          }
          .step-tooltip {
            display: none;
          }
        }
      `}</style>

      {/* Navbar Header */}
      <div className="sticky top-0 z-50 bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left - Back Button and Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Mobile Menu Button */}
              <Button
                onClick={() => setSidebarOpen(true)}
                variant="outline"
                size="sm"
                className="md:hidden flex items-center gap-1 text-slate-700 hover:bg-slate-100"
              >
                <Menu size={16} />
                <span className="hidden xs:inline">Steps</span>
              </Button>

              {/* Back Button */}
              <Button
                onClick={handleBack}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 sm:gap-2 text-slate-700 hover:bg-slate-100 hover:scale-105 transition-all duration-200 text-xs sm:text-sm"
                disabled={isTransitioning}
              >
                <ArrowLeft size={14} sm:size={16} />
                <span className="hidden xs:inline">Back</span>
              </Button>
            </div>

            {/* Center - Title */}
            <div className="flex-1 text-center px-2">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 tracking-wide">
                <span className="hidden sm:inline">ISCS Employee Registration</span>
                <span className="sm:hidden">ISCS Registration</span>
              </h1>
              <div className="text-xs sm:text-sm text-slate-500 mt-1 hidden sm:block">
                Complete your registration process
              </div>
            </div>

            {/* Right - Step Counter */}
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-100 rounded-full px-2 sm:px-4 py-1 sm:py-2 border border-slate-300">
              <div className="text-slate-700 text-xs sm:text-sm font-medium">
                <span className="hidden xs:inline">Step </span>
                {currentStep}/{steps.length}
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300">
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Registration Steps</h3>
              <Button
                onClick={() => setSidebarOpen(false)}
                variant="ghost"
                size="sm"
                className="p-1"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Mobile Steps */}
            <div className="p-4">
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    <div
                      className={`flex items-center gap-4 step-indicator p-4 rounded-xl transition-all duration-300 cursor-pointer group ${
                        currentStep === step.id
                          ? "bg-blue-100 text-blue-800 shadow-lg transform scale-[1.02] border border-blue-200"
                          : currentStep > step.id
                          ? "bg-blue-50 text-blue-700 shadow-md hover:shadow-lg hover:scale-[1.01] border border-blue-100"
                          : "bg-white/70 hover:bg-blue-50 hover:shadow-md hover:scale-[1.01] border border-slate-200 hover:border-blue-200"
                      } ${isTransitioning ? "pointer-events-none" : ""}`}
                      onClick={() => navigateToStep(step.id)}
                    >
                      {/* Step Number/Check */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                          currentStep > step.id
                            ? "bg-blue-200 text-blue-800"
                            : currentStep === step.id
                            ? "bg-blue-200 text-blue-800"
                            : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-blue-100 group-hover:to-blue-100 group-hover:text-blue-600"
                        }`}
                      >
                        {currentStep > step.id ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <span className="text-sm font-bold">{step.id}</span>
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-semibold text-base leading-tight transition-colors duration-300 ${
                            currentStep >= step.id
                              ? "text-current"
                              : "text-slate-600 group-hover:text-slate-800"
                          }`}
                        >
                          {step.title}
                        </div>
                        <div
                          className={`text-sm mt-1 leading-tight ${
                            currentStep >= step.id
                              ? "text-current opacity-80"
                              : "text-slate-500 group-hover:text-slate-600"
                          }`}
                        >
                          {step.description}
                        </div>
                      </div>
                    </div>

                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div className="ml-9 my-1">
                        <div
                          className={`w-1 h-4 rounded-full step-line transition-all duration-500 ${
                            currentStep > step.id
                              ? "bg-blue-300"
                              : currentStep === step.id
                              ? "bg-blue-400"
                              : "bg-slate-300"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Progress Summary */}
              <div className="mt-8 p-4 bg-white/60 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-700">
                    Overall Progress
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {Math.round((currentStep / steps.length) * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-300 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                      style={{
                        width: `${(currentStep / steps.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                    {currentStep}/{steps.length}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500 text-center">
                  {currentStep === steps.length
                    ? "Ready to submit!"
                    : `${steps.length - currentStep} steps remaining`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-2 sm:p-4">
        {/* Display Generated Employee ID if available */}
        {generatedEmployeeId && (
          <div className="text-center mb-4 sm:mb-6 mt-2 sm:mt-4">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full shadow-sm">
              <CheckCircle2 size={16} sm:size={20} className="text-green-600 flex-shrink-0" />
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                <span className="hidden sm:inline">Employee ID Generated: </span>
                <span className="sm:hidden">ID: </span>
              </span>
              <span className="text-base sm:text-lg font-bold text-green-700">
                {generatedEmployeeId}
              </span>
            </div>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mt-4 sm:mt-6">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <Card className="steps-container p-0 h-fit overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-slate-200 shadow-xl">
              {/* Header Section */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 size={18} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Registration Progress
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Complete all steps to finish registration
                </p>
              </div>

              {/* Steps Section */}
              <div className="p-6">
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div key={step.id} className="relative">
                      <div
                        className={`flex items-center gap-4 step-indicator p-4 rounded-xl transition-all duration-300 cursor-pointer group ${
                          currentStep === step.id
                            ? "bg-blue-100 text-blue-800 shadow-lg transform scale-[1.02] border border-blue-200"
                            : currentStep > step.id
                            ? "bg-blue-50 text-blue-700 shadow-md hover:shadow-lg hover:scale-[1.01] border border-blue-100"
                            : "bg-white/70 hover:bg-blue-50 hover:shadow-md hover:scale-[1.01] border border-slate-200 hover:border-blue-200"
                        } ${isTransitioning ? "pointer-events-none" : ""}`}
                        onClick={() => navigateToStep(step.id)}
                      >
                        {/* Step Number/Check */}
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                            currentStep > step.id
                              ? "bg-blue-200 text-blue-800"
                              : currentStep === step.id
                              ? "bg-blue-200 text-blue-800"
                              : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-blue-100 group-hover:to-blue-100 group-hover:text-blue-600"
                          }`}
                        >
                          {currentStep > step.id ? (
                            <CheckCircle2 size={20} />
                          ) : (
                            <span className="text-base font-bold">
                              {step.id}
                            </span>
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-semibold text-base leading-tight transition-colors duration-300 ${
                              currentStep >= step.id
                                ? "text-current"
                                : "text-slate-600 group-hover:text-slate-800"
                            }`}
                          >
                            {step.title}
                          </div>
                          <div
                            className={`text-sm mt-1 leading-tight ${
                              currentStep >= step.id
                                ? "text-current opacity-80"
                                : "text-slate-500 group-hover:text-slate-600"
                            }`}
                          >
                            {step.description}
                          </div>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex flex-col items-center gap-1">
                          {currentStep === step.id && (
                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg"></div>
                          )}
                          {currentStep > step.id && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
                          )}
                          {currentStep < step.id && (
                            <div className="w-2 h-2 bg-slate-300 rounded-full group-hover:bg-blue-300 transition-colors duration-300"></div>
                          )}
                        </div>
                      </div>

                      {/* Connecting Line */}
                      {index < steps.length - 1 && (
                        <div className="ml-10 my-1">
                          <div
                            className={`w-1 h-4 rounded-full step-line transition-all duration-500 ${
                              currentStep > step.id
                                ? "bg-blue-300"
                                : currentStep === step.id
                                ? "bg-blue-400"
                                : "bg-slate-300"
                            }`}
                          />
                        </div>
                      )}

                      {/* Tooltip */}
                      <div className="step-tooltip">
                        Click to go to {step.title}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Summary */}
                <div className="mt-8 p-4 bg-white/60 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-700">
                      Overall Progress
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {Math.round((currentStep / steps.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-blue-300 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                        style={{
                          width: `${(currentStep / steps.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                      {currentStep}/{steps.length}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 text-center">
                    {currentStep === steps.length
                      ? "Ready to submit!"
                      : `${steps.length - currentStep} steps remaining`}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Form Content - Full width on mobile, flex-1 on desktop */}
          <div className="flex-1 page-container">
            <Card
              className={`form-card book-shadow page-turn-effect transition-all duration-300 ${
                isTransitioning ? "scale-[0.98]" : "scale-100"
              }`}
            >
              <div className={`p-4 sm:p-6 md:p-8 page-content ${slideDirection}`}>
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