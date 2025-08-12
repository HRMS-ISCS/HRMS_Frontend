//loginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Mail, User, Shield, UserPlus } from "lucide-react";
import iscsLogo from "@/assets/iscs-logo.png";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Accept any email and password
    if (email && password) {
      onLogin();
    } else {
      setError("Please enter both email and password.");
    }
    setLoading(false);
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
      <Card className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl backdrop-blur-sm bg-white shadow-2xl border-0 ring-1 ring-gray-200/50 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[320px] sm:min-h-[360px] md:min-h-[400px] lg:h-[440px]">
          {/* Left Side - Logo and Branding */}
          <div className="bg-white relative overflow-hidden flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-green-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-red-500 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 text-center space-y-2 sm:space-y-3 md:space-y-4 w-full max-w-sm">
              {/* Logo Container */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg ring-1 ring-gray-100">
                <div className="w-full h-12 sm:h-16 md:h-20 bg-white rounded-lg flex items-center justify-center">
                  <img
                    src={iscsLogo}
                    alt="ISCS Logo"
                    className="h-8 sm:h-10 md:h-12 object-contain"
                  />
                </div>
              </div>

              {/* Welcome Text */}
              <div className="space-y-1 sm:space-y-2">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-xs mx-auto leading-relaxed px-2">
                  Access your Human Resource Management System with secure
                  authentication
                </p>
              </div>
              
              {/* Features - Hidden on small screens, shown on medium+ */}
              <div className="hidden md:grid grid-cols-1 gap-2 max-w-xs mx-auto">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-green-100 p-1.5 rounded-lg">
                    <Shield size={14} className="text-green-600" />
                  </div>
                  <span className="text-sm">Secure Access</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-blue-100 p-1.5 rounded-lg">
                    <User size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm">Employee Portal</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-red-100 p-1.5 rounded-lg">
                    <Lock size={14} className="text-red-600" />
                  </div>
                  <span className="text-sm">Protected Data</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Login Form */}
          <div className="flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50/50">
            <div className="w-full max-w-xs space-y-3 sm:space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Sign In</h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Enter your credentials to access your account
                </p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-700 font-medium text-xs sm:text-sm"
                  >
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-8 sm:pl-10 h-9 sm:h-10 md:h-11 text-sm border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 bg-white group-hover:border-gray-300"
                    />
                    <Mail
                      size={14}
                      className="sm:w-4 sm:h-4 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors"
                    />
                  </div>
                </div>
                
                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium text-xs sm:text-sm"
                  >
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-8 sm:pl-10 pr-8 sm:pr-10 h-9 sm:h-10 md:h-11 text-sm border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 bg-white group-hover:border-gray-300"
                    />
                    <Lock
                      size={14}
                      className="sm:w-4 sm:h-4 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={14} className="sm:w-4 sm:h-4" /> : <Eye size={14} className="sm:w-4 sm:h-4" />}
                    </button>
                  </div>
                </div>
                
                {error && (
                  <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs sm:text-sm text-red-600 text-center">{error}</p>
                  </div>
                )}
                
                <Button
                  type="submit"
                  className="w-full h-9 sm:h-10 md:h-11 text-sm font-medium bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-xs sm:text-sm">Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Register Button */}
              <Button
                onClick={handleRegister}
                variant="outline"
                className="w-full h-9 sm:h-10 md:h-11 text-sm border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 bg-white hover:bg-blue-50"
              >
                <UserPlus size={14} className="sm:w-4 sm:h-4 mr-2" />
                Register as New Employee
              </Button>
              
              <div className="text-center">
                <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot your password?
                </button>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-400">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="text-xs">Secure Login</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}