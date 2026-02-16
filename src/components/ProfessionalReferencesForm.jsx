// ProfessionalReferencesForm.jsx
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  User,
  Target,
  Trophy,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  Building2,
  Calendar,
  Save,
  CheckCircle,
  AlertCircle,
  UserPlus
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDarkMode } from "@/context/DarkModeContext";
import { apiRequest } from "../api";

export default function ProfessionalReferencesForm({
  initialData,
  generatedEmployeeId,
  onSubmit,
  onAboutSelfSubmit,
}) {
  const { darkMode } = useDarkMode();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // API-specific states
  const [referencesLoading, setReferencesLoading] = useState(false);
  const [aboutSelfLoading, setAboutSelfLoading] = useState(false);

  const [referencesSuccess, setReferencesSuccess] = useState(false);
  const [aboutSelfSuccess, setAboutSelfSuccess] = useState(false);

  const [referencesEmployeeId, setReferencesEmployeeId] = useState("");
  const [aboutSelfEmployeeId, setAboutSelfEmployeeId] = useState("");

  // Set employee IDs from props
  useEffect(() => {
    if (generatedEmployeeId) {
      setReferencesEmployeeId(generatedEmployeeId);
      setAboutSelfEmployeeId(generatedEmployeeId);
    }
  }, [generatedEmployeeId]);

  const handleReferenceChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      professionalReferences: prev.professionalReferences.map((ref, i) =>
        i === index ? { ...ref, [field]: value } : ref,
      ),
    }));
  };

  // Handlers for other sections
  const handleEmployeeReferralChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      employeeReferral: {
        ...prev.employeeReferral,
        [field]: value,
      },
    }));
  };

  const handleAboutSelfChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      aboutSelf: {
        ...prev.aboutSelf,
        [field]: value,
      },
    }));
  };

  const handleStrengthChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      strengths: prev.strengths.map((strength, i) =>
        i === index ? value : strength,
      ),
    }));
  };

  const handleWeaknessChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      weaknesses: prev.weaknesses.map((weakness, i) =>
        i === index ? value : weakness,
      ),
    }));
  };

  // Submit Professional References
  const submitProfessionalReferences = async () => {
    if (!referencesEmployeeId.trim()) {
      setErrors((prev) => ({
        ...prev,
        referencesEmployeeId: "Employee ID is required",
      }));
      return;
    }

    // Check if at least one field in any reference is filled
    const hasAnyData = formData.professionalReferences.some(ref => 
      ref.name?.trim() || 
      ref.designation?.trim() || 
      ref.company?.trim() || 
      ref.phoneNumber?.trim() || 
      ref.email?.trim() ||
      ref.knownPeriod?.trim() ||
      ref.capacity?.trim()
    );

    if (!hasAnyData) {
      setErrors((prev) => ({
        ...prev,
        referencesGeneral: "Please fill at least one field in any reference",
      }));
      return;
    }

    setReferencesLoading(true);
    setReferencesSuccess(false);

    try {
      let successCount = 0;

      // Send each reference that has at least one field filled
      for (const reference of formData.professionalReferences) {
        // Only send if at least one field is filled
        if (reference.name?.trim() || 
            reference.designation?.trim() || 
            reference.company?.trim() || 
            reference.phoneNumber?.trim() || 
            reference.email?.trim() ||
            reference.knownPeriod?.trim() ||
            reference.capacity?.trim()) {
          
          const apiData = {
            name: reference.name || null,
            designation: reference.designation || null,
            company: reference.company || null,
            tel_no: reference.phoneNumber || null,
            email: reference.email || null,
            period_known: reference.knownPeriod || null,
            capacity_known: reference.capacity || null,
            referred_by_employee_ISCS: false,
          };

          await apiRequest(
            `/users/Professional_Reference/${referencesEmployeeId}`,
            {
              method: "POST",
              body: JSON.stringify(apiData),
            },
          );

          successCount++;
        }
      }

      if (successCount > 0) {
        setReferencesSuccess(true);
        setErrors((prev) => ({ ...prev, referencesGeneral: "" }));

        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Professional References Saved</span>
            </div>
          ),
          description: `${successCount} reference(s) have been saved successfully.`,
          className: darkMode
            ? "bg-green-900/80 border-green-700 text-green-100"
            : "bg-green-50 border-green-200 text-green-800",
        });
      }
    } catch (error) {
      console.error("References API Error:", error);
      setErrors((prev) => ({
        ...prev,
        referencesGeneral: error.message || "Failed to connect to server",
      }));

      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to save professional references. Please try again.",
        variant: "destructive",
      });
    } finally {
      setReferencesLoading(false);
    }
  };

  // Submit About Self
  const submitAboutSelf = async () => {
    if (!aboutSelfEmployeeId.trim()) {
      setErrors((prev) => ({
        ...prev,
        aboutSelfEmployeeId: "Employee ID is required",
      }));
      return;
    }

    // Check if at least first 3 questions are filled (keeping required validation as per your original)
    if (
      !formData.aboutSelf.careerAmbition?.trim() ||
      !formData.aboutSelf.achievements?.trim() ||
      !formData.aboutSelf.professionalFailures?.trim()
    ) {
      setErrors((prev) => ({
        ...prev,
        aboutSelfGeneral:
          "Please answer at least first 3 questions in About Self section",
      }));
      return;
    }

    setAboutSelfLoading(true);
    setAboutSelfSuccess(false);

    try {
      const apiData = {
        career_ambition: formData.aboutSelf.careerAmbition || null,
        significant_achievements: formData.aboutSelf.achievements || null,
        professional_failures: formData.aboutSelf.professionalFailures || null,
        strength1: formData.strengths[0] || null,
        strength2: formData.strengths[1] || null,
        strength3: formData.strengths[2] || null,
        weakness1: formData.weaknesses[0] || null,
        weakness2: formData.weaknesses[1] || null,
        weakness3: formData.weaknesses[2] || null,
      };

      await apiRequest(`/users/About_Self/${aboutSelfEmployeeId}`, {
        method: "POST",
        body: JSON.stringify(apiData),
      });

      setAboutSelfSuccess(true);
      setErrors((prev) => ({ ...prev, aboutSelfGeneral: "" }));

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>About Self Details Saved</span>
          </div>
        ),
        description:
          "Your self-assessment information has been saved successfully.",
        className: darkMode
          ? "bg-green-900/80 border-green-700 text-green-100"
          : "bg-green-50 border-green-200 text-green-800",
      });

      if (onAboutSelfSubmit) {
        onAboutSelfSubmit();
      }
    } catch (error) {
      console.error("About Self API Error:", error);
      setErrors((prev) => ({
        ...prev,
        aboutSelfGeneral: error.message || "Failed to save about self details",
      }));

      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to save about self details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAboutSelfLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onSubmit(formData);
    setLoading(false);
  };

  // Check if any section is completed to enable next button
  const isAnySectionCompleted = referencesSuccess || aboutSelfSuccess;

  return (
    <div
      className={`max-w-6xl mx-auto ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="text-center mb-8">
        <h1
          className={`text-3xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"} mb-2`}
        >
          Professional References & Self Assessment
        </h1>
        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
          Provide professional references and tell us about yourself
        </p>
      </div>

      {/* Global Employee ID Display - HIDDEN */}
      <div className="hidden text-center mb-6">
        <div
          className={`inline-flex items-center gap-3 px-6 py-3 ${darkMode ? "bg-green-900/50 border-green-700" : "bg-green-50 border-green-200"} rounded-full shadow-sm`}
        >
          <CheckCircle
            size={20}
            className={darkMode ? "text-green-400" : "text-green-600"}
          />
          <span
            className={`text-gray-700 font-medium ${darkMode ? "text-gray-200" : ""}`}
          >
            Auto-filled Employee ID:
          </span>
          <span
            className={`text-lg font-bold ${darkMode ? "text-green-300" : "text-green-700"}`}
          >
            {generatedEmployeeId}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Professional References Section */}
        <Card
          className={`p-6 ${referencesSuccess ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"} ${darkMode ? "from-gray-800 to-gray-700 border-gray-600" : ""}`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users
                className={darkMode ? "text-blue-400" : "text-blue-600"}
                size={20}
              />
              <h2
                className={`text-xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
              >
                Professional References
              </h2>
            </div>
            {referencesSuccess && (
              <CheckCircle
                className={darkMode ? "text-green-400" : "text-green-600"}
                size={20}
              />
            )}
          </div>

          {/* Employee ID Input for References - HIDDEN */}
          <div className="hidden mb-4">
            <Label
              htmlFor="referencesEmployeeId"
              className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium`}
            >
              Employee ID {generatedEmployeeId ? "(Auto-filled)" : ""}
            </Label>
            <Input
              id="referencesEmployeeId"
              value={referencesEmployeeId}
              onChange={(e) => setReferencesEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              className={`${errors.referencesEmployeeId ? "border-red-500" : ""} ${
                generatedEmployeeId
                  ? darkMode
                    ? "bg-green-900/50 border-green-700"
                    : "bg-green-50 border-green-300"
                  : ""
              } ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
              readOnly={!!generatedEmployeeId}
            />
            {errors.referencesEmployeeId && (
              <p
                className={`text-sm ${darkMode ? "text-red-400" : "text-red-600"}`}
              >
                {errors.referencesEmployeeId}
              </p>
            )}
            {generatedEmployeeId && (
              <p
                className={`text-xs ${darkMode ? "text-green-400" : "text-green-600"} mt-1`}
              >
                ✓ Auto-filled from previous step
              </p>
            )}
          </div>

          <p
            className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-6`}
          >
            Give name and contact details of persons who know you professionally (all fields are optional)
          </p>

          <div
            className={`space-y-6 mb-6 ${darkMode ? "bg-gray-700/50" : "bg-white/50"} rounded-lg p-4`}
          >
            {formData.professionalReferences.slice(0, 2).map((reference, index) => (
              <div
                key={index}
                className={`border ${darkMode ? "border-gray-600" : "border-gray-200"} rounded-lg p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <h3
                  className={`text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4 flex items-center gap-2`}
                >
                  <User
                    size={18}
                    className={darkMode ? "text-gray-400" : "text-gray-600"}
                  />
                  Reference {index + 1}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium text-sm`}
                    >
                      Name
                    </Label>
                    <Input
                      value={reference.name}
                      onChange={(e) =>
                        handleReferenceChange(index, "name", e.target.value)
                      }
                      placeholder="Enter full name"
                      className={`text-sm ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium text-sm`}
                    >
                      Designation
                    </Label>
                    <Input
                      value={reference.designation}
                      onChange={(e) =>
                        handleReferenceChange(
                          index,
                          "designation",
                          e.target.value,
                        )
                      }
                      placeholder="Enter designation"
                      className={`text-sm ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium text-sm flex items-center gap-2`}
                    >
                      <Building2
                        size={16}
                        className={darkMode ? "text-gray-400" : "text-gray-500"}
                      />
                      Company
                    </Label>
                    <Input
                      value={reference.company}
                      onChange={(e) =>
                        handleReferenceChange(index, "company", e.target.value)
                      }
                      placeholder="Enter company name"
                      className={`text-sm ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium text-sm flex items-center gap-2`}
                    >
                      <Phone
                        size={16}
                        className={darkMode ? "text-gray-400" : "text-gray-500"}
                      />
                      Tel No to contact
                    </Label>
                    <Input
                      value={reference.phoneNumber}
                      onChange={(e) =>
                        handleReferenceChange(
                          index,
                          "phoneNumber",
                          e.target.value,
                        )
                      }
                      placeholder="Enter 10-digit phone number"
                      className={`text-sm ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
                      maxLength={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium text-sm flex items-center gap-2`}
                    >
                      <Mail
                        size={16}
                        className={darkMode ? "text-gray-400" : "text-gray-500"}
                      />
                      Email ID
                    </Label>
                    <Input
                      type="email"
                      value={reference.email}
                      onChange={(e) =>
                        handleReferenceChange(index, "email", e.target.value)
                      }
                      placeholder="Enter email address"
                      className={`text-sm ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium text-sm flex items-center gap-2`}
                    >
                      <Calendar
                        size={16}
                        className={darkMode ? "text-gray-400" : "text-gray-500"}
                      />
                      Time Period ,he/she knows you
                    </Label>
                    <Input
                      value={reference.knownPeriod}
                      onChange={(e) =>
                        handleReferenceChange(
                          index,
                          "knownPeriod",
                          e.target.value,
                        )
                      }
                      placeholder="e.g., 2 years, 6 months"
                      className={`text-sm ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label
                      className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium text-sm`}
                    >
                      Capacity in which he/she knows you
                    </Label>
                    <Input
                      value={reference.capacity}
                      onChange={(e) =>
                        handleReferenceChange(index, "capacity", e.target.value)
                      }
                      placeholder="e.g., Manager, Colleague, Client"
                      className={`text-sm ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Employee Referral Section REMOVED */}

          {errors.referencesGeneral && (
            <div
              className={`mb-4 p-3 ${darkMode ? "bg-red-900/50 border-red-700" : "bg-red-50 border-red-200"} rounded-lg flex items-center gap-2`}
            >
              <AlertCircle
                className={`h-5 w-5 ${darkMode ? "text-red-400" : "text-red-600"}`}
              />
              <p
                className={`text-sm ${darkMode ? "text-red-300" : "text-red-600"}`}
              >
                {errors.referencesGeneral}
              </p>
            </div>
          )}

          <Button
            onClick={submitProfessionalReferences}
            disabled={referencesLoading}
            className={`w-full ${referencesSuccess ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
          >
            {referencesLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving References...
              </div>
            ) : referencesSuccess ? (
              <>
                <CheckCircle size={16} className="mr-2" />
                References Saved
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Professional References
              </>
            )}
          </Button>
        </Card>

        {/* About Self Section */}
        <Card
          className={`p-6 ${aboutSelfSuccess ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"} ${darkMode ? "from-gray-800 to-gray-700 border-gray-600" : ""}`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Target
                className={darkMode ? "text-purple-400" : "text-purple-600"}
                size={20}
              />
              <h2
                className={`text-xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
              >
                About Self
              </h2>
            </div>
            {aboutSelfSuccess && (
              <CheckCircle
                className={darkMode ? "text-green-400" : "text-green-600"}
                size={20}
              />
            )}
          </div>

          {/* Employee ID Input for About Self - HIDDEN */}
          <div className="hidden mb-4">
            <Label
              htmlFor="aboutSelfEmployeeId"
              className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium`}
            >
              Employee ID {generatedEmployeeId ? "(Auto-filled)" : ""}
            </Label>
            <Input
              id="aboutSelfEmployeeId"
              value={aboutSelfEmployeeId}
              onChange={(e) => setAboutSelfEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              className={`${errors.aboutSelfEmployeeId ? "border-red-500" : ""} ${
                generatedEmployeeId
                  ? darkMode
                    ? "bg-green-900/50 border-green-700"
                    : "bg-green-50 border-green-300"
                  : ""
              } ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
              readOnly={!!generatedEmployeeId}
            />
            {errors.aboutSelfEmployeeId && (
              <p
                className={`text-sm ${darkMode ? "text-red-400" : "text-red-600"}`}
              >
                {errors.aboutSelfEmployeeId}
              </p>
            )}
            {generatedEmployeeId && (
              <p
                className={`text-xs ${darkMode ? "text-green-400" : "text-green-600"} mt-1`}
              >
                ✓ Auto-filled from previous step
              </p>
            )}
          </div>

          <div
            className={`space-y-6 mb-6 ${darkMode ? "bg-gray-700/50" : "bg-white/50"} rounded-lg p-4`}
          >
            <div className="space-y-2">
              <Label
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium flex items-center gap-2`}
              >
                <span className="text-red-500 mr-1">*</span>
                1. What is your career ambition? How do you look at yourself in
                another 5 years from now?
              </Label>
              <Textarea
                value={formData.aboutSelf.careerAmbition}
                onChange={(e) =>
                  handleAboutSelfChange("careerAmbition", e.target.value)
                }
                placeholder="Describe your career ambitions and 5-year vision..."
                className={`text-sm min-h-[100px] ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium flex items-center gap-2`}
              >
                <span className="text-red-500 mr-1">*</span>
                2. Give details on significant achievements in your career/life
                if any
              </Label>
              <Textarea
                value={formData.aboutSelf.achievements}
                onChange={(e) =>
                  handleAboutSelfChange("achievements", e.target.value)
                }
                placeholder="Describe your significant achievements..."
                className={`text-sm min-h-[100px] ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium flex items-center gap-2`}
              >
                <span className="text-red-500 mr-1">*</span>
                3. Give details on professional failures if any? How do you plan
                to overcome them?
              </Label>
              <Textarea
                value={formData.aboutSelf.professionalFailures}
                onChange={(e) =>
                  handleAboutSelfChange("professionalFailures", e.target.value)
                }
                placeholder="Describe any professional failures and your plan to overcome them..."
                className={`text-sm min-h-[100px] ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
                rows={4}
              />
            </div>
          </div>

          {/* Strengths and Weaknesses Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="space-y-4">
              <h3
                className={`text-lg font-medium ${darkMode ? "text-green-400" : "text-green-700"}`}
              >
                Your Strengths (any Three)
              </h3>
              {formData.strengths.map((strength, index) => (
                <div key={index} className="space-y-2">
                  <Label
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium text-sm`}
                  >
                    {index + 1}.
                  </Label>
                  <Input
                    value={strength}
                    onChange={(e) =>
                      handleStrengthChange(index, e.target.value)
                    }
                    placeholder={`Enter strength ${index + 1}`}
                    className={`text-sm ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3
                className={`text-lg font-medium ${darkMode ? "text-red-400" : "text-red-700"}`}
              >
                Your Weaknesses (any Three)
              </h3>
              {formData.weaknesses.map((weakness, index) => (
                <div key={index} className="space-y-2">
                  <Label
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium text-sm`}
                  >
                    {index + 1}.
                  </Label>
                  <Input
                    value={weakness}
                    onChange={(e) =>
                      handleWeaknessChange(index, e.target.value)
                    }
                    placeholder={`Enter weakness ${index + 1}`}
                    className={`text-sm ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {errors.aboutSelfGeneral && (
            <div
              className={`mb-4 p-3 ${darkMode ? "bg-red-900/50 border-red-700" : "bg-red-50 border-red-200"} rounded-lg flex items-center gap-2`}
            >
              <AlertCircle
                className={`h-5 w-5 ${darkMode ? "text-red-400" : "text-red-600"}`}
              />
              <p
                className={`text-sm ${darkMode ? "text-red-300" : "text-red-600"}`}
              >
                {errors.aboutSelfGeneral}
              </p>
            </div>
          )}

          <Button
            onClick={submitAboutSelf}
            disabled={aboutSelfLoading}
            className={`w-full ${aboutSelfSuccess ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"} text-white`}
          >
            {aboutSelfLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving About Self Details...
              </div>
            ) : aboutSelfSuccess ? (
              <>
                <CheckCircle size={16} className="mr-2" />
                About Self Details Saved
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save About Self Details
              </>
            )}
          </Button>
        </Card>

        {/* Company Info Card */}
        <Card
          className={`bg-gradient-to-r ${darkMode ? "from-gray-800 to-gray-700 border-gray-600" : "from-gray-50 to-slate-50 border-gray-200"} p-6`}
        >
          <div className="text-center">
            <h3
              className={`text-lg font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"} mb-2`}
            >
              ISCS Technologies Private Limited
            </h3>
            <p
              className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              TRUSTED IT CONSULTING PARTNER
            </p>
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
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
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
                Next
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}