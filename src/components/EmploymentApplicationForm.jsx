// EmploymentApplicationForm.jsx
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { User, Calendar, Briefcase, Building, Users, Code, ArrowRight, Mail, Phone, Save, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Import useToast

export default function EmploymentApplicationForm({ initialData = {}, onSubmit }) {
  const { toast } = useToast(); // Initialize toast
  
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    employeeIdPrefix: initialData.employeeIdPrefix || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    dateOfJoining: initialData.dateOfJoining || "",
    position: initialData.position || "",
    clientName: initialData.clientName || "",
    skillSet: initialData.skillSet || "",
    generatedEmployeeId: initialData.generatedEmployeeId || ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.employeeIdPrefix.trim()) {
      newErrors.employeeIdPrefix = "Employee ID prefix is required";
    } else if (!["ISCSI", "ISCSE"].includes(formData.employeeIdPrefix.toUpperCase())) {
      newErrors.employeeIdPrefix = "Employee ID prefix must be either ISCSI or ISCSE";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    
    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = "Date of joining is required";
    }
    
    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    
    if (!formData.skillSet.trim()) {
      newErrors.skillSet = "Skill set is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        if (onSubmit) {
          onSubmit(formData);
        }
        setLoading(false);
      }, 500);
    }
  };

  const handleSubmitToAPI = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    
    try {
      // Prepare data for API according to your specification
      const apiData = {
        name: formData.name,
        employee_id: formData.employeeIdPrefix.toUpperCase(), // Send just the prefix
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        date_of_joining: formData.dateOfJoining, // Already in YYYY-MM-DD format from date input
        client: formData.clientName,
        skill_set: formData.skillSet
      };

      console.log('Sending data to API:', apiData);

      const response = await fetch('http://127.0.0.1:8000/users/Basic_Employee_Details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();

      if (response.ok) {
        const generatedEmployeeId = result.id; // Extract the generated ID
        
        // Show success toast instead of alert
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Employee Created Successfully</span>
            </div>
          ),
          description: `ID: ${generatedEmployeeId}`,
          className: "bg-green-50 border-green-200 text-green-800",
        });
        
        // Update form data with generated employee ID
        const updatedFormData = {
          ...formData,
          generatedEmployeeId: generatedEmployeeId
        };
        
        // Pass the updated data including generated employee ID to parent
        if (onSubmit) {
          onSubmit(updatedFormData);
        }
      } else {
        // Handle API errors
        setErrors({ submit: result.detail || 'An error occurred while creating employee' });
      }
    } catch (error) {
      console.error('API Error:', error);
      setErrors({ submit: 'Failed to connect to server. Please try again.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Form Card */}
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Employment Application</h1>
          <p className="text-sm sm:text-base text-gray-600">Please fill in your employment details</p>
        </div>

        {/* Display Generated Employee ID if available */}
        {formData.generatedEmployeeId && (
          <Card className="p-3 sm:p-4 mb-4 sm:mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center text-center sm:text-left">
              <div className="flex items-center gap-2">
                <Building size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700 font-medium">
                  <span className="hidden sm:inline">Generated Employee ID:</span>
                  <span className="sm:hidden">Employee ID:</span>
                </span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-green-700">{formData.generatedEmployeeId}</span>
            </div>
          </Card>
        )}

        <div className="space-y-4 sm:space-y-6">
          {/* Form Grid - 2 columns on larger screens, 1 on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Name Field */}
            <div className="lg:col-span-2 space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                <User size={14} sm:size={16} className="text-gray-500 flex-shrink-0" />
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`h-10 sm:h-12 transition-all duration-200 bg-white text-sm sm:text-base ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                }`}
              />
              {errors.name && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Employee ID Prefix Field */}
            <div className="space-y-2">
              <Label htmlFor="employeeIdPrefix" className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                <Building size={14} sm:size={16} className="text-gray-500 flex-shrink-0" />
                Employee ID Prefix *
              </Label>
              <Input
                id="employeeIdPrefix"
                name="employeeIdPrefix"
                type="text"
                value={formData.employeeIdPrefix}
                onChange={handleChange}
                placeholder="Enter ISCSI or ISCSE"
                className={`h-10 sm:h-12 transition-all duration-200 bg-white text-sm sm:text-base ${
                  errors.employeeIdPrefix ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                }`}
                maxLength={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter either "ISCSI" or "ISCSE". The system will auto-generate the complete ID.
              </p>
              {errors.employeeIdPrefix && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.employeeIdPrefix}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                <Mail size={14} sm:size={16} className="text-gray-500 flex-shrink-0" />
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`h-10 sm:h-12 transition-all duration-200 bg-white text-sm sm:text-base ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                }`}
              />
              {errors.email && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                <Phone size={14} sm:size={16} className="text-gray-500 flex-shrink-0" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                className={`h-10 sm:h-12 transition-all duration-200 bg-white text-sm sm:text-base ${
                  errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                }`}
              />
              {errors.phone && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Date of Joining Field */}
            <div className="space-y-2">
              <Label htmlFor="dateOfJoining" className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                <Calendar size={14} sm:size={16} className="text-gray-500 flex-shrink-0" />
                Date of Joining *
              </Label>
              <Input
                id="dateOfJoining"
                name="dateOfJoining"
                type="date"
                value={formData.dateOfJoining}
                onChange={handleChange}
                className={`h-10 sm:h-12 transition-all duration-200 bg-white text-sm sm:text-base ${
                  errors.dateOfJoining ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                }`}
              />
              {errors.dateOfJoining && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.dateOfJoining}</p>
              )}
            </div>

            {/* Position Field */}
            <div className="space-y-2">
              <Label htmlFor="position" className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                <Briefcase size={14} sm:size={16} className="text-gray-500 flex-shrink-0" />
                Position *
              </Label>
              <Input
                id="position"
                name="position"
                type="text"
                value={formData.position}
                onChange={handleChange}
                placeholder="Enter your position/job title"
                className={`h-10 sm:h-12 transition-all duration-200 bg-white text-sm sm:text-base ${
                  errors.position ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                }`}
              />
              {errors.position && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.position}</p>
              )}
            </div>

            {/* Client Name Field */}
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                <Users size={14} sm:size={16} className="text-gray-500 flex-shrink-0" />
                Client Name *
              </Label>
              <Input
                id="clientName"
                name="clientName"
                type="text"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Enter client name"
                className={`h-10 sm:h-12 transition-all duration-200 bg-white text-sm sm:text-base ${
                  errors.clientName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                }`}
              />
              {errors.clientName && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.clientName}</p>
              )}
            </div>
            
          </div>

          {/* Skill Set Field - Full width */}
          <div className="space-y-2">
            <Label htmlFor="skillSet" className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
              <Code size={14} sm:size={16} className="text-gray-500 flex-shrink-0" />
              Skill Set *
            </Label>
            <Textarea
              id="skillSet"
              name="skillSet"
              value={formData.skillSet}
              onChange={handleChange}
              placeholder="Enter your skills and technologies (e.g., React, Node.js, Python, etc.)"
              className={`min-h-[80px] sm:min-h-[100px] transition-all duration-200 bg-white text-sm sm:text-base ${
                errors.skillSet ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
              }`}
            />
            {errors.skillSet && (
              <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.skillSet}</p>
            )}
          </div>

          {/* Submit Error Display */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs sm:text-sm text-red-600 text-center">{errors.submit}</p>
            </div>
          )}

          {/* Company Info Card */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 p-4 sm:p-6 mt-6 sm:mt-8">
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                ISCS Technologies Private Limited
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">TRUSTED IT CONSULTING PARTNER</p>
            </div>
          </Card>

          {/* Action Buttons - Stack on mobile, side by side on larger screens */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between pt-4 sm:pt-6">
            {/* Submit Button */}
            <Button
              onClick={handleSubmitToAPI}
              disabled={submitLoading}
              className="w-full sm:w-auto order-2 sm:order-1 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
            >
              {submitLoading ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Submitting...</span>
                  <span className="sm:hidden">Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Save size={14} sm:size={16} />
                  <span className="hidden sm:inline">Submit</span>
                  <span className="sm:hidden">Submit</span>
                </div>
              )}
            </Button>

            {/* Next Button */}
            <Button
              onClick={handleNext}
              disabled={loading}
              className="w-full sm:w-auto order-1 sm:order-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Processing...</span>
                  <span className="sm:hidden">Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="hidden sm:inline">Next: Personal Profile</span>
                  <span className="sm:hidden">Next: Personal</span>
                  <ArrowRight size={14} sm:size={16} />
                </div>
              )}
            </Button>
          </div>

          {/* Mobile Helper Text */}
          <div className="sm:hidden text-center pt-2">
            <p className="text-xs text-gray-500">
              Complete this step to continue to Personal Profile
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}