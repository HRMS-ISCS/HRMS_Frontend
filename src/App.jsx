// // // src/App.jsx
// import React, { useState, useEffect } from "react"
// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
// import LoginPage from "./auth/LoginPage"
// import RegisterPage from "./components/RegisterPage"
// import LoadingScreen from "./auth/LoadingScreen"
// import AboutISCS from "./components/AboutISCS"
// import Sidebar from "./components/Sidebar"
// import Navbar from "./components/Navbar"
// import Dashboard from "./components/Dashboard"
// import Profile from "./components/Profile";
// import Employees from "./components/Employees"
// import Documents from "./components/Documents"
// import { Toaster } from "@/components/ui/toaster"
// import { getToken, removeToken, getCurrentUser, hasValidToken, isTokenExpired } from "./api"
// import { DarkModeProvider } from "@/context/DarkModeContext"

// // Protected Route Component
// function ProtectedRoute({ children, isLoggedIn, userRole, requiredRole }) {
//   if (!isLoggedIn) {
//     return <Navigate to="/" replace />
//   }
  
//   // If a specific role is required and user doesn't have it, redirect to dashboard
//   if (requiredRole && userRole === requiredRole) {
//     return <Navigate to="/dashboard" replace />
//   }
  
//   return children
// }

// // Main App Content Component
// function AppContent({ isLoggedIn, isLoading, user, onLogin, onLogout, onLoadingComplete, isCheckingToken }) {
//   const navigate = useNavigate()

//   const handleLogout = () => {
//     removeToken();
//     onLogout()
//     navigate("/")
//   }

//   // Show loading screen while checking token
//   if (isCheckingToken) {
//     return <LoadingScreen onLoadingComplete={() => {}} />
//   }

//   return (
//     <>
//       <Routes>
//         <Route 
//           path="/" 
//           element={
//             isLoggedIn ? (
//               // Redirect based on user role after login
//               user?.role === "superadmin" ? (
//                 <Navigate to="/loading" replace />
//               ) : (
//                 <Navigate to="/about-iscs" replace />
//               )
//             ) : (
//               <LoginPage onLogin={onLogin} />
//             )
//           } 
//         />
        
//         {/* Protected About ISCS Route - Only accessible after login and not for superadmin */}
//         <Route 
//           path="/about-iscs" 
//           element={
//             isLoggedIn && user?.role !== "superadmin" ? (
//               <AboutISCS />
//             ) : (
//               <Navigate to="/dashboard" replace />
//             )
//           } 
//         />
        
//         {/* Loading Route - Only for superadmin */}
//         <Route 
//           path="/loading" 
//           element={
//             <LoadingScreen onLoadingComplete={onLoadingComplete} />
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
//               <div className="full-page-container min-h-screen bg-gray-50 dark:bg-gray-900">
//                 <div className="flex min-h-screen">
//                   <Sidebar user={user} />
//                   <div className="flex-1 ml-64 main-container min-h-screen">
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
//               <div className="full-page-container min-h-screen bg-gray-50 dark:bg-gray-900">
//                 <div className="flex min-h-screen">
//                   <Sidebar user={user} />
//                   <div className="flex-1 ml-64 main-container min-h-screen">
//                     <Navbar onLogout={handleLogout} />
//                     <main className="min-h-screen pt-16">
//                       <Dashboard user={user} />
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
//               <div className="full-page-container min-h-screen bg-gray-50 dark:bg-gray-900">
//                 <div className="flex min-h-screen">
//                   <Sidebar user={user} />
//                   <div className="flex-1 ml-64 main-container min-h-screen">
//                     <Navbar onLogout={handleLogout} />
//                     <main className="min-h-screen pt-16">
//                       <Profile user={user} />
//                     </main>
//                   </div>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />
        
//         <Route
//           path="/employees"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <div className="full-page-container min-h-screen bg-gray-50 dark:bg-gray-900">
//                 <div className="flex min-h-screen">
//                   <Sidebar user={user} />
//                   <div className="flex-1 ml-64 main-container min-h-screen">
//                     <Navbar onLogout={handleLogout} />
//                     <main className="min-h-screen pt-16">
//                       <Employees user={user} />
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
//               <div className="full-page-container min-h-screen bg-gray-50 dark:bg-gray-900">
//                 <div className="flex min-h-screen">
//                   <Sidebar user={user} />
//                   <div className="flex-1 ml-64 main-container min-h-screen">
//                     <Navbar onLogout={handleLogout} />
//                     <main className="min-h-screen pt-16">
//                       <Documents user={user} />
//                     </main>
//                   </div>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />

