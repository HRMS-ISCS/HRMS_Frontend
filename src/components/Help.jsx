// src/components/Help.jsx
import React from "react";
import { useDarkMode } from "@/context/DarkModeContext";
import { Mail, HelpCircle } from "lucide-react";

export default function Help() {
  const { darkMode } = useDarkMode();
  const hrEmail = "hr@iscstech.com";

  const handleEmailClick = () => {
    window.location.href = `mailto:${hrEmail}`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(hrEmail);
    // You can add a toast notification here if you want
    alert("Email copied to clipboard!");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
          Help & Support
        </h1>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Get assistance with your HRMS queries
        </p>
      </div>

      <div className="max-w-2xl">
        <div
          className={`rounded-lg shadow-sm p-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-full">
              <HelpCircle className="w-5 h-5 text-green-600" />
            </div>
            <h2 className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
              Contact HR Department
            </h2>
          </div>

          <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            For any HR-related queries, assistance, or support, please contact our HR team:
          </p>

          <div
            className={`flex items-center justify-between p-4 rounded-lg ${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`text-base ${darkMode ? "text-white" : "text-gray-800"}`}>
                {hrEmail}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleEmailClick}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${darkMode 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-green-600 hover:bg-green-700 text-white"}`}
              >
                Send Email
              </button>
              <button
                onClick={handleCopyEmail}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${darkMode 
                    ? "bg-gray-600 hover:bg-gray-500 text-white" 
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
              >
                Copy
              </button>
            </div>
          </div>

          <div className={`mt-6 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <p>Our HR team will respond to your query within 24-48 business hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}