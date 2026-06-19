// // src/App.jsx
// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router } from "react-router-dom";
// import LoginPage from "./auth/LoginPage";
// import RegisterPage from "./components/RegisterPage";
// import LoadingScreen from "./auth/LoadingScreen";
// import AboutISCS from "./components/AboutISCS";
// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";
// import Dashboard from "./components/Dashboard";
// import Profile from "./components/Profile";
// import Employees from "./components/Employees";
// import Documents from "./components/Documents";
// import CalendarComponent from "./components/Calendar";
// import Help from "./components/Help";
// import Payroll from "./components/Payroll";
// import { Toaster } from "@/components/ui/toaster";
// import { getToken, removeToken, getCurrentUser, isTokenExpired } from "./api";
// import { DarkModeProvider, useDarkMode } from "@/context/DarkModeContext";
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// import Appointment from "./components/Appointment";

// // Protected Route
// function ProtectedRoute({ children, isLoggedIn, userRole, requiredRole }) {
//   if (!isLoggedIn) return <Navigate to="/hrms" replace />;
//   if (requiredRole && userRole === requiredRole)
//     return <Navigate to="/hrms/dashboard" replace />;
//   return children;
// }

// // AppContent function
// function AppContent({
//   isLoggedIn,
//   isLoading,
//   user,
//   onLogin,
//   onLogout,
//   onLoadingComplete,
//   isCheckingToken,
// }) {
//   const navigate = useNavigate();
//   const [collapsed, setCollapsed] = useState(false);

//   const handleLogout = () => {
//     removeToken();
//     onLogout();
//     navigate("/hrms");
//   };

//   if (isCheckingToken) {
//     return <LoadingScreen onLoadingComplete={() => {}} />;
//   }

//   // sidebar width logic
//   const sidebarMargin = collapsed ? "ml-20" : "ml-64";

//   // Helper function to get the appropriate redirect path based on user role
//   const getHomeRedirectPath = () => {
//     if (!user) return "/hrms";

//     if (user.role === "superadmin") {
//       return "/hrms/loading";
//     } else if (user.role === "employee") {
//       // Employees should go to AboutISCS first, then Loading, then Employees
//       return "/hrms/about-iscs";
//     } else {
//       return "/hrms/about-iscs";
//     }
//   };

//   return (
//     <>
//       <Routes>
//         <Route path="/" element={<Navigate to="/hrms" replace />} />

//         {/* HOME */}
//         <Route
//           path="/hrms"
//           element={
//             isLoggedIn ? (
//               <Navigate to={getHomeRedirectPath()} replace />
//             ) : (
//               <LoginPage onLogin={onLogin} />
//             )
//           }
//         />

//         {/* ABOUT ISCS - Accessible by all non-superadmin users including employees */}
//         <Route
//           path="/hrms/about-iscs"
//           element={
//             isLoggedIn ? (
//               // Allow both regular users AND employees to view AboutISCS
//               <AboutISCS />
//             ) : (
//               <Navigate to="/hrms" replace />
//             )
//           }
//         />

//         {/* LOADING SCREEN */}
//         <Route
//           path="/hrms/loading"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <LoadingScreen onLoadingComplete={onLoadingComplete} />
//             </ProtectedRoute>
//           }
//         />

//         {/* REGISTER - Only accessible by superadmin */}
//         <Route
//           path="/hrms/register"
//           element={
//             <ProtectedRoute
//               isLoggedIn={isLoggedIn}
//               userRole={user?.role}
//               requiredRole="superadmin"
//             >
//               <div className="w-full min-h-screen">
//                 <div className="flex">
//                   <Sidebar
//                     user={user}
//                     collapsed={collapsed}
//                     setCollapsed={setCollapsed}
//                   />

//                   <div className={`flex-1 ${sidebarMargin} transition-all`}>
//                     <Navbar onLogout={handleLogout} collapsed={collapsed} />

//                     <main className="min-h-screen pt-16">
//                       <RegisterPage />
//                     </main>
//                   </div>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />

//         {/* DASHBOARD - Not accessible by employees */}
//         <Route
//           path="/hrms/dashboard"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               {user?.role === "employee" ? (
//                 <Navigate to="/hrms/employees" replace />
//               ) : (
//                 <div className="w-full min-h-screen">
//                   <div className="flex">
//                     <Sidebar
//                       user={user}
//                       collapsed={collapsed}
//                       setCollapsed={setCollapsed}
//                     />

