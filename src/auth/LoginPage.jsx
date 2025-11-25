// // src/auth/LoginPage.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Card } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Eye, EyeOff, Lock, Shield, User } from "lucide-react";
// import iscsLogo from "@/assets/iscs-logo.png";
// import { login } from "../api";

// export default function LoginPage({ onLogin }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       await login(username, password);
//       onLogin();
//       navigate("/dashboard");
//     } catch (error) {
//       setError(error.message || "An error occurred during login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.96, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         <Card className="w-full max-w-4xl backdrop-blur-xl bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/40 rounded-2xl overflow-hidden">
//           <div className="grid grid-cols-1 lg:grid-cols-2">
            
//             {/* LEFT SIDE */}
//             <div className="relative flex items-center justify-center p-8 bg-gradient-to-br from-green-100 to-blue-100">
//               {/* floating glow elements */}
//               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
//               <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>

//               <div className="relative text-center z-10">
//                 <div className="p-6 bg-white/60 rounded-2xl shadow-md backdrop-blur-sm inline-block mb-4">
//                   <img
//                     src={iscsLogo}
//                     alt="ISCS Logo"
//                     className="h-12 sm:h-14 md:h-16 object-contain mx-auto"
//                   />
//                 </div>

//                 <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
//                   Welcome Back 👋
//                 </h1>
//                 <p className="text-gray-600 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
//                   Sign in to your <span className="font-semibold text-blue-700">HRMS Dashboard</span> and manage your profile, payroll, and attendance easily.
//                 </p>

//                 <div className="hidden md:grid gap-3 mt-6 text-left max-w-xs mx-auto">
//                   {[
//                     { icon: <Shield size={16} className="text-green-600" />, label: "Secure Authentication" },
//                     { icon: <User size={16} className="text-blue-600" />, label: "Employee Management" },
//                     { icon: <Lock size={16} className="text-red-600" />, label: "Data Protection" },
//                   ].map((item, idx) => (
//                     <div key={idx} className="flex items-center gap-3 text-gray-700">
//                       <div className="bg-white p-2 rounded-lg shadow-sm">{item.icon}</div>
//                       <span className="text-sm font-medium">{item.label}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT SIDE */}
//             <div className="flex items-center justify-center p-6 md:p-10 bg-white/80 backdrop-blur-sm">
//               <div className="w-full max-w-sm space-y-5">
//                 <div className="text-center">
//                   <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
//                   <p className="text-gray-500 text-sm mt-1">
//                     Enter your credentials to continue
//                   </p>
//                 </div>

//                 <form onSubmit={handleLogin} className="space-y-4">
//                   <div>
//                     <Label htmlFor="username" className="text-gray-700 text-sm font-medium">
//                       Username or Email
//                     </Label>
//                     <div className="relative mt-1">
//                       <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//                       <Input
//                         id="username"
//                         type="text"
//                         placeholder="Enter username or email"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-200 bg-white/90 rounded-lg text-sm"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <Label htmlFor="password" className="text-gray-700 text-sm font-medium">
//                       Password
//                     </Label>
//                     <div className="relative mt-1">
//                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//                       <Input
//                         id="password"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Enter your password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="pl-10 pr-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-200 bg-white/90 rounded-lg text-sm"
//                         required
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                       </button>
//                     </div>
//                   </div>

//                   {error && (
//                     <div className="bg-red-50 border border-red-200 text-red-600 text-sm text-center p-2 rounded-lg">
//                       {error}
//                     </div>
//                   )}

//                   <Button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
//                   >
//                     {loading ? (
//                       <div className="flex items-center justify-center gap-2">
//                         <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
//                         <span>Signing in...</span>
//                       </div>
//                     ) : (
//                       "Sign In"
//                     )}
//                   </Button>
//                 </form>

//                 <div className="text-center">
//                   <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
//                     Forgot your password?
//                   </button>
//                 </div>

//                 <div className="flex items-center gap-2 text-xs text-gray-400 mt-6">
//                   <div className="flex-1 border-t border-gray-200"></div>
//                   <span>ISCS Secure Login</span>
//                   <div className="flex-1 border-t border-gray-200"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }
// src/auth/LoginPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Shield, User } from "lucide-react";
import iscsLogo from "@/assets/iscs-logo.png";
import { login } from "../api";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(username, password);
      onLogin();
      // Remove the explicit navigation here - let App.jsx handle the redirect based on role
    } catch (error) {
      setError(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="w-full max-w-4xl backdrop-blur-xl bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/40 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* LEFT SIDE */}
            <div className="relative flex items-center justify-center p-8 bg-gradient-to-br from-green-100 to-blue-100">
              {/* floating glow elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>

              <div className="relative text-center z-10">
                <div className="p-6 bg-white/60 rounded-2xl shadow-md backdrop-blur-sm inline-block mb-4">
                  <img
                    src={iscsLogo}
                    alt="ISCS Logo"
                    className="h-12 sm:h-14 md:h-16 object-contain mx-auto"
                  />
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
                  Welcome Back 👋
                </h1>
                <p className="text-gray-600 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
                  Sign in to your <span className="font-semibold text-blue-700">HRMS Dashboard</span> and manage your profile, payroll, and attendance easily.
                </p>

                <div className="hidden md:grid gap-3 mt-6 text-left max-w-xs mx-auto">
                  {[
                    { icon: <Shield size={16} className="text-green-600" />, label: "Secure Authentication" },
                    { icon: <User size={16} className="text-blue-600" />, label: "Employee Management" },
                    { icon: <Lock size={16} className="text-red-600" />, label: "Data Protection" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-700">
                      <div className="bg-white p-2 rounded-lg shadow-sm">{item.icon}</div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center justify-center p-6 md:p-10 bg-white/80 backdrop-blur-sm">
              <div className="w-full max-w-sm space-y-5">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Enter your credentials to continue
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-gray-700 text-sm font-medium">
                      Username or Email
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter username or email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-200 bg-white/90 rounded-lg text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-gray-700 text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-200 bg-white/90 rounded-lg text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm text-center p-2 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot your password?
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 mt-6">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span>ISCS Secure Login</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}