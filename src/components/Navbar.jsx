// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Search, LogOut, User, ChevronDown, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeToken, getCurrentUser } from "../api";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "@/context/DarkModeContext";

export default function Navbar({ onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Explicitly remove token
    removeToken();
    // Call onLogout prop
    onLogout();
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setShowUserMenu(false);
  };

  return (
    <nav className={`fixed top-0 left-64 right-0 h-16 z-30 shadow-sm border-b ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between px-6 h-full">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search size={20} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              darkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search employees, departments, or documents..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-green-500/20 focus:border-green-500' 
                  : 'bg-white border-gray-200 text-gray-800 focus:ring-green-500/20 focus:border-green-500'
              }`}
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="text-left">
                <p className={`text-sm font-medium ${
                  darkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {loading ? "Loading..." : userData ? `${userData.first_name} ${userData.last_name}` : "User"}
                </p>
                <p className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {loading ? "..." : userData ? userData.role : "Unknown"}
                </p>
              </div>
              <ChevronDown size={16} className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border py-2 z-50 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <button 
                  onClick={handleProfileClick}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-3 ${
                    darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User size={16} />
                  Profile
                </button>
                <hr className={darkMode ? 'border-gray-700' : 'border-gray-200'} />
                <button 
                  onClick={handleLogout}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-3 ${
                    darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}