//                     <div className={`flex-1 ${sidebarMargin} transition-all`}>
//                       <Navbar onLogout={handleLogout} collapsed={collapsed} />

//                       <main className="min-h-screen pt-16">
//                         <Dashboard user={user} />
//                       </main>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </ProtectedRoute>
//           }
//         />

//         {/* PROFILE */}
//         <Route
//           path="/hrms/profile"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <div className="w-full min-h-screen">
//                 <div className="flex">
//                   <Sidebar
//                     user={user}
//                     collapsed={collapsed}
//                     setCollapsed={setCollapsed}
//                   />

//                   <div className={`flex-1 ${sidebarMargin} transition-all`}>
//                     <Navbar onLogout={handleLogout} collapsed={collapsed} />

//                     <main className="min-h-screen pt-16">
//                       <Profile />
//                     </main>
//                   </div>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />

//         {/* EMPLOYEES - Accessible by all roles */}
//         <Route
//           path="/hrms/employees"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <div className="w-full min-h-screen">
//                 <div className="flex">
//                   <Sidebar
//                     user={user}
//                     collapsed={collapsed}
//                     setCollapsed={setCollapsed}
//                   />

//                   <div className={`flex-1 ${sidebarMargin} transition-all`}>
//                     <Navbar onLogout={handleLogout} collapsed={collapsed} />

//                     <main className="min-h-screen pt-16">
//                       <Employees user={user} />
//                     </main>
//                   </div>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />

//         {/* DOCUMENTS */}
//         <Route
//           path="/hrms/documents"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <div className="w-full min-h-screen">
//                 <div className="flex">
//                   <Sidebar
//                     user={user}
//                     collapsed={collapsed}
//                     setCollapsed={setCollapsed}
//                   />

//                   <div className={`flex-1 ${sidebarMargin} transition-all`}>
//                     <Navbar onLogout={handleLogout} collapsed={collapsed} />

//                     <main className="min-h-screen pt-16">
//                       <Documents user={user} />
//                     </main>
//                   </div>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />

//         {/* CALENDAR */}
//         <Route
//           path="/hrms/calendar"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <div className="w-full min-h-screen">
//                 <div className="flex">
//                   <Sidebar
//                     user={user}
//                     collapsed={collapsed}
//                     setCollapsed={setCollapsed}
//                   />

//                   <div className={`flex-1 ${sidebarMargin} transition-all`}>
//                     <Navbar onLogout={handleLogout} collapsed={collapsed} />

//                     <main className="min-h-screen pt-16">
//                       <CalendarComponent user={user} />
//                     </main>
//                   </div>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />

//         {/* PAYROLL */}
//         <Route
//           path="/hrms/payroll"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <div className="w-full min-h-screen">
//                 <div className="flex">
//                   <Sidebar
//                     user={user}
//                     collapsed={collapsed}
//                     setCollapsed={setCollapsed}
//                   />

//                   <div className={`flex-1 ${sidebarMargin} transition-all`}>
//                     <Navbar onLogout={handleLogout} collapsed={collapsed} />

//                     <main className="min-h-screen pt-16">
//                       <Payroll user={user} />
//                     </main>
//                   </div>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />

//         {/* HELP */}
// <Route
//   path="/hrms/help"
//   element={
//     <ProtectedRoute isLoggedIn={isLoggedIn}>
//       <div className="w-full min-h-screen">
//         <div className="flex">
//           <Sidebar
//             user={user}
//             collapsed={collapsed}
//             setCollapsed={setCollapsed}
//           />

//           <div className={`flex-1 ${sidebarMargin} transition-all`}>
//             <Navbar onLogout={handleLogout} collapsed={collapsed} />

//             <main className="min-h-screen pt-16">
//               <Help />
//             </main>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   }
// />

// {/* APPOINTMENT LETTER - Superadmin / HR / Admin only (not employees) */}
// <Route
//   path="/hrms/appointment"
//   element={
//     <ProtectedRoute isLoggedIn={isLoggedIn}>
//       {user?.role === "employee" ? (
//         <Navigate to="/hrms/employees" replace />
//       ) : (
//         <div className="w-full min-h-screen">
//           <div className="flex">
//             <Sidebar
//               user={user}
//               collapsed={collapsed}
//               setCollapsed={setCollapsed}
//             />
//             <div className={`flex-1 ${sidebarMargin} transition-all`}>
//               <Navbar onLogout={handleLogout} collapsed={collapsed} />
//               <main className="min-h-screen pt-16">
//                 <Appointment />
//               </main>
//             </div>
//           </div>
//         </div>
//       )}
//     </ProtectedRoute>
//   }
// />

