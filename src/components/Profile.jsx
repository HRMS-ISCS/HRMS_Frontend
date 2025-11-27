// src/components/Profile.jsx
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Calendar, Shield, Briefcase, Clock, ChevronRight } from "lucide-react";
import { getCurrentUser } from "../api";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
        No user data available
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
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and account details</p>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        {/* Cover and Profile Section */}
        <div className="bg-gradient-to-r from-blue-400 to-indigo-400 h-32 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {getInitials(userData.first_name, userData.last_name)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="px-8 pt-16 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {userData.first_name} {userData.last_name}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(userData.role)}`}>
                  {userData.role?.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">@{userData.username}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Contact Information Card */}
            <Card className="p-6 bg-gray-50 border-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Contact</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{userData.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Phone Number</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{userData.mobile_number}</p>
                </div>
              </div>
            </Card>

            {/* Account Information Card */}
            <Card className="p-6 bg-gray-50 border-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Account</h3>
              </div>
              <div className="space-y-3">
                {/* User ID field removed */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Username</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{userData.username}</p>
                </div>
              </div>
            </Card>

            {/* Organization Information Card */}
            <Card className="p-6 bg-gray-50 border-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Organization</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Tenant ID</p>
                  <p className="text-sm font-medium text-gray-900 mt-1 truncate" title={userData.tenant_id}>
                    {userData.tenant_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Role</p>
                  <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{userData.role}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Additional Information */}
          <Card className="mt-6 p-6 bg-gray-50 border-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Account Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Member Since</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {new Date(userData.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Account Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm font-medium text-gray-900">Active</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}