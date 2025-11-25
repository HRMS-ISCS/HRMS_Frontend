// // src/App.jsx ( superadmin restricted to emp reg route)
// import React, { useState, useEffect } from "react"
// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
// import LoginPage from "./auth/LoginPage"
// import RegisterPage from "./components/RegisterPage"
// import LoadingScreen from "./auth/LoadingScreen"
// import Sidebar from "./components/Sidebar"
// import Navbar from "./components/Navbar"
// import Dashboard from "./components/Dashboard"
// import Profile from "./components/Profile";
// import Employees from "./components/Employees"
// import Documents from "./components/Documents"
// import { Toaster } from "@/components/ui/toaster"
// import { getToken, removeToken, getCurrentUser, hasValidToken, isTokenExpired } from "./api"

// // Protected Route Component
// function ProtectedRoute({ children, isLoggedIn, userRole, requiredRole }) {
//   if (!isLoggedIn) {
//     return <Navigate to="/" replace />
//   }
  
//   // If a specific role is required and the user doesn't have it, redirect to dashboard
//   if (requiredRole && userRole === requiredRole) {
//     return <Navigate to="/dashboard" replace />
//   }
  
//   return children
// }

// // Main App Content Component
// function AppContent({ isLoggedIn, isLoading, user, onLogin, onLogout, onLoadingComplete }) {
//   const navigate = useNavigate()

//   const handleLogout = () => {
//     removeToken();
//     onLogout()
//     navigate("/")
//   }

//   // Show loading screen after login
//   if (isLoading) {
//     return <LoadingScreen onLoadingComplete={onLoadingComplete} />
//   }

//   return (
//     <>
//       <Routes>
//         <Route 
//           path="/" 
//           element={
//             isLoggedIn ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <LoginPage onLogin={onLogin} />
//             )
//           } 
//         />
         
//         {/* Registration Route - Now with role-based access */}
//         <Route
//           path="/register"
//           element={
//             <ProtectedRoute 
//               isLoggedIn={isLoggedIn} 
//               userRole={user?.role}
//               requiredRole="superadmin"
//             >
//               <div className="min-h-screen bg-gray-50">
//                 <div className="flex">
//                   <Sidebar user={user} />
//                   <div className="flex-1 ml-64">
//                     <Navbar onLogout={handleLogout} />
//                     <main className="min-h-screen pt-16">
//                       <RegisterPage />
//                     </main>
//                   </div>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />
        
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <div className="min-h-screen bg-gray-50">
//                 <div className="flex">
//                   <Sidebar user={user} />
//                   <div className="flex-1 ml-64">
//                     <Navbar onLogout={handleLogout} />
//                     <main className="min-h-screen pt-16">
//                       <Dashboard />
//                     </main>
//                   </div>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <div className="min-h-screen bg-gray-50">
//                 <div className="flex">
//                   <Sidebar user={user} />
//                   <div className="flex-1 ml-64">
//                     <Navbar onLogout={handleLogout} />
//                     <main className="min-h-screen pt-16">
//                       <Profile />
//                     </main>
//                   </div>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
// />
        
//         <Route
//           path="/employees"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <div className="min-h-screen bg-gray-50">
//                 <div className="flex">
//                   <Sidebar user={user} />
//                   <div className="flex-1 ml-64">
//                     <Navbar onLogout={handleLogout} />
//                     <main className="min-h-screen pt-16">
//                       <Employees />
//                     </main>
//                   </div>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />
        
//         {/* Documents Route */}
//         <Route
//           path="/documents"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <div className="min-h-screen bg-gray-50">
//                 <div className="flex">
//                   <Sidebar user={user} />
//                   <div className="flex-1 ml-64">
//                     <Navbar onLogout={handleLogout} />
//                     <main className="min-h-screen pt-16">
//                       <Documents />
//                     </main>
//                   </div>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//       {typeof Toaster !== 'undefined' && <Toaster />}
//     </>
//   )
// }

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isCheckingToken, setIsCheckingToken] = useState(true)
//   const [user, setUser] = useState(null)

//   // Check for token on initial load
//   useEffect(() => {
//     const checkToken = async () => {
//       try {
//         const token = getToken();
        
//         // If no token, user is not logged in
//         if (!token) {
//           setIsLoggedIn(false);
//           setIsCheckingToken(false);
//           return;
//         }

//         // Check if token is expired by decoding it
//         if (isTokenExpired()) {
//           console.log("Token is expired, removing it");
//           removeToken();
//           setIsLoggedIn(false);
//           setIsCheckingToken(false);
//           return;
//         }

//         // If token exists and is not expired, try to validate with backend
//         try {
//           const userData = await getCurrentUser();
//           setUser(userData);
//           setIsLoggedIn(true);
//         } catch (error) {
//           console.error("Error validating token with backend:", error);
          
