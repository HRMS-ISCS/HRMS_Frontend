// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
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
import { Toaster } from "@/components/ui/toaster";
import { getToken, removeToken, getCurrentUser, isTokenExpired } from "./api";
import { DarkModeProvider, useDarkMode } from "@/context/DarkModeContext";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Protected Route
function ProtectedRoute({ children, isLoggedIn, userRole, requiredRole }) {
  if (!isLoggedIn) return <Navigate to="/hrms" replace />;
  if (requiredRole && userRole === requiredRole)
    return <Navigate to="/hrms/dashboard" replace />;
  return children;
}

// AppContent
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
  const [collapsed, setCollapsed] = useState(false); // 👈 ADDED

  const handleLogout = () => {
    removeToken();
    onLogout();
    navigate("/hrms");
  };

  if (isCheckingToken) {
    return <LoadingScreen onLoadingComplete={() => {}} />;
  }

  // sidebar width logic
  const sidebarMargin = collapsed ? "ml-20" : "ml-64";

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/hrms" replace />} />

        {/* HOME */}
        <Route
          path="/hrms"
          element={
            isLoggedIn ? (
              user?.role === "superadmin" ? (
                <Navigate to="/hrms/loading" replace />
              ) : (
                <Navigate to="/hrms/about-iscs" replace />
              )
            ) : (
              <LoginPage onLogin={onLogin} />
            )
          }
        />

        <Route
          path="/hrms/about-iscs"
          element={
            isLoggedIn && user?.role !== "superadmin" ? (
              <AboutISCS />
            ) : (
              <Navigate to="/hrms/dashboard" replace />
            )
          }
        />

        <Route
          path="/hrms/loading"
          element={<LoadingScreen onLoadingComplete={onLoadingComplete} />}
        />

        {/* REGISTER */}
        <Route
          path="/hrms/register"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              userRole={user?.role}
              requiredRole="superadmin"
            >
              <div className="w-full min-h-screen">
                <div className="flex">
                  <Sidebar
                    user={user}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                  />

                  <div className={`flex-1 ${sidebarMargin} transition-all`}>
                    <Navbar onLogout={handleLogout} collapsed={collapsed} />

                    <main className="min-h-screen pt-16">
                      <RegisterPage />
                    </main>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/hrms/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="w-full min-h-screen">
                <div className="flex">
                  <Sidebar
                    user={user}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                  />

                  <div className={`flex-1 ${sidebarMargin} transition-all`}>
                    <Navbar onLogout={handleLogout} collapsed={collapsed} />

                    <main className="min-h-screen pt-16">
                      <Dashboard user={user} />
                    </main>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/hrms/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="w-full min-h-screen">
                <div className="flex">
                  <Sidebar
                    user={user}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                  />

                  <div className={`flex-1 ${sidebarMargin} transition-all`}>
                    <Navbar onLogout={handleLogout} collapsed={collapsed} />

                    <main className="min-h-screen pt-16">
                      <Profile />
                    </main>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEES */}
        <Route
          path="/hrms/employees"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="w-full min-h-screen">
                <div className="flex">
                  <Sidebar
                    user={user}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                  />

                  <div className={`flex-1 ${sidebarMargin} transition-all`}>
                    <Navbar onLogout={handleLogout} collapsed={collapsed} />

                    <main className="min-h-screen pt-16">
                      <Employees user={user} />
                    </main>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* DOCUMENTS */}
        <Route
          path="/hrms/documents"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="w-full min-h-screen">
                <div className="flex">
                  <Sidebar
                    user={user}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                  />

                  <div className={`flex-1 ${sidebarMargin} transition-all`}>
                    <Navbar onLogout={handleLogout} collapsed={collapsed} />

                    <main className="min-h-screen pt-16">
                      <Documents user={user} />
                    </main>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* CALENDAR */}
        <Route
          path="/hrms/calendar"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="w-full min-h-screen">
                <div className="flex">
                  <Sidebar
                    user={user}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                  />

                  <div className={`flex-1 ${sidebarMargin} transition-all`}>
                    <Navbar onLogout={handleLogout} collapsed={collapsed} />

                    <main className="min-h-screen pt-16">
                      <CalendarComponent user={user} />
                    </main>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            isLoggedIn ? (
              <Navigate to="/hrms/dashboard" replace />
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

// Wrapper
function InnerAppWrapper(props) {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`${
        darkMode ? "min-h-screen bg-gray-900" : "min-h-screen bg-gray-50"
      }`}
    >
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

        // if (!token || isTokenExpired()) {
        //   removeToken();
        //   setIsCheckingToken(false);
        //   return;
        // }
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

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

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
