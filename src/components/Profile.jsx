// src/components/Profile.jsx
import React, { useState, useEffect } from "react"; 
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // Import useToast
import {
  User, Mail, Phone, Calendar, Shield, Building, Briefcase, Lock, Eye, EyeOff, CheckCircle // Added CheckCircle
} from "lucide-react";
import { getCurrentUser, apiRequest } from "../api";
import { useDarkMode } from "@/context/DarkModeContext";

export default function Profile() {
  const { darkMode } = useDarkMode();
  const { toast } = useToast(); // Initialize toast
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.confirm_new_password) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.new_password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      await apiRequest("/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
          confirm_new_password: passwordForm.confirm_new_password
        })
      });

      // Success toast matching PersonalProfileForm style
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Password Updated Successfully</span>
          </div>
        ),
        description: "Your password has been changed successfully.",
        className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
      });

      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_new_password: ""
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-start justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="w-full min-h-screen flex items-start justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            No user data available
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleColor = (role) => {
    const roleColors = {
      'superadmin': 'bg-purple-100 text-purple-800',
      'admin': 'bg-blue-100 text-blue-800',
      'hr': 'bg-green-100 text-green-800',
      'employee': 'bg-gray-100 text-gray-800'
    };
    return roleColors[role?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`w-full min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>My Profile</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Manage your personal information and account details
          </p>
        </div>

        {/* Profile Card */}
        <Card className={`overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {/* Cover and Profile */}
          <div className={`bg-gradient-to-r ${darkMode ? 'from-gray-700 to-gray-600' : 'from-blue-400 to-indigo-400'} h-32 relative`}>
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg border-2 border-white">
                {userData.profile_photo_url ? (
                  <img 
                    src={userData.profile_photo_url} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center ${userData.profile_photo_url ? 'hidden' : ''}`}>
                  <span className="text-2xl font-bold text-blue-600">
                    {getInitials(userData.first_name, userData.last_name)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className={`px-8 pt-16 pb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {`${userData.first_name || ""} ${userData.last_name || ""}`.trim()}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(userData.role)}`}>
                    {userData.role?.toUpperCase()}
                  </span>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>@{userData.username}</span>
                  {userData.employee_id && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      ID: {userData.employee_id}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="px-8 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Contact */}
              <Card className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-0`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                    <Mail className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Contact</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Email Address</p>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mt-1`}>{userData.email}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Phone Number</p>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mt-1`}>{userData.mobile_number}</p>
                  </div>
                </div>
              </Card>

              {/* Account */}
              <Card className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-0`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${darkMode ? 'bg-green-900' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
                    <Shield className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Account</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Username</p>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mt-1`}>{userData.username}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>User ID</p>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mt-1`}>{userData.id}</p>
                  </div>
                </div>
              </Card>

              {/* Organization */}
              <Card className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-0`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${darkMode ? 'bg-purple-900' : 'bg-purple-100'} rounded-lg flex items-center justify-center`}>
                    <Building className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Organization</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Tenant ID</p>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mt-1 truncate`} title={userData.tenant_id}>
                      {userData.tenant_id}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Role</p>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mt-1 capitalize`}>{userData.role}</p>
                  </div>
                </div>
              </Card>

              {/* Employee Information - Only show for employees */}
              {userData.role?.toLowerCase() === "employee" && (
                <Card className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-0`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} rounded-lg flex items-center justify-center`}>
                      <Briefcase className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    </div>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Employee Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Employee ID</p>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mt-1`}>{userData.employee_id || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Profile Photo</p>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mt-1`}>
                        {userData.profile_photo_url ? "Available" : "Not uploaded"}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Account Info */}
              <Card className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-0`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${darkMode ? 'bg-orange-900' : 'bg-orange-100'} rounded-lg flex items-center justify-center`}>
                    <Calendar className={`w-5 h-5 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                  </div>
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Account Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Member Since</p>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mt-1`}>
                      {userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Account Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 ${userData.is_active ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {userData.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>

        {/* Change Password Section */}
        <Card className={`mt-6 overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 ${darkMode ? 'bg-red-900' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                <Lock className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Change Password</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Update your account password regularly for security</p>
              </div>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="current_password"
                      value={passwordForm.current_password}
                      onChange={handlePasswordChange}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showPasswords.current ? (
                        <EyeOff className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <Eye className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="new_password"
                      value={passwordForm.new_password}
                      onChange={handlePasswordChange}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showPasswords.new ? (
                        <EyeOff className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <Eye className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirm_new_password"
                      value={passwordForm.confirm_new_password}
                      onChange={handlePasswordChange}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <Eye className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isChangingPassword}
                  className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}