//           // Only log out if it's a 401 error (invalid token)
//           // For other errors (network, server down), keep user logged in
//           if (error.message && error.message.includes("401")) {
//             console.log("Token is invalid according to backend");
//             removeToken();
//             setIsLoggedIn(false);
//           } else {
//             // For network errors or other issues, assume token is still valid
//             console.log("Network error, keeping user logged in");
//             setIsLoggedIn(true);
//           }
//         }
//       } catch (error) {
//         console.error("Error checking token:", error);
//         setIsLoggedIn(false);
//       } finally {
//         setIsCheckingToken(false);
//       }
//     };

//     checkToken();
//   }, []);

//   const handleLogin = async () => {
//     setIsLoading(true)
//     setIsLoggedIn(true)
    
//     // Fetch user data after login
//     try {
//       const userData = await getCurrentUser();
//       setUser(userData);
//     } catch (error) {
//       console.error("Error fetching user data after login:", error);
//     }
//   }

//   const handleLoadingComplete = () => {
//     setIsLoading(false)
//   }

//   const handleLogout = () => {
//     setIsLoggedIn(false)
//     setIsLoading(false)
//     setUser(null)
//   }

//   // Show loading screen while checking token
//   if (isCheckingToken) {
//     return <LoadingScreen onLoadingComplete={() => setIsCheckingToken(false)} />
//   }

//   return (
//     <Router>
//       <AppContent 
//         isLoggedIn={isLoggedIn}
//         isLoading={isLoading}
//         user={user}
//         onLogin={handleLogin}
//         onLogout={handleLogout}
//         onLoadingComplete={handleLoadingComplete}
//       />
//     </Router>
//   )
// }


// src/App.jsx
import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import LoginPage from "./auth/LoginPage"
import RegisterPage from "./components/RegisterPage"
import LoadingScreen from "./auth/LoadingScreen"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"
import Profile from "./components/Profile";
import Employees from "./components/Employees"
import Documents from "./components/Documents"
import { Toaster } from "@/components/ui/toaster"
import { getToken, removeToken, getCurrentUser, hasValidToken, isTokenExpired } from "./api"

// Protected Route Component
function ProtectedRoute({ children, isLoggedIn, userRole, requiredRole }) {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }
  
  // If a specific role is required and the user doesn't have it, redirect to dashboard
  if (requiredRole && userRole === requiredRole) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// Main App Content Component
function AppContent({ isLoggedIn, isLoading, user, onLogin, onLogout, onLoadingComplete }) {
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
              // Redirect based on user role after login
              user?.role === "employee" ? (
                <Navigate to="/employees" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <LoginPage onLogin={onLogin} />
            )
          } 
        />
         
        {/* Registration Route - Now with role-based access */}
        <Route
          path="/register"
          element={
            <ProtectedRoute 
              isLoggedIn={isLoggedIn} 
              userRole={user?.role}
              requiredRole="superadmin"
            >
              <div className="min-h-screen bg-gray-50">
                <div className="flex">
                  <Sidebar user={user} />
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
                  <Sidebar user={user} />
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
          path="/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="min-h-screen bg-gray-50">
                <div className="flex">
                  <Sidebar user={user} />
                  <div className="flex-1 ml-64">
                    <Navbar onLogout={handleLogout} />
                    <main className="min-h-screen pt-16">
                      <Profile />
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
                  <Sidebar user={user} />
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
        
        {/* Documents Route */}
        <Route
          path="/documents"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="min-h-screen bg-gray-50">
                <div className="flex">
                  <Sidebar user={user} />
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
  const [user, setUser] = useState(null)

  // Check for token on initial load
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = getToken();
        
        // If no token, user is not logged in
        if (!token) {
          setIsLoggedIn(false);
          setIsCheckingToken(false);
          return;
        }

        // Check if token is expired by decoding it
        if (isTokenExpired()) {
          console.log("Token is expired, removing it");
          removeToken();
          setIsLoggedIn(false);
          setIsCheckingToken(false);
          return;
        }

        // If token exists and is not expired, try to validate with backend
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error validating token with backend:", error);
          
          // Only log out if it's a 401 error (invalid token)
          // For other errors (network, server down), keep user logged in
          if (error.message && error.message.includes("401")) {
            console.log("Token is invalid according to backend");
            removeToken();
            setIsLoggedIn(false);
          } else {
            // For network errors or other issues, assume token is still valid
            console.log("Network error, keeping user logged in");
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setIsLoggedIn(false);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkToken();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true)
    setIsLoggedIn(true)
    
    // Fetch user data after login
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data after login:", error);
    }
  }

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsLoading(false)
    setUser(null)
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
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onLoadingComplete={handleLoadingComplete}
      />
    </Router>
  )
}