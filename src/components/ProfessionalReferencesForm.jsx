// //ProfessionalReferencesForm.jsx
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
  AlertTriangle,
  ArrowLeft, 
  ArrowRight,
  Mail,
  Phone,
  Building2,
  Calendar,
  Save,
  CheckCircle,
  AlertCircle,
  UserCheck
} from "lucide-react";

export default function ProfessionalReferencesForm({ initialData, generatedEmployeeId, onSubmit, onBack }) {
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

  // Set employee IDs from props when component mounts or when generatedEmployeeId changes
  useEffect(() => {
    if (generatedEmployeeId) {
      setReferencesEmployeeId(generatedEmployeeId);
      setAboutSelfEmployeeId(generatedEmployeeId);
    }
  }, [generatedEmployeeId]);

  const handleReferenceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      professionalReferences: prev.professionalReferences.map((ref, i) =>
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const handleEmployeeReferralChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      employeeReferral: {
        ...prev.employeeReferral,
        [field]: value
      }
    }));
  };

  const handleAboutSelfChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      aboutSelf: {
        ...prev.aboutSelf,
        [field]: value
      }
    }));
  };

  const handleStrengthChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      strengths: prev.strengths.map((strength, i) =>
        i === index ? value : strength
      )
    }));
  };

  const handleWeaknessChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      weaknesses: prev.weaknesses.map((weakness, i) =>
        i === index ? value : weakness
      )
    }));
  };

  // API Submit Functions
  const submitProfessionalReferences = async () => {
    if (!referencesEmployeeId.trim()) {
      setErrors(prev => ({ ...prev, referencesEmployeeId: "Employee ID is required" }));
      return;
    }

    const validReferences = formData.professionalReferences.filter(ref => 
      ref.name?.trim() && ref.designation?.trim() && ref.company?.trim() && 
      ref.address?.trim() && ref.phoneNumber?.trim() && ref.email?.trim()
    );

    if (validReferences.length === 0) {
      setErrors(prev => ({ ...prev, referencesGeneral: "Please fill at least one complete reference" }));
      return;
    }

    setReferencesLoading(true);
    setReferencesSuccess(false);
    
    try {
      let successCount = 0;

      for (const reference of validReferences) {
        const apiData = {
          name: reference.name,
          designation: reference.designation,
          company: reference.company,
          address: reference.address,
          tel_no: reference.phoneNumber,
          email: reference.email,
          period_known: reference.knownPeriod || "Not specified",
          capacity_known: reference.capacity || "Not specified",
          // Add the employee referral field
          referred_by_employee_ISCS: formData.employeeReferral.isReferred === 'yes'
        };

        const response = await fetch(`http://127.0.0.1:8000/users/Professional_Reference/${referencesEmployeeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData)
        });

        if (response.ok) {
          successCount++;
        } else {
          const errorData = await response.json();
          console.error('Reference API Error:', errorData);
        }
      }

      if (successCount > 0) {
        setReferencesSuccess(true);
        setErrors(prev => ({ ...prev, referencesGeneral: "" }));
        
        // Enhanced success message including referral status
        const referralStatus = formData.employeeReferral.isReferred === 'yes' 
          ? ` (Including employee referral by ${formData.employeeReferral.name || 'ISCS employee'})` 
          : '';
        
        alert(`Professional references saved successfully! (${successCount} references)${referralStatus}`);
      } else {
        setErrors(prev => ({ ...prev, referencesGeneral: 'Failed to save references' }));
      }
    } catch (error) {
      console.error('References API Error:', error);
      setErrors(prev => ({ ...prev, referencesGeneral: 'Failed to connect to server' }));
    } finally {
      setReferencesLoading(false);
    }
  };

  const submitAboutSelf = async () => {
    if (!aboutSelfEmployeeId.trim()) {
      setErrors(prev => ({ ...prev, aboutSelfEmployeeId: "Employee ID is required" }));
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
        weakness3: formData.weaknesses[2] || null
      };

      const response = await fetch(`http://127.0.0.1:8000/users/About_Self/${aboutSelfEmployeeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      if (response.ok) {
        setAboutSelfSuccess(true);
        setErrors(prev => ({ ...prev, aboutSelfGeneral: "" }));
        alert('About Self details saved successfully!');
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ ...prev, aboutSelfGeneral: errorData.detail || 'Failed to save about self details' }));
      }
    } catch (error) {
      console.error('About Self API Error:', error);
      setErrors(prev => ({ ...prev, aboutSelfGeneral: 'Failed to connect to server' }));
    } finally {
      setAboutSelfLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Professional References & Self Assessment</h1>
        <p className="text-gray-600">Provide professional references and tell us about yourself</p>
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
        {/* Professional References Section */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="text-blue-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Professional References</h2>
            </div>
            {referencesSuccess && <CheckCircle className="text-green-600" size={20} />}
          </div>
          
          {/* Employee ID Input for References */}
          <div className="mb-4">
            <Label htmlFor="referencesEmployeeId" className="text-gray-700 font-medium">
              Employee ID {generatedEmployeeId ? '(Auto-filled)' : '*'}
            </Label>
            <Input
              id="referencesEmployeeId"
              value={referencesEmployeeId}
              onChange={(e) => setReferencesEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              className={`${errors.referencesEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 'bg-green-50 border-green-300' : ''}`}
              readOnly={!!generatedEmployeeId}
            />
            {errors.referencesEmployeeId && <p className="text-sm text-red-600">{errors.referencesEmployeeId}</p>}
            {generatedEmployeeId && (
              <p className="text-xs text-green-600 mt-1">✓ Auto-filled from previous step</p>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-6">Give name and contact details of the persons who know you professionally</p>

          <div className="space-y-6 mb-6">
            {formData.professionalReferences.map((reference, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <User size={18} className="text-gray-600" />
                  Reference {index + 1}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Name *
                    </Label>
                    <Input
                      value={reference.name}
                      onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                      placeholder="Enter full name"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Designation *
                    </Label>
                    <Input
                      value={reference.designation}
                      onChange={(e) => handleReferenceChange(index, 'designation', e.target.value)}
                      placeholder="Enter designation"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                      <Building2 size={16} className="text-gray-500" />
                      Company *
                    </Label>
                    <Input
                      value={reference.company}
                      onChange={(e) => handleReferenceChange(index, 'company', e.target.value)}
                      placeholder="Enter company name"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Address *
                    </Label>
                    <Textarea
                      value={reference.address}
                      onChange={(e) => handleReferenceChange(index, 'address', e.target.value)}
                      placeholder="Enter complete address"
                      className="text-sm"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                      <Phone size={16} className="text-gray-500" />
                      Tel No to contact * (10 digits)
                    </Label>
                    <Input
                      value={reference.phoneNumber}
                      onChange={(e) => handleReferenceChange(index, 'phoneNumber', e.target.value)}
                      placeholder="Enter 10-digit phone number"
                      className="text-sm"
                      maxLength={10}
                      pattern="[0-9]{10}"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      Email ID *
                    </Label>
                    <Input
                      type="email"
                      value={reference.email}
                      onChange={(e) => handleReferenceChange(index, 'email', e.target.value)}
                      placeholder="Enter email address"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      Period for which he/she knows you
                    </Label>
                    <Input
                      value={reference.knownPeriod}
                      onChange={(e) => handleReferenceChange(index, 'knownPeriod', e.target.value)}
                      placeholder="e.g., 2 years, 6 months"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Capacity in which he/she knows you
                    </Label>
                    <Input
                      value={reference.capacity}
                      onChange={(e) => handleReferenceChange(index, 'capacity', e.target.value)}
                      placeholder="e.g., Manager, Colleague, Client"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Employee Referral Section - Enhanced with visual indicators */}
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <UserCheck className="text-yellow-600" size={20} />
              Employee Referral Information
              {formData.employeeReferral.isReferred === 'yes' && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  ✓ Will be included in references
                </span>
              )}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="text-gray-700 font-medium">
                  Referred by an employee of ISCS Technologies?
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isReferred"
                      value="yes"
                      checked={formData.employeeReferral.isReferred === 'yes'}
                      onChange={(e) => handleEmployeeReferralChange('isReferred', e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isReferred"
                      value="no"
                      checked={formData.employeeReferral.isReferred === 'no'}
                      onChange={(e) => handleEmployeeReferralChange('isReferred', e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>

              {formData.employeeReferral.isReferred === 'yes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white border border-green-200 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Referrer's Name:
                    </Label>
                    <Input
                      value={formData.employeeReferral.name}
                      onChange={(e) => handleEmployeeReferralChange('name', e.target.value)}
                      placeholder="Enter referrer's name"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Referrer's Tel No:
                    </Label>
                    <Input
                      value={formData.employeeReferral.phoneNumber}
                      onChange={(e) => handleEmployeeReferralChange('phoneNumber', e.target.value)}
                      placeholder="Enter referrer's phone number"
                      className="text-sm"
                    />
                  </div>
                </div>
              )}

              {formData.employeeReferral.isReferred === 'yes' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <strong>Note:</strong> This referral information will be automatically included when you save your professional references.
                      {formData.employeeReferral.name && (
                        <span className="block mt-1">
                          Referred by: <strong>{formData.employeeReferral.name}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {errors.referencesGeneral && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-red-600" size={16} />
              <p className="text-sm text-red-600">{errors.referencesGeneral}</p>
            </div>
          )}

          <Button
            onClick={submitProfessionalReferences}
            disabled={referencesLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-6 relative"
          >
            {referencesLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving References & Referral Info...
              </div>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Professional References
                {formData.employeeReferral.isReferred === 'yes' && (
                  <span className="ml-2 text-xs bg-blue-500 px-2 py-1 rounded-full">
                    + Referral
                  </span>
                )}
              </>
            )}
          </Button>
        </Card>

        {/* About Self Section */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Target className="text-purple-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">About Self</h2>
            </div>
            {aboutSelfSuccess && <CheckCircle className="text-green-600" size={20} />}
          </div>
          
          {/* Employee ID Input for About Self */}
          <div className="mb-4">
            <Label htmlFor="aboutSelfEmployeeId" className="text-gray-700 font-medium">
              Employee ID {generatedEmployeeId ? '(Auto-filled)' : '*'}
            </Label>
            <Input
              id="aboutSelfEmployeeId"
              value={aboutSelfEmployeeId}
              onChange={(e) => setAboutSelfEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              className={`${errors.aboutSelfEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 'bg-green-50 border-green-300' : ''}`}
              readOnly={!!generatedEmployeeId}
            />
            {errors.aboutSelfEmployeeId && <p className="text-sm text-red-600">{errors.aboutSelfEmployeeId}</p>}
            {generatedEmployeeId && (
              <p className="text-xs text-green-600 mt-1">✓ Auto-filled from previous step</p>
            )}
          </div>
          
          <div className="space-y-6 mb-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                1. What is your career ambition? How do you look at yourself in another 5 years from now?
              </Label>
              <Textarea
                value={formData.aboutSelf.careerAmbition}
                onChange={(e) => handleAboutSelfChange('careerAmbition', e.target.value)}
                placeholder="Describe your career ambitions and 5-year vision..."
                className="text-sm min-h-[100px]"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center gap-2">
                <Trophy size={16} className="text-gray-500" />
                2. Give details on significant achievements in your career/life if any
              </Label>
              <Textarea
                value={formData.aboutSelf.achievements}
                onChange={(e) => handleAboutSelfChange('achievements', e.target.value)}
                placeholder="Describe your significant achievements..."
                className="text-sm min-h-[100px]"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center gap-2">
                <AlertTriangle size={16} className="text-gray-500" />
                3. Give details on professional failures if any? How do you plan to overcome them?
              </Label>
              <Textarea
                value={formData.aboutSelf.professionalFailures}
                onChange={(e) => handleAboutSelfChange('professionalFailures', e.target.value)}
                placeholder="Describe any professional failures and your plan to overcome them..."
                className="text-sm min-h-[100px]"
                rows={4}
              />
            </div>
          </div>

          {/* Strengths and Weaknesses Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-green-700">Your Strengths (any Three)</h3>
              {formData.strengths.map((strength, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm">
                    {index + 1}.
                  </Label>
                  <Input
                    value={strength}
                    onChange={(e) => handleStrengthChange(index, e.target.value)}
                    placeholder={`Enter strength ${index + 1}`}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-red-700">Your Weaknesses (any Three)</h3>
              {formData.weaknesses.map((weakness, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm">
                    {index + 1}.
                  </Label>
                  <Input
                    value={weakness}
                    onChange={(e) => handleWeaknessChange(index, e.target.value)}
                    placeholder={`Enter weakness ${index + 1}`}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {errors.aboutSelfGeneral && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-red-600" size={16} />
              <p className="text-sm text-red-600">{errors.aboutSelfGeneral}</p>
            </div>
          )}

          <Button
            onClick={submitAboutSelf}
            disabled={aboutSelfLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {aboutSelfLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving About Self Details...
              </div>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save About Self Details
              </>
            )}
          </Button>
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
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Proceeding to Declaration...
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