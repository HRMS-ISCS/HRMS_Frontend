// src/components/EmploymentApplicationForm.jsx
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  User,
  Calendar,
  Briefcase,
  Building,
  Users,
  Code,
  ArrowRight,
  Mail,
  Phone,
  Save,
  CheckCircle,
  Loader2,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDarkMode } from "@/context/DarkModeContext";
import { apiRequest } from "../api";

export default function EmploymentApplicationForm({
  initialData = {},
  onSubmit,
}) {
  const { darkMode } = useDarkMode();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: initialData.name || "",
    employeeIdPrefix: initialData.employeeIdPrefix || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    dateOfJoining: initialData.dateOfJoining || "",
    position: initialData.position || "",
    clientName: initialData.clientName || "",
    skillSet: initialData.skillSet || "",
    generatedEmployeeId: initialData.generatedEmployeeId || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- NEW STATES FOR POSITION ---
  const [positions, setPositions] = useState([]);
  const [showNewPositionInput, setShowNewPositionInput] = useState(false);
  const [isSavingPosition, setIsSavingPosition] = useState(false);
  // ----------------------------------

  // Fetch existing positions from DB on mount
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await apiRequest("/positions");
        if (response && response.positions) {
          setPositions(response.positions);
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchPositions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // --- NEW: Create Position Handler ---
  const handleCreateNewPosition = async () => {
    const positionName = formData.position.trim();

    if (!positionName) {
      toast({
        title: "Error",
        description: "Position name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSavingPosition(true);
    try {
      // Call API to create position (POST /positions)
      const response = await apiRequest("/positions", {
        method: "POST",
        body: JSON.stringify({ name: positionName }),
      });

      if (response && response.position) {
        const pos = response.position;

        toast({
          title: pos.is_new ? "Position Created" : "Position Exists",
          description: pos.is_new
            ? "New position added to database"
            : "This position already exists. It has been selected.",
          className: darkMode
            ? "bg-green-900/80 border-green-700 text-green-100"
            : "bg-green-50 border-green-200 text-green-800",
        });

        // If it was new, update our local list so it appears in dropdown next time
        if (pos.is_new) {
          setPositions((prev) => [...prev, pos.name]);
        }

        // Ensure the main form has this name set so it submits correctly
        setFormData((prev) => ({ ...prev, position: pos.name }));

        // Optional: Switch back to dropdown view after saving
        // setShowNewPositionInput(false);
      }
    } catch (error) {
      console.error("Error creating position:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save position",
        variant: "destructive",
      });
    } finally {
      setIsSavingPosition(false);
    }
  };
  // ----------------------------------

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.employeeIdPrefix.trim()) {
      newErrors.employeeIdPrefix = "Employee ID prefix is required";
    } else if (
      !["ISCSI", "ISCSE"].includes(formData.employeeIdPrefix.toUpperCase())
    ) {
      newErrors.employeeIdPrefix =
        "Employee ID prefix must be either ISCSI or ISCSE";
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

    // Position Validation
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

  const handleSubmitAndNext = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setIsSuccess(false);

    try {
      const apiData = {
        name: formData.name,
        employee_id: formData.employeeIdPrefix.toUpperCase(),
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        date_of_joining: formData.dateOfJoining,
        client: formData.clientName,
        skill_set: formData.skillSet,
      };

      const result = await apiRequest("/users/Basic_Employee_Details", {
        method: "POST",
        body: JSON.stringify(apiData),
      });

      const generatedEmployeeId = result.id;

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Employee Created Successfully</span>
          </div>
        ),
        description: `ID: ${generatedEmployeeId}`,
        className: darkMode
          ? "bg-green-900/80 border-green-700 text-green-100"
          : "bg-green-50 border-green-200 text-green-800",
      });

      const updatedFormData = {
        ...formData,
        generatedEmployeeId: generatedEmployeeId,
      };
      setFormData(updatedFormData);
      setIsSuccess(true);

      if (onSubmit) {
        onSubmit(updatedFormData);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create employee. Please try again.",
        variant: "destructive",
      });
      setErrors({
        submit: error.message || "Failed to create employee. Please try again.",
      });
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card
        className={`p-4 sm:p-6 ${darkMode ? "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600" : "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200"}`}
      >
        <div className="text-center mb-6 sm:mb-8">
          <h1
            className={`text-2xl sm:text-3xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"} mb-2`}
          >
            Employment Application
          </h1>
          <p
            className={`text-sm sm:text-base ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Please fill in your employment details
          </p>
        </div>

        {formData.generatedEmployeeId && (
          <Card
            className={`p-3 sm:p-4 mb-4 sm:mb-6 ${darkMode ? "bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-700" : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"}`}
          >
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center text-center sm:text-left">
              <div className="flex items-center gap-2">
                <Building
                  size={16}
                  className={darkMode ? "text-green-400" : "text-green-600"}
                />
                <span
                  className={`text-sm sm:text-base ${darkMode ? "text-gray-200" : "text-gray-700"} font-medium`}
                >
                  <span className="hidden sm:inline">
                    Generated Employee ID:
                  </span>
                  <span className="sm:hidden">Employee ID:</span>
                </span>
              </div>
              <span
                className={`text-lg sm:text-xl font-bold ${darkMode ? "text-green-300" : "text-green-700"}`}
              >
                {formData.generatedEmployeeId}
              </span>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmitAndNext} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Name Field */}
            <div className="lg:col-span-2 space-y-2">
              <Label
                htmlFor="name"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium flex items-center gap-2 text-sm sm:text-base`}
              >
                <User
                  size={16}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`h-10 sm:h-12 transition-all duration-200 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"} text-sm sm:text-base ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
              {errors.name && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Employee ID Prefix Field (Dropdown) */}
            <div className="space-y-2">
              <Label
                htmlFor="employeeIdPrefix"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium flex items-center gap-2 text-sm sm:text-base`}
              >
                <Building
                  size={16}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
                Employee ID Prefix *
              </Label>
              <select
                id="employeeIdPrefix"
                name="employeeIdPrefix"
                value={formData.employeeIdPrefix}
                onChange={handleChange}
                className={`h-10 sm:h-12 w-full rounded-md border px-3 py-2 text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-200"
                } ${
                  errors.employeeIdPrefix
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-green-500"
                }`}
              >
                <option value="" disabled>
                  Select Prefix
                </option>
                <option value="ISCSI">ISCSI</option>
                <option value="ISCSE">ISCSE</option>
              </select>
              <p
                className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}
              >
                Select either "ISCSI" or "ISCSE". The system will auto-generate
                the complete ID.
              </p>
              {errors.employeeIdPrefix && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">
                  {errors.employeeIdPrefix}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium flex items-center gap-2 text-sm sm:text-base`}
              >
                <Mail
                  size={16}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`h-10 sm:h-12 transition-all duration-200 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"} text-sm sm:text-base ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
              {errors.email && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium flex items-center gap-2 text-sm sm:text-base`}
              >
                <Phone
                  size={16}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
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
                className={`h-10 sm:h-12 transition-all duration-200 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"} text-sm sm:text-base ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
              {errors.phone && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Date of Joining Field */}
            <div className="space-y-2">
              <Label
                htmlFor="dateOfJoining"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium flex items-center gap-2 text-sm sm:text-base`}
              >
                <Calendar
                  size={16}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
                Date of Joining *
              </Label>
              <Input
                id="dateOfJoining"
                name="dateOfJoining"
                type="date"
                value={formData.dateOfJoining}
                onChange={handleChange}
                className={`h-10 sm:h-12 transition-all duration-200 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"} text-sm sm:text-base ${
                  errors.dateOfJoining
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
              {errors.dateOfJoining && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">
                  {errors.dateOfJoining}
                </p>
              )}
            </div>
            {/* Position Field */}
            {/* <div className="lg:col-span-2 space-y-2">
              <Label
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium flex items-center gap-2 text-sm sm:text-base`}
              >
                <Briefcase
                  size={16}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
                Position *
              </Label>

              {showNewPositionInput ? (
                // MODE: ADD NEW
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="position"
                      name="position"
                      type="text"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="Enter new position title..."
                      className={`h-10 sm:h-12 flex-1 transition-all duration-200 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"} text-sm sm:text-base ${
                        errors.position
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-green-500"
                      }`}
                    />
                    <Button
                      type="button"
                      onClick={handleCreateNewPosition}
                      disabled={isSavingPosition}
                      className="bg-green-600 hover:bg-green-700 text-white h-10 sm:h-12 px-4 flex items-center gap-2"
                    >
                      {isSavingPosition ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      <span className="hidden sm:inline">Save</span>
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewPositionInput(false)}
                    className={`text-xs sm:text-sm ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"} flex items-center gap-1`}
                  >
                    ← Back to selection
                  </button>
                </div>
              ) : (
                // MODE: SELECT EXISTING
                <div className="space-y-2">
                  <div className="relative">
                    <select
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      size="3"
                      className={`w-full rounded-md border px-3 py-2 pr-10 text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        darkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-900 border-gray-200"
                      } ${
                        errors.position
                          ? "border-red-500 focus:border-red-500"
                          : "focus:border-green-500"
                      }`}
                      style={{
                        minHeight: "120px",
                        overflowY: "auto",
                      }}
                    >
                      <option value="">Select a position</option>
                      {positions.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewPositionInput(true)}
                    className={`text-xs sm:text-sm ${darkMode ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-700"} flex items-center gap-1`}
                  >
                    <Plus size={14} />
                    Add new position
                  </button>
                </div>
              )}

              {errors.position && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">
                  {errors.position}
                </p>
              )}
            </div> */}
            {/* Position Field */}