//         {/* Catch all route */}
//         <Route
//           path="*"
//           element={
//             isLoggedIn ? (
//               <Navigate to={getHomeRedirectPath()} replace />
//             ) : (
//               <Navigate to="/hrms" replace />
//             )
//           }
//         />
//       </Routes>

//       {typeof Toaster !== "undefined" && <Toaster />}
//     </>
//   );
// }

// // Wrapper
// function InnerAppWrapper(props) {
//   const { darkMode } = useDarkMode();

//   return (
//     <div
//       className={`${
//         darkMode ? "min-h-screen bg-gray-900" : "min-h-screen bg-gray-50"
//       }`}
//     >
//       <Router>
//         <AppContent {...props} />
//       </Router>
//     </div>
//   );
// }

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCheckingToken, setIsCheckingToken] = useState(true);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const checkToken = async () => {
//       try {
//         const token = getToken();

//         if (!token) {
//           setIsCheckingToken(false);
//           return;
//         }

//         const userData = await getCurrentUser();
//         setUser(userData);
//         setIsLoggedIn(true);
//       } catch (e) {
//         setIsLoggedIn(false);
//       } finally {
//         setIsCheckingToken(false);
//       }
//     };

//     checkToken();
//   }, []);

//   const handleLogin = async () => {
//     const userData = await getCurrentUser();
//     setUser(userData);
//     setIsLoggedIn(true);
//   };

//   const handleLoadingComplete = () => {
//     setIsLoading(false);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUser(null);
//   };

//   return (
//     <DarkModeProvider>
//       <InnerAppWrapper
//         isLoggedIn={isLoggedIn}
//         isLoading={isLoading}
//         user={user}
//         onLogin={handleLogin}
//         onLogout={handleLogout}
//         onLoadingComplete={handleLoadingComplete}
//         isCheckingToken={isCheckingToken}
//       />
//     </DarkModeProvider>
//   );
// }

// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./components/RegisterPage";
import LoadingScreen from "./auth/LoadingScreen";
import AboutISCS from "./components/AboutISCS";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Employees from "./components/Employees";
import Documents from "./components/Documents";
import CalendarComponent from "./components/Calendar";
import Help from "./components/Help";
import Payroll from "./components/Payroll";
import { Toaster } from "@/components/ui/toaster";
import { getToken, removeToken, getCurrentUser } from "./api";
import { DarkModeProvider, useDarkMode } from "@/context/DarkModeContext";
import Appointment from "./components/Appointment";
import ForgotPasswordPage from "./auth/ForgotPasswordPage";
import ResetPasswordPage from "./auth/ResetPasswordPage";

// Protected Route
function ProtectedRoute({ children, isLoggedIn, userRole, requiredRole }) {
  if (!isLoggedIn) return <Navigate to="/hrms" replace />;
  if (requiredRole && userRole === requiredRole)
    return <Navigate to="/hrms/dashboard" replace />;
  return children;
}

// AppContent — must be rendered inside <Router>
function AppContent({
  isLoggedIn,
  isLoading,
  user,
  onLogin,
  onLogout,
  onLoadingComplete,
  isCheckingToken,
}) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    removeToken();
    onLogout();
    navigate("/hrms");
  };

  if (isCheckingToken) {
    return <LoadingScreen onLoadingComplete={() => {}} />;
  }

  const sidebarMargin = collapsed ? "ml-20" : "ml-64";

  const getHomeRedirectPath = () => {
    if (!user) return "/hrms";
    if (user.role === "superadmin") return "/hrms/loading";
    return "/hrms/about-iscs";
  };

  // Reusable layout wrapper
  const WithLayout = ({ children }) => (
    <div className="w-full min-h-screen">
      <div className="flex">
        <Sidebar user={user} collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className={`flex-1 ${sidebarMargin} transition-all`}>
          <Navbar onLogout={handleLogout} collapsed={collapsed} />
          <main className="min-h-screen pt-16">{children}</main>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/hrms" replace />} />

        {/* LOGIN */}
        <Route
          path="/hrms"
          element={
            isLoggedIn ? (
              <Navigate to={getHomeRedirectPath()} replace />
            ) : (
              <LoginPage onLogin={onLogin} />
            )
          }
        />

        {/* FORGOT PASSWORD */}
        <Route
          path="/hrms/forgot-password"
          element={
            isLoggedIn ? (
              <Navigate to={getHomeRedirectPath()} replace />
            ) : (
              <ForgotPasswordPage />
            )
          }
        />
        {/* also support without /hrms prefix in case user navigates directly */}
        <Route
          path="/forgot-password"
          element={<Navigate to="/hrms/forgot-password" replace />}
        />

        {/* RESET PASSWORD — email links point to /hrms/reset-password?token=... */}
        <Route
          path="/hrms/reset-password"
          element={
            isLoggedIn ? (
              <Navigate to={getHomeRedirectPath()} replace />
            ) : (
              <ResetPasswordPage />
            )
          }
        />
        {/* also support without /hrms prefix */}
        <Route
          path="/reset-password"
          element={<Navigate to={`/hrms/reset-password${window.location.search}`} replace />}
        />

        {/* ABOUT ISCS */}
        <Route
          path="/hrms/about-iscs"
          element={
            isLoggedIn ? <AboutISCS /> : <Navigate to="/hrms" replace />
          }
        />

        {/* LOADING SCREEN */}
        <Route
          path="/hrms/loading"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <LoadingScreen onLoadingComplete={onLoadingComplete} />
            </ProtectedRoute>
          }
        />

        {/* REGISTER — superadmin only */}
        <Route
          path="/hrms/register"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              userRole={user?.role}
              requiredRole="superadmin"
            >
              <WithLayout>
                <RegisterPage />
              </WithLayout>
            </ProtectedRoute>
          }
        />

        {/* DASHBOARD — not for employees */}
        <Route
          path="/hrms/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              {user?.role === "employee" ? (
                <Navigate to="/hrms/employees" replace />
              ) : (
                <WithLayout>
                  <Dashboard user={user} />
                </WithLayout>
              )}
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/hrms/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <WithLayout>
                <Profile />
              </WithLayout>
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEES */}
        <Route
          path="/hrms/employees"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <WithLayout>
                <Employees user={user} />
              </WithLayout>
            </ProtectedRoute>
          }
        />

        {/* DOCUMENTS */}
        <Route
          path="/hrms/documents"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <WithLayout>
                <Documents user={user} />
              </WithLayout>
            </ProtectedRoute>
          }
        />

        {/* CALENDAR */}
        <Route
          path="/hrms/calendar"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <WithLayout>
                <CalendarComponent user={user} />
              </WithLayout>
            </ProtectedRoute>
          }
        />

        {/* PAYROLL */}
        <Route
          path="/hrms/payroll"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <WithLayout>
                <Payroll user={user} />
              </WithLayout>
            </ProtectedRoute>
          }
        />

        {/* HELP */}
        <Route
          path="/hrms/help"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <WithLayout>
                <Help />
              </WithLayout>
            </ProtectedRoute>
          }
        />

        {/* APPOINTMENT — not for employees */}
        <Route
          path="/hrms/appointment"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              {user?.role === "employee" ? (
                <Navigate to="/hrms/employees" replace />
              ) : (
                <WithLayout>
                  <Appointment />
                </WithLayout>
              )}
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={
            isLoggedIn ? (
              <Navigate to={getHomeRedirectPath()} replace />
            ) : (
              <Navigate to="/hrms" replace />
            )
          }
        />
      </Routes>

      {typeof Toaster !== "undefined" && <Toaster />}
    </>
  );
}

// DarkMode wrapper — Router lives HERE so all children (including ResetPasswordPage)
// can safely call useNavigate / useSearchParams
function InnerAppWrapper(props) {
  const { darkMode } = useDarkMode();

  return (
    <div className={darkMode ? "min-h-screen bg-gray-900" : "min-h-screen bg-gray-50"}>
      {/* FIX: Router is now the outermost wrapper so hooks work everywhere */}
      <Router>
        <AppContent {...props} />
      </Router>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = getToken();
        if (!token) {
          setIsCheckingToken(false);
          return;
        }
        const userData = await getCurrentUser();
        setUser(userData);
        setIsLoggedIn(true);
      } catch (e) {
        setIsLoggedIn(false);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkToken();
  }, []);

  const handleLogin = async () => {
    const userData = await getCurrentUser();
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLoadingComplete = () => setIsLoading(false);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <DarkModeProvider>
      <InnerAppWrapper
        isLoggedIn={isLoggedIn}
        isLoading={isLoading}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onLoadingComplete={handleLoadingComplete}
        isCheckingToken={isCheckingToken}
      />
    </DarkModeProvider>
  );
}