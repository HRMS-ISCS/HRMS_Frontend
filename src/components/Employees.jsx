// src/components/Employees.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Loader2,
  RefreshCw,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Building2,
  Code,
  AlertCircle,
  CheckCircle2,
  Eye,
  Filter,
  MapPin,
  CreditCard,
  GraduationCap,
  Award,
  Heart,
  FileText,
  Contact,
  Building,
  Banknote,
  ChevronDown,
  ChevronRight,
  UserCheck,
  Shield,
  Home,
  Flag,
  Globe,
  BookOpen,
  Target,
  TrendingUp,
  AlertTriangle,
  Zap,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { apiRequest } from "../api";
import { useDarkMode } from "@/context/DarkModeContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function Employees() {
  const { darkMode } = useDarkMode();
  const [allEmployees, setAllEmployees] = useState([]);
  const [paginationData, setPaginationData] = useState({
    total: 0,
    page: 1,
    pageSize: 8,
    totalPages: 0,
  });
  const [searchedEmployee, setSearchedEmployee] = useState(null);
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [expandedSections, setExpandedSections] = useState({
    personalProfile: true,
    bankAccount: false,
    maritalStatus: false,
    familyBackground: false,
    academicBackground: false,
    professionalTraining: false,
    professionalExperience: false,
    professionalReference: false,
    aboutSelf: false,
    declaration: false,
  });
  const [profilePictures, setProfilePictures] = useState({});

  // Edit dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editDialogSection, setEditDialogSection] = useState(null);
  const [editDialogData, setEditDialogData] = useState({});
  const [editDialogTitle, setEditDialogTitle] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // Edit mode for employee basic info
  const [isEditBasicInfoOpen, setIsEditBasicInfoOpen] = useState(false);
  const [basicInfoData, setBasicInfoData] = useState({});

  // Fetch employees
  const fetchEmployees = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest(
          `/db/employment-applications?page=${page}&page_size=${itemsPerPage}`,
        );

        if (data.applications) {
          setAllEmployees(data.applications);
          setPaginationData({
            total: data.total,
            page: data.page,
            pageSize: data.page_size,
            totalPages: data.total_pages,
          });
        } else {
          setAllEmployees(data || []);
          setPaginationData({
            total: data?.length || 0,
            page: 1,
            pageSize: itemsPerPage,
            totalPages: Math.ceil((data?.length || 0) / itemsPerPage),
          });
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Failed to fetch employee data. Please try again.");
        setAllEmployees([]);
        setPaginationData({
          total: 0,
          page: 1,
          pageSize: itemsPerPage,
          totalPages: 0,
        });
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage],
  );

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage, fetchEmployees]);

  // Fetch profile pictures
  const fetchProfilePictures = useCallback(async () => {
    if (allEmployees.length === 0) return;

    try {
      const picturePromises = allEmployees.map(async (employee) => {
        try {
          const data = await apiRequest(
            `/db/generate-sas/${employee.employee_id}`,
          );
          if (data.personal_documents?.profile_photo?.sas_url) {
            return {
              employeeId: employee.employee_id,
              profilePicture: data.personal_documents.profile_photo.sas_url,
            };
          }
          return null;
        } catch (error) {
          console.error(
            `Error fetching profile picture for ${employee.employee_id}:`,
            error,
          );
          return null;
        }
      });

      const results = await Promise.all(picturePromises);
      const pictureMap = {};
      results.forEach((result) => {
        if (result) pictureMap[result.employeeId] = result.profilePicture;
      });
      setProfilePictures(pictureMap);
    } catch (error) {
      console.error("Error fetching profile pictures:", error);
    }
  }, [allEmployees]);

  useEffect(() => {
    fetchProfilePictures();
  }, [fetchProfilePictures]);

  // Search employee by ID
  const searchEmployeeById = async (employeeId = null) => {
    const idToSearch = employeeId || searchEmployeeId.trim();
    if (!idToSearch) {
      setSearchError("Please enter an employee ID");
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    try {
      const data = await apiRequest(
        `/db/employment-applications/${idToSearch}`,
      );
      setSearchedEmployee(data);
      setSearchMode(true);
      setSearchEmployeeId(idToSearch);

      try {
        const picData = await apiRequest(`/db/generate-sas/${idToSearch}`);
        if (picData.personal_documents?.profile_photo?.sas_url) {
          setProfilePictures((prev) => ({
            ...prev,
            [idToSearch]: picData.personal_documents.profile_photo.sas_url,
          }));
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }

      setExpandedSections({
        personalProfile: true,
        bankAccount: false,
        maritalStatus: false,
        familyBackground: false,
        academicBackground: false,
        professionalTraining: false,
        professionalExperience: false,
        professionalReference: false,
        aboutSelf: false,
        declaration: false,
      });
    } catch (error) {
      console.error("Error searching employee:", error);
      setSearchError(
        error.message || "Failed to search employee. Please try again.",
      );
      setSearchedEmployee(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchMode(false);
    setSearchedEmployee(null);
    setSearchEmployeeId("");
    setSearchError("");
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") searchEmployeeById();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRefresh = () => {
    if (searchMode) {
      clearSearch();
    }
    fetchEmployees(currentPage);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // Open edit dialog for a section
  const openEditDialog = (sectionKey, currentData) => {
    setEditDialogSection(sectionKey);

    const titles = {
      personalProfile: "Edit Personal Profile",
      bankAccount: "Edit Bank Account Details",
      maritalStatus: "Edit Marital Status",
      familyBackground: "Edit Family Background",
      academicBackground: "Edit Academic Background",
      professionalTraining: "Edit Professional Training",
      professionalExperience: "Edit Professional Experience",
      professionalReference: "Edit Professional Reference",
      aboutSelf: "Edit About Self",
      declaration: "Edit Declaration",
    };
    setEditDialogTitle(titles[sectionKey] || "Edit Information");

    const clonedData = JSON.parse(JSON.stringify(currentData));
    setEditDialogData(clonedData);
    setIsEditDialogOpen(true);
  };

  // Open edit dialog for basic info
  const openEditBasicInfo = (employee) => {
    setBasicInfoData({
      employee_id: employee.employee_id || "",
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      position: employee.position || "",
      date_of_joining: formatDateForInput(employee.date_of_joining),
      client: employee.client || "",
      skill_set: employee.skill_set || "",
    });
    setIsEditBasicInfoOpen(true);
  };

  // Handle input changes in edit dialog
  const handleEditDialogChange = (field, value) => {
    setEditDialogData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle array field changes in edit dialog
  const handleArrayFieldChange = (index, field, value, arrayName) => {
    setEditDialogData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  // Add item to array
  const addArrayItem = (arrayName, template = {}) => {
    setEditDialogData((prev) => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), template],
    }));
  };

  // Remove item from array
  const removeArrayItem = (index, arrayName) => {
    setEditDialogData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  // Save section changes
  const saveSectionChanges = async () => {
    if (!searchedEmployee?.employee_id) return;

    setSaveLoading(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      let updatePayload = {};

      if (editDialogSection === "personalProfile") {
        updatePayload.personal_profile = editDialogData;
      } else if (editDialogSection === "bankAccount") {
        updatePayload.bank_account = editDialogData;
      } else if (editDialogSection === "maritalStatus") {
        updatePayload.marital_status = editDialogData;
      } else if (editDialogSection === "familyBackground") {
        updatePayload.family_background =
          editDialogData.family_background || [];
      } else if (editDialogSection === "academicBackground") {
        updatePayload.academic_background =
          editDialogData.academic_background || [];
      } else if (editDialogSection === "professionalTraining") {
        updatePayload.professional_training =
          editDialogData.professional_training || [];
      } else if (editDialogSection === "professionalExperience") {
        updatePayload.professional_experience =
          editDialogData.professional_experience || [];
      } else if (editDialogSection === "professionalReference") {
        updatePayload.professional_reference =
          editDialogData.professional_reference || [];
      } else if (editDialogSection === "aboutSelf") {
        updatePayload.about_self = editDialogData;
      } else if (editDialogSection === "declaration") {
        updatePayload.declaration = editDialogData;
      }

      await apiRequest(
        `/db/employment-applications/${searchedEmployee.employee_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        },
      );

      const updatedEmployee = await apiRequest(
        `/db/employment-applications/${searchedEmployee.employee_id}`,
      );
      setSearchedEmployee(updatedEmployee);

      setSaveSuccess(`Section updated successfully!`);
      setIsEditDialogOpen(false);
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (error) {
      console.error("Error saving section:", error);
      setSaveError(
        error.message || "Failed to save changes. Please try again.",
      );
    } finally {
      setSaveLoading(false);
    }
  };

  // Save basic info changes
  // const saveBasicInfoChanges = async (dataToSave) => {
  //   if (!searchedEmployee?.employee_id) return;

  //   setSaveLoading(true);
  //   setSaveError(null);
  //   setSaveSuccess(null);

  //   try {
  //     const updatePayload = {
  //       name: dataToSave.name,
  //       email: dataToSave.email,
  //       phone: dataToSave.phone,
  //       position: dataToSave.position,
  //       date_of_joining: dataToSave.date_of_joining,
  //       client: dataToSave.client,
  //       skill_set: dataToSave.skill_set,
  //     };
  //     await apiRequest(
  //       `/db/employment-applications/${searchedEmployee.employee_id}`,
  //       {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(updatePayload),
  //       },
  //     );

  //     // ✅ Re-fetch updated employee
  //     const updatedEmployee = await apiRequest(
  //       `/db/employment-applications/${searchedEmployee.employee_id}`,
  //     );

  //     setSearchedEmployee(updatedEmployee);

  //     setSaveSuccess(`Basic information updated successfully!`);
  //     setIsEditBasicInfoOpen(false);
  //     setTimeout(() => setSaveSuccess(null), 3000);
  //   } catch (error) {
  //     setSaveError(
  //       error.message || "Failed to save changes. Please try again.",
  //     );
  //   } finally {
  //     setSaveLoading(false);
  //   }
  // };

  const saveBasicInfoChanges = async (dataToSave) => {
    if (!searchedEmployee?.employee_id) return;

    setSaveLoading(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
        const updatePayload = {
            name: dataToSave.name,
            email: dataToSave.email,
            phone: dataToSave.phone,
            position: dataToSave.position,
            date_of_joining: dataToSave.date_of_joining,
            client: dataToSave.client,
            skill_set: dataToSave.skill_set,
            employee_id: dataToSave.employee_id,  // ← ADD THIS
        };

        await apiRequest(
            `/db/employment-applications/${searchedEmployee.employee_id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatePayload),
            },
        );

        // Use the NEW employee_id for re-fetch (falls back to old if unchanged)
        const newId = dataToSave.employee_id || searchedEmployee.employee_id;
        const updatedEmployee = await apiRequest(
            `/db/employment-applications/${newId}`,
        );
        setSearchedEmployee(updatedEmployee);
        setSearchEmployeeId(newId);  // update search bar too

        setSaveSuccess("Basic information updated successfully!");
        setIsEditBasicInfoOpen(false);
        setTimeout(() => setSaveSuccess(null), 3000);
    } catch (error) {
        setSaveError(error.message || "Failed to save changes.");
    } finally {
        setSaveLoading(false);
    }
};



  const currentItems = searchMode
    ? searchedEmployee
      ? [searchedEmployee]
      : []
    : allEmployees;

  const sectionColors = {
    personalProfile: {
      bg: darkMode ? "bg-gray-800" : "bg-blue-50",
      border: darkMode ? "border-gray-700" : "border-blue-200",
      iconBg: darkMode ? "bg-gray-700" : "bg-blue-100",
      iconColor: darkMode ? "text-blue-400" : "text-blue-600",
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-blue-50",
      badgeBg: darkMode ? "bg-blue-900/30" : "bg-blue-100",
      badgeText: darkMode ? "text-blue-300" : "text-blue-700",
    },
    bankAccount: {
      bg: darkMode ? "bg-gray-800" : "bg-green-50",
      border: darkMode ? "border-gray-700" : "border-green-200",
      iconBg: darkMode ? "bg-gray-700" : "bg-green-100",
      iconColor: darkMode ? "text-green-400" : "text-green-600",
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-green-50",
      badgeBg: darkMode ? "bg-green-900/30" : "bg-green-100",
      badgeText: darkMode ? "text-green-300" : "text-green-700",
    },
    maritalStatus: {
      bg: darkMode ? "bg-gray-800" : "bg-pink-50",
      border: darkMode ? "border-gray-700" : "border-pink-200",
      iconBg: darkMode ? "bg-gray-700" : "bg-pink-100",
      iconColor: darkMode ? "text-pink-400" : "text-pink-600",
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-pink-50",
      badgeBg: darkMode ? "bg-pink-900/30" : "bg-pink-100",
      badgeText: darkMode ? "text-pink-300" : "text-pink-700",
    },
    familyBackground: {
      bg: darkMode ? "bg-gray-800" : "bg-purple-50",
      border: darkMode ? "border-gray-700" : "border-purple-200",
      iconBg: darkMode ? "bg-gray-700" : "bg-purple-100",
      iconColor: darkMode ? "text-purple-400" : "text-purple-600",
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-purple-50",
      badgeBg: darkMode ? "bg-purple-900/30" : "bg-purple-100",
      badgeText: darkMode ? "text-purple-300" : "text-purple-700",
    },
    academicBackground: {
      bg: darkMode ? "bg-gray-800" : "bg-indigo-50",
      border: darkMode ? "border-gray-700" : "border-indigo-200",
      iconBg: darkMode ? "bg-gray-700" : "bg-indigo-100",
      iconColor: darkMode ? "text-indigo-400" : "text-indigo-600",
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50",
      badgeBg: darkMode ? "bg-indigo-900/30" : "bg-indigo-100",
      badgeText: darkMode ? "text-indigo-300" : "text-indigo-700",
    },
    professionalTraining: {
      bg: darkMode ? "bg-gray-800" : "bg-teal-50",
      border: darkMode ? "border-gray-700" : "border-teal-200",
      iconBg: darkMode ? "bg-gray-700" : "bg-teal-100",
      iconColor: darkMode ? "text-teal-400" : "text-teal-600",
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-teal-50",
      badgeBg: darkMode ? "bg-teal-900/30" : "bg-teal-100",
      badgeText: darkMode ? "text-teal-300" : "text-teal-700",
    },
    professionalExperience: {
      bg: darkMode ? "bg-gray-800" : "bg-orange-50",
      border: darkMode ? "border-gray-700" : "border-orange-200",
      iconBg: darkMode ? "bg-gray-700" : "bg-orange-100",
      iconColor: darkMode ? "text-orange-400" : "text-orange-600",
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-orange-50",
      badgeBg: darkMode ? "bg-orange-900/30" : "bg-orange-100",
      badgeText: darkMode ? "text-orange-300" : "text-orange-700",
    },
    professionalReference: {
      bg: darkMode ? "bg-gray-800" : "bg-cyan-50",
      border: darkMode ? "border-gray-700" : "border-cyan-200",
      iconBg: darkMode ? "bg-gray-700" : "bg-cyan-100",
      iconColor: darkMode ? "text-cyan-400" : "text-cyan-600",
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-cyan-50",
      badgeBg: darkMode ? "bg-cyan-900/30" : "bg-cyan-100",
      badgeText: darkMode ? "text-cyan-300" : "text-cyan-700",
    },
    aboutSelf: {
      bg: darkMode ? "bg-gray-800" : "bg-amber-50",
      border: darkMode ? "border-gray-700" : "border-amber-200",
      iconBg: darkMode ? "bg-gray-700" : "bg-amber-100",
      iconColor: darkMode ? "text-amber-400" : "text-amber-600",
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-amber-50",
      badgeBg: darkMode ? "bg-amber-900/30" : "bg-amber-100",
      badgeText: darkMode ? "text-amber-300" : "text-amber-700",
    },
    declaration: {
      bg: darkMode ? "bg-gray-800" : "bg-slate-50",
      border: darkMode ? "border-gray-700" : "border-slate-200",
      iconBg: darkMode ? "bg-gray-700" : "bg-slate-100",
      iconColor: darkMode ? "text-slate-400" : "text-slate-600",
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-slate-50",
      badgeBg: darkMode ? "bg-slate-900/30" : "bg-slate-100",
      badgeText: darkMode ? "text-slate-300" : "text-slate-700",
    },
  };

  const CollapsibleSection = React.memo(
    ({ title, sectionKey, icon: Icon, children, badge }) => {
      const colors = sectionColors[sectionKey] || sectionColors.personalProfile;

      return (
        <Card
          className={`overflow-hidden ${colors.border} shadow-sm mb-3 ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div
            className={`flex items-center justify-between p-3 cursor-pointer ${colors.headerBg} transition-all duration-200 border-b ${colors.border}`}
            onClick={() => toggleSection(sectionKey)}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 ${colors.iconBg} rounded-lg flex items-center justify-center`}
              >
                <Icon size={16} className={colors.iconColor} />
              </div>
              <div>
                <h3
                  className={`font-semibold text-sm ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                >
                  {title}
                </h3>
                {badge && (
                  <span
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {badge}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {badge && (
                <span
                  className={`px-2 py-1 ${colors.badgeBg} ${colors.badgeText} rounded-full text-xs font-medium`}
                >
                  {badge}
                </span>
              )}
              <div className={`p-1 rounded-full ${colors.iconBg}`}>
                {expandedSections[sectionKey] ? (
                  <ChevronDown size={14} className={colors.iconColor} />
                ) : (
                  <ChevronRight size={14} className={colors.iconColor} />
                )}
              </div>
            </div>
          </div>
          {expandedSections[sectionKey] && (
            <div className={`p-4 ${colors.bg}`}>{children}</div>
          )}
        </Card>
      );
    },
  );

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-2 py-1">
      {Icon && (
        <Icon
          size={14}
          className={`flex-shrink-0 mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        />
      )}
      <div className="min-w-0 flex-1">
        <div
          className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          {label}
        </div>
        <div
          className={`text-sm break-words px-2 py-1 rounded border ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-100 text-gray-800"}`}
        >
          {value || "N/A"}
        </div>
      </div>
    </div>
  );

  const DetailedEmployeeView = ({ employee }) => {
    if (!employee) return null;
    const personalProfile = employee.personal_profile || {};
    const bankAccount = employee.bank_account;
    const maritalStatus = employee.marital_status?.[0];
    const familyBackground = employee.family_background || [];
    const academicBackground = employee.academic_background || [];
    const professionalTraining = employee.professional_training || [];
    const professionalExperience = employee.professional_experience || [];
    const professionalReference = employee.professional_reference || [];
    const aboutSelf = employee.about_self || {};
    const declaration = employee.declaration || {};
    const profilePicture = profilePictures[employee.employee_id];

    const email = employee.email || personalProfile.mail_id || "N/A";
    const phone = employee.phone || personalProfile.mobile_phone || "N/A";

    return (
      <div className="space-y-4">
        {saveSuccess && (
          <div
            className={`p-3 rounded-lg ${darkMode ? "bg-green-900/20 border-green-800" : "bg-green-50 border-green-200"} border`}
          >
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 size={16} />
              <span className="text-sm font-medium">{saveSuccess}</span>
            </div>
          </div>
        )}

        {saveError && (
          <div
            className={`p-3 rounded-lg ${darkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"} border`}
          >
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">{saveError}</span>
            </div>
          </div>
        )}

        <Card
          className={`p-4 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={`${personalProfile.first_name} ${personalProfile.last_name}`}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center border-2 border-white shadow-md ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  <User
                    size={32}
                    className={darkMode ? "text-gray-400" : "text-gray-500"}
                  />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className={`text-xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-700"}`}
                  >
                    {`${personalProfile.first_name || ""} ${personalProfile.middle_name || ""} ${personalProfile.last_name || ""}`.trim() ||
                      "N/A"}
                  </h2>
                  <p
                    className={`font-medium ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                  >
                    Employee ID: {employee.employee_id}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditBasicInfo(employee)}
                  className="h-8"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit Basic Info
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <div
                  className={`flex items-center gap-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  <Mail size={12} />
                  <span>{email}</span>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  <Phone size={12} />
                  <span>{phone}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <CollapsibleSection
          title="Personal Profile"
          sectionKey="personalProfile"
          icon={User}
          badge="Basic Information"
        >
          <div>
            <div className="flex justify-end mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  openEditDialog("personalProfile", personalProfile)
                }
                className="h-7"
              >
                <Edit2 size={14} className="mr-1" />
                Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <InfoRow
                  label="First Name"
                  value={personalProfile.first_name}
                  icon={User}
                />
                <InfoRow
                  label="Middle Name"
                  value={personalProfile.middle_name}
                  icon={User}
                />
                <InfoRow
                  label="Last Name"
                  value={personalProfile.last_name}
                  icon={User}
                />
                <InfoRow
                  label="Date of Birth"
                  value={formatDate(personalProfile.date_of_birth)}
                  icon={Calendar}
                />
                <InfoRow
                  label="Gender"
                  value={personalProfile.gender}
                  icon={User}
                />
                <InfoRow
                  label="Blood Group"
                  value={personalProfile.blood_group}
                  icon={Heart}
                />
                <InfoRow
                  label="Nationality"
                  value={personalProfile.nationality}
                  icon={Flag}
                />
              </div>
              <div className="space-y-2">
                <InfoRow
                  label="Mobile Phone"
                  value={personalProfile.mobile_phone}
                  icon={Phone}
                />
                <InfoRow
                  label="Email"
                  value={personalProfile.mail_id}
                  icon={Mail}
                />
                <InfoRow
                  label="Telephone"
                  value={personalProfile.tel_no}
                  icon={Phone}
                />
                <InfoRow
                  label="Aadhar Number"
                  value={personalProfile.aadhar_no}
                  icon={CreditCard}
                />
                <InfoRow
                  label="PAN Card"
                  value={personalProfile.pan_card_no}
                  icon={CreditCard}
                />
                <InfoRow
                  label="Passport Number"
                  value={personalProfile.passport_no}
                  icon={Globe}
                />
                <InfoRow
                  label="UAN Number"
                  value={personalProfile.uan_number}
                  icon={Shield}
                />
                <InfoRow
                  label="ESI Number"
                  value={personalProfile.esi_no}
                  icon={Shield}
                />
              </div>
            </div>

            <div
              className={`mt-6 pt-4 border-t ${darkMode ? "border-gray-700" : "border-blue-200"}`}
            >
              <h4
                className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
              >
                <Home
                  size={16}
                  className={darkMode ? "text-blue-400" : "text-blue-600"}
                />
                Current Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow
                  label="City"
                  value={personalProfile.current_address_city}
                />
                <InfoRow
                  label="District"
                  value={personalProfile.current_address_district}
                />
                <InfoRow
                  label="State"
                  value={personalProfile.current_address_state}
                />
                <InfoRow
                  label="Pin Code"
                  value={personalProfile.current_address_pin_code}
                />
              </div>
            </div>

            <div
              className={`mt-6 pt-4 border-t ${darkMode ? "border-gray-700" : "border-blue-200"}`}
            >
              <h4
                className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
              >
                <Home
                  size={16}
                  className={darkMode ? "text-blue-400" : "text-blue-600"}
                />
                Permanent Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow
                  label="City"
                  value={personalProfile.permanent_address_city}
                />
                <InfoRow
                  label="District"
                  value={personalProfile.permanent_address_district}
                />
                <InfoRow
                  label="State"
                  value={personalProfile.permanent_address_state}
                />
                <InfoRow
                  label="Pin Code"
                  value={personalProfile.permanent_address_pin_code}
                />
              </div>
            </div>

            <div
              className={`mt-6 pt-4 border-t ${darkMode ? "border-gray-700" : "border-blue-200"}`}
            >
              <h4
                className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
              >
                <Contact
                  size={16}
                  className={darkMode ? "text-blue-400" : "text-blue-600"}
                />
                Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow
                  label="Contact Name"
                  value={personalProfile.emergency_contact_name}
                  icon={User}
                />
                <InfoRow
                  label="Relation"
                  value={personalProfile.emergency_contact_relation}
                  icon={Heart}
                />
                <InfoRow
                  label="Mobile"
                  value={personalProfile.emergency_contact_mobile}
                  icon={Phone}
                />
                <InfoRow
                  label="Email"
                  value={personalProfile.emergency_contact_mail_id}
                  icon={Mail}
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {bankAccount && (
          <CollapsibleSection
            title="Bank Account Details"
            sectionKey="bankAccount"
            icon={Banknote}
            badge="Financial Information"
          >
            <div>
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog("bankAccount", bankAccount)}
                  className="h-7"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoRow
                  label="Account Number"
                  value={bankAccount.account_number}
                  icon={CreditCard}
                />
                <InfoRow
                  label="Bank Name"
                  value={bankAccount.bank_name}
                  icon={Building}
                />
                <InfoRow
                  label="Branch Name"
                  value={bankAccount.branch_name}
                  icon={MapPin}
                />
                <InfoRow
                  label="IFSC Code"
                  value={bankAccount.ifsc_code}
                  icon={Code}
                />
                <InfoRow
                  label="Account Type"
                  value={bankAccount.account_type}
                  icon={CreditCard}
                />
              </div>
            </div>
          </CollapsibleSection>
        )}

        {maritalStatus && (
          <CollapsibleSection
            title="Marital Status"
            sectionKey="maritalStatus"
            icon={Heart}
            badge="Personal Status"
          >
            <div>
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog("maritalStatus", maritalStatus)}
                  className="h-7"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoRow
                  label="Status"
                  value={maritalStatus.marital_status}
                  icon={Heart}
                />
                <InfoRow
                  label="Marriage Date"
                  value={formatDate(maritalStatus.marriage_date)}
                  icon={Calendar}
                />
              </div>
            </div>
          </CollapsibleSection>
        )}

        {familyBackground.length > 0 && (
          <CollapsibleSection
            title="Family Background"
            sectionKey="familyBackground"
            icon={Users}
            badge={`${familyBackground.length} members`}
          >
            <div>
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    openEditDialog("familyBackground", {
                      family_background: familyBackground,
                    })
                  }
                  className="h-7"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
              <div className="grid gap-3">
                {familyBackground.map((member, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <InfoRow
                        label="Relationship"
                        value={member.relationship_status}
                        icon={Heart}
                      />
                      <InfoRow label="Name" value={member.name} icon={User} />
                      <InfoRow
                        label="Gender"
                        value={member.gender}
                        icon={User}
                      />
                      <InfoRow
                        label="Age"
                        value={member.age ? `${member.age} years` : "N/A"}
                        icon={Calendar}
                      />
                    </div>
                    {member.date_of_birth && (
                      <div
                        className={`mt-3 pt-3 border-t ${darkMode ? "border-gray-600" : "border-gray-100"}`}
                      >
                        <InfoRow
                          label="Date of Birth"
                          value={formatDate(member.date_of_birth)}
                          icon={Calendar}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        )}

        {academicBackground.length > 0 && (
          <CollapsibleSection
            title="Academic Background"
            sectionKey="academicBackground"
            icon={GraduationCap}
            badge={`${academicBackground.length} qualifications`}
          >
            <div>
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    openEditDialog("academicBackground", {
                      academic_background: academicBackground,
                    })
                  }
                  className="h-7"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
              <div className="grid gap-3">
                {academicBackground.map((education, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InfoRow
                        label="Qualification"
                        value={education.qualification}
                        icon={GraduationCap}
                      />
                      <InfoRow
                        label="Specialization"
                        value={education.specification}
                        icon={BookOpen}
                      />
                      <InfoRow
                        label="Institute"
                        value={education.institute_name}
                        icon={Building}
                      />
                      <InfoRow
                        label="Year of Passing"
                        value={education.year_of_passing}
                        icon={Calendar}
                      />
                      <InfoRow
                        label="Grade/Rank"
                        value={education.rank_or_grade}
                        icon={Award}
                      />
                      <InfoRow
                        label="Duration"
                        value={`${formatDate(education.duration_from)} - ${formatDate(education.duration_to)}`}
                        icon={Calendar}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        )}

        {professionalTraining.length > 0 && (
          <CollapsibleSection
            title="Professional Training"
            sectionKey="professionalTraining"
            icon={BookOpen}
            badge={`${professionalTraining.length} trainings`}
          >
            <div>
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    openEditDialog("professionalTraining", {
                      professional_training: professionalTraining,
                    })
                  }
                  className="h-7"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
              <div className="grid gap-3">
                {professionalTraining.map((training, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <InfoRow
                        label="Institute"
                        value={training.institute_name}
                        icon={Building}
                      />
                      <InfoRow
                        label="Duration"
                        value={training.duration}
                        icon={Calendar}
                      />
                      <InfoRow
                        label="Training Area"
                        value={training.area_of_training}
                        icon={Target}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        )}

        {professionalExperience.length > 0 && (
          <CollapsibleSection
            title="Professional Experience"
            sectionKey="professionalExperience"
            icon={Briefcase}
            badge={`${professionalExperience.length} positions`}
          >
            <div>
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    openEditDialog("professionalExperience", {
                      professional_experience: professionalExperience,
                    })
                  }
                  className="h-7"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
              <div className="grid gap-3">
                {professionalExperience.map((experience, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InfoRow
                        label="Company"
                        value={experience.company_name}
                        icon={Building}
                      />
                      <InfoRow
                        label="Designation"
                        value={experience.designation}
                        icon={Briefcase}
                      />
                      <InfoRow
                        label="Location"
                        value={experience.employer_location}
                        icon={MapPin}
                      />
                      <InfoRow
                        label="Employee ID"
                        value={experience.employer_id}
                        icon={CreditCard}
                      />
                      <InfoRow
                        label="RM Contact"
                        value={experience.rm_contact_no}
                        icon={Phone}
                      />
                      <InfoRow
                        label="HR Email"
                        value={experience.hr_email}
                        icon={Mail}
                      />
                      <InfoRow
                        label="Period"
                        value={`${formatDate(experience.period_from)} - ${formatDate(experience.period_to)}`}
                        icon={Calendar}
                      />
                      <InfoRow
                        label="CTC"
                        value={
                          experience.ctc ? `₹${experience.ctc} LPA` : "N/A"
                        }
                        icon={Banknote}
                      />
                      <InfoRow
                        label="UAN Number"
                        value={experience.uan_number}
                        icon={Shield}
                      />
                    </div>
                    {experience.reason_for_leaving && (
                      <div
                        className={`mt-3 pt-3 border-t ${darkMode ? "border-gray-600" : "border-gray-100"}`}
                      >
                        <InfoRow
                          label="Reason for Leaving"
                          value={experience.reason_for_leaving}
                          icon={FileText}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        )}

        {professionalReference.length > 0 && (
          <CollapsibleSection
            title="Professional References"
            sectionKey="professionalReference"
            icon={UserCheck}
            badge={`${professionalReference.length} references`}
          >
            <div>
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    openEditDialog("professionalReference", {
                      professional_reference: professionalReference,
                    })
                  }
                  className="h-7"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
              <div className="grid gap-3">
                {professionalReference.map((reference, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InfoRow
                        label="Name"
                        value={reference.name}
                        icon={User}
                      />
                      <InfoRow
                        label="Designation"
                        value={reference.designation}
                        icon={Briefcase}
                      />
                      <InfoRow
                        label="Company"
                        value={reference.company}
                        icon={Building}
                      />
                      <InfoRow
                        label="Address"
                        value={reference.address}
                        icon={MapPin}
                      />
                      <InfoRow
                        label="Contact"
                        value={reference.tel_no}
                        icon={Phone}
                      />
                      <InfoRow
                        label="Email"
                        value={reference.email}
                        icon={Mail}
                      />
                      <InfoRow
                        label="Period Known"
                        value={reference.period_known}
                        icon={Calendar}
                      />
                      <InfoRow
                        label="Capacity Known"
                        value={reference.capacity_known}
                        icon={FileText}
                      />
                      <InfoRow
                        label="Referred by ISCS Employee"
                        value={
                          reference.referred_by_employee_ISCS ? "Yes" : "No"
                        }
                        icon={UserCheck}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        )}

        {Object.keys(aboutSelf).length > 0 && (
          <CollapsibleSection
            title="About Self"
            sectionKey="aboutSelf"
            icon={Target}
            badge="Self Assessment"
          >
            <div>
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog("aboutSelf", aboutSelf)}
                  className="h-7"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
              <div className="space-y-4">
                <div
                  className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}
                >
                  <h5
                    className={`font-semibold mb-3 flex items-center gap-2 text-sm ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                  >
                    <TrendingUp
                      size={16}
                      className={darkMode ? "text-gray-600" : "text-gray-600"}
                    />
                    Career & Achievements
                  </h5>
                  <div className="space-y-2">
                    <InfoRow
                      label="Career Ambition"
                      value={aboutSelf.career_ambition}
                      icon={Target}
                    />
                    <InfoRow
                      label="Significant Achievements"
                      value={aboutSelf.significant_achievements}
                      icon={Award}
                    />
                    <InfoRow
                      label="Professional Failures"
                      value={aboutSelf.professional_failures}
                      icon={AlertTriangle}
                    />
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}
                >
                  <h5
                    className={`font-semibold mb-3 flex items-center gap-2 text-sm ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                  >
                    <Zap
                      size={16}
                      className={darkMode ? "text-green-400" : "text-green-600"}
                    />
                    Strengths
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <InfoRow label="Strength 1" value={aboutSelf.strength1} />
                    <InfoRow label="Strength 2" value={aboutSelf.strength2} />
                    <InfoRow label="Strength 3" value={aboutSelf.strength3} />
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}
                >
                  <h5
                    className={`font-semibold mb-3 flex items-center gap-2 text-sm ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                  >
                    <AlertTriangle
                      size={16}
                      className={darkMode ? "text-amber-400" : "text-amber-600"}
                    />
                    Areas for Improvement
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <InfoRow label="Area 1" value={aboutSelf.weakness1} />
                    <InfoRow label="Area 2" value={aboutSelf.weakness2} />
                    <InfoRow label="Area 3" value={aboutSelf.weakness3} />
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {Object.keys(declaration).length > 0 && (
          <CollapsibleSection
            title="Declaration"
            sectionKey="declaration"
            icon={FileText}
            badge="Legal Document"
          >
            <div>
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog("declaration", declaration)}
                  className="h-7"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
              <div
                className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}
              >
                <div className="space-y-3">
                  <InfoRow
                    label="Declared by"
                    value={declaration.name}
                    icon={User}
                  />
                  <InfoRow
                    label="Date of Declaration"
                    value={formatDate(declaration.date_of_declaration)}
                    icon={Calendar}
                  />
                  {declaration.declaration_text && (
                    <div
                      className={`pt-3 border-t ${darkMode ? "border-gray-600" : "border-gray-100"}`}
                    >
                      <h5
                        className={`font-semibold mb-3 text-sm ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                      >
                        Declaration Text
                      </h5>
                      <div
                        className={`p-3 rounded-lg text-sm leading-relaxed border ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-gray-50 border-gray-100 text-gray-700"}`}
                      >
                        {declaration.declaration_text}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleSection>
        )}
      </div>
    );
  };

  // Edit Dialog Components
  const renderEditDialogContent = () => {
    if (!editDialogSection) return null;

    switch (editDialogSection) {
      case "personalProfile":
        return (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={editDialogData.first_name || ""}
                      onChange={(e) =>
                        handleEditDialogChange("first_name", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Middle Name</Label>
                    <Input
                      value={editDialogData.middle_name || ""}
                      onChange={(e) =>
                        handleEditDialogChange("middle_name", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={editDialogData.last_name || ""}
                      onChange={(e) =>
                        handleEditDialogChange("last_name", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={formatDateForInput(editDialogData.date_of_birth)}
                      onChange={(e) =>
                        handleEditDialogChange("date_of_birth", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <select
                      value={editDialogData.gender || ""}
                      onChange={(e) =>
                        handleEditDialogChange("gender", e.target.value)
                      }
                      className={`w-full px-3 py-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label>Blood Group</Label>
                    <select
                      value={editDialogData.blood_group || ""}
                      onChange={(e) =>
                        handleEditDialogChange("blood_group", e.target.value)
                      }
                      className={`w-full px-3 py-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}
                    >
                      <option value="">Select</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <Input
                      value={editDialogData.nationality || ""}
                      onChange={(e) =>
                        handleEditDialogChange("nationality", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Mobile Phone</Label>
                    <Input
                      value={editDialogData.mobile_phone || ""}
                      onChange={(e) =>
                        handleEditDialogChange("mobile_phone", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editDialogData.mail_id || ""}
                      onChange={(e) =>
                        handleEditDialogChange("mail_id", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Telephone</Label>
                    <Input
                      value={editDialogData.tel_no || ""}
                      onChange={(e) =>
                        handleEditDialogChange("tel_no", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Aadhar Number</Label>
                    <Input
                      value={editDialogData.aadhar_no || ""}
                      onChange={(e) =>
                        handleEditDialogChange("aadhar_no", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>PAN Card</Label>
                    <Input
                      value={editDialogData.pan_card_no || ""}
                      onChange={(e) =>
                        handleEditDialogChange("pan_card_no", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Passport Number</Label>
                    <Input
                      value={editDialogData.passport_no || ""}
                      onChange={(e) =>
                        handleEditDialogChange("passport_no", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>UAN Number</Label>
                    <Input
                      value={editDialogData.uan_number || ""}
                      onChange={(e) =>
                        handleEditDialogChange("uan_number", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>ESI Number</Label>
                    <Input
                      value={editDialogData.esi_no || ""}
                      onChange={(e) =>
                        handleEditDialogChange("esi_no", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Current Address</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        value={editDialogData.current_address_city || ""}
                        onChange={(e) =>
                          handleEditDialogChange(
                            "current_address_city",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>District</Label>
                      <Input
                        value={editDialogData.current_address_district || ""}
                        onChange={(e) =>
                          handleEditDialogChange(
                            "current_address_district",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input
                        value={editDialogData.current_address_state || ""}
                        onChange={(e) =>
                          handleEditDialogChange(
                            "current_address_state",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Pin Code</Label>
                      <Input
                        value={editDialogData.current_address_pin_code || ""}
                        onChange={(e) =>
                          handleEditDialogChange(
                            "current_address_pin_code",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <h4 className="font-medium mt-4">Permanent Address</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        value={editDialogData.permanent_address_city || ""}
                        onChange={(e) =>
                          handleEditDialogChange(
                            "permanent_address_city",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>District</Label>
                      <Input
                        value={editDialogData.permanent_address_district || ""}
                        onChange={(e) =>
                          handleEditDialogChange(
                            "permanent_address_district",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input
                        value={editDialogData.permanent_address_state || ""}
                        onChange={(e) =>
                          handleEditDialogChange(
                            "permanent_address_state",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Pin Code</Label>
                      <Input
                        value={editDialogData.permanent_address_pin_code || ""}
                        onChange={(e) =>
                          handleEditDialogChange(
                            "permanent_address_pin_code",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="emergency" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Name</Label>
                    <Input
                      value={editDialogData.emergency_contact_name || ""}
                      onChange={(e) =>
                        handleEditDialogChange(
                          "emergency_contact_name",
                          e.target.value,
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Relation</Label>
                    <Input
                      value={editDialogData.emergency_contact_relation || ""}
                      onChange={(e) =>
                        handleEditDialogChange(
                          "emergency_contact_relation",
                          e.target.value,
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Mobile</Label>
                    <Input
                      value={editDialogData.emergency_contact_mobile || ""}
                      onChange={(e) =>
                        handleEditDialogChange(
                          "emergency_contact_mobile",
                          e.target.value,
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editDialogData.emergency_contact_mail_id || ""}
                      onChange={(e) =>
                        handleEditDialogChange(
                          "emergency_contact_mail_id",
                          e.target.value,
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case "bankAccount":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Account Number</Label>
                <Input
                  value={editDialogData.account_number || ""}
                  onChange={(e) =>
                    handleEditDialogChange("account_number", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Bank Name</Label>
                <Input
                  value={editDialogData.bank_name || ""}
                  onChange={(e) =>
                    handleEditDialogChange("bank_name", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Branch Name</Label>
                <Input
                  value={editDialogData.branch_name || ""}
                  onChange={(e) =>
                    handleEditDialogChange("branch_name", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>IFSC Code</Label>
                <Input
                  value={editDialogData.ifsc_code || ""}
                  onChange={(e) =>
                    handleEditDialogChange("ifsc_code", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Account Type</Label>
                <select
                  value={editDialogData.account_type || ""}
                  onChange={(e) =>
                    handleEditDialogChange("account_type", e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}
                >
                  <option value="">Select</option>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                  <option value="Salary">Salary</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "maritalStatus":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Marital Status</Label>
                <select
                  value={editDialogData.marital_status || ""}
                  onChange={(e) =>
                    handleEditDialogChange("marital_status", e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              <div>
                <Label>Marriage Date</Label>
                <Input
                  type="date"
                  value={formatDateForInput(editDialogData.marriage_date)}
                  onChange={(e) =>
                    handleEditDialogChange("marriage_date", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case "familyBackground":
        return (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            {editDialogData.family_background?.map((member, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${darkMode ? "border-gray-600" : "border-gray-200"} relative`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem(index, "family_background")}
                  className="absolute top-2 right-2 h-6 w-6 p-0 text-red-500"
                >
                  <Trash2 size={14} />
                </Button>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>Relationship</Label>
                    <select
                      value={member.relationship_status || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "relationship_status",
                          e.target.value,
                          "family_background",
                        )
                      }
                      className={`w-full px-3 py-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}
                    >
                      <option value="">Select</option>
                      {[
                        "Father",
                        "Mother",
                        "Brother",
                        "Sister",
                        "Spouse",
                        "Child",
                        "Other",
                      ].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={member.name || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "name",
                          e.target.value,
                          "family_background",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <select
                      value={member.gender || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "gender",
                          e.target.value,
                          "family_background",
                        )
                      }
                      className={`w-full px-3 py-2 rounded border ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={formatDateForInput(member.date_of_birth)}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "date_of_birth",
                          e.target.value,
                          "family_background",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={member.age || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "age",
                          parseInt(e.target.value),
                          "family_background",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addArrayItem("family_background", {})}
              className="w-full"
            >
              <Plus size={14} className="mr-1" />
              Add Family Member
            </Button>
          </div>
        );

      case "academicBackground":
        return (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            {editDialogData.academic_background?.map((education, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${darkMode ? "border-gray-600" : "border-gray-200"} relative`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem(index, "academic_background")}
                  className="absolute top-2 right-2 h-6 w-6 p-0 text-red-500"
                >
                  <Trash2 size={14} />
                </Button>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>Qualification</Label>
                    <Input
                      value={education.qualification || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "qualification",
                          e.target.value,
                          "academic_background",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Specialization</Label>
                    <Input
                      value={education.specification || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "specification",
                          e.target.value,
                          "academic_background",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Institute</Label>
                    <Input
                      value={education.institute_name || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "institute_name",
                          e.target.value,
                          "academic_background",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Year of Passing</Label>
                    <Input
                      type="number"
                      value={education.year_of_passing || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "year_of_passing",
                          parseInt(e.target.value),
                          "academic_background",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Duration From</Label>
                    <Input
                      type="date"
                      value={formatDateForInput(education.duration_from)}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "duration_from",
                          e.target.value,
                          "academic_background",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Duration To</Label>
                    <Input
                      type="date"
                      value={formatDateForInput(education.duration_to)}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "duration_to",
                          e.target.value,
                          "academic_background",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Grade/Rank</Label>
                    <Input
                      value={education.rank_or_grade || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "rank_or_grade",
                          e.target.value,
                          "academic_background",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addArrayItem("academic_background", {})}
              className="w-full"
            >
              <Plus size={14} className="mr-1" />
              Add Education
            </Button>
          </div>
        );

      case "professionalTraining":
        return (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            {editDialogData.professional_training?.map((training, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${darkMode ? "border-gray-600" : "border-gray-200"} relative`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    removeArrayItem(index, "professional_training")
                  }
                  className="absolute top-2 right-2 h-6 w-6 p-0 text-red-500"
                >
                  <Trash2 size={14} />
                </Button>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>Institute Name</Label>
                    <Input
                      value={training.institute_name || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "institute_name",
                          e.target.value,
                          "professional_training",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={training.duration || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "duration",
                          e.target.value,
                          "professional_training",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Area of Training</Label>
                    <Input
                      value={training.area_of_training || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "area_of_training",
                          e.target.value,
                          "professional_training",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addArrayItem("professional_training", {})}
              className="w-full"
            >
              <Plus size={14} className="mr-1" />
              Add Training
            </Button>
          </div>
        );

      case "professionalExperience":
        return (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            {editDialogData.professional_experience?.map(
              (experience, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${darkMode ? "border-gray-600" : "border-gray-200"} relative`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      removeArrayItem(index, "professional_experience")
                    }
                    className="absolute top-2 right-2 h-6 w-6 p-0 text-red-500"
                  >
                    <Trash2 size={14} />
                  </Button>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label>Company Name</Label>
                      <Input
                        value={experience.company_name || ""}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            index,
                            "company_name",
                            e.target.value,
                            "professional_experience",
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Employer Location</Label>
                      <Input
                        value={experience.employer_location || ""}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            index,
                            "employer_location",
                            e.target.value,
                            "professional_experience",
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Employer ID</Label>
                      <Input
                        value={experience.employer_id || ""}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            index,
                            "employer_id",
                            e.target.value,
                            "professional_experience",
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>RM Contact No</Label>
                      <Input
                        value={experience.rm_contact_no || ""}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            index,
                            "rm_contact_no",
                            e.target.value,
                            "professional_experience",
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>HR Email</Label>
                      <Input
                        type="email"
                        value={experience.hr_email || ""}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            index,
                            "hr_email",
                            e.target.value,
                            "professional_experience",
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Designation</Label>
                      <Input
                        value={experience.designation || ""}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            index,
                            "designation",
                            e.target.value,
                            "professional_experience",
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Period From</Label>
                      <Input
                        type="date"
                        value={formatDateForInput(experience.period_from)}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            index,
                            "period_from",
                            e.target.value,
                            "professional_experience",
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Period To</Label>
                      <Input
                        type="date"
                        value={formatDateForInput(experience.period_to)}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            index,
                            "period_to",
                            e.target.value,
                            "professional_experience",
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>CTC (LPA)</Label>
                      <Input
                        type="number"
                        value={experience.ctc || ""}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            index,
                            "ctc",
                            parseFloat(e.target.value),
                            "professional_experience",
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Reason for Leaving</Label>
                      <Textarea
                        value={experience.reason_for_leaving || ""}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            index,
                            "reason_for_leaving",
                            e.target.value,
                            "professional_experience",
                          )
                        }
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>UAN Number</Label>
                      <Input
                        value={experience.uan_number || ""}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            index,
                            "uan_number",
                            e.target.value,
                            "professional_experience",
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ),
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addArrayItem("professional_experience", {})}
              className="w-full"
            >
              <Plus size={14} className="mr-1" />
              Add Experience
            </Button>
          </div>
        );

      case "professionalReference":
        return (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            {editDialogData.professional_reference?.map((reference, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${darkMode ? "border-gray-600" : "border-gray-200"} relative`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    removeArrayItem(index, "professional_reference")
                  }
                  className="absolute top-2 right-2 h-6 w-6 p-0 text-red-500"
                >
                  <Trash2 size={14} />
                </Button>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={reference.name || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "name",
                          e.target.value,
                          "professional_reference",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Designation</Label>
                    <Input
                      value={reference.designation || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "designation",
                          e.target.value,
                          "professional_reference",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={reference.company || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "company",
                          e.target.value,
                          "professional_reference",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Textarea
                      value={reference.address || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "address",
                          e.target.value,
                          "professional_reference",
                        )
                      }
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Telephone</Label>
                    <Input
                      value={reference.tel_no || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "tel_no",
                          e.target.value,
                          "professional_reference",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={reference.email || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "email",
                          e.target.value,
                          "professional_reference",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Period Known</Label>
                    <Input
                      value={reference.period_known || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "period_known",
                          e.target.value,
                          "professional_reference",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Capacity Known</Label>
                    <Input
                      value={reference.capacity_known || ""}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          index,
                          "capacity_known",
                          e.target.value,
                          "professional_reference",
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`referred-${index}`}
                      checked={reference.referred_by_employee_ISCS || false}
                      onCheckedChange={(checked) =>
                        handleArrayFieldChange(
                          index,
                          "referred_by_employee_ISCS",
                          checked,
                          "professional_reference",
                        )
                      }
                    />
                    <Label htmlFor={`referred-${index}`}>
                      Referred by ISCS Employee
                    </Label>
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                addArrayItem("professional_reference", {
                  referred_by_employee_ISCS: false,
                })
              }
              className="w-full"
            >
              <Plus size={14} className="mr-1" />
              Add Reference
            </Button>
          </div>
        );

      case "aboutSelf":
        return (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            <div className="space-y-4">
              <h4 className="font-medium">Career & Achievements</h4>
              <div>
                <Label>Career Ambition</Label>
                <Textarea
                  value={editDialogData.career_ambition || ""}
                  onChange={(e) =>
                    handleEditDialogChange("career_ambition", e.target.value)
                  }
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <Label>Significant Achievements</Label>
                <Textarea
                  value={editDialogData.significant_achievements || ""}
                  onChange={(e) =>
                    handleEditDialogChange(
                      "significant_achievements",
                      e.target.value,
                    )
                  }
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <Label>Professional Failures</Label>
                <Textarea
                  value={editDialogData.professional_failures || ""}
                  onChange={(e) =>
                    handleEditDialogChange(
                      "professional_failures",
                      e.target.value,
                    )
                  }
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <h4 className="font-medium">Strengths</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Strength 1</Label>
                  <Input
                    value={editDialogData.strength1 || ""}
                    onChange={(e) =>
                      handleEditDialogChange("strength1", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Strength 2</Label>
                  <Input
                    value={editDialogData.strength2 || ""}
                    onChange={(e) =>
                      handleEditDialogChange("strength2", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Strength 3</Label>
                  <Input
                    value={editDialogData.strength3 || ""}
                    onChange={(e) =>
                      handleEditDialogChange("strength3", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <h4 className="font-medium">Areas for Improvement</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Area 1</Label>
                  <Input
                    value={editDialogData.weakness1 || ""}
                    onChange={(e) =>
                      handleEditDialogChange("weakness1", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Area 2</Label>
                  <Input
                    value={editDialogData.weakness2 || ""}
                    onChange={(e) =>
                      handleEditDialogChange("weakness2", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Area 3</Label>
                  <Input
                    value={editDialogData.weakness3 || ""}
                    onChange={(e) =>
                      handleEditDialogChange("weakness3", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "declaration":
        return (
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={editDialogData.name || ""}
                onChange={(e) => handleEditDialogChange("name", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Declaration Text</Label>
              <Textarea
                value={editDialogData.declaration_text || ""}
                onChange={(e) =>
                  handleEditDialogChange("declaration_text", e.target.value)
                }
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <Label>Date of Declaration</Label>
              <Input
                type="date"
                value={formatDateForInput(editDialogData.date_of_declaration)}
                onChange={(e) =>
                  handleEditDialogChange("date_of_declaration", e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Signature Font</Label>
              <Input
                value={editDialogData.signature_font || "SignatureFont"}
                onChange={(e) =>
                  handleEditDialogChange("signature_font", e.target.value)
                }
                className="mt-1"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Basic Info Edit Dialog
  const BasicInfoDialog = () => {
    const [localBasicInfoData, setLocalBasicInfoData] = useState({});

    useEffect(() => {
      if (isEditBasicInfoOpen) {
        setLocalBasicInfoData(basicInfoData);
      }
    }, [isEditBasicInfoOpen, basicInfoData]);

    const handleLocalChange = (field, value) => {
      setLocalBasicInfoData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    // const handleSave = () => {
    //   setBasicInfoData(localBasicInfoData);
    //   saveBasicInfoChanges();
    // };
    const handleSave = () => {
      saveBasicInfoChanges(localBasicInfoData);
    };

    return (
      <Dialog open={isEditBasicInfoOpen} onOpenChange={setIsEditBasicInfoOpen}>
        <DialogContent
          className={`max-w-2xl ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white"}`}
        >
          <DialogHeader>
            <DialogTitle>Edit Basic Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employee ID</Label>
                <Input
                  value={localBasicInfoData.employee_id || ""}
                  onChange={(e) =>
                    handleLocalChange("employee_id", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Name</Label>
                <Input
                  value={localBasicInfoData.name || ""}
                  onChange={(e) => handleLocalChange("name", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={localBasicInfoData.email || ""}
                  onChange={(e) => handleLocalChange("email", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={localBasicInfoData.phone || ""}
                  onChange={(e) => handleLocalChange("phone", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  value={localBasicInfoData.position || ""}
                  onChange={(e) =>
                    handleLocalChange("position", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Date of Joining</Label>
                <Input
                  type="date"
                  value={localBasicInfoData.date_of_joining || ""}
                  onChange={(e) =>
                    handleLocalChange("date_of_joining", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Client</Label>
                <Input
                  value={localBasicInfoData.client || ""}
                  onChange={(e) => handleLocalChange("client", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Skill Set</Label>
                <Input
                  value={localBasicInfoData.skill_set || ""}
                  onChange={(e) =>
                    handleLocalChange("skill_set", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditBasicInfoOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saveLoading ? (
                <Loader2 size={16} className="animate-spin mr-1" />
              ) : (
                <Save size={16} className="mr-1" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const EmployeeCard = ({ employee }) => {
    const personalProfile = employee.personal_profile || {};
    const name =
      `${personalProfile.first_name || ""} ${personalProfile.middle_name || ""} ${personalProfile.last_name || ""}`.trim() ||
      employee.name ||
      "N/A";

    const email = employee.email || personalProfile.mail_id || "N/A";
    const phone = employee.phone || personalProfile.mobile_phone || "N/A";

    const profilePicture = profilePictures[employee.employee_id];

    const getInitials = (fullName) => {
      const names = fullName.split(" ").filter((n) => n);
      if (names.length >= 2)
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      return names[0] ? names[0].substring(0, 2).toUpperCase() : "NA";
    };

    const initials = getInitials(name);

    return (
      <Card
        className={`group hover:shadow-lg transition-all duration-300 overflow-hidden relative ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="relative p-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm border-4 ${darkMode ? "bg-gradient-to-br from-gray-700 to-gray-600 border-gray-500" : "bg-gradient-to-br from-blue-100 to-cyan-100 border-white"}`}
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span
                    className={`text-xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                  >
                    {initials}
                  </span>
                )}
              </div>
            </div>
            <div className="text-center mt-2">
              <h3
                className={`font-bold text-sm mb-0.5 ${darkMode ? "text-gray-100" : "text-gray-900"}`}
              >
                {name.toUpperCase()}
              </h3>
              <div className="flex items-center justify-center">
                <span
                  className={`font-mono px-1.5 py-0.5 rounded-full text-[10px] font-medium ${darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700"}`}
                >
                  #{employee.employee_id || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}
              >
                <Briefcase
                  size={12}
                  className={darkMode ? "text-blue-400" : "text-blue-600"}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[10px] ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}
                >
                  Position
                </p>
                <p
                  className={`text-xs ${darkMode ? "text-gray-100" : "text-gray-900"} font-semibold truncate`}
                >
                  {employee.position || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-gray-700" : "bg-purple-50"}`}
              >
                <Building2
                  size={12}
                  className={darkMode ? "text-purple-400" : "text-purple-600"}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[10px] ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}
                >
                  Client
                </p>
                <p
                  className={`text-xs ${darkMode ? "text-gray-100" : "text-gray-900"} font-semibold truncate`}
                >
                  {employee.client || employee.department || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <Mail
                  size={10}
                  className={darkMode ? "text-gray-400" : "text-gray-600"}
                />
              </div>
              <span
                className={`text-[11px] ${darkMode ? "text-gray-300" : "text-gray-600"} truncate flex-1`}
              >
                {email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <Phone
                  size={10}
                  className={darkMode ? "text-gray-400" : "text-gray-600"}
                />
              </div>
              <span
                className={`text-[11px] ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {phone}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <div
                className={`w-4 h-4 rounded flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <Calendar
                  size={9}
                  className={darkMode ? "text-gray-400" : "text-gray-600"}
                />
              </div>
              <div>
                <p
                  className={`text-[9px] ${darkMode ? "text-gray-400" : "text-gray-500"} uppercase tracking-wide`}
                >
                  Joined
                </p>
                <p
                  className={`text-[10px] ${darkMode ? "text-gray-200" : "text-gray-700"} font-medium`}
                >
                  {formatDate(
                    employee.date_of_joining || personalProfile.date_of_joining,
                  )}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className={`h-7 px-2.5 shadow-sm ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
              onClick={() => searchEmployeeById(employee.employee_id)}
            >
              <Eye size={11} className="mr-1" />
              <span className="text-[11px] font-semibold">View</span>
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div
      className={`w-full min-h-screen p-4 space-y-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent
          className={`max-w-4xl ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white"}`}
        >
          <DialogHeader>
            <DialogTitle>{editDialogTitle}</DialogTitle>
          </DialogHeader>
          {renderEditDialogContent()}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveSectionChanges}
              disabled={saveLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saveLoading ? (
                <Loader2 size={16} className="animate-spin mr-1" />
              ) : (
                <Save size={16} className="mr-1" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Basic Info Edit Dialog */}
      <BasicInfoDialog />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h1
            className={`text-2xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"} flex items-center gap-2`}
          >
            <Users
              size={24}
              className={darkMode ? "text-blue-400" : "text-blue-600"}
            />
            Employee Management
          </h1>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Manage and view employee applications
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-400"}`}
              />
              <Input
                type="text"
                value={searchEmployeeId}
                onChange={(e) => setSearchEmployeeId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by Employee ID"
                className={`pl-8 h-8 w-48 text-sm ${darkMode ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500/20 focus:border-blue-500" : "bg-white border-gray-200 text-gray-800 focus:ring-blue-500/20 focus:border-blue-500"}`}
              />
            </div>
            <Button
              onClick={() => searchEmployeeById()}
              disabled={searchLoading}
              size="sm"
              className={`h-8 px-3 ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
            >
              {searchLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Search size={14} />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {searchMode && (
              <Button
                onClick={clearSearch}
                variant="outline"
                size="sm"
                className={`h-8 px-3 text-xs ${darkMode ? "border-gray-600 bg-gray-800 hover:bg-gray-700" : "border-gray-200 bg-white hover:bg-gray-50"}`}
              >
                <Filter size={14} className="mr-1" />
                Show All
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className={`h-8 px-3 ${darkMode ? "border-gray-600 bg-gray-800 hover:bg-gray-700" : "border-gray-200 bg-white hover:bg-gray-50"}`}
              disabled={loading}
              onClick={handleRefresh}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
          </div>
        </div>
      </div>

      {searchError && (
        <div
          className={`p-2 rounded-lg ${darkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}`}
        >
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={14} />
            <span className="text-sm font-medium">{searchError}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2
              className={`text-lg font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
            >
              {searchMode ? "Employee Details" : "All Employees"}
            </h2>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700"}`}
            >
              {searchMode
                ? searchedEmployee
                  ? "1"
                  : "0"
                : paginationData.total}{" "}
              {searchMode ? "Found" : "Total"}
            </span>
          </div>
          {!searchMode && (
            <div
              className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Page {currentPage} of {paginationData.totalPages}
            </div>
          )}
        </div>

        {loading && (
          <Card
            className={`p-8 text-center ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2
                size={24}
                className={`animate-spin ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              />
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Loading employee data...
              </p>
            </div>
          </Card>
        )}

        {error && !loading && (
          <Card
            className={`p-6 text-center ${darkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}`}
          >
            <div className="flex flex-col items-center gap-3">
              <AlertCircle size={24} className="text-red-500" />
              <div>
                <p
                  className={`text-red-700 font-medium text-sm ${darkMode ? "text-red-300" : "text-red-700"}`}
                >
                  {error}
                </p>
                <Button
                  onClick={handleRefresh}
                  className="mt-3"
                  variant="outline"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {searchMode && searchedEmployee && !searchLoading && (
          <DetailedEmployeeView employee={searchedEmployee} />
        )}

        {!searchMode && !loading && !error && currentItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentItems.map((employee, index) => (
                <EmployeeCard
                  key={employee.employee_id || index}
                  employee={employee}
                />
              ))}
            </div>

            {paginationData.totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-8 w-8 p-0 ${darkMode ? "border-gray-600 bg-gray-800 hover:bg-gray-700" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={14} />
                </Button>
                {Array.from(
                  { length: Math.min(paginationData.totalPages, 5) },
                  (_, i) => {
                    let pageNum;
                    if (paginationData.totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= paginationData.totalPages - 2)
                      pageNum = paginationData.totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        className={`h-8 w-8 p-0 ${currentPage === pageNum ? (darkMode ? "bg-blue-600" : "bg-blue-600") : darkMode ? "bg-gray-800" : "bg-white"} ${darkMode ? "hover:bg-blue-700" : "hover:bg-gray-50"}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  },
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-8 w-8 p-0 ${darkMode ? "border-gray-600 bg-gray-800 hover:bg-gray-700" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === paginationData.totalPages}
                >
                  <ChevronRightIcon size={14} />
                </Button>
              </div>
            )}
          </>
        )}

        {!searchMode && !loading && !error && currentItems.length === 0 && (
          <Card
            className={`p-8 text-center ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
          >
            <div className="flex flex-col items-center gap-3">
              <Users
                size={32}
                className={darkMode ? "text-gray-600" : "text-gray-300"}
              />
              <div>
                <h3
                  className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"} mb-1`}
                >
                  No Employees Found
                </h3>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  No employment applications have been submitted yet.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
