//ResetPasswordPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import iscsLogo from "@/assets/iscs-logo.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword, removeToken, removeRefreshToken } from "../api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_new_password: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset."
      );
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    if (formData.new_password !== formData.confirm_new_password) {
      setError("Passwords do not match");
      return;
    }

    if (formData.new_password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await resetPassword(
        token,
        formData.new_password,
        formData.confirm_new_password
      );
      // Clear any existing session so the user lands on a clean login page
      removeToken();
      removeRefreshToken();
      setSuccess(true);
      // FIX 1: was navigate("/login") — login route is /hrms
      setTimeout(() => {
        navigate("/hrms");
      }, 3000);
    } catch (error) {
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token && !success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 backdrop-blur-xl bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/40 rounded-2xl">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              This password reset link is invalid or has expired. Please request
              a new password reset.
            </p>
            {/* FIX 2: was /forgot-password — route is /hrms/forgot-password */}
            <Link to="/hrms/forgot-password">
              <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                Request New Reset Link
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 backdrop-blur-xl bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/40 rounded-2xl">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Your password has been reset successfully. You will be
                redirected to the login page shortly.
              </p>
              {/* FIX 3: was /login — login route is /hrms */}
              <Link to="/hrms">
                <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                  Go to Login
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="w-full backdrop-blur-xl bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/40 rounded-2xl overflow-hidden">
          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img
                  src={iscsLogo}
                  alt="ISCS Logo"
                  className="h-12 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Create New Password
              </h1>
              <p className="text-gray-600 text-sm mt-2">
                Enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <Label
                  htmlFor="new_password"
                  className="text-gray-700 text-sm font-medium"
                >
                  New Password
                </Label>
                <div className="relative mt-1">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <Input
                    id="new_password"
                    name="new_password"
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Enter new password (min 8 characters)"
                    value={formData.new_password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-200 bg-white/90 rounded-lg text-sm"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label
                  htmlFor="confirm_new_password"
                  className="text-gray-700 text-sm font-medium"
                >
                  Confirm New Password
                </Label>
                <div className="relative mt-1">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <Input
                    id="confirm_new_password"
                    name="confirm_new_password"
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={formData.confirm_new_password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-200 bg-white/90 rounded-lg text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm text-center p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                    <span>Resetting Password...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <div className="text-center">
                {/* FIX 4: was /login — login route is /hrms */}
                <Link
                  to="/hrms"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}