<div className="lg:col-span-2 space-y-2">
  <Label
    className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium flex items-center gap-2 text-sm sm:text-base`}
  >
    <Briefcase
      size={16}
      className={darkMode ? "text-gray-400" : "text-gray-500"}
    />
    Position *
  </Label>

  {showNewPositionInput ? (
    // MODE: ADD NEW
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id="position"
          name="position"
          type="text"
          value={formData.position}
          onChange={handleChange}
          placeholder="Enter new position title..."
          className={`h-10 sm:h-12 flex-1 transition-all duration-200 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"} text-sm sm:text-base ${
            errors.position
              ? "border-red-500 focus:border-red-500"
              : "border-gray-200 focus:border-green-500"
          }`}
        />
        <Button
          type="button"
          onClick={handleCreateNewPosition}
          disabled={isSavingPosition}
          className="bg-green-600 hover:bg-green-700 text-white h-10 sm:h-12 px-4 flex items-center gap-2"
        >
          {isSavingPosition ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          <span className="hidden sm:inline">Save</span>
        </Button>
      </div>
      <button
        type="button"
        onClick={() => setShowNewPositionInput(false)}
        className={`text-xs sm:text-sm ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"} flex items-center gap-1`}
      >
        ← Back to selection
      </button>
    </div>
  ) : (
    // MODE: SELECT EXISTING - BLOCK STYLE
    <div className="space-y-2">
      <div 
        className={`rounded-md border transition-all duration-200 ${
          darkMode
            ? "bg-gray-700/30 border-gray-600"
            : "bg-gray-50 border-gray-200"
        } ${
          errors.position
            ? "border-red-500"
            : ""
        }`}
        style={{
          minHeight: "120px",
          maxHeight: "160px",
          overflowY: "auto",
          padding: "8px"
        }}
      >
        {/* Placeholder when nothing selected */}
        {!formData.position && positions.length > 0 && (
          <div className={`text-sm px-3 py-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Select a position from below
          </div>
        )}
        
        {positions.length === 0 && (
          <div className={`text-sm px-3 py-2 ${darkMode ? "text-gray-500" : "text-gray-400"} text-center`}>
            No positions available. Add a new one below.
          </div>
        )}

        {/* Position Blocks */}
        <div className="space-y-1">
          {positions.map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, position: pos }));
                if (errors.position) {
                  setErrors((prev) => ({ ...prev, position: "" }));
                }
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm sm:text-base transition-all duration-200 ${
                formData.position === pos
                  ? darkMode
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-500 text-white shadow-md"
                  : darkMode
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600"
                  : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{pos}</span>
                {formData.position === pos && (
                  <CheckCircle size={16} className="flex-shrink-0 ml-2" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <button
        type="button"
        onClick={() => setShowNewPositionInput(true)}
        className={`text-xs sm:text-sm ${darkMode ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-700"} flex items-center gap-1`}
      >
        <Plus size={14} />
        Add new position
      </button>
    </div>
  )}

  {errors.position && (
    <p className="text-xs sm:text-sm text-red-600 mt-1">
      {errors.position}
    </p>
  )}
</div>

            
            {/* Client Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="clientName"
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium flex items-center gap-2 text-sm sm:text-base`}
              >
                <Users
                  size={16}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
                Client Name *
              </Label>
              <Input
                id="clientName"
                name="clientName"
                type="text"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Enter client name"
                className={`h-10 sm:h-12 transition-all duration-200 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"} text-sm sm:text-base ${
                  errors.clientName
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
              />
              {errors.clientName && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">
                  {errors.clientName}
                </p>
              )}
            </div>
          </div>

          {/* Skill Set Field - Full width */}
          <div className="space-y-2">
            <Label
              htmlFor="skillSet"
              className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium flex items-center gap-2 text-sm sm:text-base`}
            >
              <Code
                size={16}
                className={darkMode ? "text-gray-400" : "text-gray-500"}
              />
              Skill Set *
            </Label>
            <Textarea
              id="skillSet"
              name="skillSet"
              value={formData.skillSet}
              onChange={handleChange}
              placeholder="Enter your skills and technologies (e.g., React, Node.js, Python, etc.)"
              className={`min-h-[80px] sm:min-h-[100px] transition-all duration-200 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"} text-sm sm:text-base ${
                errors.skillSet
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
            />
            {errors.skillSet && (
              <p className="text-xs sm:text-sm text-red-600 mt-1">
                {errors.skillSet}
              </p>
            )}
          </div>

          {/* Submit Error Display */}
          {errors.submit && (
            <div
              className={`p-3 ${darkMode ? "bg-red-900/50 border-red-700" : "bg-red-50 border-red-200"} rounded-lg`}
            >
              <p
                className={`text-xs sm:text-sm ${darkMode ? "text-red-300" : "text-red-600"} text-center`}
              >
                {errors.submit}
              </p>
            </div>
          )}

          {/* Company Info Card */}
          <Card
            className={`${darkMode ? "bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-700" : "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"} p-4 sm:p-6 mt-6 sm:mt-8`}
          >
            <div className="text-center">
              <h3
                className={`text-base sm:text-lg font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"} mb-1`}
              >
                ISCS Technologies Private Limited
              </h3>
              <p
                className={`text-xs sm:text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                TRUSTED IT CONSULTING PARTNER
              </p>
            </div>
          </Card>

          {/* Single Combined Action Button */}
          <div className="flex justify-center pt-4 sm:pt-6">
            <Button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-8 sm:px-10 py-3 bg-gradient-to-r ${
                isSuccess
                  ? "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  : "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              } text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : isSuccess ? (
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} />
                  <span>Proceeding to Next Step...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Submit & Next</span>
                  <ArrowRight size={18} />
                </div>
              )}
            </Button>
          </div>

          {/* Mobile Helper Text */}
          <div className="text-center pt-2">
            <p
              className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Submitting will create your record and move to the next section.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
