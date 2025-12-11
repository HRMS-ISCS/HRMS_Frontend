// // src/components/Employees.jsx
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, Search, Loader2, RefreshCw, User, Mail, Phone, Briefcase, Calendar, 
  Building2, Code, AlertCircle, CheckCircle2, Eye, Filter, MapPin, 
  CreditCard, GraduationCap, Award, Heart, FileText, Contact, Building, 
  Banknote, ChevronDown, ChevronRight, UserCheck, Shield, Home, Flag, Globe, 
  BookOpen, Target, TrendingUp, AlertTriangle, Zap, Grid, List, MoreVertical, 
  ChevronLeft, ChevronRight as ChevronRightIcon 
} from "lucide-react";
import { apiRequest } from "../api"; // Import API request function
import { useDarkMode } from "@/context/DarkModeContext";

export default function Employees() {
  const { darkMode } = useDarkMode();
  const [allEmployees, setAllEmployees] = useState([]);
  const [searchedEmployee, setSearchedEmployee] = useState(null);
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [viewMode, setViewMode] = useState("cards");
  const [currentPage, setCurrentPage] = useState(1);
  const [cardItemsPerPage] = useState(8); // 8 cards per page
  const [tableItemsPerPage] = useState(6); // Fixed 6 rows per page
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

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  useEffect(() => {
    if (allEmployees.length > 0) {
      fetchProfilePictures();
    }
  }, [allEmployees]);

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode, searchMode]);

  const fetchAllEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      // Use the apiRequest function instead of direct fetch
      const data = await apiRequest("/db/employment-applications");
      setAllEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employee data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfilePictures = async () => {
    try {
      const picturePromises = allEmployees.map(async (employee) => {
        try {
          // Use the apiRequest function for profile pictures
          const data = await apiRequest(`/db/generate-sas/${employee.employee_id}`);
          if (data.documents?.profile_photo?.sas_url) {
            return {
              employeeId: employee.employee_id,
              profilePicture: data.documents.profile_photo.sas_url
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching profile picture for ${employee.employee_id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(picturePromises);
      const pictureMap = {};
      results.forEach(result => {
        if (result) pictureMap[result.employeeId] = result.profilePicture;
      });
      setProfilePictures(pictureMap);
    } catch (error) {
      console.error("Error fetching profile pictures:", error);
    }
  };

  const fetchProfilePicture = async (employeeId) => {
    try {
      // Use the apiRequest function for individual profile picture
      const data = await apiRequest(`/db/generate-sas/${employeeId}`);
      if (data.documents?.profile_photo?.sas_url) {
        setProfilePictures(prev => ({
          ...prev,
          [employeeId]: data.documents.profile_photo.sas_url
        }));
        return data.documents.profile_photo.sas_url;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching profile picture for ${employeeId}:`, error);
      return null;
    }
  };

  const searchEmployeeById = async (employeeId = null) => {
    const idToSearch = employeeId || searchEmployeeId.trim();
    if (!idToSearch) {
      setSearchError("Please enter an employee ID");
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    try {
      // Use the apiRequest function for searching employee
      const data = await apiRequest(`/db/employment-applications/${idToSearch}`);
      setSearchedEmployee(data);
      setSearchMode(true);
      setSearchEmployeeId(idToSearch);
      await fetchProfilePicture(idToSearch);
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
      setSearchError(error.message || "Failed to search employee. Please try again.");
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
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") searchEmployeeById();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // Pagination logic
  const itemsPerPage = viewMode === "cards" ? cardItemsPerPage : tableItemsPerPage;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchMode 
    ? (searchedEmployee ? [searchedEmployee] : []) 
    : allEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allEmployees.length / itemsPerPage);

  const sectionColors = {
    personalProfile: { 
      bg: darkMode ? "bg-gray-800" : "bg-blue-50", 
      border: darkMode ? "border-gray-700" : "border-blue-200", 
      iconBg: darkMode ? "bg-gray-700" : "bg-blue-100", 
      iconColor: darkMode ? "text-blue-400" : "text-blue-600", 
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-blue-50", 
      badgeBg: darkMode ? "bg-blue-900/30" : "bg-blue-100", 
      badgeText: darkMode ? "text-blue-300" : "text-blue-700" 
    },
    bankAccount: { 
      bg: darkMode ? "bg-gray-800" : "bg-green-50", 
      border: darkMode ? "border-gray-700" : "border-green-200", 
      iconBg: darkMode ? "bg-gray-700" : "bg-green-100", 
      iconColor: darkMode ? "text-green-400" : "text-green-600", 
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-green-50", 
      badgeBg: darkMode ? "bg-green-900/30" : "bg-green-100", 
      badgeText: darkMode ? "text-green-300" : "text-green-700" 
    },
    maritalStatus: { 
      bg: darkMode ? "bg-gray-800" : "bg-pink-50", 
      border: darkMode ? "border-gray-700" : "border-pink-200", 
      iconBg: darkMode ? "bg-gray-700" : "bg-pink-100", 
      iconColor: darkMode ? "text-pink-400" : "text-pink-600", 
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-pink-50", 
      badgeBg: darkMode ? "bg-pink-900/30" : "bg-pink-100", 
      badgeText: darkMode ? "text-pink-300" : "text-pink-700" 
    },
    familyBackground: { 
      bg: darkMode ? "bg-gray-800" : "bg-purple-50", 
      border: darkMode ? "border-gray-700" : "border-purple-200", 
      iconBg: darkMode ? "bg-gray-700" : "bg-purple-100", 
      iconColor: darkMode ? "text-purple-400" : "text-purple-600", 
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-purple-50", 
      badgeBg: darkMode ? "bg-purple-900/30" : "bg-purple-100", 
      badgeText: darkMode ? "text-purple-300" : "text-purple-700" 
    },
    academicBackground: { 
      bg: darkMode ? "bg-gray-800" : "bg-indigo-50", 
      border: darkMode ? "border-gray-700" : "border-indigo-200", 
      iconBg: darkMode ? "bg-gray-700" : "bg-indigo-100", 
      iconColor: darkMode ? "text-indigo-400" : "text-indigo-600", 
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50", 
      badgeBg: darkMode ? "bg-indigo-900/30" : "bg-indigo-100", 
      badgeText: darkMode ? "text-indigo-300" : "text-indigo-700" 
    },
    professionalTraining: { 
      bg: darkMode ? "bg-gray-800" : "bg-teal-50", 
      border: darkMode ? "border-gray-700" : "border-teal-200", 
      iconBg: darkMode ? "bg-gray-700" : "bg-teal-100", 
      iconColor: darkMode ? "text-teal-400" : "text-teal-600", 
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-teal-50", 
      badgeBg: darkMode ? "bg-teal-900/30" : "bg-teal-100", 
      badgeText: darkMode ? "text-teal-300" : "text-teal-700" 
    },
    professionalExperience: { 
      bg: darkMode ? "bg-gray-800" : "bg-orange-50", 
      border: darkMode ? "border-gray-700" : "border-orange-200", 
      iconBg: darkMode ? "bg-gray-700" : "bg-orange-100", 
      iconColor: darkMode ? "text-orange-400" : "text-orange-600", 
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-orange-50", 
      badgeBg: darkMode ? "bg-orange-900/30" : "bg-orange-100", 
      badgeText: darkMode ? "text-orange-300" : "text-orange-700" 
    },
    professionalReference: { 
      bg: darkMode ? "bg-gray-800" : "bg-cyan-50", 
      border: darkMode ? "border-gray-700" : "border-cyan-200", 
      iconBg: darkMode ? "bg-gray-700" : "bg-cyan-100", 
      iconColor: darkMode ? "text-cyan-400" : "text-cyan-600", 
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-cyan-50", 
      badgeBg: darkMode ? "bg-cyan-900/30" : "bg-cyan-100", 
      badgeText: darkMode ? "text-cyan-300" : "text-cyan-700" 
    },
    aboutSelf: { 
      bg: darkMode ? "bg-gray-800" : "bg-amber-50", 
      border: darkMode ? "border-gray-700" : "border-amber-200", 
      iconBg: darkMode ? "bg-gray-700" : "bg-amber-100", 
      iconColor: darkMode ? "text-amber-400" : "text-amber-600", 
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-amber-50", 
      badgeBg: darkMode ? "bg-amber-900/30" : "bg-amber-100", 
      badgeText: darkMode ? "text-amber-300" : "text-amber-700" 
    },
    declaration: { 
      bg: darkMode ? "bg-gray-800" : "bg-slate-50", 
      border: darkMode ? "border-gray-700" : "border-slate-200", 
      iconBg: darkMode ? "bg-gray-700" : "bg-slate-100", 
      iconColor: darkMode ? "text-slate-400" : "text-slate-600", 
      headerBg: darkMode ? "hover:bg-gray-700" : "hover:bg-slate-50", 
      badgeBg: darkMode ? "bg-slate-900/30" : "bg-slate-100", 
      badgeText: darkMode ? "text-slate-300" : "text-slate-700" 
    },
  };

  const CollapsibleSection = ({ title, sectionKey, icon: Icon, children, badge }) => {
    const colors = sectionColors[sectionKey] || sectionColors.personalProfile;
    return (
      <Card className={`overflow-hidden ${colors.border} shadow-sm mb-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`flex items-center justify-between p-3 cursor-pointer ${colors.headerBg} transition-all duration-200 border-b ${colors.border}`} onClick={() => toggleSection(sectionKey)}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
              <Icon size={16} className={colors.iconColor} />
            </div>
            <div>
              <h3 className={`font-semibold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{title}</h3>
              {badge && <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{badge}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {badge && <span className={`px-2 py-1 ${colors.badgeBg} ${colors.badgeText} rounded-full text-xs font-medium`}>{badge}</span>}
            <div className={`p-1 rounded-full ${colors.iconBg}`}>
              {expandedSections[sectionKey] ? <ChevronDown size={14} className={colors.iconColor} /> : <ChevronRight size={14} className={colors.iconColor} />}
            </div>
          </div>
        </div>
        {expandedSections[sectionKey] && <div className={`p-4 ${colors.bg}`}>{children}</div>}
      </Card>
    );
  };

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-2 py-1">
      {Icon && <Icon size={14} className={`flex-shrink-0 mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />}
      <div className="min-w-0 flex-1">
        <div className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
        <div className={`text-sm break-words px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-100 text-gray-800'}`}>{value || "N/A"}</div>
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

    return (
      <div className="space-y-4">
        <Card className={`p-4 shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className="relative">
              {profilePicture ? (
                <img src={profilePicture} alt={`${personalProfile.first_name} ${personalProfile.last_name}`} className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md" />
              ) : (
                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 border-white shadow-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <User size={32} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                {`${personalProfile.first_name || ""} ${personalProfile.middle_name || ""} ${personalProfile.last_name || ""}`.trim() || "N/A"}
              </h2>
              <p className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Employee ID: {employee.employee_id}</p>
              <div className="flex items-center gap-4 mt-1">
                <div className={`flex items-center gap-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Mail size={12} />
                  <span>{personalProfile.mail_id || "N/A"}</span>
                </div>
                <div className={`flex items-center gap-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Phone size={12} />
                  <span>{personalProfile.mobile_phone || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <CollapsibleSection title="Personal Profile" sectionKey="personalProfile" icon={User} badge="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <InfoRow label="Date of Birth" value={formatDate(personalProfile.date_of_birth)} icon={Calendar} />
              <InfoRow label="Gender" value={personalProfile.gender} icon={User} />
              <InfoRow label="Blood Group" value={personalProfile.blood_group} icon={Heart} />
              <InfoRow label="Nationality" value={personalProfile.nationality} icon={Flag} />
            </div>
            <div className="space-y-2">
              <InfoRow label="Aadhar Number" value={personalProfile.aadhar_no} icon={CreditCard} />
              <InfoRow label="PAN Card" value={personalProfile.pan_card_no} icon={CreditCard} />
              <InfoRow label="Passport Number" value={personalProfile.passport_no} icon={Globe} />
              <InfoRow label="UAN Number" value={personalProfile.uan_number} icon={Shield} />
            </div>
          </div>

          <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-blue-200'}`}>
            <h4 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              <Home size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              Address Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
                <h5 className={`font-semibold mb-2 flex items-center gap-2 text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  <MapPin size={14} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                  Current Address
                </h5>
                <div className={`space-y-1 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  <div className="font-medium">{personalProfile.current_address_city}, {personalProfile.current_address_district}</div>
                  <div>{personalProfile.current_address_state} - {personalProfile.current_address_pin_code}</div>
                </div>
              </div>
              <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
                <h5 className={`font-semibold mb-2 flex items-center gap-2 text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  <Home size={14} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                  Permanent Address
                </h5>
                <div className={`space-y-1 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  <div className="font-medium">{personalProfile.permanent_address_city}, {personalProfile.permanent_address_district}</div>
                  <div>{personalProfile.permanent_address_state} - {personalProfile.permanent_address_pin_code}</div>
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-blue-200'}`}>
            <h4 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              <Contact size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              Emergency Contact
            </h4>
            <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoRow label="Contact Name" value={personalProfile.emergency_contact_name} icon={User} />
                <InfoRow label="Relation" value={personalProfile.emergency_contact_relation} icon={Heart} />
                <InfoRow label="Mobile" value={personalProfile.emergency_contact_mobile} icon={Phone} />
                <InfoRow label="Email" value={personalProfile.emergency_contact_mail_id} icon={Mail} />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {bankAccount && (
          <CollapsibleSection title="Bank Account Details" sectionKey="bankAccount" icon={Banknote} badge="Financial Information">
            <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoRow label="Account Number" value={bankAccount.account_number} icon={CreditCard} />
                <InfoRow label="Bank Name" value={bankAccount.bank_name} icon={Building} />
                <InfoRow label="Branch" value={bankAccount.branch} icon={MapPin} />
                <InfoRow label="IFSC Code" value={bankAccount.ifsc_code} icon={Code} />
              </div>
            </div>
          </CollapsibleSection>
        )}

        {maritalStatus && (
          <CollapsibleSection title="Marital Status" sectionKey="maritalStatus" icon={Heart} badge="Personal Status">
            <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoRow label="Status" value={maritalStatus.marital_status} icon={Heart} />
                <InfoRow label="Marriage Date" value={formatDate(maritalStatus.marriage_date)} icon={Calendar} />
              </div>
            </div>
          </CollapsibleSection>
        )}

        {familyBackground.length > 0 && (
          <CollapsibleSection title="Family Background" sectionKey="familyBackground" icon={Users} badge={`${familyBackground.length} members`}>
            <div className="grid gap-3">
              {familyBackground.map((member, index) => (
                <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <InfoRow label="Relationship" value={member.relationship_status} icon={Heart} />
                    <InfoRow label="Name" value={member.name} icon={User} />
                    <InfoRow label="Gender" value={member.gender} icon={User} />
                    <InfoRow label="Age" value={`${member.age} years`} icon={Calendar} />
                  </div>
                  {member.date_of_birth && (
                    <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-100'}`}>
                      <InfoRow label="Date of Birth" value={formatDate(member.date_of_birth)} icon={Calendar} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {academicBackground.length > 0 && (
          <CollapsibleSection title="Academic Background" sectionKey="academicBackground" icon={GraduationCap} badge={`${academicBackground.length} qualifications`}>
            <div className="grid gap-3">
              {academicBackground.map((education, index) => (
                <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoRow label="Qualification" value={education.qualification} icon={GraduationCap} />
                    <InfoRow label="Specialization" value={education.specification} icon={BookOpen} />
                    <InfoRow label="Institute" value={education.institute_name} icon={Building} />
                    <InfoRow label="Year of Passing" value={education.year_of_passing} icon={Calendar} />
                    <InfoRow label="Grade/Rank" value={education.rank_or_grade} icon={Award} />
                    <InfoRow label="Duration" value={`${formatDate(education.duration_from)} - ${formatDate(education.duration_to)}`} icon={Calendar} />
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {professionalTraining.length > 0 && (
          <CollapsibleSection title="Professional Training" sectionKey="professionalTraining" icon={BookOpen} badge={`${professionalTraining.length} trainings`}>
            <div className="grid gap-3">
              {professionalTraining.map((training, index) => (
                <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <InfoRow label="Institute" value={training.institute_name} icon={Building} />
                    <InfoRow label="Duration" value={training.duration} icon={Calendar} />
                    <InfoRow label="Training Area" value={training.area_of_training} icon={Target} />
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {professionalExperience.length > 0 && (
          <CollapsibleSection title="Professional Experience" sectionKey="professionalExperience" icon={Briefcase} badge={`${professionalExperience.length} positions`}>
            <div className="grid gap-3">
              {professionalExperience.map((experience, index) => (
                <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoRow label="Company" value={experience.company_name} icon={Building} />
                    <InfoRow label="Designation" value={experience.designation} icon={Briefcase} />
                    <InfoRow label="Location" value={experience.employer_location} icon={MapPin} />
                    <InfoRow label="Employee ID" value={experience.employer_id} icon={CreditCard} />
                    <InfoRow label="Period" value={`${formatDate(experience.period_from)} - ${formatDate(experience.period_to)}`} icon={Calendar} />
                    <InfoRow label="CTC" value={experience.ctc ? `₹${experience.ctc} LPA` : "N/A"} icon={Banknote} />
                  </div>
                  {experience.reason_for_leaving && (
                    <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-100'}`}>
                      <InfoRow label="Reason for Leaving" value={experience.reason_for_leaving} icon={FileText} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {professionalReference.length > 0 && (
          <CollapsibleSection title="Professional References" sectionKey="professionalReference" icon={UserCheck} badge={`${professionalReference.length} references`}>
            <div className="grid gap-3">
              {professionalReference.map((reference, index) => (
                <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoRow label="Name" value={reference.name} icon={User} />
                    <InfoRow label="Designation" value={reference.designation} icon={Briefcase} />
                    <InfoRow label="Company" value={reference.company} icon={Building} />
                    <InfoRow label="Contact" value={reference.tel_no} icon={Phone} />
                    <InfoRow label="Email" value={reference.email} icon={Mail} />
                    <InfoRow label="Period Known" value={`${reference.period_known} years`} icon={Calendar} />
                  </div>
                  <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-100'}`}>
                    <InfoRow label="Address" value={reference.address} icon={MapPin} />
                    <InfoRow label="Capacity Known" value={reference.capacity_known} icon={FileText} />
                    <InfoRow label="Referred by ISCS Employee" value={reference.referred_by_employee_ISCS ? "Yes" : "No"} icon={UserCheck} />
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {Object.keys(aboutSelf).length > 0 && (
          <CollapsibleSection title="About Self" sectionKey="aboutSelf" icon={Target} badge="Self Assessment">
            <div className="space-y-4">
              <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
                <h5 className={`font-semibold mb-3 flex items-center gap-2 text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  <TrendingUp size={16} className={darkMode ? 'text-gray-600' : 'text-gray-600'} />
                  Career & Achievements
                </h5>
                <div className="space-y-2">
                  <InfoRow label="Career Ambition" value={aboutSelf.career_ambition} icon={Target} />
                  <InfoRow label="Significant Achievements" value={aboutSelf.significant_achievements} icon={Award} />
                  <InfoRow label="Professional Failures" value={aboutSelf.professional_failures} icon={AlertTriangle} />
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
                <h5 className={`font-semibold mb-3 flex items-center gap-2 text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  <Zap size={16} className={darkMode ? 'text-green-400' : 'text-green-600'} />
                  Strengths
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InfoRow label="Strength 1" value={aboutSelf.strength1} />
                  <InfoRow label="Strength 2" value={aboutSelf.strength2} />
                  <InfoRow label="Strength 3" value={aboutSelf.strength3} />
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
                <h5 className={`font-semibold mb-3 flex items-center gap-2 text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  <AlertTriangle size={16} className={darkMode ? 'text-amber-400' : 'text-amber-600'} />
                  Areas for Improvement
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InfoRow label="Area 1" value={aboutSelf.weakness1} />
                  <InfoRow label="Area 2" value={aboutSelf.weakness2} />
                  <InfoRow label="Area 3" value={aboutSelf.weakness3} />
                </div>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {Object.keys(declaration).length > 0 && (
          <CollapsibleSection title="Declaration" sectionKey="declaration" icon={FileText} badge="Legal Document">
            <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
              <div className="space-y-3">
                <InfoRow label="Declared by" value={declaration.name} icon={User} />
                <InfoRow label="Date of Declaration" value={formatDate(declaration.date_of_declaration)} icon={Calendar} />
                {declaration.declaration_text && (
                  <div className={`pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-100'}`}>
                    <h5 className={`font-semibold mb-3 text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Declaration Text</h5>
                    <div className={`p-3 rounded-lg text-sm leading-relaxed border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
                      {declaration.declaration_text}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleSection>
        )}
      </div>
    );
  };

  const EmployeeCard = ({ employee }) => {
    const personalProfile = employee.personal_profile || {};
    const name = `${personalProfile.first_name || ""} ${personalProfile.middle_name || ""} ${personalProfile.last_name || ""}`.trim() || employee.name || "N/A";
    const email = personalProfile.mail_id || employee.email || "N/A";
    const phone = personalProfile.mobile_phone || employee.phone || "N/A";
    const profilePicture = profilePictures[employee.employee_id];

    const getInitials = (fullName) => {
      const names = fullName.split(" ").filter(n => n);
      if (names.length >= 2) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      return names[0] ? names[0].substring(0, 2).toUpperCase() : "NA";
    };

    const initials = getInitials(name);

    return (
      <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden relative ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="relative p-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm border-4 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-500' : 'bg-gradient-to-br from-blue-100 to-cyan-100 border-white'}`}>
                {profilePicture ? (
                  <img src={profilePicture} alt={name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{initials}</span>
                )}
              </div>
            </div>
            <div className="text-center mt-2">
              {/* <h3 className={`font-bold text-sm mb-0.5 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{name}</h3> */}
              <h3 className={`font-bold text-sm mb-0.5 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{name.toUpperCase()}</h3>
              <div className="flex items-center justify-center">
                <span className={`font-mono px-1.5 py-0.5 rounded-full text-[10px] font-medium ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  #{employee.employee_id || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <Briefcase size={12} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Position</p>
                <p className={`text-xs ${darkMode ? 'text-gray-100' : 'text-gray-900'} font-semibold truncate`}>{employee.position || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                <Building2 size={12} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Department</p>
                <p className={`text-xs ${darkMode ? 'text-gray-100' : 'text-gray-900'} font-semibold truncate`}>{employee.client || employee.department || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <Mail size={10} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
              </div>
              <span className={`text-[11px] ${darkMode ? 'text-gray-300' : 'text-gray-600'} truncate flex-1`}>{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <Phone size={10} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
              </div>
              <span className={`text-[11px] ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{phone}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <div className={`w-4 h-4 rounded flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <Calendar size={9} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
              </div>
              <div>
                <p className={`text-[9px] ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>Joined</p>
                <p className={`text-[10px] ${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>{formatDate(employee.date_of_joining || personalProfile.date_of_joining)}</p>
              </div>
            </div>
            <Button size="sm" className={`h-7 px-2.5 shadow-sm ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`} onClick={() => searchEmployeeById(employee.employee_id)}>
              <Eye size={11} className="mr-1" />
              <span className="text-[11px] font-semibold">View</span>
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const EmployeeTable = ({ employees }) => {
    // Create array of 6 items (fill with empty objects if needed)
    const tableRows = Array.from({ length: 6 }, (_, index) => {
      if (index < employees.length) {
        return employees[index];
      }
      return null; // Empty row
    });

    return (
      <Card className={`overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <tr>
                <th className={`px-3 py-2 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Employee</th>
                <th className={`px-3 py-2 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Contact</th>
                <th className={`px-3 py-2 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Position</th>
                <th className={`px-3 py-2 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Department</th>
                <th className={`px-3 py-2 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Joined</th>
                <th className={`px-3 py-2 text-left text-xs font-semibold ${darkMode ? 'text-gray-303' : 'text-gray-700'}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {tableRows.map((employee, index) => {
                if (!employee) {
                  // Empty row
                  return (
                    <tr key={`empty-${index}`} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <User size={12} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                          </div>
                          <div>
                            <div className={`text-sm font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>—</div>
                            <div className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>—</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="space-y-1">
                          <div className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>—</div>
                          <div className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>—</div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>—</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>—</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>—</span>
                      </td>
                      <td className="px-3 py-2">
                        <Button variant="ghost" size="sm" disabled className={`h-6 px-2 text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                          <Eye size={12} className="mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                }

                const personalProfile = employee.personal_profile || {};
                const name = `${personalProfile.first_name || ""} ${personalProfile.middle_name || ""} ${personalProfile.last_name || ""}`.trim() || employee.name || "N/A";
                const email = personalProfile.mail_id || employee.email || "N/A";
                const phone = personalProfile.mobile_phone || employee.phone || "N/A";
                const profilePicture = profilePictures[employee.employee_id];

                return (
                  <tr key={employee.employee_id || index} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          {profilePicture ? (
                            <img src={profilePicture} alt={name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User size={12} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                          )}
                        </div>
                        <div>
                          {/* <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{name}</div> */}
                          <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{name.toUpperCase()}</div>
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>#{employee.employee_id || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="space-y-1">
                        <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} truncate max-w-[150px]`}>{email}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{phone}</div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{employee.position || "N/A"}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{employee.client || employee.department || "N/A"}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(employee.date_of_joining || personalProfile.date_of_joining)}</span>
                    </td>
                    <td className="px-3 py-2">
                      <Button variant="ghost" size="sm" className={`h-6 px-2 text-xs ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`} onClick={() => searchEmployeeById(employee.employee_id)}>
                        <Eye size={12} className="mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Always show pagination with fixed 6 rows per page */}
        <div className={`flex items-center justify-between px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t`}>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, allEmployees.length)} of {allEmployees.length} employees
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className={`h-8 w-8 p-0 ${darkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50'}`} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              <ChevronLeft size={14} />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              
              return (
                <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="sm" className={`h-8 w-8 p-0 ${currentPage === pageNum ? (darkMode ? 'bg-blue-600' : 'bg-blue-600') : (darkMode ? 'bg-gray-800' : 'bg-white')} ${darkMode ? 'hover:bg-blue-700' : 'hover:bg-gray-50'}`} onClick={() => setCurrentPage(pageNum)}>
                  {pageNum}
                </Button>
              );
            })}
            <Button variant="outline" size="sm" className={`h-8 w-8 p-0 ${darkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50'}`} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              <ChevronRightIcon size={14} />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    /* Top-level wrapper: full width + full viewport height so background doesn't show as a band */
    <div className={`w-full min-h-screen p-4 space-y-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} flex items-center gap-2`}>
            <Users size={24} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            Employee Management
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage and view employee applications</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <Input 
                type="text" 
                value={searchEmployeeId} 
                onChange={(e) => setSearchEmployeeId(e.target.value)} 
                onKeyPress={handleKeyPress} 
                placeholder="Search by Employee ID" 
                className={`pl-8 h-8 w-48 text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500/20 focus:border-blue-500' : 'bg-white border-gray-200 text-gray-800 focus:ring-blue-500/20 focus:border-blue-500'}`} 
              />
            </div>
            <Button onClick={() => searchEmployeeById()} disabled={searchLoading} size="sm" className={`h-8 px-3 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
              {searchLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {searchMode && (
              <Button onClick={clearSearch} variant="outline" size="sm" className={`h-8 px-3 text-xs ${darkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                <Filter size={14} className="mr-1" />
                Show All
              </Button>
            )}

            {!searchMode && (
              <div className={`flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                <Button variant={viewMode === "cards" ? "default" : "ghost"} size="sm" className={`h-6 px-2 ${viewMode === "cards" ? (darkMode ? 'bg-blue-600' : 'bg-blue-600') : (darkMode ? 'bg-gray-800' : 'bg-white')} ${darkMode ? 'hover:bg-blue-700' : 'hover:bg-gray-50'}`} onClick={() => setViewMode("cards")}>
                  <Grid size={14} />
                </Button>
                <Button variant={viewMode === "table" ? "default" : "ghost"} size="sm" className={`h-6 px-2 ${viewMode === "table" ? (darkMode ? 'bg-blue-600' : 'bg-blue-600') : (darkMode ? 'bg-gray-800' : 'bg-white')} ${darkMode ? 'hover:bg-blue-700' : 'hover:bg-gray-50'}`} onClick={() => setViewMode("table")}>
                  <List size={14} />
                </Button>
              </div>
            )}

            <Button variant="outline" size="sm" className={`h-8 px-3 ${darkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50'}`} disabled={loading} onClick={fetchAllEmployees}>
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
          </div>
        </div>
      </div>

      {searchError && (
        <div className={`p-2 rounded-lg ${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={14} />
            <span className="text-sm font-medium">{searchError}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              {searchMode ? "Employee Details" : "All Employees"}
            </h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
              {searchMode ? (searchedEmployee ? "1" : "0") : allEmployees.length} {searchMode ? "Found" : "Total"}
            </span>
          </div>
          {!searchMode && <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last updated: {new Date().toLocaleTimeString()}</div>}
        </div>

        {loading && (
          <Card className={`p-8 text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={24} className={`animate-spin ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading employee data...</p>
            </div>
          </Card>
        )}

        {error && !loading && (
          <Card className={`p-6 text-center ${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
            <div className="flex flex-col items-center gap-3">
              <AlertCircle size={24} className="text-red-500" />
              <div>
                <p className={`text-red-700 font-medium text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
                <Button onClick={fetchAllEmployees} className="mt-3" variant="outline" size="sm">Try Again</Button>
              </div>
            </div>
          </Card>
        )}

        {searchMode && searchedEmployee && !searchLoading && <DetailedEmployeeView employee={searchedEmployee} />}

        {!searchMode && !loading && !error && allEmployees.length > 0 && (
          <>
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentItems.map((employee, index) => (
                  <EmployeeCard key={employee.employee_id || index} employee={employee} />
                ))}
              </div>
            ) : (
              <EmployeeTable employees={currentItems} />
            )}
            
            {viewMode === "cards" && allEmployees.length > cardItemsPerPage && (
              <div className="flex items-center justify-center gap-1 mt-4">
                <Button variant="outline" size="sm" className={`h-8 w-8 p-0 ${darkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50'}`} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                  <ChevronLeft size={14} />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  
                  return (
                    <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="sm" className={`h-8 w-8 p-0 ${currentPage === pageNum ? (darkMode ? 'bg-blue-600' : 'bg-blue-600') : (darkMode ? 'bg-gray-800' : 'bg-white')} ${darkMode ? 'hover:bg-blue-700' : 'hover:bg-gray-50'}`} onClick={() => setCurrentPage(pageNum)}>
                      {pageNum}
                    </Button>
                  );
                })}
                <Button variant="outline" size="sm" className={`h-8 w-8 p-0 ${darkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50'}`} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                  <ChevronRightIcon size={14} />
                </Button>
              </div>
            )}
          </>
        )}

        {!searchMode && !loading && !error && allEmployees.length === 0 && (
          <Card className={`p-8 text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex flex-col items-center gap-3">
              <Users size={32} className={darkMode ? 'text-gray-600' : 'text-gray-300'} />
              <div>
                <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>No Employees Found</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No employment applications have been submitted yet.</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}