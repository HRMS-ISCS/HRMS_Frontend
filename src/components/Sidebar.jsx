// // src/components/Sidebar.jsx (updated)
// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   FileText,
//   UserPlus,
//   Calendar,
//   ChevronRight,
//   ChevronLeft,
//   DollarSign, // Add this import
// } from "lucide-react";
// import { useDarkMode } from "@/context/DarkModeContext";
// import iscsLogo from "@/assets/iscslogo.png";

// export default function Sidebar({ user, collapsed, setCollapsed }) {
//   const location = useLocation();
//   const { darkMode } = useDarkMode();

//   const isSuperAdmin = user?.role === "superadmin";
//   const isEmployee = user?.role === "employee";

//   const menuItems = [
//     ...(isEmployee
//       ? []
//       : [
//           {
//             id: "dashboard",
//             label: "Dashboard",
//             icon: LayoutDashboard,
//             path: "/hrms/dashboard",
//           },
//         ]),
//     {
//       id: "employees",
//       // Change label based on user role
//       label: isEmployee ? "Employee" : "Employees",
//       icon: Users,
//       path: "/hrms/employees",
//     },
//     ...(isSuperAdmin
//       ? []
//       : [
//           {
//             id: "employee-reg",
//             label: "Employee REG",
//             icon: UserPlus,
//             path: "/hrms/register",
//           },
//         ]),
//     {
//       id: "payroll", // Add this new menu item
//       label: "Payroll",
//       icon: DollarSign,
//       path: "/hrms/payroll",
//     },
//     {
//       id: "documents",
//       label: "Documents",
//       icon: FileText,
//       path: "/hrms/documents",
//     },
//     {
//       id: "calendar",
//       label: "Calendar",
//       icon: Calendar,
//       path: "/hrms/calendar",
//     },
//   ];

//   return (
//     <div
//       className={`fixed left-0 top-0 h-full z-40 border-r shadow-lg
//       transition-all duration-300
//       ${collapsed ? "w-20" : "w-56"}
//       ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
//     >
//       {/* LOGO */}
//       <div className="p-4 border-b flex justify-center">
//         <img
//           src={iscsLogo}
//           alt="logo"
//           className={`transition-all ${collapsed ? "h-8" : "h-10"}`}
//         />
//       </div>

//       {/* MENU */}
//       <nav className="mt-4 px-2">
//         <ul className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             const active = location.pathname === item.path;

//             return (
//               <li key={item.id}>
//                 <Link
//                   to={item.path}
//                   className={`flex items-center gap-3 px-3 py-2 rounded-lg
//                   ${
//                     active
//                       ? "bg-green-100 text-green-700"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }
//                   ${darkMode && !active ? "text-gray-300 hover:bg-gray-700" : ""}
//                   ${darkMode && active ? "bg-green-900/30 text-green-400" : ""}`}
//                 >
//                   <Icon size={20} />

//                   {!collapsed && (
//                     <span className="text-sm font-medium">{item.label}</span>
//                   )}

//                   {active && !collapsed && (
//                     <ChevronRight size={14} className="ml-auto" />
//                   )}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       {/* FOOTER */}
//       <div className="absolute bottom-14 left-0 right-0 px-3">
//         {!collapsed && (
//           <div className="text-center text-xs text-gray-500">
//             HRMS v1.0
//             <br />
//             Role: {user?.role}
//           </div>
//         )}
//       </div>

//       {/* TOGGLE */}
//       <button
//         onClick={() => setCollapsed(!collapsed)}
//         className={`absolute bottom-3 left-1/2 -translate-x-1/2
//         p-2 rounded-full shadow transition
//         ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100"}`}
//       >
//         {collapsed ? <ChevronRight /> : <ChevronLeft />}
//       </button>
//     </div>
//   );
// }

// src/components/Sidebar.jsx (updated)
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  UserPlus,
  Calendar,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  HelpCircle, // Add this import
} from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";
import iscsLogo from "@/assets/iscslogo.png";

export default function Sidebar({ user, collapsed, setCollapsed }) {
  const location = useLocation();
  const { darkMode } = useDarkMode();

  const isSuperAdmin = user?.role === "superadmin";
  const isEmployee = user?.role === "employee";

  const menuItems = [
    ...(isEmployee
      ? []
      : [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/hrms/dashboard",
          },
        ]),
    {
      id: "employees",
      // Change label based on user role
      label: isEmployee ? "Employee" : "Employees",
      icon: Users,
      path: "/hrms/employees",
    },
    ...(isSuperAdmin
      ? []
      : [
          {
            id: "employee-reg",
            label: "Employee REG",
            icon: UserPlus,
            path: "/hrms/register",
          },
        ]),
    {
      id: "payroll",
      label: "Payroll",
      icon: DollarSign,
      path: "/hrms/payroll",
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      path: "/hrms/documents",
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      path: "/hrms/calendar",
    },
    // Add Help menu item at the bottom
    {
      id: "help",
      label: "Help",
      icon: HelpCircle,
      path: "/hrms/help",
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full z-40 border-r shadow-lg
      transition-all duration-300
      ${collapsed ? "w-20" : "w-56"}
      ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
    >
      {/* LOGO */}
      <div className="p-4 border-b flex justify-center">
        <img
          src={iscsLogo}
          alt="logo"
          className={`transition-all ${collapsed ? "h-8" : "h-10"}`}
        />
      </div>

      {/* MENU */}
      <nav className="mt-4 px-2 h-[calc(100vh-180px)] overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg
                  ${
                    active
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                  ${darkMode && !active ? "text-gray-300 hover:bg-gray-700" : ""}
                  ${darkMode && active ? "bg-green-900/30 text-green-400" : ""}`}
                >
                  <Icon size={20} />

                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}

                  {active && !collapsed && (
                    <ChevronRight size={14} className="ml-auto" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* FOOTER */}
      <div className="absolute bottom-14 left-0 right-0 px-3">
        {!collapsed && (
          <div className="text-center text-xs text-gray-500">
            HRMS v1.0
            <br />
            Role: {user?.role}
          </div>
        )}
      </div>

      {/* TOGGLE */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`absolute bottom-3 left-1/2 -translate-x-1/2
        p-2 rounded-full shadow transition
        ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100"}`}
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>
    </div>
  );
}