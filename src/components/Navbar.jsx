// // src/components/Navbar.jsx
import React, { useState, useEffect } from "react"
import { Search, LogOut, User, ChevronDown, Moon, Sun } from "lucide-react"
import { removeToken, getCurrentUser } from "../api"
import { useNavigate } from "react-router-dom"
import { useDarkMode } from "@/context/DarkModeContext"

export default function Navbar({ onLogout, collapsed }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { darkMode, toggleDarkMode } = useDarkMode()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getCurrentUser()
        setUserData(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const handleLogout = () => {
    removeToken()
    onLogout()
  }

  const getInitials = (f, l) =>
    `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase()

  return (
    <nav
      className={`fixed top-0 right-0 h-16 z-30 border-b shadow-sm
      transition-all duration-300
      ${collapsed ? "left-20" : "left-56"}
      ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
    >
      <div className="flex items-center justify-between px-6 h-full">

        {/* SEARCH */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search..."
              className={`w-full pl-9 pr-3 py-2 rounded-lg border
              ${darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white"
              }`}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* DARK MODE */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded hover:bg-gray-100"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                {loading ? "" : getInitials(userData?.first_name, userData?.last_name)}
              </div>
              <ChevronDown size={14} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}
