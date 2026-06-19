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
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
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

// ─── Protected Route ──────────────────────────────────────────────────────────
function ProtectedRoute({ children, isLoggedIn, userRole, requiredRole }) {
  if (!isLoggedIn) return <Navigate to="/hrms" replace />;
  if (requiredRole && userRole === requiredRole)
    return <Navigate to="/hrms/dashboard" replace />;
  return children;
}

// ─── AppContent (must live inside <Router>) ───────────────────────────────────
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

  // While validating the stored token show a spinner — but NOT on reset/forgot
  // pages (those skip the token check so isCheckingToken resolves immediately).
  if (isCheckingToken) {
    return <LoadingScreen onLoadingComplete={() => {}} />;
  }

  const sidebarMargin = collapsed ? "ml-20" : "ml-64";

  const getHomeRedirectPath = () => {
    if (!user) return "/hrms";
    if (user.role === "superadmin") return "/hrms/loading";
    return "/hrms/about-iscs";
  };

  // Reusable layout shell
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
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/hrms" replace />} />

        {/* ── LOGIN ── */}
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

        {/* ── FORGOT PASSWORD ──
            Always render — never guard behind isLoggedIn.
            A logged-in user who forgot their password must reach this page. */}
        <Route path="/hrms/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/forgot-password"
          element={<Navigate to="/hrms/forgot-password" replace />}
        />

        {/* ── RESET PASSWORD ──
            *** ROOT CAUSE FIX ***
            Email links arrive as /hrms/reset-password?token=…
            This route MUST render unconditionally — no isLoggedIn guard.

            The old session in localStorage was causing:
              1. checkToken() → setIsLoggedIn(true)
              2. Route guard saw isLoggedIn=true → redirected to /hrms/about-iscs
              3. ?token= param was lost → user ended up at /hrms in <1 second

            Fix: render ResetPasswordPage with no condition. The page itself
            clears tokens (removeToken + removeRefreshToken) on success. */}
        <Route path="/hrms/reset-password" element={<ResetPasswordPage />} />
        {/* Alias without /hrms prefix — preserves the ?token= query string */}
        <Route
          path="/reset-password"
          element={
            <Navigate
              to={`/hrms/reset-password${window.location.search}`}
              replace
            />
          }
        />

        {/* ── ABOUT ISCS ── */}
        <Route
          path="/hrms/about-iscs"
          element={
            isLoggedIn ? <AboutISCS /> : <Navigate to="/hrms" replace />
          }
        />

        {/* ── LOADING SCREEN ── */}
        <Route
          path="/hrms/loading"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <LoadingScreen onLoadingComplete={onLoadingComplete} />
            </ProtectedRoute>
          }
        />

        {/* ── REGISTER (superadmin only) ── */}
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

        {/* ── DASHBOARD (not for employees) ── */}
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

        {/* ── PROFILE ── */}
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

        {/* ── EMPLOYEES ── */}
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

        {/* ── DOCUMENTS ── */}
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

        {/* ── CALENDAR ── */}
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

        {/* ── PAYROLL ── */}
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

        {/* ── HELP ── */}
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

        {/* ── APPOINTMENT (not for employees) ── */}
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

        {/* ── Catch-all ── */}
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

// ─── InnerAppWrapper ──────────────────────────────────────────────────────────
function InnerAppWrapper(props) {
  const { darkMode } = useDarkMode();

  return (
    <div className={darkMode ? "min-h-screen bg-gray-900" : "min-h-screen bg-gray-50"}>
      <Router>
        <AppContent {...props} />
      </Router>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        // ── KEY FIX ────────────────────────────────────────────────────────
        // If the user landed directly on a password-reset or forgot-password
        // URL, skip validating the stored session entirely.
        //
        // Without this, the sequence was:
        //   1. /hrms/reset-password?token=XYZ loads
        //   2. checkToken() finds old access_token → hits /db/Current_user/Profile
        //   3. Sets isLoggedIn=true
        //   4. Route guard (or catch-all) sees isLoggedIn=true → redirects to
        //      /hrms/about-iscs, dropping the ?token= param from the URL
        //   5. User ends up at /hrms within ~1 second — token is gone forever
        //
        // By returning early here, isLoggedIn stays false and isCheckingToken
        // is set to false immediately, so ResetPasswordPage renders right away.
        // ──────────────────────────────────────────────────────────────────
        const path = window.location.pathname;
        const isPasswordPage =
          path.includes("/reset-password") ||
          path.includes("/forgot-password");

        if (isPasswordPage) return;

        const token = getToken();
        if (!token) return;

        const userData = await getCurrentUser();
        setUser(userData);
        setIsLoggedIn(true);
      } catch {
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

  return (
    <DarkModeProvider>
      <InnerAppWrapper
        isLoggedIn={isLoggedIn}
        isLoading={isLoading}
        user={user}
        onLogin={handleLogin}
        onLogout={() => {
          setIsLoggedIn(false);
          setUser(null);
        }}
        onLoadingComplete={() => setIsLoading(false)}
        isCheckingToken={isCheckingToken}
      />
    </DarkModeProvider>
  );
}