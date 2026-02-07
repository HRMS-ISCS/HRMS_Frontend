// // // src/components/Sidebar.jsx
// import React from "react"
// import { Link, useLocation } from "react-router-dom"
// import {
//   LayoutDashboard,
//   Users,
//   FileText,
//   UserPlus,
//   Calendar,
//   ChevronRight,
//   ChevronLeft
// } from "lucide-react"
// import { useDarkMode } from "@/context/DarkModeContext"
// import iscsLogo from "@/assets/iscslogo.png"

// export default function Sidebar({ user, collapsed, setCollapsed }) {
//   const location = useLocation()
//   const { darkMode } = useDarkMode()

//   const isSuperAdmin = user?.role === "superadmin"
//   const isEmployee = user?.role === "employee"

//   const menuItems = [
//     ...(isEmployee ? [] : [{
//       id: "dashboard",
//       label: "Dashboard",
//       icon: LayoutDashboard,
//       path: "/dashboard"
//     }]),
//     {
//       id: "employees",
//       label: "Employees",
//       icon: Users,
//       path: "/employees"
//     },
//     ...(isSuperAdmin ? [] : [{
//       id: "employee-reg",
//       label: "Employee REG",
//       icon: UserPlus,
//       path: "/register"
//     }]),
//     {
//       id: "documents",
//       label: "Documents",
//       icon: FileText,
//       path: "/documents"
//     },
//     {
//       id: "calendar",
//       label: "Calendar",
//       icon: Calendar,
//       path: "/calendar"
//     }
//   ]

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
//           {menuItems.map(item => {
//             const Icon = item.icon
//             const active = location.pathname === item.path

//             return (
//               <li key={item.id}>
//                 <Link
//                   to={item.path}
//                   className={`flex items-center gap-3 px-3 py-2 rounded-lg
//                   ${active
//                     ? "bg-green-100 text-green-700"
//                     : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   <Icon size={20} />

//                   {!collapsed && (
//                     <span className="text-sm font-medium">
//                       {item.label}
//                     </span>
//                   )}

//                   {active && !collapsed && (
//                     <ChevronRight size={14} className="ml-auto" />
//                   )}
//                 </Link>
//               </li>
//             )
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
//   )
// }
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  UserPlus,
  Calendar,
  ChevronRight
} from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";
import iscsLogo from "@/assets/iscslogo.png";

export default function Sidebar({ user }) {
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
            path: "/dashboard"
          }
        ]),
    {
      id: "employees",
      label: "Employees",
      icon: Users,
      path: "/employees"
    },
    ...(isSuperAdmin
      ? []
      : [
          {
            id: "employee-reg",
            label: "Employee REG",
            icon: UserPlus,
            path: "/register"
          }
        ]),
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      path: "/documents"
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      path: "/calendar"
    }
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full w-64 z-40 border-r shadow-lg ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* LOGO */}
      <div className="p-4 border-b flex justify-center">
        <img src={iscsLogo} alt="logo" className="h-10" />
      </div>

      {/* MENU */}
      <nav className="mt-4 px-2">
        <ul className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                    active
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {active && <ChevronRight size={14} className="ml-auto" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* FOOTER */}
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <div className="text-center text-xs text-gray-500">
          HRMS v1.0
          <br />
          Role: {user?.role}
        </div>
      </div>
    </div>
  );
}