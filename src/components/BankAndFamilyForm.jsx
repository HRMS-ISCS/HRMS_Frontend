//BankAndFamilyForm.jsx
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  CreditCard, 
  Users, 
  GraduationCap, 
  ArrowLeft, 
  ArrowRight, 
  Building, 
  Heart, 
  Calendar,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function BankAndFamilyForm({ initialData, generatedEmployeeId, onSubmit, onBack }) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // API-specific states
  const [bankLoading, setBankLoading] = useState(false);
  const [maritalLoading, setMaritalLoading] = useState(false);
  const [familyLoading, setFamilyLoading] = useState(false);
  const [academicLoading, setAcademicLoading] = useState(false);
  
  const [bankSuccess, setBankSuccess] = useState(false);
  const [maritalSuccess, setMaritalSuccess] = useState(false);
  const [familySuccess, setFamilySuccess] = useState(false);
  const [academicSuccess, setAcademicSuccess] = useState(false);
  
  const [bankEmployeeId, setBankEmployeeId] = useState("");
  const [maritalEmployeeId, setMaritalEmployeeId] = useState("");
  const [familyEmployeeId, setFamilyEmployeeId] = useState("");
  const [academicEmployeeId, setAcademicEmployeeId] = useState("");

  // Set employee IDs from props when component mounts or when generatedEmployeeId changes
  useEffect(() => {
    if (generatedEmployeeId) {
      setBankEmployeeId(generatedEmployeeId);
      setMaritalEmployeeId(generatedEmployeeId);
      setFamilyEmployeeId(generatedEmployeeId);
      setAcademicEmployeeId(generatedEmployeeId);
    }
  }, [generatedEmployeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFamilyMemberChange = (memberType, field, value) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: {
        ...prev.familyMembers,
        [memberType]: {
          ...prev.familyMembers[memberType],
          [field]: value
        }
      }
    }));
  };

  const handleAcademicChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      academicQualifications: prev.academicQualifications.map((qual, i) =>
        i === index ? { ...qual, [field]: value } : qual
      )
    }));
  };

  const addAcademicQualification = () => {
    setFormData(prev => ({
      ...prev,
      academicQualifications: [
        ...prev.academicQualifications,
        {
          qualification: "",
          specification: "",
          instituteName: "",
          instituteAddress: "",
          yearOfPassing: "",
          durationFrom: "",
          durationTo: "",
          rankGradePercentage: ""
        }
      ]
    }));
  };

  const removeAcademicQualification = (index) => {
    if (formData.academicQualifications.length > 1) {
      setFormData(prev => ({
        ...prev,
        academicQualifications: prev.academicQualifications.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return (age - 1).toString();
    }
    return age.toString();
  };

  // API Submit Functions
  const submitBankAccount = async () => {
    if (!bankEmployeeId.trim()) {
      setErrors(prev => ({ ...prev, bankEmployeeId: "Employee ID is required" }));
      return;
    }

    if (!formData.bankName?.trim() || !formData.accountNumber?.trim() || !formData.ifscCode?.trim()) {
      setErrors(prev => ({ ...prev, bankGeneral: "Please fill all required bank details" }));
      return;
    }

    setBankLoading(true);
    setBankSuccess(false);
    
    try {
      const apiData = {
        bank_name: formData.bankName,
        account_number: formData.accountNumber,
        branch_name: formData.branch || null,
        ifsc_code: formData.ifscCode,
        account_type: formData.accountType || "Savings"
      };

      const response = await fetch(`http://127.0.0.1:8000/users/Bank_Account/${bankEmployeeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();

      if (response.ok) {
        setBankSuccess(true);
        setErrors(prev => ({ ...prev, bankGeneral: "" }));
        alert('Bank account details saved successfully!');
      } else {
        setErrors(prev => ({ ...prev, bankGeneral: result.detail || 'Failed to save bank details' }));
      }
    } catch (error) {
      console.error('Bank API Error:', error);
      setErrors(prev => ({ ...prev, bankGeneral: 'Failed to connect to server' }));
    } finally {
      setBankLoading(false);
    }
  };

  const submitMaritalStatus = async () => {
    if (!maritalEmployeeId.trim()) {
      setErrors(prev => ({ ...prev, maritalEmployeeId: "Employee ID is required" }));
      return;
    }

    if (!formData.maritalStatus?.trim()) {
      setErrors(prev => ({ ...prev, maritalGeneral: "Please select marital status" }));
      return;
    }

    setMaritalLoading(true);
    setMaritalSuccess(false);
    
    try {
      const apiData = {
        marital_status: formData.maritalStatus,
        marriage_date: formData.marriageDate || null
      };

      const response = await fetch(`http://127.0.0.1:8000/users/MaritalStatus/${maritalEmployeeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();

      if (response.ok) {
        setMaritalSuccess(true);
        setErrors(prev => ({ ...prev, maritalGeneral: "" }));
        alert('Marital status saved successfully!');
      } else {
        setErrors(prev => ({ ...prev, maritalGeneral: result.detail || 'Failed to save marital status' }));
      }
    } catch (error) {
      console.error('Marital API Error:', error);
      setErrors(prev => ({ ...prev, maritalGeneral: 'Failed to connect to server' }));
    } finally {
      setMaritalLoading(false);
    }
  };

  const submitFamilyBackground = async () => {
    if (!familyEmployeeId.trim()) {
      setErrors(prev => ({ ...prev, familyEmployeeId: "Employee ID is required" }));
      return;
    }

    setFamilyLoading(true);
    setFamilySuccess(false);
    
    try {
      const familyMemberTypes = ['employee', 'spouse', 'child1', 'child2', 'father', 'mother'];
      let successCount = 0;

      for (const memberType of familyMemberTypes) {
        const member = formData.familyMembers[memberType];
        
        if (member && (member.name?.trim() || member.dateOfBirth)) {
          const apiData = {
            relationship_status: memberType,
            name: member.name || null,
            gender: member.gender || null,
            date_of_birth: member.dateOfBirth || null,
            age: member.dateOfBirth ? parseInt(calculateAge(member.dateOfBirth)) : null
          };

          const response = await fetch(`http://127.0.0.1:8000/users/FamilyBackground/${familyEmployeeId}`, {
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
      }

      if (successCount > 0) {
        setFamilySuccess(true);
        setErrors(prev => ({ ...prev, familyGeneral: "" }));
        alert(`Family background saved successfully! (${successCount} members)`);
      } else {
        setErrors(prev => ({ ...prev, familyGeneral: 'No family member data to save' }));
      }
    } catch (error) {
      console.error('Family API Error:', error);
      setErrors(prev => ({ ...prev, familyGeneral: 'Failed to connect to server' }));
    } finally {
      setFamilyLoading(false);
    }
  };

  const submitAcademicBackground = async () => {
    if (!academicEmployeeId.trim()) {
      setErrors(prev => ({ ...prev, academicEmployeeId: "Employee ID is required" }));
      return;
    }

    const validQualifications = formData.academicQualifications.filter(qual => 
      qual.qualification?.trim() && qual.specification?.trim() && qual.instituteName?.trim()
    );

    if (validQualifications.length === 0) {
      setErrors(prev => ({ ...prev, academicGeneral: "Please fill at least one qualification" }));
      return;
    }

    setAcademicLoading(true);
    setAcademicSuccess(false);
    
    try {
      let successCount = 0;

      for (const qualification of validQualifications) {
        const apiData = {
          qualification: qualification.qualification,
          specification: qualification.specification,
          institute_name: qualification.instituteName,
          year_of_passing: parseInt(qualification.yearOfPassing) || 2024,
          duration_from: qualification.durationFrom || "2020-01-01",
          duration_to: qualification.durationTo || "2024-01-01",
          rank_or_grade: qualification.rankGradePercentage ? parseFloat(qualification.rankGradePercentage) : null
        };

        const response = await fetch(`http://127.0.0.1:8000/users/Academic_Background/${academicEmployeeId}`, {
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
        setAcademicSuccess(true);
        setErrors(prev => ({ ...prev, academicGeneral: "" }));
        alert(`Academic background saved successfully! (${successCount} qualifications)`);
      } else {
        setErrors(prev => ({ ...prev, academicGeneral: 'Failed to save academic qualifications' }));
      }
    } catch (error) {
      console.error('Academic API Error:', error);
      setErrors(prev => ({ ...prev, academicGeneral: 'Failed to connect to server' }));
    } finally {
      setAcademicLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic bank details validation
    if (!formData.bankName?.trim()) {
      newErrors.bankName = "Bank name is required";
    }
    
    if (!formData.accountNumber?.trim()) {
      newErrors.accountNumber = "Account number is required";
    }
    
    if (!formData.ifscCode?.trim()) {
      newErrors.ifscCode = "IFSC code is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      // Calculate ages for family members
      const updatedFormData = {
        ...formData,
        familyMembers: Object.keys(formData.familyMembers).reduce((acc, key) => {
          const member = formData.familyMembers[key];
          acc[key] = {
            ...member,
            age: calculateAge(member.dateOfBirth)
          };
          return acc;
        }, {})
      };
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubmit(updatedFormData);
      setLoading(false);
    }
  };

  const familyMemberTypes = [
    { key: 'employee', label: 'Employee' },
    { key: 'spouse', label: 'Spouse' },
    { key: 'child1', label: 'Child 1' },
    { key: 'child2', label: 'Child 2' },
    { key: 'father', label: 'Father' },
    { key: 'mother', label: 'Mother' }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bank Account & Family Details</h1>
        <p className="text-gray-600">Complete your banking, family background and academic information</p>
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
        {/* Bank Account Details Section */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CreditCard className="text-green-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Bank Account Details</h2>
            </div>
            {bankSuccess && <CheckCircle className="text-green-600" size={20} />}
          </div>
          
          {/* Employee ID Input for Bank */}
          <div className="mb-4">
            <Label htmlFor="bankEmployeeId" className="text-gray-700 font-medium">
              Employee ID {generatedEmployeeId ? '(Auto-filled)' : '*'}
            </Label>
            <Input
              id="bankEmployeeId"
              value={bankEmployeeId}
              onChange={(e) => setBankEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              className={`${errors.bankEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 'bg-green-50 border-green-300' : ''}`}
              readOnly={!!generatedEmployeeId}
            />
            {errors.bankEmployeeId && <p className="text-sm text-red-600">{errors.bankEmployeeId}</p>}
            {generatedEmployeeId && (
              <p className="text-xs text-green-600 mt-1">✓ Auto-filled from previous step</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-gray-700 font-medium flex items-center gap-2">
                <Building size={16} className="text-gray-500" />
                Bank Name *
              </Label>
              <Input
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter bank name"
                className={errors.bankName ? 'border-red-500' : ''}
              />
              {errors.bankName && <p className="text-sm text-red-600">{errors.bankName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch" className="text-gray-700 font-medium">
                Branch
              </Label>
              <Input
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="Enter branch name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-gray-700 font-medium">
                Account Number *
              </Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
                className={errors.accountNumber ? 'border-red-500' : ''}
              />
              {errors.accountNumber && <p className="text-sm text-red-600">{errors.accountNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ifscCode" className="text-gray-700 font-medium">
                IFSC Code *
              </Label>
              <Input
                id="ifscCode"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="Enter IFSC code"
                className={errors.ifscCode ? 'border-red-500' : ''}
              />
              {errors.ifscCode && <p className="text-sm text-red-600">{errors.ifscCode}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType" className="text-gray-700 font-medium">
                Account Type
              </Label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
              </select>
            </div>
          </div>

          {errors.bankGeneral && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-red-600" size={16} />
              <p className="text-sm text-red-600">{errors.bankGeneral}</p>
            </div>
          )}

          <Button
            onClick={submitBankAccount}
            disabled={bankLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {bankLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving Bank Details...
              </div>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Bank Account Details
              </>
            )}
          </Button>
        </Card>

        {/* Family Background Section */}
        <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Heart className="text-pink-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Marital Status</h2>
            </div>
            {maritalSuccess && <CheckCircle className="text-green-600" size={20} />}
          </div>
          
          {/* Employee ID Input for Marital */}
          <div className="mb-4">
            <Label htmlFor="maritalEmployeeId" className="text-gray-700 font-medium">
              Employee ID {generatedEmployeeId ? '(Auto-filled)' : '*'}
            </Label>
            <Input
              id="maritalEmployeeId"
              value={maritalEmployeeId}
              onChange={(e) => setMaritalEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              className={`${errors.maritalEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 'bg-green-50 border-green-300' : ''}`}
              readOnly={!!generatedEmployeeId}
            />
            {errors.maritalEmployeeId && <p className="text-sm text-red-600">{errors.maritalEmployeeId}</p>}
            {generatedEmployeeId && (
              <p className="text-xs text-green-600 mt-1">✓ Auto-filled from previous step</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="maritalStatus" className="text-gray-700 font-medium">
                Marital Status *
              </Label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <option value="">Select marital status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marriageDate" className="text-gray-700 font-medium flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                Marriage Date
              </Label>
              <Input
                id="marriageDate"
                name="marriageDate"
                type="date"
                value={formData.marriageDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {errors.maritalGeneral && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-red-600" size={16} />
              <p className="text-sm text-red-600">{errors.maritalGeneral}</p>
            </div>
          )}

          <Button
            onClick={submitMaritalStatus}
            disabled={maritalLoading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white mb-6"
          >
            {maritalLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving Marital Status...
              </div>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Marital Status
              </>
            )}
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="text-pink-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Family Members</h3>
            </div>
            {familySuccess && <CheckCircle className="text-green-600" size={20} />}
          </div>

          {/* Employee ID Input for Family */}
          <div className="mb-4">
            <Label htmlFor="familyEmployeeId" className="text-gray-700 font-medium">
              Employee ID {generatedEmployeeId ? '(Auto-filled)' : '*'}
            </Label>
            <Input
              id="familyEmployeeId"
              value={familyEmployeeId}
              onChange={(e) => setFamilyEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              className={`${errors.familyEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 'bg-green-50 border-green-300' : ''}`}
              readOnly={!!generatedEmployeeId}
            />
            {errors.familyEmployeeId && <p className="text-sm text-red-600">{errors.familyEmployeeId}</p>}
            {generatedEmployeeId && (
              <p className="text-xs text-green-600 mt-1">✓ Auto-filled from previous step</p>
            )}
          </div>

          {/* Family Members Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">Name</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">Gender</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">Date of Birth</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">Age</th>
                </tr>
              </thead>
              <tbody>
                {familyMemberTypes.map(({ key, label }) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-16">{label}</span>
                        <Input
                          value={formData.familyMembers[key]?.name || ""}
                          onChange={(e) => handleFamilyMemberChange(key, 'name', e.target.value)}
                          placeholder="Enter name"
                          className="text-sm"
                        />
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <select
                        value={formData.familyMembers[key]?.gender || ""}
                        onChange={(e) => handleFamilyMemberChange(key, 'gender', e.target.value)}
                        className="w-full h-8 rounded-md border border-gray-200 bg-white px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Input
                        type="date"
                        value={formData.familyMembers[key]?.dateOfBirth || ""}
                        onChange={(e) => handleFamilyMemberChange(key, 'dateOfBirth', e.target.value)}
                        className="text-sm"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Input
                        value={calculateAge(formData.familyMembers[key]?.dateOfBirth) || ""}
                        readOnly
                        placeholder="Auto-calculated"
                        className="text-sm bg-gray-50"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {errors.familyGeneral && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-red-600" size={16} />
              <p className="text-sm text-red-600">{errors.familyGeneral}</p>
            </div>
          )}

          <Button
            onClick={submitFamilyBackground}
            disabled={familyLoading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white"
          >
            {familyLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving Family Details...
              </div>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Family Background
              </>
            )}
          </Button>
        </Card>

        {/* Academic Background Section */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="text-blue-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Academic Background</h2>
            </div>
            <div className="flex items-center gap-4">
              {academicSuccess && <CheckCircle className="text-green-600" size={20} />}
              <Button
                type="button"
                onClick={addAcademicQualification}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Qualification
              </Button>
            </div>
          </div>
          
          {/* Employee ID Input for Academic */}
          <div className="mb-4">
            <Label htmlFor="academicEmployeeId" className="text-gray-700 font-medium">
              Employee ID {generatedEmployeeId ? '(Auto-filled)' : '*'}
            </Label>
            <Input
              id="academicEmployeeId"
              value={academicEmployeeId}
              onChange={(e) => setAcademicEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              className={`${errors.academicEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 'bg-green-50 border-green-300' : ''}`}
              readOnly={!!generatedEmployeeId}
            />
            {errors.academicEmployeeId && <p className="text-sm text-red-600">{errors.academicEmployeeId}</p>}
            {generatedEmployeeId && (
              <p className="text-xs text-green-600 mt-1">✓ Auto-filled from previous step</p>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-6">• Please fill in Reverse Chronological Order</p>

          <div className="space-y-6 mb-6">
            {formData.academicQualifications.map((qualification, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white relative">
                {formData.academicQualifications.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeAcademicQualification(index)}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Qualification *
                    </Label>
                    <Input
                      value={qualification.qualification}
                      onChange={(e) => handleAcademicChange(index, 'qualification', e.target.value)}
                      placeholder="e.g., B.Tech, M.Tech"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Specification *
                    </Label>
                    <Input
                      value={qualification.specification}
                      onChange={(e) => handleAcademicChange(index, 'specification', e.target.value)}
                      placeholder="e.g., Computer Science"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Year of Passing
                    </Label>
                    <Input
                      type="number"
                      value={qualification.yearOfPassing}
                      onChange={(e) => handleAcademicChange(index, 'yearOfPassing', e.target.value)}
                      placeholder="e.g., 2020"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Rank/Grade/Percentage
                    </Label>
                    <Input
                      value={qualification.rankGradePercentage}
                      onChange={(e) => handleAcademicChange(index, 'rankGradePercentage', e.target.value)}
                      placeholder="e.g., 85%, A Grade"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Institute/University Name *
                    </Label>
                    <Input
                      value={qualification.instituteName}
                      onChange={(e) => handleAcademicChange(index, 'instituteName', e.target.value)}
                      placeholder="Enter institute/university name"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Institute Address
                    </Label>
                    <Input
                      value={qualification.instituteAddress}
                      onChange={(e) => handleAcademicChange(index, 'instituteAddress', e.target.value)}
                      placeholder="Enter institute address"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Duration From
                    </Label>
                    <Input
                      type="date"
                      value={qualification.durationFrom}
                      onChange={(e) => handleAcademicChange(index, 'durationFrom', e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Duration To
                    </Label>
                    <Input
                      type="date"
                      value={qualification.durationTo}
                      onChange={(e) => handleAcademicChange(index, 'durationTo', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.academicGeneral && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-red-600" size={16} />
              <p className="text-sm text-red-600">{errors.academicGeneral}</p>
            </div>
          )}

          <Button
            onClick={submitAcademicBackground}
            disabled={academicLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {academicLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving Academic Details...
              </div>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Academic Background
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
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              <>
                Next Step
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}