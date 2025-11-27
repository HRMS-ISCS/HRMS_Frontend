// Sidebar.jsx(Dr-emp)
import React from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Users, FileText, UserPlus, ChevronRight } from "lucide-react"
import iscsLogo from "@/assets/iscs-logo.png"

export default function Sidebar({ user }) {
  const location = useLocation()
  
  // Check user role
  const isSuperAdmin = user?.role === "superadmin"
  const isEmployee = user?.role === "employee"
  const isHR = user?.role === "hr"
 
  const menuItems = [
    // Only show Dashboard if user is not an Employee
    ...(isEmployee ? [] : [{
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      active: location.pathname === "/dashboard"
    }]),
    {
      id: "employees",
      label: "Employees",
      icon: Users,
      path: "/employees",
      active: location.pathname === "/employees"
    },
    // Only show Employee REG if user is not a superadmin
    ...(isSuperAdmin ? [] : [{
      id: "employee-reg",
      label: "Employee REG",
      icon: UserPlus,
      path: "/register",
      active: location.pathname === "/register"
    }]),
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      path: "/documents",
      active: location.pathname === "/documents"
    }
  ]

  // Rest of the component remains the same...
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <img
            src={iscsLogo}
            alt="ISCS Logo"
            className="h-12 object-contain"
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    item.active
                      ? "bg-gradient-to-r from-green-50 to-blue-50 text-green-700 border border-green-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={`transition-colors ${
                      item.active ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.active && (
                    <ChevronRight size={16} className="text-green-600" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3">
          <p className="text-sm text-gray-600 text-center">
            <span className="font-medium">HRMS v1.0</span>
          </p>
          <p className="text-xs text-gray-500 text-center mt-1">
            Human Resource Management
          </p>
          {user && (
            <p className="text-xs text-gray-500 text-center mt-1">
              Role: <span className="font-medium">{user.role}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}