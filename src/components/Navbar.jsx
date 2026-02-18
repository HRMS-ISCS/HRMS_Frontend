// // // src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { removeToken, getCurrentUser } from "../api";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "@/context/DarkModeContext";

export default function Navbar({ onLogout, collapsed }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Fetch logged in user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    removeToken();
    onLogout();
  };

  const getInitials = (f, l) =>
    `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();

  return (
    <nav
      className={`fixed top-0 right-0 h-16 z-30 border-b shadow-sm
      transition-all duration-300
      ${collapsed ? "left-20" : "left-56"}
      ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
    >
      <div className="flex items-center justify-end px-6 h-full gap-4">
        {/* DARK MODE TOGGLE */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded transition ${
            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
              {loading
                ? ""
                : getInitials(userData?.first_name, userData?.last_name)}
            </div>
            <ChevronDown size={14} />
          </button>

          {showUserMenu && (
            <div
              className={`absolute right-0 mt-2 w-40 shadow rounded border
              ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            >
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate("/hrms/profile");
                }}
                className={`w-full px-3 py-2 text-left ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className={`w-full px-3 py-2 text-left text-red-600 ${
                  darkMode ? "hover:bg-red-900/20" : "hover:bg-red-50"
                }`}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// // src/components/Navbar.jsx
// import React, { useState, useEffect, useRef } from "react"
// import { ChevronDown, Moon, Sun, User } from "lucide-react"
// import { removeToken, getCurrentUser } from "../api"
// import { useNavigate } from "react-router-dom"
// import { useDarkMode } from "@/context/DarkModeContext"

// export default function Navbar({ onLogout, collapsed }) {
//   const [showUserMenu, setShowUserMenu] = useState(false)
//   const [userData, setUserData] = useState(null)
//   const [loading, setLoading] = useState(true)

//   const { darkMode, toggleDarkMode } = useDarkMode()
//   const navigate = useNavigate()
//   const menuRef = useRef(null)

//   // Fetch logged in user
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const data = await getCurrentUser()
//         setUserData(data)
//       } catch (e) {
//         console.error(e)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchUserData()
//   }, [])

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowUserMenu(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [])

//   const handleLogout = () => {
//     removeToken()
//     onLogout()
//   }

//   const getInitials = (f, l) =>
//     `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase()

//   return (
//     <nav
//       className={`fixed top-0 right-0 h-16 z-30 border-b shadow-sm
//       transition-all duration-300
//       ${collapsed ? "left-20" : "left-56"}
//       ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
//     >
//       <div className="flex items-center justify-end px-6 h-full gap-4">

//         {/* DARK MODE TOGGLE */}
//         <button
//           onClick={toggleDarkMode}
//           className={`p-2 rounded transition ${
//             darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
//           }`}
//         >
//           {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//         </button>

//         {/* PROFILE DROPDOWN */}
//         <div className="relative" ref={menuRef}>
//           <button
//             onClick={() => setShowUserMenu(prev => !prev)}
//             className="flex items-center gap-2"
//           >
//             <div className="relative">
//               {loading ? (
//                 <div className={`w-8 h-8 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} flex items-center justify-center`}>
//                   <User size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
//                 </div>
//               ) : (
//                 <>
//                   {userData?.profile_photo_url ? (
//                     <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
//                       <img
//                         src={userData.profile_photo_url}
//                         alt={`${userData.first_name} ${userData.last_name}`}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           // If image fails to load, show initials instead
//                           e.target.style.display = 'none';
//                           const parent = e.target.parentElement;
//                           const fallback = document.createElement('div');
//                           fallback.className = `w-full h-full ${darkMode ? "bg-green-600" : "bg-green-500"} flex items-center justify-center text-white text-xs font-bold`;
//                           fallback.textContent = getInitials(userData.first_name, userData.last_name);
//                           parent.appendChild(fallback);
//                         }}
//                       />
//                     </div>
//                   ) : (
//                     <div className={`w-8 h-8 rounded-full ${darkMode ? "bg-green-700" : "bg-green-600"} flex items-center justify-center text-white font-medium text-sm`}>
//                       {getInitials(userData?.first_name, userData?.last_name)}
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//             <ChevronDown size={14} className={darkMode ? "text-gray-400" : "text-gray-600"} />
//           </button>

//           {showUserMenu && (
//             <div
//               className={`absolute right-0 mt-2 w-48 shadow-lg rounded-lg border py-1
//               ${darkMode
//                 ? "bg-gray-800 border-gray-700 text-white"
//                 : "bg-white border-gray-200 text-gray-800"
//               }`}
//             >
//               {/* User Info in Dropdown */}
//               <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     {userData?.profile_photo_url ? (
//                       <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
//                         <img
//                           src={userData.profile_photo_url}
//                           alt={`${userData.first_name} ${userData.last_name}`}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.style.display = 'none';
//                             const parent = e.target.parentElement;
//                             const fallback = document.createElement('div');
//                             fallback.className = `w-full h-full ${darkMode ? "bg-green-600" : "bg-green-500"} flex items-center justify-center text-white text-sm font-bold`;
//                             fallback.textContent = getInitials(userData.first_name, userData.last_name);
//                             parent.appendChild(fallback);
//                           }}
//                         />
//                       </div>
//                     ) : (
//                       <div className={`w-10 h-10 rounded-full ${darkMode ? "bg-green-700" : "bg-green-600"} flex items-center justify-center text-white font-bold`}>
//                         {getInitials(userData?.first_name, userData?.last_name)}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <p className={`font-medium text-sm ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
//                       {`${userData?.first_name || ""} ${userData?.last_name || ""}`.trim()}
//                     </p>
//                     <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
//                       {userData?.email}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => {
//                   setShowUserMenu(false)
//                   navigate("/profile")
//                 }}
//                 className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm`}
//               >
//                 Profile
//               </button>

//               <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

//               <button
//                 onClick={handleLogout}
//                 className={`w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm`}
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>

//       </div>
//     </nav>
//   )
// }