//         {/* Catch-all route for any undefined paths */}
//         <Route 
//           path="*" 
//           element={
//             isLoggedIn ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <Navigate to="/" replace />
//             )
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
//     try {
//       // Fetch user data first, then set login state
//       const userData = await getCurrentUser();
//       setUser(userData);
      
//       // Only set loading state for superadmin
//       if (userData.role === "superadmin") {
//         setIsLoading(true);
//       }
      
//       setIsLoggedIn(true);
//     } catch (error) {
//       console.error("Error fetching user data after login:", error);
//       // If there's an error, don't set login state
//     }
//   }

//   const handleLoadingComplete = () => {
//     setIsLoading(false)
//     // Navigation will be handled by route redirects
//   }

//   const handleLogout = () => {
//     setIsLoggedIn(false)
//     setIsLoading(false)
//     setUser(null)
//   }

//   return (
//     <DarkModeProvider>
//       <Router>
//         <AppContent 
//           isLoggedIn={isLoggedIn}
//           isLoading={isLoading}
//           user={user}
//           onLogin={handleLogin}
//           onLogout={handleLogout}
//           onLoadingComplete={handleLoadingComplete}
//           isCheckingToken={isCheckingToken}
//         />
//       </Router>
//     </DarkModeProvider>
//   )
// }
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
import { Toaster } from "@/components/ui/toaster";
import { getToken, removeToken, getCurrentUser, hasValidToken, isTokenExpired } from "./api";
import { DarkModeProvider, useDarkMode } from "@/context/DarkModeContext";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Protected Route Component (same behaviour)
function ProtectedRoute({ children, isLoggedIn, userRole, requiredRole }) {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  if (requiredRole && userRole === requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// AppContent (unchanged logic) - keep inside Router so useNavigate works
function AppContent({ isLoggedIn, isLoading, user, onLogin, onLogout, onLoadingComplete, isCheckingToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    onLogout();
    navigate("/");
  };

  if (isCheckingToken) {
    return <LoadingScreen onLoadingComplete={() => {}} />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              user?.role === "superadmin" ? (
                <Navigate to="/loading" replace />
              ) : (
                <Navigate to="/about-iscs" replace />
              )
            ) : (
              <LoginPage onLogin={onLogin} />
            )
          }
        />

        <Route
          path="/about-iscs"
          element={
            isLoggedIn && user?.role !== "superadmin" ? (
              <AboutISCS />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/loading"
          element={<LoadingScreen onLoadingComplete={onLoadingComplete} />}
        />

        <Route
          path="/register"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} userRole={user?.role} requiredRole="superadmin">
              <div className="w-full min-h-screen">
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
              <div className="w-full min-h-screen">
                <div className="flex">
                  <Sidebar user={user} />
                  <div className="flex-1 ml-64">
                    <Navbar onLogout={handleLogout} />
                    <main className="min-h-screen pt-16">
                      <Dashboard user={user} />
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
              <div className="w-full min-h-screen">
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
              <div className="w-full min-h-screen">
                <div className="flex">
                  <Sidebar user={user} />
                  <div className="flex-1 ml-64">
                    <Navbar onLogout={handleLogout} />
                    <main className="min-h-screen pt-16">
                      <Employees user={user} />
                    </main>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="w-full min-h-screen">
                <div className="flex">
                  <Sidebar user={user} />
                  <div className="flex-1 ml-64">
                    <Navbar onLogout={handleLogout} />
                    <main className="min-h-screen pt-16">
                      <Documents user={user} />
                    </main>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} />
      </Routes>
      {typeof Toaster !== "undefined" && <Toaster />}
    </>
  );
}

// InnerApp consumes dark mode and renders Router inside provider
function InnerAppWrapper(props) {
  const { darkMode } = useDarkMode();

  // top-level container ensures background covers full viewport
  return (
    <div className={`${darkMode ? 'min-h-screen bg-gray-900' : 'min-h-screen bg-gray-50'}`}>
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

  // Check for token on initial load
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = getToken();

        if (!token) {
          setIsLoggedIn(false);
          setIsCheckingToken(false);
          return;
        }

        if (isTokenExpired()) {
          removeToken();
          setIsLoggedIn(false);
          setIsCheckingToken(false);
          return;
        }

        try {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error validating token with backend:", error);
          if (error.message && error.message.includes("401")) {
            removeToken();
            setIsLoggedIn(false);
          } else {
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
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      if (userData.role === "superadmin") {
        setIsLoading(true);
      }
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error fetching user data after login:", error);
    }
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsLoading(false);
    setUser(null);
  };

  // AppContent requires Router, so we render InnerAppWrapper inside the provider
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
