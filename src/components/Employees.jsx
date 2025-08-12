// // // //Employees.jsx
import React, { useState, useEffect } from "react";
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
  Download,
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
  Grid,
  List,
  MoreVertical
} from "lucide-react";

export default function Employees() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [searchedEmployee, setSearchedEmployee] = useState(null);
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
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
    declaration: false
  });

  // Fetch all employment applications on component mount
  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const fetchAllEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('http://127.0.0.1:8000/db/employment-applications');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setAllEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employee data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchEmployeeById = async () => {
    if (!searchEmployeeId.trim()) {
      setSearchError('Please enter an employee ID');
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    try {
      const response = await fetch(`http://127.0.0.1:8000/db/employment-applications/${searchEmployeeId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Employee not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchedEmployee(data);
      setSearchMode(true);
      // Reset expanded sections when new employee is loaded
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
        declaration: false
      });
    } catch (error) {
      console.error('Error searching employee:', error);
      setSearchError(error.message || 'Failed to search employee. Please try again.');
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
    if (e.key === 'Enter') {
      searchEmployeeById();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const sectionColors = {
    personalProfile: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      headerBg: 'hover:bg-blue-50',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-700'
    },
    bankAccount: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      headerBg: 'hover:bg-green-50',
      badgeBg: 'bg-green-100',
      badgeText: 'text-green-700'
    },
    maritalStatus: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      headerBg: 'hover:bg-pink-50',
      badgeBg: 'bg-pink-100',
      badgeText: 'text-pink-700'
    },
    familyBackground: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      headerBg: 'hover:bg-purple-50',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-700'
    },
    academicBackground: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      headerBg: 'hover:bg-indigo-50',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-700'
    },
    professionalTraining: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      headerBg: 'hover:bg-teal-50',
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-700'
    },
    professionalExperience: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      headerBg: 'hover:bg-orange-50',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-700'
    },
    professionalReference: {
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      headerBg: 'hover:bg-cyan-50',
      badgeBg: 'bg-cyan-100',
      badgeText: 'text-cyan-700'
    },
    aboutSelf: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      headerBg: 'hover:bg-amber-50',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-700'
    },
    declaration: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      headerBg: 'hover:bg-slate-50',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700'
    }
  };

  const CollapsibleSection = ({ title, sectionKey, icon: Icon, children, badge }) => {
    const colors = sectionColors[sectionKey] || sectionColors.personalProfile;
    
    return (
      <Card className={`overflow-hidden ${colors.border} shadow-sm mb-3`}>
        <div 
          className={`flex items-center justify-between p-3 cursor-pointer ${colors.headerBg} transition-all duration-200 border-b ${colors.border}`}
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
              <Icon size={16} className={colors.iconColor} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
              {badge && (
                <span className="text-xs text-gray-500">{badge}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {badge && (
              <span className={`px-2 py-1 ${colors.badgeBg} ${colors.badgeText} rounded-full text-xs font-medium`}>
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
          <div className={`p-4 ${colors.bg}`}>
            {children}
          </div>
        )}
      </Card>
    );
  };

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-2 py-1">
      {Icon && <Icon size={14} className="text-gray-500 flex-shrink-0 mt-0.5" />}
      <div className="min-w-0 flex-1">
        <div className="text-xs text-gray-600 font-medium mb-1">{label}</div>
        <div className="text-sm text-gray-800 break-words bg-white px-2 py-1 rounded border border-gray-100">
          {value || 'N/A'}
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

    return (
      <div className="space-y-4">
        {/* Compact Employee Header */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">
                {`${personalProfile.first_name || ''} ${personalProfile.middle_name || ''} ${personalProfile.last_name || ''}`.trim() || 'N/A'}
              </h2>
              <p className="text-blue-600 font-medium">Employee ID: {employee.employee_id}</p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <Mail size={12} />
                  <span>{personalProfile.mail_id || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <Phone size={12} />
                  <span>{personalProfile.mobile_phone || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
              <CheckCircle2 size={14} className="text-green-600" />
              <span className="text-green-700 font-medium text-sm">Active</span>
            </div>
          </div>
        </Card>

        {/* Personal Profile Section */}
        <CollapsibleSection 
          title="Personal Profile" 
          sectionKey="personalProfile" 
          icon={User}
          badge="Basic Information"
        >
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
          
          {/* Address Information */}
          <div className="mt-6 pt-4 border-t border-blue-200">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Home size={16} className="text-blue-600" />
              Address Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-blue-600" />
                  Current Address
                </h5>
                <div className="space-y-1 text-gray-700 text-sm">
                  <div className="font-medium">{personalProfile.current_address_city}, {personalProfile.current_address_district}</div>
                  <div>{personalProfile.current_address_state} - {personalProfile.current_address_pin_code}</div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                  <Home size={14} className="text-blue-600" />
                  Permanent Address
                </h5>
                <div className="space-y-1 text-gray-700 text-sm">
                  <div className="font-medium">{personalProfile.permanent_address_city}, {personalProfile.permanent_address_district}</div>
                  <div>{personalProfile.permanent_address_state} - {personalProfile.permanent_address_pin_code}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-6 pt-4 border-t border-blue-200">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Contact size={16} className="text-blue-600" />
              Emergency Contact
            </h4>
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoRow label="Contact Name" value={personalProfile.emergency_contact_name} icon={User} />
                <InfoRow label="Relation" value={personalProfile.emergency_contact_relation} icon={Heart} />
                <InfoRow label="Mobile" value={personalProfile.emergency_contact_mobile} icon={Phone} />
                <InfoRow label="Email" value={personalProfile.emergency_contact_mail_id} icon={Mail} />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Bank Account Section */}
        {bankAccount && (
          <CollapsibleSection 
            title="Bank Account Details" 
            sectionKey="bankAccount" 
            icon={Banknote}
            badge="Financial Information"
          >
            <div className="bg-white p-3 rounded-lg border border-green-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoRow label="Account Number" value={bankAccount.account_number} icon={CreditCard} />
                <InfoRow label="Bank Name" value={bankAccount.bank_name} icon={Building} />
                <InfoRow label="Branch" value={bankAccount.branch} icon={MapPin} />
                <InfoRow label="IFSC Code" value={bankAccount.ifsc_code} icon={Code} />
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Marital Status Section */}
        {maritalStatus && (
          <CollapsibleSection 
            title="Marital Status" 
            sectionKey="maritalStatus" 
            icon={Heart}
            badge="Personal Status"
          >
            <div className="bg-white p-3 rounded-lg border border-pink-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoRow label="Status" value={maritalStatus.marital_status} icon={Heart} />
                <InfoRow label="Marriage Date" value={formatDate(maritalStatus.marriage_date)} icon={Calendar} />
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Family Background Section */}
        {familyBackground.length > 0 && (
          <CollapsibleSection 
            title="Family Background" 
            sectionKey="familyBackground" 
            icon={Users}
            badge={`${familyBackground.length} members`}
          >
            <div className="grid gap-3">
              {familyBackground.map((member, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-purple-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <InfoRow label="Relationship" value={member.relationship_status} icon={Heart} />
                    <InfoRow label="Name" value={member.name} icon={User} />
                    <InfoRow label="Gender" value={member.gender} icon={User} />
                    <InfoRow label="Age" value={`${member.age} years`} icon={Calendar} />
                  </div>
                  {member.date_of_birth && (
                    <div className="mt-3 pt-3 border-t border-purple-100">
                      <InfoRow label="Date of Birth" value={formatDate(member.date_of_birth)} icon={Calendar} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Academic Background Section */}
        {academicBackground.length > 0 && (
          <CollapsibleSection 
            title="Academic Background" 
            sectionKey="academicBackground" 
            icon={GraduationCap}
            badge={`${academicBackground.length} qualifications`}
          >
            <div className="grid gap-3">
              {academicBackground.map((education, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-indigo-100">
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

        {/* Professional Training Section */}
        {professionalTraining.length > 0 && (
          <CollapsibleSection 
            title="Professional Training" 
            sectionKey="professionalTraining" 
            icon={BookOpen}
            badge={`${professionalTraining.length} trainings`}
          >
            <div className="grid gap-3">
              {professionalTraining.map((training, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-teal-100">
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

        {/* Professional Experience Section */}
        {professionalExperience.length > 0 && (
          <CollapsibleSection 
            title="Professional Experience" 
            sectionKey="professionalExperience" 
            icon={Briefcase}
            badge={`${professionalExperience.length} positions`}
          >
            <div className="grid gap-3">
              {professionalExperience.map((experience, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-orange-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoRow label="Company" value={experience.company_name} icon={Building} />
                    <InfoRow label="Designation" value={experience.designation} icon={Briefcase} />
                    <InfoRow label="Location" value={experience.employer_location} icon={MapPin} />
                    <InfoRow label="Employee ID" value={experience.employer_id} icon={CreditCard} />
                    <InfoRow label="Period" value={`${formatDate(experience.period_from)} - ${formatDate(experience.period_to)}`} icon={Calendar} />
                    <InfoRow label="CTC" value={experience.ctc ? `₹${experience.ctc} LPA` : 'N/A'} icon={Banknote} />
                  </div>
                  {experience.reason_for_leaving && (
                    <div className="mt-3 pt-3 border-t border-orange-100">
                      <InfoRow label="Reason for Leaving" value={experience.reason_for_leaving} icon={FileText} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Professional Reference Section */}
        {professionalReference.length > 0 && (
          <CollapsibleSection 
            title="Professional References" 
            sectionKey="professionalReference" 
            icon={UserCheck}
            badge={`${professionalReference.length} references`}
          >
            <div className="grid gap-3">
              {professionalReference.map((reference, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-cyan-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoRow label="Name" value={reference.name} icon={User} />
                    <InfoRow label="Designation" value={reference.designation} icon={Briefcase} />
                    <InfoRow label="Company" value={reference.company} icon={Building} />
                    <InfoRow label="Contact" value={reference.tel_no} icon={Phone} />
                    <InfoRow label="Email" value={reference.email} icon={Mail} />
                    <InfoRow label="Period Known" value={`${reference.period_known} years`} icon={Calendar} />
                  </div>
                  <div className="mt-3 pt-3 border-t border-cyan-100">
                    <InfoRow label="Address" value={reference.address} icon={MapPin} />
                    <InfoRow label="Capacity Known" value={reference.capacity_known} icon={FileText} />
                    <InfoRow label="Referred by ISCS Employee" value={reference.referred_by_employee_ISCS ? 'Yes' : 'No'} icon={UserCheck} />
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* About Self Section */}
        {Object.keys(aboutSelf).length > 0 && (
          <CollapsibleSection 
            title="About Self" 
            sectionKey="aboutSelf" 
            icon={Target}
            badge="Self Assessment"
          >
            <div className="space-y-4">
              {/* Career & Achievements */}
              <div className="bg-white p-3 rounded-lg border border-amber-100">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                  <TrendingUp size={16} className="text-amber-600" />
                  Career & Achievements
                </h5>
                <div className="space-y-2">
                  <InfoRow label="Career Ambition" value={aboutSelf.career_ambition} icon={Target} />
                  <InfoRow label="Significant Achievements" value={aboutSelf.significant_achievements} icon={Award} />
                  <InfoRow label="Professional Failures" value={aboutSelf.professional_failures} icon={AlertTriangle} />
                </div>
              </div>

              {/* Strengths */}
              <div className="bg-white p-3 rounded-lg border border-amber-100">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                  <Zap size={16} className="text-green-600" />
                  Strengths
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InfoRow label="Strength 1" value={aboutSelf.strength1} />
                  <InfoRow label="Strength 2" value={aboutSelf.strength2} />
                  <InfoRow label="Strength 3" value={aboutSelf.strength3} />
                </div>
              </div>

              {/* Weaknesses */}
              <div className="bg-white p-3 rounded-lg border border-amber-100">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                  <AlertTriangle size={16} className="text-amber-600" />
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

        {/* Declaration Section */}
        {Object.keys(declaration).length > 0 && (
          <CollapsibleSection 
            title="Declaration" 
            sectionKey="declaration" 
            icon={FileText}
            badge="Legal Document"
          >
            <div className="bg-white p-3 rounded-lg border border-slate-100">
              <div className="space-y-3">
                <InfoRow label="Declared by" value={declaration.name} icon={User} />
                <InfoRow label="Date of Declaration" value={formatDate(declaration.date_of_declaration)} icon={Calendar} />
                {declaration.declaration_text && (
                  <div className="pt-3 border-t border-slate-100">
                    <h5 className="font-semibold text-gray-800 mb-3 text-sm">Declaration Text</h5>
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-gray-700 leading-relaxed border border-slate-200">
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

  // Compact Employee Card Component
  const EmployeeCard = ({ employee }) => {
    const personalProfile = employee.personal_profile || {};
    const name = `${personalProfile.first_name || ''} ${personalProfile.middle_name || ''} ${personalProfile.last_name || ''}`.trim() || employee.name || 'N/A';
    const email = personalProfile.mail_id || employee.email || 'N/A';
    const phone = personalProfile.mobile_phone || employee.phone || 'N/A';
    
    return (
      <Card className="p-3 hover:shadow-md transition-all border-l-4 border-l-blue-500 bg-white">
        <div className="space-y-3">
          {/* Header with Avatar and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{name}</h3>
                <p className="text-xs text-gray-500">#{employee.employee_id || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600 font-medium">Active</span>
            </div>
          </div>

          {/* Position and Department */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <Briefcase size={12} className="text-gray-400" />
              <span className="font-medium">{employee.position || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Building2 size={12} className="text-gray-400" />
              <span>{employee.client || employee.department || 'N/A'}</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Mail size={12} className="text-gray-400" />
              <span className="truncate">{email}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Phone size={12} className="text-gray-400" />
              <span>{phone}</span>
            </div>
          </div>

          {/* Footer with Date and Action */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>Joined {formatDate(employee.date_of_joining || personalProfile.date_of_joining)}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={() => {
                setSearchEmployeeId(employee.employee_id);
                searchEmployeeById();
              }}
            >
              <Eye size={12} className="mr-1" />
              View
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // Compact Table Component
  const EmployeeTable = ({ employees }) => (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Employee</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Contact</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Position</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Department</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Joined</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((employee, index) => {
              const personalProfile = employee.personal_profile || {};
              const name = `${personalProfile.first_name || ''} ${personalProfile.middle_name || ''} ${personalProfile.last_name || ''}`.trim() || employee.name || 'N/A';
              const email = personalProfile.mail_id || employee.email || 'N/A';
              const phone = personalProfile.mobile_phone || employee.phone || 'N/A';
              
              return (
                <tr key={employee.employee_id || index} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={12} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{name}</div>
                        <div className="text-xs text-gray-500">#{employee.employee_id || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600 truncate max-w-[150px]">{email}</div>
                      <div className="text-xs text-gray-500">{phone}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-sm text-gray-600">{employee.position || 'N/A'}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-sm text-gray-600">{employee.client || employee.department || 'N/A'}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-500">{formatDate(employee.date_of_joining || personalProfile.date_of_joining)}</span>
                  </td>
                  <td className="px-3 py-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => {
                        setSearchEmployeeId(employee.employee_id);
                        searchEmployeeById();
                      }}
                    >
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
    </Card>
  );

  return (
    <div className="p-4 space-y-4 max-w-full">
      {/* Compact Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users size={24} className="text-blue-600" />
            Employee Management
          </h1>
          <p className="text-gray-600 text-sm">Manage and view employee applications</p>
        </div>
        
        {/* Compact Search and Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                value={searchEmployeeId}
                onChange={(e) => setSearchEmployeeId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by Employee ID"
                className="pl-8 h-8 w-48 text-sm"
              />
            </div>
            <Button
              onClick={searchEmployeeById}
              disabled={searchLoading}
              size="sm"
              className="h-8 px-3"
            >
              {searchLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            </Button>
          </div>
          
          {/* View Toggle and Actions */}
          <div className="flex items-center gap-2">
            {searchMode && (
              <Button onClick={clearSearch} variant="outline" size="sm" className="h-8 px-3 text-xs">
                <Filter size={14} className="mr-1" />
                Show All
              </Button>
            )}
            
            {!searchMode && (
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => setViewMode('cards')}
                >
                  <Grid size={14} />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => setViewMode('table')}
                >
                  <List size={14} />
                </Button>
              </div>
            )}
            
            <Button variant="outline" size="sm" className="h-8 px-3" disabled={loading} onClick={fetchAllEmployees}>
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
            
            <Button size="sm" className="h-8 px-3 bg-green-600 hover:bg-green-700">
              <Download size={14} className="mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Search Error */}
      {searchError && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={14} />
            <span className="text-sm font-medium">{searchError}</span>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-4">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {searchMode ? 'Employee Details' : 'All Employees'}
            </h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {searchMode ? (searchedEmployee ? '1' : '0') : allEmployees.length} 
              {searchMode ? ' Found' : ' Total'}
            </span>
          </div>
          {!searchMode && (
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={24} className="animate-spin text-blue-600" />
              <p className="text-gray-600 text-sm">Loading employee data...</p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-6 text-center border-red-200 bg-red-50">
            <div className="flex flex-col items-center gap-3">
              <AlertCircle size={24} className="text-red-500" />
              <div>
                <p className="text-red-700 font-medium text-sm">{error}</p>
                <Button onClick={() => {}} className="mt-3" variant="outline" size="sm">
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Search Results - Detailed View */}
        {searchMode && searchedEmployee && !searchLoading && (
          <DetailedEmployeeView employee={searchedEmployee} />
        )}

        {/* All Employees Results */}
        {!searchMode && !loading && !error && allEmployees.length > 0 && (
          <>
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {allEmployees.map((employee, index) => (
                  <EmployeeCard key={employee.employee_id || index} employee={employee} />
                ))}
              </div>
            ) : (
              <EmployeeTable employees={allEmployees} />
            )}
          </>
        )}

        {/* No Results */}
        {!searchMode && !loading && !error && allEmployees.length === 0 && (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Users size={32} className="text-gray-300" />
              <div>
                <h3 className="font-medium text-gray-800 mb-1">No Employees Found</h3>
                <p className="text-gray-600 text-sm">No employment applications have been submitted yet.</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}