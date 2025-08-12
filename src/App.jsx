// App.jsx
import React, { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import LoginPage from "./auth/LoginPage"
import RegisterPage from "./components/RegisterPage"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"
import Employees from "./components/Employees"

// Protected Route Component
function ProtectedRoute({ children, isLoggedIn }) {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }
  return children
}

// Main App Content Component
function AppContent({ isLoggedIn, onLogin, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate("/") // Navigate to login page after logout
  }

  return (
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
      
      {/* Registration Route */}
      <Route
        path="/register"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <RegisterPage />
          )
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
    </Routes>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <Router>
      <AppContent 
        isLoggedIn={isLoggedIn} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />
    </Router>
  )
}