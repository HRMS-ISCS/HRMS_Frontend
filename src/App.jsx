// src/App.jsx
import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import LoginPage from "./auth/LoginPage"
import RegisterPage from "./components/RegisterPage"
import LoadingScreen from "./auth/LoadingScreen"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"
import Employees from "./components/Employees"
import Documents from "./components/Documents"
import { Toaster } from "@/components/ui/toaster"
import { getToken, removeToken, getCurrentUser, hasValidToken } from "./api"

// Protected Route Component
function ProtectedRoute({ children, isLoggedIn }) {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }
  return children
}

// Main App Content Component
function AppContent({ isLoggedIn, isLoading, onLogin, onLogout, onLoadingComplete }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    removeToken();
    onLogout()
    navigate("/")
  }

  // Show loading screen after login
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={onLoadingComplete} />
  }

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={onLogin} />
            )
          } 
        />
         
        {/* Registration Route - Now with sidebar and navbar layout */}
        <Route
          path="/register"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="min-h-screen bg-gray-50">
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1 ml-64">
                    <Navbar onLogout={handleLogout} />
                    <main className="min-h-screen pt-16">
                      <RegisterPage />
                    </main>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="min-h-screen bg-gray-50">
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1 ml-64">
                    <Navbar onLogout={handleLogout} />
                    <main className="min-h-screen pt-16">
                      <Dashboard />
                    </main>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/employees"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="min-h-screen bg-gray-50">
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1 ml-64">
                    <Navbar onLogout={handleLogout} />
                    <main className="min-h-screen pt-16">
                      <Employees />
                    </main>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        
        {/* Documents Route - NEW */}
        <Route
          path="/documents"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="min-h-screen bg-gray-50">
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1 ml-64">
                    <Navbar onLogout={handleLogout} />
                    <main className="min-h-screen pt-16">
                      <Documents />
                    </main>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
      {typeof Toaster !== 'undefined' && <Toaster />}
    </>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingToken, setIsCheckingToken] = useState(true)

  // Check for token on initial load
  useEffect(() => {
    const checkToken = async () => {
      try {
        // First check if token exists
        if (hasValidToken()) {
          // Then validate it with the backend
          await getCurrentUser();
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        removeToken();
        setIsLoggedIn(false);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkToken();
  }, []);

  const handleLogin = () => {
    setIsLoading(true)
    setIsLoggedIn(true)
  }

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsLoading(false)
  }

  // Show loading screen while checking token
  if (isCheckingToken) {
    return <LoadingScreen onLoadingComplete={() => setIsCheckingToken(false)} />
  }

  return (
    <Router>
      <AppContent 
        isLoggedIn={isLoggedIn}
        isLoading={isLoading}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onLoadingComplete={handleLoadingComplete}
      />
    </Router>
  )
}