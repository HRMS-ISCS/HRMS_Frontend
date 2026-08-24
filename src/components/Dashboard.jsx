// // src/components/Dashboard.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { Card } from "@/components/ui/card";
// import {
//   Users,
//   UserPlus,
//   Calendar,
//   TrendingUp,
//   Clock,
//   Award,
//   ChevronDown,
//   ChevronUp,
//   Building,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   CheckCircle,
//   Eye,
//   EyeOff,
//   Filter,
// } from "lucide-react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";
// import { apiRequest } from "../api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/components/ui/use-toast";
// import { useDarkMode } from "@/context/DarkModeContext";

// export default function Dashboard() {
//   const { darkMode } = useDarkMode();

//   // Existing states
//   const [employeeCounts, setEmployeeCounts] = useState({
//     internal_employees: 0,
//     external_employees: 0,
//   });

//   const [genderCounts, setGenderCounts] = useState({
//     Male: 0,
//     Female: 0,
//     Other: 0,
//     Total_Employees: 0,
//   });

//   const [bankAccountData, setBankAccountData] = useState({
//     summary: {
//       Total_Accounts: 0,
//       Axis_Bank_Accounts: 0,
//       Non_Axis_Bank_Accounts: 0,
//     },
//     non_axis_bank_employees: [],
//   });

//   // New states for user management
//   const [userRoleData, setUserRoleData] = useState({
//     superadmin: 0,
//     hr: 0,
//     employee: 0,
//   });

//   const [usersList, setUsersList] = useState([]);
//   const [roleFilter, setRoleFilter] = useState("All");
//   const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
//   const [showNonAxisTable, setShowNonAxisTable] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [userPage, setUserPage] = useState(1);
//   const [userPageSet, setUserPageSet] = useState(1);
//   const rowsPerPage = 3;
//   const userRowsPerPage = 5;
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Form state for creating user
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     mobile_number: "",
//     username: "",
//     email: "",
//     password: "",
//     confirm_password: "",
//     role: "",
//   });

//   // New state for email preference
//   const [sendEmail, setSendEmail] = useState(true);

//   const [formErrors, setFormErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Initialize toast
//   const { toast } = useToast();

//   useEffect(() => {
//     // Existing API calls
//     apiRequest("/dashboard/employment-applications/count/internal-external")
//       .then((data) => setEmployeeCounts(data))
//       .catch((err) => console.error("Error fetching employee counts:", err));

//     apiRequest("/dashboard/gender-count")
//       .then((data) => setGenderCounts(data))
//       .catch((err) => console.error("Error fetching gender counts:", err));

//     apiRequest("/db/bank-accounts/axis-summary")
//       .then((data) => setBankAccountData(data))
//       .catch((err) => console.error("Error fetching bank account data:", err));

//     // New API calls for user management
//     apiRequest("/admin/users")
//       .then((data) => {
//         if (data.superadmin_data) {
//           const grouped = data.superadmin_data;

//           setUserRoleData({
//             superadmin: grouped.superadmin.length,
//             hr: grouped.hr.length,
//             employee: grouped.employee.length,
//           });

//           const allUsers = [
//             ...grouped.superadmin,
//             ...grouped.hr,
//             ...grouped.employee,
//           ];

//           setUsersList(allUsers);
//         } else if (data.hr_data) {
//           const grouped = data.hr_data;

//           setUserRoleData({
//             superadmin: 0,
//             hr: grouped.hr.length,
//             employee: grouped.employee.length,
//           });

//           const allUsers = [...grouped.hr, ...grouped.employee];
//           setUsersList(allUsers);
//         } else if (data.admin_data) {
//           const users = data.admin_data;

//           setUserRoleData({
//             superadmin: 0,
//             hr: 0,
//             employee: users.filter((u) => u.role === "employee").length,
//           });

//           setUsersList(users);
//         }
//       })
//       .catch((err) => console.error("Error fetching user data:", err));
//   }, []);

//   // Form validation
//   const validateForm = () => {
//     const errors = {};

//     if (!formData.first_name.trim()) {
//       errors.first_name = "First name is required";
//     } else if (formData.first_name.trim().length < 3) {
//       errors.first_name = "First name must be at least 3 characters";
//     }

//     if (!formData.last_name.trim()) {
//       errors.last_name = "Last name is required";
//     }

//     if (!formData.mobile_number.trim()) {
//       errors.mobile_number = "Mobile number is required";
//     } else if (!/^\d{10}$/.test(formData.mobile_number)) {
//       errors.mobile_number = "Mobile number must be 10 digits";
//     }

//     if (!formData.username.trim()) {
//       errors.username = "Username is required";
//     } else if (formData.username.trim().length < 3) {
//       errors.username = "Username must be at least 3 characters";
//     }

//     if (!formData.email.trim()) {
//       errors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       errors.email = "Email is invalid";
//     }

//     if (!formData.password.trim()) {
//       errors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       errors.password = "Password must be at least 6 characters";
//     }

//     if (!formData.confirm_password.trim()) {
//       errors.confirm_password = "Please confirm your password";
//     } else if (formData.password !== formData.confirm_password) {
//       errors.confirm_password = "Passwords do not match";
//     }

//     if (!formData.role) {
//       errors.role = "Role is required";
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (formErrors[name]) {
//       setFormErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   // Handle role selection
//   const handleRoleChange = (value) => {
//     setFormData((prev) => ({ ...prev, role: value }));
//     if (formErrors.role) {
//       setFormErrors((prev) => ({ ...prev, role: "" }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await apiRequest("/admin/create-user", {
//         method: "POST",
//         body: JSON.stringify({
//           ...formData,
//           send_email: sendEmail,
//         }),
//       });

//       const newUser = response.user;
//       const isEmailSent = response.email_sent;

//       setUsersList((prev) => [newUser, ...prev]);

//       setUserRoleData((prev) => ({
//         ...prev,
//         [formData.role]: (prev[formData.role] || 0) + 1,
//       }));

//       setFormData({
//         first_name: "",
//         last_name: "",
//         mobile_number: "",
//         username: "",
//         email: "",
//         password: "",
//         confirm_password: "",
//         role: "",
//       });
//       setSendEmail(true);
//       setShowCreateUserDialog(false);

//       toast({
//         title: (
//           <div className="flex items-center gap-2">
//             <CheckCircle
//               className={`h-5 w-5 ${isEmailSent ? "text-green-500" : "text-orange-500"}`}
//             />
//             <span>User Created Successfully</span>
//           </div>
//         ),
//         description: (
//           <div>
//             <p className="text-sm">{`${newUser.first_name} ${newUser.last_name} has been added as ${newUser.role.toUpperCase()}.`}</p>
//             {isEmailSent ? (
//               <p className="text-xs mt-1 text-green-600 font-medium flex items-center gap-1">
//                 ✉️ Welcome email sent to{" "}
//                 <span className="font-normal">{newUser.email}</span>
//               </p>
//             ) : (
//               <p className="text-xs mt-1 text-orange-600 font-medium flex items-center gap-1">
//                 ⚠️ User created, but welcome email failed to send.
//               </p>
//             )}
//           </div>
//         ),
//         className: darkMode
//           ? "bg-gray-800 border-gray-700 text-gray-100"
//           : "bg-white border-gray-200 text-gray-800",
//       });
//     } catch (error) {
//       console.error("Error creating user:", error);
//       toast({
//         title: "Error",
//         description:
//           error.message || "Failed to create user. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const totalEmployees =
//     employeeCounts.internal_employees + employeeCounts.external_employees;

//   const stats = [
//     {
//       title: "Total Employees",
//       value: totalEmployees,
//       change: "+12%",
//       changeType: "increase",
//       icon: Users,
//       color: "bg-blue-500",
//     },
//     {
//       title: "Internal Employees",
//       value: employeeCounts.internal_employees,
//       change: "+3%",
//       changeType: "increase",
//       icon: Users,
//       color: "bg-green-500",
//     },
//     {
//       title: "External Employees",
//       value: employeeCounts.external_employees,
//       change: "+2%",
//       changeType: "increase",
//       icon: Users,
//       color: "bg-yellow-500",
//     },
//     {
//       title: "Performance",
//       value: "92%",
//       change: "+8%",
//       changeType: "increase",
//       icon: TrendingUp,
//       color: "bg-purple-500",
//     },
//   ];

//   const pieChartData = [
//     {
//       name: "Internal Employees",
//       value: employeeCounts.internal_employees,
//       color: "#f8a688",
//       percentage:
//         totalEmployees > 0
//           ? (
//               (employeeCounts.internal_employees / totalEmployees) *
//               100
//             ).toFixed(1)
//           : 0,
//     },
//     {
//       name: "External Employees",
//       value: employeeCounts.external_employees,
//       color: "#53c9cf",
//       percentage:
//         totalEmployees > 0
//           ? (
//               (employeeCounts.external_employees / totalEmployees) *
//               100
//             ).toFixed(1)
//           : 0,
//     },
//   ];

//   const genderPieData = [
//     { name: "Male", value: genderCounts.Male, color: "#23989a" },
//     { name: "Female", value: genderCounts.Female, color: "#d6ad3a" },
//   ];

//   const userRolePieData = [
//     { name: "Superadmin", value: userRoleData.superadmin, color: "#10b981" },
//     { name: "HR", value: userRoleData.hr, color: "#53c9cf" },
//     { name: "Employee", value: userRoleData.employee, color: "#f8a688" },
//   ];

//   const bankAccountChartData = [
//     {
//       name: "Axis Bank",
//       value: bankAccountData.summary.Axis_Bank_Accounts,
//       color: "#E6F3FF",
//       percentage:
//         bankAccountData.summary.Total_Accounts > 0
//           ? (
//               (bankAccountData.summary.Axis_Bank_Accounts /
//                 bankAccountData.summary.Total_Accounts) *
//               100
//             ).toFixed(1)
//           : 0,
//     },
//     {
//       name: "Non-Axis Bank",
//       value: bankAccountData.summary.Non_Axis_Bank_Accounts,
//       color: "#FFEAD0",
//       percentage:
//         bankAccountData.summary.Total_Accounts > 0
//           ? (
//               (bankAccountData.summary.Non_Axis_Bank_Accounts /
//                 bankAccountData.summary.Total_Accounts) *
//               100
//             ).toFixed(1)
//           : 0,
//     },
//   ];

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload;
//       return (
//         <div
//           className={`p-3 shadow-lg rounded-lg border ${
//             darkMode
//               ? "bg-gray-800 border-gray-700"
//               : "bg-white border-gray-200"
//           }`}
//         >
//           <p
//             className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//           >
//             {data.name}
//           </p>
//           <p className="text-blue-600">Count: {data.value}</p>
//           {data.percentage && (
//             <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
//               Percentage: {data.percentage}%
//             </p>
//           )}
//         </div>
//       );
//     }
//     return null;
//   };

//   const renderLabel = ({
//     cx,
//     cy,
//     midAngle,
//     innerRadius,
//     outerRadius,
//     percent,
//   }) => {
//     const RADIAN = Math.PI / 180;
//     const radius = outerRadius + 25;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);
//     return (
//       <text
//         x={x}
//         y={y}
//         fill={darkMode ? "#D1D5DB" : "#374151"}
//         textAnchor={x > cx ? "start" : "end"}
//         dominantBaseline="central"
//         className="font-semibold text-sm"
//       >
//         {`${(percent * 100).toFixed(1)}%`}
//       </text>
//     );
//   };

//   // Pagination logic for bank accounts
//   const totalPages = Math.ceil(
//     bankAccountData.non_axis_bank_employees.length / rowsPerPage,
//   );
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const endIndex = startIndex + rowsPerPage;
//   const currentEmployees = bankAccountData.non_axis_bank_employees.slice(
//     startIndex,
//     endIndex,
//   );

//   // Users List Logic
//   const sortedUsers = [...usersList].sort((a, b) => {
//     const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
//     const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
//     return dateB - dateA;
//   });

//   const filteredUsers = sortedUsers.filter((user) => {
//     if (roleFilter === "All") return true;
//     return user.role === roleFilter;
//   });

//   const totalUserPages = Math.ceil(filteredUsers.length / userRowsPerPage);

//   useEffect(() => {
//     setUserPage(1);
//     setUserPageSet(1);
//   }, [roleFilter]);

//   const userStartIndex = (userPage - 1) * userRowsPerPage;
//   const userEndIndex = userStartIndex + userRowsPerPage;
//   const currentUsers = filteredUsers.slice(userStartIndex, userEndIndex);

//   const pageNumbersToShow = () => {
//     const pages = [];
//     const maxPagesToShow = 5;
//     const startPage = (userPageSet - 1) * maxPagesToShow + 1;
//     const endPage = Math.min(startPage + maxPagesToShow - 1, totalUserPages);

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }

//     return pages;
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleUserPageChange = (page) => {
//     setUserPage(page);

//     const maxPagesToShow = 5;
//     const newPageSet = Math.ceil(page / maxPagesToShow);
//     if (newPageSet !== userPageSet) {
//       setUserPageSet(newPageSet);
//     }
//   };

//   const handleNextPageSet = () => {
//     const maxPagesToShow = 5;
//     const newPageSet = userPageSet + 1;
//     const startPage = (newPageSet - 1) * maxPagesToShow + 1;

//     if (startPage <= totalUserPages) {
//       setUserPageSet(newPageSet);
//       setUserPage(startPage);
//     }
//   };

//   const handlePrevPageSet = () => {
//     const maxPagesToShow = 5;
//     const newPageSet = Math.max(1, userPageSet - 1);
//     const startPage = (newPageSet - 1) * maxPagesToShow + 1;

//     setUserPageSet(newPageSet);
//     setUserPage(startPage);
//   };

//   useEffect(() => {
//     if (showCreateUserDialog) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }

//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [showCreateUserDialog]);

//   return (
//     <div
//       className={`p-6 space-y-6 min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
//     >
//       {/* Header */}
//       <div
//         className={`flex items-center justify-between p-4 rounded-lg shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}
//       >
//         <div>
//           <h1
//             className={`text-2xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//           >
//             Dashboard
//           </h1>
//           <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
//             Welcome back! Here's what's happening today.
//           </p>
//         </div>
//         <div
//           className={`flex items-center gap-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//         >
//           <Clock size={16} />
//           <span>Last updated: {new Date().toLocaleTimeString()}</span>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat) => {
//           const Icon = stat.icon;
//           return (
//             <Card
//               key={stat.title}
//               className={`p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${darkMode ? "bg-gray-800" : "bg-white"}`}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p
//                     className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}
//                   >
//                     {stat.title}
//                   </p>
//                   <p
//                     className={`text-2xl font-bold mt-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//                   >
//                     {stat.value}
//                   </p>
//                   <p
//                     className={`text-sm mt-1 ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}
//                   >
//                     {stat.change} from last month
//                   </p>
//                 </div>
//                 <div
//                   className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
//                 >
//                   <Icon size={24} className="text-white" />
//                 </div>
//               </div>
//             </Card>
//           );
//         })}
//       </div>

//       {/* User Role Distribution */}
//       <Card
//         className={`p-6 shadow-lg border-0 ${
//           darkMode
//             ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800"
//             : "bg-gradient-to-br from-white via-purple-50/20 to-indigo-50/30"
//         }`}
//       >
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h3
//               className={`text-xl font-bold mb-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//             >
//               User Role Distribution
//             </h3>
//             <p
//               className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//             >
//               Distribution of users by role
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             <div
//               className={`text-right rounded-xl p-3 shadow-sm border ${
//                 darkMode
//                   ? "bg-gray-700/80 border-gray-600"
//                   : "bg-white/80 border-gray-100"
//               }`}
//             >
//               <p
//                 className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//               >
//                 Total Users
//               </p>
//               <p
//                 className={`text-2xl font-bold mt-1 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
//               >
//                 {userRoleData.superadmin +
//                   userRoleData.hr +
//                   userRoleData.employee}
//               </p>
//             </div>
//             <Button
//               onClick={() => setShowCreateUserDialog(true)}
//               className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
//             >
//               <UserPlus size={16} />
//               Create User
//             </Button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Pie Chart */}
//           <div className="flex justify-center">
//             <div className="relative">
//               <div className="h-64 w-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={userRolePieData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={renderLabel}
//                       outerRadius={85}
//                       innerRadius={0}
//                       fill="#8884d8"
//                       dataKey="value"
//                       stroke={darkMode ? "#1F2937" : "#ffffff"}
//                       strokeWidth={3}
//                       paddingAngle={2}
//                       isAnimationActive={true}
//                       animationBegin={0}
//                       animationDuration={800}
//                     >
//                       {userRolePieData.map((entry, index) => (
//                         <Cell
//                           key={`cell-user-role-${index}`}
//                           fill={entry.color}
//                           stroke={darkMode ? "#1F2937" : "#ffffff"}
//                           strokeWidth={2}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       content={<CustomTooltip />}
//                       cursor={{ fill: "transparent" }}
//                       wrapperStyle={{ outline: "none", zIndex: 1000 }}
//                     />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {/* Statistics Summary */}
//           <div className="space-y-4">
//             {userRolePieData.map((item, index) => (
//               <div
//                 key={index}
//                 className="group hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
//               >
//                 <div
//                   className={`flex items-center justify-between p-4 rounded-xl border shadow-sm ${
//                     darkMode
//                       ? "bg-gray-700/70 border-gray-600/50"
//                       : "bg-white/70 border-gray-100/50"
//                   }`}
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="relative">
//                       <div
//                         className="w-6 h-6 rounded-full shadow-sm border-2"
//                         style={{
//                           backgroundColor: item.color,
//                           borderColor: darkMode ? "#1F2937" : "#ffffff",
//                         }}
//                       ></div>
//                     </div>
//                     <div>
//                       <span
//                         className={`font-semibold text-base ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//                       >
//                         {item.name}
//                       </span>
//                       <p
//                         className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                       >
//                         Users with this role
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="flex items-baseline gap-2">
//                       <p
//                         className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//                       >
//                         {item.value}
//                       </p>
//                       <div
//                         className="px-2 py-1 rounded-full text-xs font-medium text-gray-700"
//                         style={{ backgroundColor: item.color }}
//                       >
//                         {item.value > 0
//                           ? (
//                               (item.value /
//                                 (userRoleData.superadmin +
//                                   userRoleData.hr +
//                                   userRoleData.employee)) *
//                               100
//                             ).toFixed(1)
//                           : 0}
//                         %
//                       </div>
//                     </div>
//                     <p
//                       className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                     >
//                       of total users
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Users Table */}
//         <div
//           className={`mt-6 p-4 rounded-xl border shadow-sm ${
//             darkMode
//               ? "bg-gray-700/80 border-gray-600/50"
//               : "bg-white/80 border-gray-100/50"
//           }`}
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-4">
//               <h4
//                 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//               >
//                 <Users size={20} className="text-indigo-500" />
//                 Users List
//               </h4>
//               {/* Filter Dropdown */}
//               <div
//                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-white"}`}
//               >
//                 <Filter
//                   size={16}
//                   className={darkMode ? "text-gray-400" : "text-gray-500"}
//                 />
//                 <Select value={roleFilter} onValueChange={setRoleFilter}>
//                   <SelectTrigger className="w-[150px] h-8 border-0 shadow-none focus:ring-0 pl-0 text-sm">
//                     <SelectValue placeholder="Filter by Role" />
//                   </SelectTrigger>
//                   <SelectContent
//                     className={
//                       darkMode
//                         ? "bg-gray-800 border-gray-600 text-white"
//                         : "bg-white border-gray-200"
//                     }
//                   >
//                     <SelectItem value="All">All Roles</SelectItem>
//                     <SelectItem value="superadmin">Superadmin</SelectItem>
//                     <SelectItem value="hr">HR</SelectItem>
//                     <SelectItem value="employee">Employee</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <span
//               className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//             >
//               {filteredUsers.length} users
//             </span>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr
//                   className={`border-b ${darkMode ? "border-gray-600" : "border-gray-200/50"}`}
//                 >
//                   <th
//                     className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     Name
//                   </th>
//                   <th
//                     className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     Username
//                   </th>
//                   <th
//                     className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     Email
//                   </th>
//                   <th
//                     className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     Mobile
//                   </th>
//                   <th
//                     className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     Role
//                   </th>
//                   <th
//                     className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     Created At
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentUsers.map((user, index) => (
//                   <tr
//                     key={index}
//                     className={`border-b hover:transition-all duration-200 ${
//                       darkMode
//                         ? "border-gray-700/50 hover:bg-gray-700/50"
//                         : "border-gray-100/50 hover:bg-gray-50/50"
//                     }`}
//                   >
//                     <td
//                       className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
//                     >
//                       {user.first_name} {user.last_name}
//                     </td>
//                     <td
//                       className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
//                     >
//                       {user.username}
//                     </td>
//                     <td
//                       className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
//                     >
//                       {user.email}
//                     </td>
//                     <td
//                       className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
//                     >
//                       {user.mobile_number}
//                     </td>
//                     <td className="py-3 px-4">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           user.role === "superadmin"
//                             ? "bg-green-100 text-green-700"
//                             : user.role === "hr"
//                               ? "bg-teal-100 text-teal-700"
//                               : "bg-orange-100 text-orange-700"
//                         }`}
//                       >
//                         {user.role.toUpperCase()}
//                       </span>
//                     </td>
//                     <td
//                       className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
//                     >
//                       {user.created_at
//                         ? new Date(user.created_at).toLocaleDateString()
//                         : "N/A"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination Controls */}
//           {totalUserPages > 1 && (
//             <div
//               className={`flex items-center justify-between mt-4 pt-4 border-t ${darkMode ? "border-gray-600" : "border-gray-200/50"}`}
//             >
//               <div
//                 className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
//               >
//                 Showing {userStartIndex + 1} to{" "}
//                 {Math.min(userEndIndex, filteredUsers.length)} of{" "}
//                 {filteredUsers.length} entries
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => handleUserPageChange(userPage - 1)}
//                   disabled={userPage === 1}
//                   className={`p-2 rounded-lg border transition-all duration-200 ${
//                     darkMode
//                       ? "border-gray-600 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
//                       : "border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
//                   }`}
//                 >
//                   <ChevronLeft size={16} />
//                 </button>

//                 {userPageSet > 1 && (
//                   <button
//                     onClick={handlePrevPageSet}
//                     className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
//                       darkMode
//                         ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
//                         : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
//                     }`}
//                   >
//                     ...
//                   </button>
//                 )}

//                 {pageNumbersToShow().map((page) => (
//                   <button
//                     key={page}
//                     onClick={() => handleUserPageChange(page)}
//                     className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
//                       userPage === page
//                         ? "bg-indigo-500 text-white"
//                         : darkMode
//                           ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
//                           : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}

//                 {userPageSet * 5 < totalUserPages && (
//                   <button
//                     onClick={handleNextPageSet}
//                     className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
//                       darkMode
//                         ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
//                         : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
//                     }`}
//                   >
//                     ...
//                   </button>
//                 )}

//                 <button
//                   onClick={() => handleUserPageChange(userPage + 1)}
//                   disabled={userPage === totalUserPages}
//                   className={`p-2 rounded-lg border transition-all duration-200 ${
//                     darkMode
//                       ? "border-gray-600 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
//                       : "border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
//                   }`}
//                 >
//                   <ChevronRight size={16} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Employee Distribution and Gender Distribution Charts Side by Side */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Employee Distribution Pie Chart */}
//         <Card
//           className={`p-6 shadow-lg border-0 ${
//             darkMode
//               ? "bg-gradient-to-br from-gray-800 to-gray-700"
//               : "bg-gradient-to-br from-white to-blue-50/30"
//           }`}
//         >
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3
//                 className={`text-xl font-bold mb-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//               >
//                 Employee Distribution
//               </h3>
//               <p
//                 className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//               >
//                 Internal vs External workforce breakdown
//               </p>
//             </div>
//             <div
//               className={`text-right rounded-xl p-3 shadow-sm border ${
//                 darkMode
//                   ? "bg-gray-700 border-gray-600"
//                   : "bg-white border-gray-100"
//               }`}
//             >
//               <p
//                 className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//               >
//                 Total Employees
//               </p>
//               <p
//                 className={`text-2xl font-bold mt-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
//               >
//                 {totalEmployees}
//               </p>
//             </div>
//           </div>

//           <div className="flex justify-center">
//             <div className="relative">
//               <div className="h-64 w-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={pieChartData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={renderLabel}
//                       outerRadius={80}
//                       innerRadius={40}
//                       fill="#8884d8"
//                       dataKey="value"
//                       stroke={darkMode ? "#1F2937" : "#ffffff"}
//                       strokeWidth={3}
//                       paddingAngle={0}
//                       isAnimationActive={true}
//                     >
//                       {pieChartData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       content={<CustomTooltip />}
//                       cursor={{ fill: "transparent" }}
//                       wrapperStyle={{ outline: "none", zIndex: 1000 }}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               {/* Center Label */}
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div
//                   className={`text-center rounded-full p-3 shadow-sm border ${
//                     darkMode
//                       ? "bg-gray-700 border-gray-600"
//                       : "bg-white border-gray-100"
//                   }`}
//                 >
//                   <p
//                     className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                   >
//                     Total
//                   </p>
//                   <p
//                     className={`text-xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//                   >
//                     {totalEmployees}
//                   </p>
//                   <p
//                     className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                   >
//                     Employees
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Statistics Summary */}
//           <div className="mt-6 space-y-3">
//             {pieChartData.map((item, index) => (
//               <div
//                 key={index}
//                 className="group hover:shadow-md transition-all duration-300"
//               >
//                 <div
//                   className={`flex items-center justify-between p-3 rounded-lg border shadow-sm ${
//                     darkMode
//                       ? "bg-gray-700 border-gray-600"
//                       : "bg-white border-gray-100"
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="relative">
//                       <div
//                         className="w-5 h-5 rounded-full shadow-sm border-2"
//                         style={{
//                           backgroundColor: item.color,
//                           borderColor: darkMode ? "#1F2937" : "#ffffff",
//                         }}
//                       ></div>
//                     </div>
//                     <div>
//                       <span
//                         className={`font-semibold text-sm ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//                       >
//                         {item.name}
//                       </span>
//                       <p
//                         className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                       >
//                         Active employees
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="flex items-baseline gap-2">
//                       <p
//                         className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//                       >
//                         {item.value}
//                       </p>
//                       <div
//                         className="px-2 py-1 rounded-full text-xs font-medium text-white"
//                         style={{ backgroundColor: item.color }}
//                       >
//                         {item.percentage}%
//                       </div>
//                     </div>
//                     <p
//                       className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                     >
//                       of workforce
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>

//         {/* Gender Distribution Chart (Full Pie) */}
//         <Card className={`p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3
//                 className={`text-xl font-bold mb-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//               >
//                 Gender Distribution
//               </h3>
//               <p
//                 className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//               >
//                 Employee gender breakdown
//               </p>
//             </div>
//             <div
//               className={`text-right rounded-xl p-3 shadow-sm border ${
//                 darkMode
//                   ? "bg-gray-700 border-gray-600"
//                   : "bg-white border-gray-100"
//               }`}
//             >
//               <p
//                 className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//               >
//                 Total Employees
//               </p>
//               <p
//                 className={`text-2xl font-bold mt-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
//               >
//                 {genderCounts.Total_Employees}
//               </p>
//             </div>
//           </div>

//           <div className="flex justify-center">
//             <div className="h-64 w-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={genderPieData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={renderLabel}
//                     outerRadius={80}
//                     innerRadius={0}
//                     dataKey="value"
//                     stroke={darkMode ? "#1F2937" : "#ffffff"}
//                     strokeWidth={3}
//                   >
//                     {genderPieData.map((entry, index) => (
//                       <Cell key={`cell-gender-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Statistics Summary */}
//           <div className="mt-6 space-y-3">
//             {genderPieData.map((item, index) => (
//               <div
//                 key={index}
//                 className="group hover:shadow-md transition-all duration-300"
//               >
//                 <div
//                   className={`flex items-center justify-between p-3 rounded-lg border shadow-sm ${
//                     darkMode
//                       ? "bg-gray-700 border-gray-600"
//                       : "bg-white border-gray-100"
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="relative">
//                       <div
//                         className="w-5 h-5 rounded-full shadow-sm border-2"
//                         style={{
//                           backgroundColor: item.color,
//                           borderColor: darkMode ? "#1F2937" : "#ffffff",
//                         }}
//                       ></div>
//                     </div>
//                     <div>
//                       <span
//                         className={`font-semibold text-sm ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//                       >
//                         {item.name}
//                       </span>
//                       <p
//                         className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                       >
//                         Employees
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="flex items-baseline gap-2">
//                       <p
//                         className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//                       >
//                         {item.value}
//                       </p>
//                       <div
//                         className="px-2 py-1 rounded-full text-xs font-medium text-white"
//                         style={{ backgroundColor: item.color }}
//                       >
//                         {genderCounts.Total_Employees > 0
//                           ? (
//                               (item.value / genderCounts.Total_Employees) *
//                               100
//                             ).toFixed(1)
//                           : 0}
//                         %
//                       </div>
//                     </div>
//                     <p
//                       className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                     >
//                       of total
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* Bank Account Distribution */}
//       <Card
//         className={`p-6 shadow-lg border-0 ${
//           darkMode
//             ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800"
//             : "bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30"
//         }`}
//       >
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h3
//               className={`text-xl font-bold mb-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//             >
//               Bank Account Distribution
//             </h3>
//             <p
//               className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//             >
//               Axis Bank vs Non-Axis Bank accounts
//             </p>
//           </div>
//           <div
//             className={`text-right rounded-xl p-3 shadow-sm border ${
//               darkMode
//                 ? "bg-gray-700/80 border-gray-600"
//                 : "bg-white/80 border-gray-100"
//             }`}
//           >
//             <p
//               className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//             >
//               Total Accounts
//             </p>
//             <p
//               className={`text-2xl font-bold mt-1 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
//             >
//               {bankAccountData.summary.Total_Accounts}
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Ring Chart */}
//           <div className="flex justify-center">
//             <div className="relative">
//               <div className="h-64 w-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={bankAccountChartData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={renderLabel}
//                       outerRadius={85}
//                       innerRadius={65}
//                       fill="#8884d8"
//                       dataKey="value"
//                       stroke={darkMode ? "#1F2937" : "#ffffff"}
//                       strokeWidth={4}
//                       paddingAngle={2}
//                       isAnimationActive={true}
//                       animationBegin={0}
//                       animationDuration={800}
//                     >
//                       {bankAccountChartData.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={entry.color}
//                           stroke={darkMode ? "#1F2937" : "#ffffff"}
//                           strokeWidth={2}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       content={<CustomTooltip />}
//                       cursor={{ fill: "transparent" }}
//                       wrapperStyle={{ outline: "none", zIndex: 1000 }}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               {/* Center Label */}
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div
//                   className={`text-center rounded-full p-3 shadow-sm border ${
//                     darkMode
//                       ? "bg-gray-700/90 border-gray-600"
//                       : "bg-white/90 border-gray-100"
//                   }`}
//                 >
//                   <p
//                     className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                   >
//                     Total
//                   </p>
//                   <p
//                     className={`text-xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//                   >
//                     {bankAccountData.summary.Total_Accounts}
//                   </p>
//                   <p
//                     className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                   >
//                     Accounts
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Statistics Summary */}
//           <div className="space-y-4">
//             {bankAccountChartData.map((item, index) => (
//               <div
//                 key={index}
//                 className="group hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
//               >
//                 <div
//                   className={`flex items-center justify-between p-4 rounded-xl border shadow-sm cursor-pointer ${
//                     darkMode
//                       ? "bg-gray-700/70 border-gray-600/50"
//                       : "bg-white/70 border-gray-100/50"
//                   }`}
//                   onClick={() =>
//                     item.name === "Non-Axis Bank" &&
//                     setShowNonAxisTable(!showNonAxisTable)
//                   }
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="relative">
//                       <div
//                         className="w-6 h-6 rounded-full shadow-sm border-2"
//                         style={{
//                           backgroundColor: item.color,
//                           borderColor: darkMode ? "#1F2937" : "#ffffff",
//                         }}
//                       ></div>
//                     </div>
//                     <div>
//                       <span
//                         className={`font-semibold text-base flex items-center gap-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//                       >
//                         {item.name}
//                         {item.name === "Non-Axis Bank" &&
//                           (showNonAxisTable ? (
//                             <ChevronUp size={16} />
//                           ) : (
//                             <ChevronDown size={16} />
//                           ))}
//                       </span>
//                       <p
//                         className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                       >
//                         {item.name === "Non-Axis Bank"
//                           ? "Click to view details"
//                           : "Bank accounts"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="flex items-baseline gap-2">
//                       <p
//                         className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//                       >
//                         {item.value}
//                       </p>
//                       <div
//                         className="px-2 py-1 rounded-full text-xs font-medium text-gray-700"
//                         style={{ backgroundColor: item.color }}
//                       >
//                         {item.percentage}%
//                       </div>
//                     </div>
//                     <p
//                       className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                     >
//                       of total accounts
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Non-Axis Bank Employees Table with Pagination */}
//         {showNonAxisTable &&
//           bankAccountData.non_axis_bank_employees.length > 0 && (
//             <div
//               className={`mt-6 p-4 rounded-xl border shadow-sm transition-all duration-500 ${
//                 darkMode
//                   ? "bg-gray-700/80 border-gray-600/50"
//                   : "bg-white/80 border-gray-100/50"
//               }`}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h4
//                   className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//                 >
//                   <Building size={20} className="text-orange-500" />
//                   Non-Axis Bank Employees
//                 </h4>
//                 <span
//                   className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                 >
//                   {bankAccountData.non_axis_bank_employees.length} employees
//                 </span>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr
//                       className={`border-b ${darkMode ? "border-gray-600" : "border-gray-200/50"}`}
//                     >
//                       <th
//                         className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                       >
//                         Employee ID
//                       </th>
//                       <th
//                         className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                       >
//                         Name
//                       </th>
//                       <th
//                         className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                       >
//                         Email
//                       </th>
//                       <th
//                         className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                       >
//                         Bank Name
//                       </th>
//                       <th
//                         className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                       >
//                         Account Number
//                       </th>
//                       <th
//                         className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                       >
//                         IFSC Code
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentEmployees.map((employee, index) => (
//                       <tr
//                         key={index}
//                         className={`border-b hover:transition-all duration-200 ${
//                           darkMode
//                             ? "border-gray-700/50 hover:bg-gray-700/50"
//                             : "border-gray-100/50 hover:bg-gray-50/50"
//                         }`}
//                       >
//                         <td
//                           className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
//                         >
//                           {employee.employee_id}
//                         </td>
//                         <td
//                           className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
//                         >
//                           {employee.name}
//                         </td>
//                         <td
//                           className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
//                         >
//                           {employee.mail_id}
//                         </td>
//                         <td
//                           className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
//                         >
//                           {employee.bank_name}
//                         </td>
//                         <td
//                           className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
//                         >
//                           {employee.account_number}
//                         </td>
//                         <td
//                           className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
//                         >
//                           {employee.ifsc_code}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination Controls */}
//               {totalPages > 1 && (
//                 <div
//                   className={`flex items-center justify-between mt-4 pt-4 border-t ${darkMode ? "border-gray-600" : "border-gray-200/50"}`}
//                 >
//                   <div
//                     className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
//                   >
//                     Showing {startIndex + 1} to{" "}
//                     {Math.min(
//                       endIndex,
//                       bankAccountData.non_axis_bank_employees.length,
//                     )}{" "}
//                     of {bankAccountData.non_axis_bank_employees.length} entries
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       className={`p-2 rounded-lg border transition-all duration-200 ${
//                         darkMode
//                           ? "border-gray-600 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
//                           : "border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
//                       }`}
//                     >
//                       <ChevronLeft size={16} />
//                     </button>

//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                       (page) => (
//                         <button
//                           key={page}
//                           onClick={() => handlePageChange(page)}
//                           className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
//                             currentPage === page
//                               ? "bg-indigo-500 text-white"
//                               : darkMode
//                                 ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
//                                 : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
//                           }`}
//                         >
//                           {page}
//                         </button>
//                       ),
//                     )}

//                     <button
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                       className={`p-2 rounded-lg border transition-all duration-200 ${
//                         darkMode
//                           ? "border-gray-600 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
//                           : "border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
//                       }`}
//                     >
//                       <ChevronRight size={16} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//       </Card>

//       {/* Create User Dialog */}
//       {showCreateUserDialog && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto pointer-events-none">
//           <div
//             className={`w-full max-w-2xl p-6 my-8 relative animate-in fade-in zoom-in duration-200 pointer-events-auto rounded-xl shadow-2xl ${
//               darkMode ? "bg-gray-800" : "bg-white"
//             }`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between mb-6">
//               <h3
//                 className={`text-xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
//               >
//                 Create New User
//               </h3>
//               <button
//                 onClick={() => setShowCreateUserDialog(false)}
//                 className={`p-2 rounded-lg transition-colors ${
//                   darkMode
//                     ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
//                     : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
//                 }`}
//                 type="button"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* First Row: First Name, Last Name, Mobile Number */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <Label
//                     htmlFor="first_name"
//                     className={`text-sm font-medium mb-1 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     First Name <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     id="first_name"
//                     name="first_name"
//                     type="text"
//                     placeholder="Enter first name"
//                     value={formData.first_name}
//                     onChange={handleInputChange}
//                     className={`w-full ${formErrors.first_name ? "border-red-500 focus:ring-red-500" : ""} ${
//                       darkMode
//                         ? "text-white bg-gray-700 border-gray-600"
//                         : "text-gray-900 bg-white border-gray-300"
//                     }`}
//                     disabled={isSubmitting}
//                   />
//                   {formErrors.first_name && (
//                     <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                       <span>⚠</span> {formErrors.first_name}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label
//                     htmlFor="last_name"
//                     className={`text-sm font-medium mb-1 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     Last Name <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     id="last_name"
//                     name="last_name"
//                     type="text"
//                     placeholder="Enter last name"
//                     value={formData.last_name}
//                     onChange={handleInputChange}
//                     className={`w-full ${formErrors.last_name ? "border-red-500 focus:ring-red-500" : ""} ${
//                       darkMode
//                         ? "text-white bg-gray-700 border-gray-600"
//                         : "text-gray-900 bg-white border-gray-300"
//                     }`}
//                     disabled={isSubmitting}
//                   />
//                   {formErrors.last_name && (
//                     <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                       <span>⚠</span> {formErrors.last_name}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label
//                     htmlFor="mobile_number"
//                     className={`text-sm font-medium mb-1 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     Mobile Number <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     id="mobile_number"
//                     name="mobile_number"
//                     type="text"
//                     placeholder="10-digit number"
//                     value={formData.mobile_number}
//                     onChange={handleInputChange}
//                     maxLength={10}
//                     className={`w-full ${formErrors.mobile_number ? "border-red-500 focus:ring-red-500" : ""} ${
//                       darkMode
//                         ? "text-white bg-gray-700 border-gray-600"
//                         : "text-gray-900 bg-white border-gray-300"
//                     }`}
//                     disabled={isSubmitting}
//                   />
//                   {formErrors.mobile_number && (
//                     <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                       <span>⚠</span> {formErrors.mobile_number}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Second Row: Username, Email, Role */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <Label
//                     htmlFor="username"
//                     className={`text-sm font-medium mb-1 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     Username <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     id="username"
//                     name="username"
//                     type="text"
//                     placeholder="Enter username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     className={`w-full ${formErrors.username ? "border-red-500 focus:ring-red-500" : ""} ${
//                       darkMode
//                         ? "text-white bg-gray-700 border-gray-600"
//                         : "text-gray-900 bg-white border-gray-300"
//                     }`}
//                     disabled={isSubmitting}
//                   />
//                   {formErrors.username && (
//                     <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                       <span>⚠</span> {formErrors.username}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label
//                     htmlFor="email"
//                     className={`text-sm font-medium mb-1 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     Email <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="email@example.com"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className={`w-full ${formErrors.email ? "border-red-500 focus:ring-red-500" : ""} ${
//                       darkMode
//                         ? "text-white bg-gray-700 border-gray-600"
//                         : "text-gray-900 bg-white border-gray-300"
//                     }`}
//                     disabled={isSubmitting}
//                   />
//                   {formErrors.email && (
//                     <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                       <span>⚠</span> {formErrors.email}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label
//                     htmlFor="role"
//                     className={`text-sm font-medium mb-1 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     Role <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     value={formData.role}
//                     onValueChange={handleRoleChange}
//                     disabled={isSubmitting}
//                   >
//                     <SelectTrigger
//                       className={`w-full ${formErrors.role ? "border-red-500 focus:ring-red-500" : ""} ${
//                         darkMode
//                           ? "text-white bg-gray-700 border-gray-600"
//                           : "text-gray-900 bg-white border-gray-300"
//                       }`}
//                     >
//                       <SelectValue placeholder="Select role" />
//                     </SelectTrigger>
//                     <SelectContent
//                       className={
//                         darkMode
//                           ? "bg-gray-700 border-gray-600 text-white"
//                           : "bg-white border-gray-300"
//                       }
//                     >
//                       <SelectItem value="superadmin">Superadmin</SelectItem>
//                       <SelectItem value="hr">HR</SelectItem>
//                       <SelectItem value="employee">Employee</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   {formErrors.role && (
//                     <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                       <span>⚠</span> {formErrors.role}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Third Row: Password, Confirm Password */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label
//                     htmlFor="password"
//                     className={`text-sm font-medium mb-1 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     Password <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Min. 6 characters"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className={`w-full pr-10 ${formErrors.password ? "border-red-500 focus:ring-red-500" : ""} ${
//                         darkMode
//                           ? "text-white bg-gray-700 border-gray-600"
//                           : "text-gray-900 bg-white border-gray-300"
//                       }`}
//                       disabled={isSubmitting}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
//                         darkMode
//                           ? "text-gray-400 hover:text-gray-300"
//                           : "text-gray-500 hover:text-gray-700"
//                       }`}
//                       tabIndex="-1"
//                     >
//                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
//                   {formErrors.password && (
//                     <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                       <span>⚠</span> {formErrors.password}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label
//                     htmlFor="confirm_password"
//                     className={`text-sm font-medium mb-1 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     Confirm Password <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       id="confirm_password"
//                       name="confirm_password"
//                       type={showConfirmPassword ? "text" : "password"}
//                       placeholder="Re-enter password"
//                       value={formData.confirm_password}
//                       onChange={handleInputChange}
//                       className={`w-full pr-10 ${formErrors.confirm_password ? "border-red-500 focus:ring-red-500" : ""} ${
//                         darkMode
//                           ? "text-white bg-gray-700 border-gray-600"
//                           : "text-gray-900 bg-white border-gray-300"
//                       }`}
//                       disabled={isSubmitting}
//                     />
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowConfirmPassword(!showConfirmPassword)
//                       }
//                       className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
//                         darkMode
//                           ? "text-gray-400 hover:text-gray-300"
//                           : "text-gray-500 hover:text-gray-700"
//                       }`}
//                       tabIndex="-1"
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff size={18} />
//                       ) : (
//                         <Eye size={18} />
//                       )}
//                     </button>
//                   </div>
//                   {formErrors.confirm_password && (
//                     <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                       <span>⚠</span> {formErrors.confirm_password}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Email Notification Preference - NEW SECTION */}
//               <div
//                 className={`flex items-center justify-between py-3 px-4 rounded-lg border ${
//                   darkMode
//                     ? "bg-gray-700/50 border-gray-600"
//                     : "bg-gray-50 border-gray-200"
//                 }`}
//               >
//                 <div className="flex items-center space-x-3">
//                   <input
//                     type="checkbox"
//                     id="send_email"
//                     checked={sendEmail}
//                     onChange={(e) => setSendEmail(e.target.checked)}
//                     disabled={isSubmitting}
//                     className={`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
//                       darkMode ? "bg-gray-700 border-gray-600" : ""
//                     }`}
//                   />
//                   <Label
//                     htmlFor="send_email"
//                     className={`text-sm font-medium cursor-pointer ${
//                       darkMode ? "text-gray-300" : "text-gray-700"
//                     }`}
//                   >
//                     Send welcome email with login credentials
//                   </Label>
//                 </div>

//                 <span
//                   className={`text-xs px-2 py-1 rounded-full ${
//                     sendEmail
//                       ? "bg-green-100 text-green-700"
//                       : "bg-gray-100 text-gray-600"
//                   }`}
//                 >
//                   {sendEmail ? "✓ Email will be sent" : "✗ No email"}
//                 </span>
//               </div>

//               {/* Action Buttons */}
//               <div
//                 className={`flex justify-end gap-3 pt-4 border-t ${darkMode ? "border-gray-600" : "border-gray-200"}`}
//               >
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setShowCreateUserDialog(false)}
//                   disabled={isSubmitting}
//                   className="px-6"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-6"
//                 >
//                   {isSubmitting ? (
//                     <div className="flex items-center gap-2">
//                       <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
//                       <span>Creating...</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2">
//                       <UserPlus size={16} />
//                       <span>Create User</span>
//                     </div>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// src/components/Dashboard.jsx --- letters ui
import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  Users,
  UserPlus,
  Calendar,
  TrendingUp,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Building,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  Eye,
  EyeOff,
  Filter,
  FileText,
  Download,
  Trash2,
  Search,
  RefreshCw,
  Mail,
  MailCheck,
  MailX,
  AlertTriangle,
  History,
  CalendarDays,
  ShieldAlert,
  RotateCcw,
  HardDrive,
  Loader2,
  Send,
  User,
  Info,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { apiRequest } from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useDarkMode } from "@/context/DarkModeContext";

// ============================================================
// DOCUMENT HISTORY CONSTANTS
// ============================================================
const DOC_TYPE_OPTIONS = [
  { value: "proposed_offer_letter", label: "Proposed Offer Letter" },
  { value: "appointment_letter", label: "Appointment Letter" },
  { value: "relieving_experience_letter", label: "Relieving & Experience Letter" },
  { value: "payslip", label: "Payslip" },
];

const EMAIL_STATUS_OPTIONS = [
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
  { value: "not_requested", label: "Not Requested" },
];

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ============================================================
// DOCUMENT HISTORY FORMATTERS (pure helpers)
// ============================================================
const formatBytes = (bytes) => {
  if (bytes === null || bytes === undefined) return "—";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

const formatISTDateTime = (dt) => {
  if (!dt) return "—";
  const d = new Date(dt);
  if (isNaN(d.getTime())) return String(dt);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDateOnly = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "—";
  return `₹ ${Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

const formatCTC = (amount) => {
  if (amount === null || amount === undefined) return "—";
  const lpa = amount / 100000;
  return `${lpa.toFixed(2).replace(/\.?0+$/, "")} LPA`;
};

const formatPayslipPeriod = (month, year) => {
  if (!month || !year) return "—";
  return `${MONTH_NAMES[month] || month} ${year}`;
};

const isPermissionError = (err) => {
  const msg = String(err?.message || err?.detail || err || "").toLowerCase();
  return (
    msg.includes("403") ||
    msg.includes("forbidden") ||
    msg.includes("only hr") ||
    msg.includes("superadmin can") ||
    msg.includes("permission")
  );
};

export default function Dashboard() {
  const { darkMode } = useDarkMode();

  // ============================================================
  // EXISTING STATES
  // ============================================================
  const [employeeCounts, setEmployeeCounts] = useState({
    internal_employees: 0,
    external_employees: 0,
  });

  const [genderCounts, setGenderCounts] = useState({
    Male: 0,
    Female: 0,
    Other: 0,
    Total_Employees: 0,
  });

  const [bankAccountData, setBankAccountData] = useState({
    summary: {
      Total_Accounts: 0,
      Axis_Bank_Accounts: 0,
      Non_Axis_Bank_Accounts: 0,
    },
    non_axis_bank_employees: [],
  });

  // New states for user management
  const [userRoleData, setUserRoleData] = useState({
    superadmin: 0,
    hr: 0,
    employee: 0,
  });

  const [usersList, setUsersList] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [showNonAxisTable, setShowNonAxisTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [userPageSet, setUserPageSet] = useState(1);
  const rowsPerPage = 3;
  const userRowsPerPage = 5;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state for creating user
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "",
  });

  // New state for email preference
  const [sendEmail, setSendEmail] = useState(true);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize toast
  const { toast } = useToast();

  // ============================================================
  // DOCUMENT HISTORY STATES
  // ============================================================
  const [docHistory, setDocHistory] = useState([]);
  const [docSummary, setDocSummary] = useState(null);
  const [docHistoryLoading, setDocHistoryLoading] = useState(false);
  const [docSummaryLoading, setDocSummaryLoading] = useState(false);
  const [docHistoryError, setDocHistoryError] = useState(null);
  const [docSectionVisible, setDocSectionVisible] = useState(true);

  // Pagination (server-side)
  const [docPage, setDocPage] = useState(1);
  const [docPageSize, setDocPageSize] = useState(10);
  const [docTotal, setDocTotal] = useState(0);
  const [docTotalPages, setDocTotalPages] = useState(0);
  const [docPageSet, setDocPageSet] = useState(1);

  // Filters
  const [docTypeFilter, setDocTypeFilter] = useState("all");
  const [docEmailStatus, setDocEmailStatus] = useState("all");
  const [docFromDate, setDocFromDate] = useState("");
  const [docToDate, setDocToDate] = useState("");
  const [docSearch, setDocSearch] = useState("");

  // Row selection for bulk operations
  const [selectedDocIds, setSelectedDocIds] = useState([]);

  // Dialogs
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [detailsDoc, setDetailsDoc] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: "single", doc } | { type: "bulk" }
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadingDocId, setDownloadingDocId] = useState(null);

  // ============================================================
  // EXISTING API CALLS
  // ============================================================
  useEffect(() => {
    apiRequest("/dashboard/employment-applications/count/internal-external")
      .then((data) => setEmployeeCounts(data))
      .catch((err) => console.error("Error fetching employee counts:", err));

    apiRequest("/dashboard/gender-count")
      .then((data) => setGenderCounts(data))
      .catch((err) => console.error("Error fetching gender counts:", err));

    apiRequest("/db/bank-accounts/axis-summary")
      .then((data) => setBankAccountData(data))
      .catch((err) => console.error("Error fetching bank account data:", err));

    // New API calls for user management
    apiRequest("/admin/users")
      .then((data) => {
        if (data.superadmin_data) {
          const grouped = data.superadmin_data;

          setUserRoleData({
            superadmin: grouped.superadmin.length,
            hr: grouped.hr.length,
            employee: grouped.employee.length,
          });

          const allUsers = [
            ...grouped.superadmin,
            ...grouped.hr,
            ...grouped.employee,
          ];

          setUsersList(allUsers);
        } else if (data.hr_data) {
          const grouped = data.hr_data;

          setUserRoleData({
            superadmin: 0,
            hr: grouped.hr.length,
            employee: grouped.employee.length,
          });

          const allUsers = [...grouped.hr, ...grouped.employee];
          setUsersList(allUsers);
        } else if (data.admin_data) {
          const users = data.admin_data;

          setUserRoleData({
            superadmin: 0,
            hr: 0,
            employee: users.filter((u) => u.role === "employee").length,
          });

          setUsersList(users);
        }
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, []);

  // ============================================================
  // DOCUMENT HISTORY - DATA FETCHING
  // ============================================================
  const fetchDocSummary = async () => {
    setDocSummaryLoading(true);
    try {
      const data = await apiRequest("/dashboard/document-history/summary");
      setDocSummary(data);
      setDocHistoryError(null);
    } catch (err) {
      console.error("Error fetching document history summary:", err);
      if (isPermissionError(err)) {
        setDocSectionVisible(false);
      }
    } finally {
      setDocSummaryLoading(false);
    }
  };

  const fetchDocHistory = async () => {
    setDocHistoryLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(docPage));
      params.append("page_size", String(docPageSize));
      if (docTypeFilter !== "all") params.append("document_type", docTypeFilter);
      if (docFromDate) params.append("from_date", docFromDate);
      if (docToDate) params.append("to_date", docToDate);
      if (docSearch.trim()) params.append("search", docSearch.trim());
      if (docEmailStatus !== "all") params.append("email_status", docEmailStatus);

      const data = await apiRequest(
        `/dashboard/document-history?${params.toString()}`
      );

      setDocHistory(data.documents || []);
      setDocTotal(data.total || 0);
      setDocTotalPages(data.total_pages || 0);
      setDocHistoryError(null);
    } catch (err) {
      console.error("Error fetching document history:", err);
      if (isPermissionError(err)) {
        setDocSectionVisible(false);
      } else {
        setDocHistoryError(
          err.message || "Failed to load document history. Please try again."
        );
      }
    } finally {
      setDocHistoryLoading(false);
    }
  };

  // Fetch summary once on mount
  useEffect(() => {
    fetchDocSummary();
  }, []);

  // Debounced fetch of the listing whenever page / page size / filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDocHistory();
    }, 400);
    return () => clearTimeout(timer);
  }, [
    docPage,
    docPageSize,
    docTypeFilter,
    docEmailStatus,
    docFromDate,
    docToDate,
    docSearch,
  ]);

  // Clear row selection whenever the view changes
  useEffect(() => {
    setSelectedDocIds([]);
  }, [
    docPage,
    docPageSize,
    docTypeFilter,
    docEmailStatus,
    docFromDate,
    docToDate,
    docSearch,
  ]);

  // ============================================================
  // DOCUMENT HISTORY - FILTER HANDLERS
  // ============================================================
  const handleDocTypeFilterChange = (value) => {
    setDocTypeFilter(value);
    setDocPage(1);
    setDocPageSet(1);
  };

  const handleDocEmailStatusChange = (value) => {
    setDocEmailStatus(value);
    setDocPage(1);
    setDocPageSet(1);
  };

  const handleDocFromDateChange = (e) => {
    setDocFromDate(e.target.value);
    setDocPage(1);
    setDocPageSet(1);
  };

  const handleDocToDateChange = (e) => {
    setDocToDate(e.target.value);
    setDocPage(1);
    setDocPageSet(1);
  };

  const handleDocSearchChange = (e) => {
    setDocSearch(e.target.value);
    setDocPage(1);
    setDocPageSet(1);
  };

  const handleDocPageSizeChange = (value) => {
    setDocPageSize(Number(value));
    setDocPage(1);
    setDocPageSet(1);
  };

  const handleTypeCardClick = (typeValue) => {
    setDocTypeFilter((prev) => (prev === typeValue ? "all" : typeValue));
    setDocPage(1);
    setDocPageSet(1);
  };

  const resetDocFilters = () => {
    setDocTypeFilter("all");
    setDocEmailStatus("all");
    setDocFromDate("");
    setDocToDate("");
    setDocSearch("");
    setDocPage(1);
    setDocPageSet(1);
  };

  const hasActiveDocFilters =
    docTypeFilter !== "all" ||
    docEmailStatus !== "all" ||
    docFromDate !== "" ||
    docToDate !== "" ||
    docSearch.trim() !== "";

  // ============================================================
  // DOCUMENT HISTORY - PAGINATION
  // ============================================================
  const docPageNumbersToShow = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = (docPageSet - 1) * maxPagesToShow + 1;
    const endPage = Math.min(startPage + maxPagesToShow - 1, docTotalPages);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handleDocPageChange = (page) => {
    setDocPage(page);

    const maxPagesToShow = 5;
    const newPageSet = Math.ceil(page / maxPagesToShow);
    if (newPageSet !== docPageSet) {
      setDocPageSet(newPageSet);
    }
  };

  const handleDocNextPageSet = () => {
    const maxPagesToShow = 5;
    const newPageSet = docPageSet + 1;
    const startPage = (newPageSet - 1) * maxPagesToShow + 1;

    if (startPage <= docTotalPages) {
      setDocPageSet(newPageSet);
      setDocPage(startPage);
    }
  };

  const handleDocPrevPageSet = () => {
    const maxPagesToShow = 5;
    const newPageSet = Math.max(1, docPageSet - 1);
    const startPage = (newPageSet - 1) * maxPagesToShow + 1;

    setDocPageSet(newPageSet);
    setDocPage(startPage);
  };

  // ============================================================
  // DOCUMENT HISTORY - SELECTION
  // ============================================================
  const toggleDocSelection = (id) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllDocs = () => {
    if (docHistory.length > 0 && selectedDocIds.length === docHistory.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(docHistory.map((d) => d.id));
    }
  };

  const allDocsSelected =
    docHistory.length > 0 && selectedDocIds.length === docHistory.length;
  const someDocsSelected =
    selectedDocIds.length > 0 && selectedDocIds.length < docHistory.length;

  // ============================================================
  // DOCUMENT HISTORY - DOWNLOAD
  // ============================================================
  const openDownloadUrl = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadDoc = async (doc) => {
    setDownloadingDocId(doc.id);
    try {
      const data = await apiRequest(
        `/dashboard/document-history/${doc.id}/download`
      );

      openDownloadUrl(data.download_url);

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Download Ready</span>
          </div>
        ),
        description: (
          <div>
            <p className="text-sm">
              The archived PDF for{" "}
              <span className="font-medium">
                {doc.recipient_name || doc.document_type_label}
              </span>{" "}
              is opening in a new tab.
            </p>
            <p className="text-xs mt-1 text-blue-600 font-medium">
              Link expires in {data.expires_in_minutes} minutes
              {data.file_size_bytes
                ? ` • Size: ${formatBytes(data.file_size_bytes)}`
                : ""}
            </p>
          </div>
        ),
        className: darkMode
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-800",
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Download Failed",
        description:
          error.message ||
          "Could not generate the download link. The archived copy may no longer be available.",
        variant: "destructive",
      });
    } finally {
      setDownloadingDocId(null);
    }
  };

  // ============================================================
  // DOCUMENT HISTORY - DELETE
  // ============================================================
  const openSingleDelete = (doc) => {
    setDeleteTarget({ type: "single", doc });
    setShowDeleteDialog(true);
  };

  const openBulkDelete = () => {
    setDeleteTarget({ type: "bulk" });
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setDeleteTarget(null);
    setIsDeleting(false);
  };

  const handleDeleteDoc = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      if (deleteTarget.type === "bulk") {
        const response = await apiRequest(
          "/dashboard/document-history/bulk",
          {
            method: "DELETE",
            body: JSON.stringify({ history_ids: selectedDocIds }),
          }
        );

        let description = response.message || "Selected entries were deleted.";
        if (response.archives_deleted > 0) {
          description += ` ${response.archives_deleted} archived PDF(s) removed from storage.`;
        }
        if (
          response.orphaned_blob_paths &&
          response.orphaned_blob_paths.length > 0
        ) {
          description += ` Warning: ${response.orphaned_blob_paths.length} archive file(s) could not be removed from storage and need manual cleanup.`;
        }

        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Bulk Delete Complete</span>
            </div>
          ),
          description,
          className: darkMode
            ? "bg-gray-800 border-gray-700 text-gray-100"
            : "bg-white border-gray-200 text-gray-800",
        });

        // If we deleted every row on this page (and it is not the first
        // page), step back one page so we do not land on an empty page.
        if (docHistory.length === response.deleted && docPage > 1) {
          setDocPage(docPage - 1);
        }
      } else {
        const doc = deleteTarget.doc;
        const response = await apiRequest(
          `/dashboard/document-history/${doc.id}`,
          { method: "DELETE" }
        );

        let description = response.message || "Entry deleted successfully.";
        if (response.orphaned_blob_path) {
          description +=
            " Warning: the archived PDF could not be removed from storage and needs manual cleanup.";
        }

        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Entry Deleted</span>
            </div>
          ),
          description,
          className: darkMode
            ? "bg-gray-800 border-gray-700 text-gray-100"
            : "bg-white border-gray-200 text-gray-800",
        });

        if (docHistory.length === 1 && docPage > 1) {
          setDocPage(docPage - 1);
        }
      }

      // Cleanup and refresh
      setSelectedDocIds([]);
      closeDeleteDialog();
      fetchDocHistory();
      fetchDocSummary();
    } catch (error) {
      console.error("Error deleting document history:", error);
      toast({
        title: "Delete Failed",
        description:
          error.message ||
          "Failed to delete the history entry. Please try again.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  // ============================================================
  // DOCUMENT HISTORY - BADGE STYLE HELPERS
  // ============================================================
  const getDocTypeStyles = (type) => {
    switch (type) {
      case "proposed_offer_letter":
        return darkMode
          ? "bg-blue-900/40 text-blue-300 border border-blue-800/50"
          : "bg-blue-50 text-blue-700 border border-blue-200";
      case "appointment_letter":
        return darkMode
          ? "bg-emerald-900/40 text-emerald-300 border border-emerald-800/50"
          : "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "relieving_experience_letter":
        return darkMode
          ? "bg-purple-900/40 text-purple-300 border border-purple-800/50"
          : "bg-purple-50 text-purple-700 border border-purple-200";
      case "payslip":
        return darkMode
          ? "bg-amber-900/40 text-amber-300 border border-amber-800/50"
          : "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return darkMode
          ? "bg-gray-700 text-gray-300 border border-gray-600"
          : "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getDocTypeDotColor = (type) => {
    switch (type) {
      case "proposed_offer_letter":
        return "#3b82f6";
      case "appointment_letter":
        return "#10b981";
      case "relieving_experience_letter":
        return "#8b5cf6";
      case "payslip":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getEmailStatusStyles = (status) => {
    switch (status) {
      case "sent":
        return darkMode
          ? "bg-emerald-900/40 text-emerald-300 border border-emerald-800/50"
          : "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "failed":
        return darkMode
          ? "bg-red-900/40 text-red-300 border border-red-800/50"
          : "bg-red-50 text-red-700 border border-red-200";
      default:
        return darkMode
          ? "bg-gray-700 text-gray-300 border border-gray-600"
          : "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const EmailStatusBadge = ({ status }) => {
    const label =
      status === "sent"
        ? "Sent"
        : status === "failed"
          ? "Failed"
          : "Not Requested";
    const Icon =
      status === "sent" ? MailCheck : status === "failed" ? MailX : Mail;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getEmailStatusStyles(status)}`}
      >
        <Icon size={12} />
        {label}
      </span>
    );
  };

  // ============================================================
  // EXISTING FORM VALIDATION & HANDLERS
  // ============================================================
  const validateForm = () => {
    const errors = {};

    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required";
    } else if (formData.first_name.trim().length < 3) {
      errors.first_name = "First name must be at least 3 characters";
    }

    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required";
    }

    if (!formData.mobile_number.trim()) {
      errors.mobile_number = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile_number)) {
      errors.mobile_number = "Mobile number must be 10 digits";
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirm_password.trim()) {
      errors.confirm_password = "Please confirm your password";
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }

    if (!formData.role) {
      errors.role = "Role is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle role selection
  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
    if (formErrors.role) {
      setFormErrors((prev) => ({ ...prev, role: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest("/admin/create-user", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          send_email: sendEmail,
        }),
      });

      const newUser = response.user;
      const isEmailSent = response.email_sent;

      setUsersList((prev) => [newUser, ...prev]);

      setUserRoleData((prev) => ({
        ...prev,
        [formData.role]: (prev[formData.role] || 0) + 1,
      }));

      setFormData({
        first_name: "",
        last_name: "",
        mobile_number: "",
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        role: "",
      });
      setSendEmail(true);
      setShowCreateUserDialog(false);

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle
              className={`h-5 w-5 ${isEmailSent ? "text-green-500" : "text-orange-500"}`}
            />
            <span>User Created Successfully</span>
          </div>
        ),
        description: (
          <div>
            <p className="text-sm">{`${newUser.first_name} ${newUser.last_name} has been added as ${newUser.role.toUpperCase()}.`}</p>
            {isEmailSent ? (
              <p className="text-xs mt-1 text-green-600 font-medium flex items-center gap-1">
                ✉️ Welcome email sent to{" "}
                <span className="font-normal">{newUser.email}</span>
              </p>
            ) : (
              <p className="text-xs mt-1 text-orange-600 font-medium flex items-center gap-1">
                ⚠️ User created, but welcome email failed to send.
              </p>
            )}
          </div>
        ),
        className: darkMode
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-800",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalEmployees =
    employeeCounts.internal_employees + employeeCounts.external_employees;

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Internal Employees",
      value: employeeCounts.internal_employees,
      change: "+3%",
      changeType: "increase",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "External Employees",
      value: employeeCounts.external_employees,
      change: "+2%",
      changeType: "increase",
      icon: Users,
      color: "bg-yellow-500",
    },
    {
      title: "Performance",
      value: "92%",
      change: "+8%",
      changeType: "increase",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  const pieChartData = [
    {
      name: "Internal Employees",
      value: employeeCounts.internal_employees,
      color: "#f8a688",
      percentage:
        totalEmployees > 0
          ? (
              (employeeCounts.internal_employees / totalEmployees) *
              100
            ).toFixed(1)
          : 0,
    },
    {
      name: "External Employees",
      value: employeeCounts.external_employees,
      color: "#53c9cf",
      percentage:
        totalEmployees > 0
          ? (
              (employeeCounts.external_employees / totalEmployees) *
              100
            ).toFixed(1)
          : 0,
    },
  ];

  const genderPieData = [
    { name: "Male", value: genderCounts.Male, color: "#23989a" },
    { name: "Female", value: genderCounts.Female, color: "#d6ad3a" },
  ];

  const userRolePieData = [
    { name: "Superadmin", value: userRoleData.superadmin, color: "#10b981" },
    { name: "HR", value: userRoleData.hr, color: "#53c9cf" },
    { name: "Employee", value: userRoleData.employee, color: "#f8a688" },
  ];

  const bankAccountChartData = [
    {
      name: "Axis Bank",
      value: bankAccountData.summary.Axis_Bank_Accounts,
      color: "#E6F3FF",
      percentage:
        bankAccountData.summary.Total_Accounts > 0
          ? (
              (bankAccountData.summary.Axis_Bank_Accounts /
                bankAccountData.summary.Total_Accounts) *
              100
            ).toFixed(1)
          : 0,
    },
    {
      name: "Non-Axis Bank",
      value: bankAccountData.summary.Non_Axis_Bank_Accounts,
      color: "#FFEAD0",
      percentage:
        bankAccountData.summary.Total_Accounts > 0
          ? (
              (bankAccountData.summary.Non_Axis_Bank_Accounts /
                bankAccountData.summary.Total_Accounts) *
              100
            ).toFixed(1)
          : 0,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`p-3 shadow-lg rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <p
            className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
          >
            {data.name}
          </p>
          <p className="text-blue-600">Count: {data.value}</p>
          {data.percentage && (
            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
              Percentage: {data.percentage}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill={darkMode ? "#D1D5DB" : "#374151"}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Pagination logic for bank accounts
  const totalPages = Math.ceil(
    bankAccountData.non_axis_bank_employees.length / rowsPerPage,
  );
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentEmployees = bankAccountData.non_axis_bank_employees.slice(
    startIndex,
    endIndex,
  );

  // Users List Logic
  const sortedUsers = [...usersList].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  const filteredUsers = sortedUsers.filter((user) => {
    if (roleFilter === "All") return true;
    return user.role === roleFilter;
  });

  const totalUserPages = Math.ceil(filteredUsers.length / userRowsPerPage);

  useEffect(() => {
    setUserPage(1);
    setUserPageSet(1);
  }, [roleFilter]);

  const userStartIndex = (userPage - 1) * userRowsPerPage;
  const userEndIndex = userStartIndex + userRowsPerPage;
  const currentUsers = filteredUsers.slice(userStartIndex, userEndIndex);

  const pageNumbersToShow = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = (userPageSet - 1) * maxPagesToShow + 1;
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalUserPages);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUserPageChange = (page) => {
    setUserPage(page);

    const maxPagesToShow = 5;
    const newPageSet = Math.ceil(page / maxPagesToShow);
    if (newPageSet !== userPageSet) {
      setUserPageSet(newPageSet);
    }
  };

  const handleNextPageSet = () => {
    const maxPagesToShow = 5;
    const newPageSet = userPageSet + 1;
    const startPage = (newPageSet - 1) * maxPagesToShow + 1;

    if (startPage <= totalUserPages) {
      setUserPageSet(newPageSet);
      setUserPage(startPage);
    }
  };

  const handlePrevPageSet = () => {
    const maxPagesToShow = 5;
    const newPageSet = Math.max(1, userPageSet - 1);
    const startPage = (newPageSet - 1) * maxPagesToShow + 1;

    setUserPageSet(newPageSet);
    setUserPage(startPage);
  };

  useEffect(() => {
    if (showCreateUserDialog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showCreateUserDialog]);

  // Lock body scroll for the details / delete dialogs too
  useEffect(() => {
    if (showDetailsDialog || showDeleteDialog) {
      document.body.style.overflow = "hidden";
    } else if (!showCreateUserDialog) {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDetailsDialog, showDeleteDialog, showCreateUserDialog]);

  return (
    <div
      className={`p-6 space-y-6 min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 rounded-lg shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div>
          <h1
            className={`text-2xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
          >
            Dashboard
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div
          className={`flex items-center gap-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          <Clock size={16} />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {stat.title}
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                  >
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm mt-1 ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.change} from last month
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* User Role Distribution */}
      <Card
        className={`p-6 shadow-lg border-0 ${
          darkMode
            ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800"
            : "bg-gradient-to-br from-white via-purple-50/20 to-indigo-50/30"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3
              className={`text-xl font-bold mb-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
            >
              User Role Distribution
            </h3>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Distribution of users by role
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`text-right rounded-xl p-3 shadow-sm border ${
                darkMode
                  ? "bg-gray-700/80 border-gray-600"
                  : "bg-white/80 border-gray-100"
              }`}
            >
              <p
                className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Total Users
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
              >
                {userRoleData.superadmin +
                  userRoleData.hr +
                  userRoleData.employee}
              </p>
            </div>
            <Button
              onClick={() => setShowCreateUserDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <UserPlus size={16} />
              Create User
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-64 w-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userRolePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderLabel}
                      outerRadius={85}
                      innerRadius={0}
                      fill="#8884d8"
                      dataKey="value"
                      stroke={darkMode ? "#1F2937" : "#ffffff"}
                      strokeWidth={3}
                      paddingAngle={2}
                      isAnimationActive={true}
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {userRolePieData.map((entry, index) => (
                        <Cell
                          key={`cell-user-role-${index}`}
                          fill={entry.color}
                          stroke={darkMode ? "#1F2937" : "#ffffff"}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "transparent" }}
                      wrapperStyle={{ outline: "none", zIndex: 1000 }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="space-y-4">
            {userRolePieData.map((item, index) => (
              <div
                key={index}
                className="group hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <div
                  className={`flex items-center justify-between p-4 rounded-xl border shadow-sm ${
                    darkMode
                      ? "bg-gray-700/70 border-gray-600/50"
                      : "bg-white/70 border-gray-100/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className="w-6 h-6 rounded-full shadow-sm border-2"
                        style={{
                          backgroundColor: item.color,
                          borderColor: darkMode ? "#1F2937" : "#ffffff",
                        }}
                      ></div>
                    </div>
                    <div>
                      <span
                        className={`font-semibold text-base ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                      >
                        {item.name}
                      </span>
                      <p
                        className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Users with this role
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-2">
                      <p
                        className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                      >
                        {item.value}
                      </p>
                      <div
                        className="px-2 py-1 rounded-full text-xs font-medium text-gray-700"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.value > 0
                          ? (
                              (item.value /
                                (userRoleData.superadmin +
                                  userRoleData.hr +
                                  userRoleData.employee)) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </div>
                    </div>
                    <p
                      className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      of total users
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div
          className={`mt-6 p-4 rounded-xl border shadow-sm ${
            darkMode
              ? "bg-gray-700/80 border-gray-600/50"
              : "bg-white/80 border-gray-100/50"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h4
                className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
              >
                <Users size={20} className="text-indigo-500" />
                Users List
              </h4>
              {/* Filter Dropdown */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-white"}`}
              >
                <Filter
                  size={16}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[150px] h-8 border-0 shadow-none focus:ring-0 pl-0 text-sm">
                    <SelectValue placeholder="Filter by Role" />
                  </SelectTrigger>
                  <SelectContent
                    className={
                      darkMode
                        ? "bg-gray-800 border-gray-600 text-white"
                        : "bg-white border-gray-200"
                    }
                  >
                    <SelectItem value="All">All Roles</SelectItem>
                    <SelectItem value="superadmin">Superadmin</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <span
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {filteredUsers.length} users
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className={`border-b ${darkMode ? "border-gray-600" : "border-gray-200/50"}`}
                >
                  <th
                    className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Name
                  </th>
                  <th
                    className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Username
                  </th>
                  <th
                    className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Email
                  </th>
                  <th
                    className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Mobile
                  </th>
                  <th
                    className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Role
                  </th>
                  <th
                    className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr
                    key={index}
                    className={`border-b hover:transition-all duration-200 ${
                      darkMode
                        ? "border-gray-700/50 hover:bg-gray-700/50"
                        : "border-gray-100/50 hover:bg-gray-50/50"
                    }`}
                  >
                    <td
                      className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                    >
                      {user.first_name} {user.last_name}
                    </td>
                    <td
                      className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                    >
                      {user.username}
                    </td>
                    <td
                      className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                    >
                      {user.email}
                    </td>
                    <td
                      className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                    >
                      {user.mobile_number}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "superadmin"
                            ? "bg-green-100 text-green-700"
                            : user.role === "hr"
                              ? "bg-teal-100 text-teal-700"
                              : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                    >
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalUserPages > 1 && (
            <div
              className={`flex items-center justify-between mt-4 pt-4 border-t ${darkMode ? "border-gray-600" : "border-gray-200/50"}`}
            >
              <div
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Showing {userStartIndex + 1} to{" "}
                {Math.min(userEndIndex, filteredUsers.length)} of{" "}
                {filteredUsers.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUserPageChange(userPage - 1)}
                  disabled={userPage === 1}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                      : "border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>

                {userPageSet > 1 && (
                  <button
                    onClick={handlePrevPageSet}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    ...
                  </button>
                )}

                {pageNumbersToShow().map((page) => (
                  <button
                    key={page}
                    onClick={() => handleUserPageChange(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      userPage === page
                        ? "bg-indigo-500 text-white"
                        : darkMode
                          ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {userPageSet * 5 < totalUserPages && (
                  <button
                    onClick={handleNextPageSet}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    ...
                  </button>
                )}

                <button
                  onClick={() => handleUserPageChange(userPage + 1)}
                  disabled={userPage === totalUserPages}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                      : "border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* ============================================================ */}
      {/* ============ DOCUMENT DISPATCH HISTORY SECTION ============= */}
      {/* ============================================================ */}
      {docSectionVisible && (
        <Card
          className={`p-6 shadow-lg border-0 ${
            darkMode
              ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800"
              : "bg-gradient-to-br from-white via-teal-50/20 to-blue-50/30"
          }`}
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h3
                className={`text-xl font-bold mb-1 flex items-center gap-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
              >
                <History size={22} className="text-teal-500" />
                Document Dispatch History
              </h3>
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Every offer letter, appointment letter, relieving letter and
                payslip dispatched by the HR team
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`text-right rounded-xl p-3 shadow-sm border ${
                  darkMode
                    ? "bg-gray-700/80 border-gray-600"
                    : "bg-white/80 border-gray-100"
                }`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Last Dispatch
                </p>
                <p
                  className={`text-sm font-bold mt-1 ${darkMode ? "text-teal-400" : "text-teal-600"}`}
                >
                  {docSummaryLoading
                    ? "Loading…"
                    : docSummary?.last_dispatch_at
                      ? formatISTDateTime(docSummary.last_dispatch_at)
                      : "No dispatches yet"}
                </p>
              </div>
              <Button
                onClick={() => {
                  fetchDocHistory();
                  fetchDocSummary();
                }}
                variant="outline"
                className={`flex items-center gap-2 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:text-white"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                disabled={docHistoryLoading || docSummaryLoading}
              >
                <RefreshCw
                  size={16}
                  className={
                    docHistoryLoading || docSummaryLoading
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {/* Total Documents */}
            <div
              className={`p-4 rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md ${
                darkMode
                  ? "bg-gray-700/70 border-gray-600/50"
                  : "bg-white/80 border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Total Documents
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                  >
                    {docSummaryLoading
                      ? "…"
                      : (docSummary?.total_documents ?? 0)}
                  </p>
                  <p
                    className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    All-time dispatches
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center shadow-sm">
                  <FileText size={20} className="text-white" />
                </div>
              </div>
            </div>

            {/* Documents This Month */}
            <div
              className={`p-4 rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md ${
                darkMode
                  ? "bg-gray-700/70 border-gray-600/50"
                  : "bg-white/80 border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    This Month
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                  >
                    {docSummaryLoading
                      ? "…"
                      : (docSummary?.documents_this_month ?? 0)}
                  </p>
                  <p
                    className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Documents dispatched
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm">
                  <CalendarDays size={20} className="text-white" />
                </div>
              </div>
            </div>

            {/* Emails Failed */}
            <div
              className={`p-4 rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md ${
                darkMode
                  ? "bg-gray-700/70 border-gray-600/50"
                  : "bg-white/80 border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Emails Failed
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${
                      (docSummary?.emails_failed ?? 0) > 0
                        ? "text-red-500"
                        : darkMode
                          ? "text-gray-100"
                          : "text-gray-800"
                    }`}
                  >
                    {docSummaryLoading ? "…" : (docSummary?.emails_failed ?? 0)}
                  </p>
                  <p
                    className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Delivery failures
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                    (docSummary?.emails_failed ?? 0) > 0
                      ? "bg-red-500"
                      : "bg-gray-400"
                  }`}
                >
                  <MailX size={20} className="text-white" />
                </div>
              </div>
            </div>

            {/* Downloadable Archives */}
            <div
              className={`p-4 rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md ${
                darkMode
                  ? "bg-gray-700/70 border-gray-600/50"
                  : "bg-white/80 border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Archived PDFs
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                  >
                    {docHistoryLoading
                      ? "…"
                      : docHistory.filter((d) => d.has_archive).length}
                    <span
                      className={`text-sm font-medium ml-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      / {docHistory.length} on page
                    </span>
                  </p>
                  <p
                    className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Re-downloadable copies
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center shadow-sm">
                  <HardDrive size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Per-Type Breakdown Cards (clickable to filter) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {DOC_TYPE_OPTIONS.map((typeOption) => {
              const typeStats = docSummary?.by_type?.find(
                (b) => b.document_type === typeOption.value
              );
              const total = typeStats?.total ?? 0;
              const thisMonth = typeStats?.this_month ?? 0;
              const isActive = docTypeFilter === typeOption.value;

              return (
                <button
                  key={typeOption.value}
                  onClick={() => handleTypeCardClick(typeOption.value)}
                  className={`text-left p-4 rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${
                    isActive
                      ? darkMode
                        ? "bg-teal-900/30 border-teal-600 ring-2 ring-teal-500/50"
                        : "bg-teal-50 border-teal-400 ring-2 ring-teal-500/30"
                      : darkMode
                        ? "bg-gray-700/70 border-gray-600/50"
                        : "bg-white/80 border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                      style={{
                        backgroundColor: `${getDocTypeDotColor(typeOption.value)}20`,
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: getDocTypeDotColor(typeOption.value),
                        }}
                      ></div>
                    </div>
                    <p
                      className={`text-sm font-semibold leading-tight ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {typeOption.label}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                      >
                        {docSummaryLoading ? "…" : total}
                      </p>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        total dispatched
                      </p>
                    </div>
                    {thisMonth > 0 && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          darkMode
                            ? "bg-emerald-900/40 text-emerald-300"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        +{thisMonth} this month
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <p
                      className={`text-xs mt-2 font-medium ${darkMode ? "text-teal-400" : "text-teal-600"}`}
                    >
                      Filter active — click again to clear
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Filters Bar */}
          <div
            className={`p-4 rounded-xl border shadow-sm mb-4 ${
              darkMode
                ? "bg-gray-700/80 border-gray-600/50"
                : "bg-white/80 border-gray-100/50"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Filter
                size={16}
                className={darkMode ? "text-gray-400" : "text-gray-500"}
              />
              <h4
                className={`text-sm font-semibold uppercase tracking-wide ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Filters
              </h4>
              {hasActiveDocFilters && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    darkMode
                      ? "bg-teal-900/40 text-teal-300"
                      : "bg-teal-50 text-teal-700"
                  }`}
                >
                  Active
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative">
                <Search
                  size={16}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-400"}`}
                />
                <input
                  type="text"
                  value={docSearch}
                  onChange={handleDocSearchChange}
                  placeholder="Search name, emp ID, email…"
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-teal-500/50 ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500"
                      : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                  }`}
                />
              </div>

              {/* Document Type */}
              <Select
                value={docTypeFilter}
                onValueChange={handleDocTypeFilterChange}
              >
                <SelectTrigger
                  className={`w-full h-9 text-sm ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-gray-200"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                >
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent
                  className={
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-200"
                  }
                >
                  <SelectItem value="all">All Document Types</SelectItem>
                  {DOC_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Email Status */}
              <Select
                value={docEmailStatus}
                onValueChange={handleDocEmailStatusChange}
              >
                <SelectTrigger
                  className={`w-full h-9 text-sm ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-gray-200"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                >
                  <SelectValue placeholder="Email Status" />
                </SelectTrigger>
                <SelectContent
                  className={
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-200"
                  }
                >
                  <SelectItem value="all">All Email Statuses</SelectItem>
                  {EMAIL_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* From Date */}
              <div>
                <label
                  className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  From Date
                </label>
                <input
                  type="date"
                  value={docFromDate}
                  onChange={handleDocFromDateChange}
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-teal-500/50 ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-gray-200 [color-scheme:dark]"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>

              {/* To Date */}
              <div>
                <label
                  className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  To Date
                </label>
                <input
                  type="date"
                  value={docToDate}
                  onChange={handleDocToDateChange}
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-teal-500/50 ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-gray-200 [color-scheme:dark]"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <p
                className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {docTotal} document{docTotal === 1 ? "" : "s"} match the
                current filters
              </p>
              {hasActiveDocFilters && (
                <Button
                  onClick={resetDocFilters}
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-1 h-8 text-xs ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <RotateCcw size={12} />
                  Reset Filters
                </Button>
              )}
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedDocIds.length > 0 && (
            <div
              className={`flex items-center justify-between p-3 rounded-xl border mb-4 ${
                darkMode
                  ? "bg-red-900/20 border-red-800/50"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                  <Trash2 size={16} className="text-white" />
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                  >
                    {selectedDocIds.length} entr
                    {selectedDocIds.length === 1 ? "y" : "ies"} selected
                  </p>
                  <p
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Deleting also removes the archived PDFs from storage
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setSelectedDocIds([])}
                  variant="outline"
                  size="sm"
                  className={`h-8 text-xs ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Clear Selection
                </Button>
                <Button
                  onClick={openBulkDelete}
                  size="sm"
                  className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Delete Selected
                </Button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {docHistoryError && (
            <div
              className={`flex items-center justify-between p-4 rounded-xl border mb-4 ${
                darkMode
                  ? "bg-orange-900/20 border-orange-800/50"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle
                  size={20}
                  className={darkMode ? "text-orange-400" : "text-orange-500"}
                />
                <p
                  className={`text-sm ${darkMode ? "text-orange-300" : "text-orange-700"}`}
                >
                  {docHistoryError}
                </p>
              </div>
              <Button
                onClick={() => fetchDocHistory()}
                variant="outline"
                size="sm"
                className={`h-8 text-xs ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "bg-white border-orange-200 text-orange-700 hover:bg-orange-50"
                }`}
              >
                <RefreshCw size={12} className="mr-1" />
                Retry
              </Button>
            </div>
          )}

          {/* Documents Table */}
          <div
            className={`rounded-xl border shadow-sm overflow-hidden ${
              darkMode
                ? "bg-gray-700/80 border-gray-600/50"
                : "bg-white/80 border-gray-100/50"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr
                    className={`border-b ${darkMode ? "border-gray-600 bg-gray-800/60" : "border-gray-200/50 bg-gray-50/60"}`}
                  >
                    <th className="text-left py-3 px-3 w-10">
                      <input
                        type="checkbox"
                        checked={allDocsSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someDocsSelected;
                        }}
                        onChange={toggleSelectAllDocs}
                        disabled={docHistory.length === 0}
                        className="w-4 h-4 rounded accent-teal-600 cursor-pointer"
                        aria-label="Select all documents on this page"
                      />
                    </th>
                    <th
                      className={`text-left py-3 px-3 font-medium whitespace-nowrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Document
                    </th>
                    <th
                      className={`text-left py-3 px-3 font-medium whitespace-nowrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Recipient
                    </th>
                    <th
                      className={`text-left py-3 px-3 font-medium whitespace-nowrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Emails
                    </th>
                    <th
                      className={`text-left py-3 px-3 font-medium whitespace-nowrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Email Status
                    </th>
                    <th
                      className={`text-right py-3 px-3 font-medium whitespace-nowrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Loading Skeleton Rows */}
                  {docHistoryLoading && docHistory.length === 0 && (
                    <>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <tr
                          key={`skeleton-${i}`}
                          className={`border-b ${darkMode ? "border-gray-700/50" : "border-gray-100/50"}`}
                        >
                          {Array.from({ length: 6 }).map((__, j) => (
                            <td key={`sk-${i}-${j}`} className="py-4 px-3">
                              <div
                                className={`h-4 rounded animate-pulse ${darkMode ? "bg-gray-600/50" : "bg-gray-200/70"}`}
                              ></div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  )}

                  {/* Empty State */}
                  {!docHistoryLoading && docHistory.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 px-4">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                              darkMode ? "bg-gray-600/50" : "bg-gray-100"
                            }`}
                          >
                            <FileText
                              size={28}
                              className={
                                darkMode ? "text-gray-400" : "text-gray-400"
                              }
                            />
                          </div>
                          <p
                            className={`text-base font-semibold mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                          >
                            No documents found
                          </p>
                          <p
                            className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {hasActiveDocFilters
                              ? "No dispatches match the current filters. Try adjusting or resetting them."
                              : "No documents have been dispatched yet."}
                          </p>
                          {hasActiveDocFilters && (
                            <Button
                              onClick={resetDocFilters}
                              variant="outline"
                              size="sm"
                              className={`flex items-center gap-1 ${
                                darkMode
                                  ? "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              <RotateCcw size={14} />
                              Reset Filters
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Data Rows */}
                  {!docHistoryLoading &&
                    docHistory.map((doc) => (
                      <tr
                        key={doc.id}
                        className={`border-b transition-all duration-200 ${
                          darkMode
                            ? "border-gray-700/50 hover:bg-gray-700/50"
                            : "border-gray-100/50 hover:bg-teal-50/40"
                        } ${
                          selectedDocIds.includes(doc.id)
                            ? darkMode
                              ? "bg-teal-900/20"
                              : "bg-teal-50/50"
                            : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={selectedDocIds.includes(doc.id)}
                            onChange={() => toggleDocSelection(doc.id)}
                            className="w-4 h-4 rounded accent-teal-600 cursor-pointer"
                            aria-label={`Select document ${doc.id}`}
                          />
                        </td>

                        {/* Document Type */}
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getDocTypeStyles(doc.document_type)}`}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: getDocTypeDotColor(
                                  doc.document_type
                                ),
                              }}
                            ></span>
                            {doc.document_type_label}
                          </span>
                        </td>

                        {/* Recipient */}
                        <td className="py-3 px-3 max-w-[150px]">
                          <div className="flex flex-col">
                            <span
                              className={`font-medium truncate ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                              title={doc.recipient_name || ""}
                            >
                              {doc.recipient_name || "—"}
                            </span>
                            {doc.employee_id && (
                              <span
                                className={`text-xs truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                title={doc.employee_id}
                              >
                                {doc.employee_id}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Emails */}
                        <td className="py-3 px-3 max-w-[150px]">
                          {doc.to_emails ? (
                            <span
                              className={`block truncate text-xs ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                              title={`To: ${doc.to_emails}${doc.cc_emails ? ` | CC: ${doc.cc_emails}` : ""}${doc.bcc_emails ? ` | BCC: ${doc.bcc_emails}` : ""}`}
                            >
                              {doc.to_emails}
                              {doc.recipient_count > 1 && (
                                <span
                                  className={`ml-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                                >
                                  (+{doc.recipient_count - 1})
                                </span>
                              )}
                            </span>
                          ) : (
                            <span
                              className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                            >
                              —
                            </span>
                          )}
                        </td>

                        {/* Email Status */}
                        <td className="py-3 px-3">
                          <EmailStatusBadge status={doc.email_status} />
                        </td>

                        {/* Actions: View / Download / Delete */}
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-end gap-1">
                            {/* View Details */}
                            <button
                              onClick={() => {
                                setDetailsDoc(doc);
                                setShowDetailsDialog(true);
                              }}
                              title="View details"
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                darkMode
                                  ? "text-gray-400 hover:text-blue-400 hover:bg-gray-600/50"
                                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                              }`}
                            >
                              <Eye size={16} />
                            </button>

                            {/* Download */}
                            <button
                              onClick={() => handleDownloadDoc(doc)}
                              disabled={!doc.has_archive}
                              title={
                                doc.has_archive
                                  ? `Download the exact PDF that was sent${doc.file_size_bytes ? ` (${formatBytes(doc.file_size_bytes)})` : ""}`
                                  : "No archived copy available for download"
                              }
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                !doc.has_archive
                                  ? darkMode
                                    ? "text-gray-600 cursor-not-allowed"
                                    : "text-gray-300 cursor-not-allowed"
                                  : darkMode
                                    ? "text-gray-400 hover:text-teal-400 hover:bg-gray-600/50"
                                    : "text-gray-500 hover:text-teal-600 hover:bg-teal-50"
                              }`}
                            >
                              {downloadingDocId === doc.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Download size={16} />
                              )}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => openSingleDelete(doc)}
                              title="Delete this entry"
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                darkMode
                                  ? "text-gray-400 hover:text-red-400 hover:bg-gray-600/50"
                                  : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                              }`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div
              className={`flex items-center justify-between p-4 border-t flex-wrap gap-3 ${
                darkMode
                  ? "border-gray-600 bg-gray-800/40"
                  : "border-gray-200/50 bg-gray-50/40"
              }`}
            >
              <div className="flex items-center gap-4 flex-wrap">
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {docTotal > 0
                    ? `Showing ${(docPage - 1) * docPageSize + 1} to ${Math.min(docPage * docPageSize, docTotal)} of ${docTotal} entries`
                    : "No entries"}
                </p>
                {/* Page Size Selector */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Rows per page:
                  </span>
                  <Select
                    value={String(docPageSize)}
                    onValueChange={handleDocPageSizeChange}
                  >
                    <SelectTrigger
                      className={`w-[70px] h-8 text-xs ${
                        darkMode
                          ? "bg-gray-800 border-gray-600 text-gray-200"
                          : "bg-white border-gray-200 text-gray-800"
                      }`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      className={
                        darkMode
                          ? "bg-gray-800 border-gray-600 text-white"
                          : "bg-white border-gray-200"
                      }
                    >
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {docTotalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDocPageChange(docPage - 1)}
                    disabled={docPage === 1}
                    className={`p-2 rounded-lg border transition-all duration-200 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                        : "border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {docPageSet > 1 && (
                    <button
                      onClick={handleDocPrevPageSet}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                        darkMode
                          ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      ...
                    </button>
                  )}

                  {docPageNumbersToShow().map((page) => (
                    <button
                      key={page}
                      onClick={() => handleDocPageChange(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                        docPage === page
                          ? "bg-teal-500 text-white"
                          : darkMode
                            ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
                            : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {docPageSet * 5 < docTotalPages && (
                    <button
                      onClick={handleDocNextPageSet}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                        darkMode
                          ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      ...
                    </button>
                  )}

                  <button
                    onClick={() => handleDocPageChange(docPage + 1)}
                    disabled={docPage === docTotalPages}
                    className={`p-2 rounded-lg border transition-all duration-200 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                        : "border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Employee Distribution and Gender Distribution Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Distribution Pie Chart */}
        <Card
          className={`p-6 shadow-lg border-0 ${
            darkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-700"
              : "bg-gradient-to-br from-white to-blue-50/30"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className={`text-xl font-bold mb-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
              >
                Employee Distribution
              </h3>
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Internal vs External workforce breakdown
              </p>
            </div>
            <div
              className={`text-right rounded-xl p-3 shadow-sm border ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-100"
              }`}
            >
              <p
                className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Total Employees
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              >
                {totalEmployees}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="h-64 w-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderLabel}
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      stroke={darkMode ? "#1F2937" : "#ffffff"}
                      strokeWidth={3}
                      paddingAngle={0}
                      isAnimationActive={true}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "transparent" }}
                      wrapperStyle={{ outline: "none", zIndex: 1000 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Center Label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className={`text-center rounded-full p-3 shadow-sm border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <p
                    className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Total
                  </p>
                  <p
                    className={`text-xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                  >
                    {totalEmployees}
                  </p>
                  <p
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Employees
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="mt-6 space-y-3">
            {pieChartData.map((item, index) => (
              <div
                key={index}
                className="group hover:shadow-md transition-all duration-300"
              >
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border shadow-sm ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="w-5 h-5 rounded-full shadow-sm border-2"
                        style={{
                          backgroundColor: item.color,
                          borderColor: darkMode ? "#1F2937" : "#ffffff",
                        }}
                      ></div>
                    </div>
                    <div>
                      <span
                        className={`font-semibold text-sm ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                      >
                        {item.name}
                      </span>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Active employees
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-2">
                      <p
                        className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                      >
                        {item.value}
                      </p>
                      <div
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.percentage}%
                      </div>
                    </div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      of workforce
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Gender Distribution Chart (Full Pie) */}
        <Card className={`p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className={`text-xl font-bold mb-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
              >
                Gender Distribution
              </h3>
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Employee gender breakdown
              </p>
            </div>
            <div
              className={`text-right rounded-xl p-3 shadow-sm border ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-100"
              }`}
            >
              <p
                className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Total Employees
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              >
                {genderCounts.Total_Employees}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={80}
                    innerRadius={0}
                    dataKey="value"
                    stroke={darkMode ? "#1F2937" : "#ffffff"}
                    strokeWidth={3}
                  >
                    {genderPieData.map((entry, index) => (
                      <Cell key={`cell-gender-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="mt-6 space-y-3">
            {genderPieData.map((item, index) => (
              <div
                key={index}
                className="group hover:shadow-md transition-all duration-300"
              >
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border shadow-sm ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="w-5 h-5 rounded-full shadow-sm border-2"
                        style={{
                          backgroundColor: item.color,
                          borderColor: darkMode ? "#1F2937" : "#ffffff",
                        }}
                      ></div>
                    </div>
                    <div>
                      <span
                        className={`font-semibold text-sm ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                      >
                        {item.name}
                      </span>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Employees
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-2">
                      <p
                        className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                      >
                        {item.value}
                      </p>
                      <div
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        {genderCounts.Total_Employees > 0
                          ? (
                              (item.value / genderCounts.Total_Employees) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </div>
                    </div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      of total
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bank Account Distribution */}
      <Card
        className={`p-6 shadow-lg border-0 ${
          darkMode
            ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800"
            : "bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3
              className={`text-xl font-bold mb-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
            >
              Bank Account Distribution
            </h3>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Axis Bank vs Non-Axis Bank accounts
            </p>
          </div>
          <div
            className={`text-right rounded-xl p-3 shadow-sm border ${
              darkMode
                ? "bg-gray-700/80 border-gray-600"
                : "bg-white/80 border-gray-100"
            }`}
          >
            <p
              className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Total Accounts
            </p>
            <p
              className={`text-2xl font-bold mt-1 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
            >
              {bankAccountData.summary.Total_Accounts}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ring Chart */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-64 w-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bankAccountChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderLabel}
                      outerRadius={85}
                      innerRadius={65}
                      fill="#8884d8"
                      dataKey="value"
                      stroke={darkMode ? "#1F2937" : "#ffffff"}
                      strokeWidth={4}
                      paddingAngle={2}
                      isAnimationActive={true}
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {bankAccountChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke={darkMode ? "#1F2937" : "#ffffff"}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "transparent" }}
                      wrapperStyle={{ outline: "none", zIndex: 1000 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Center Label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className={`text-center rounded-full p-3 shadow-sm border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <p
                    className={`text-xs font-medium uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Total
                  </p>
                  <p
                    className={`text-xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                  >
                    {bankAccountData.summary.Total_Accounts}
                  </p>
                  <p
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Accounts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="space-y-3">
            {bankAccountChartData.map((item, index) => (
              <div
                key={index}
                className="group hover:shadow-md transition-all duration-300"
              >
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border shadow-sm ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="w-5 h-5 rounded-full shadow-sm border-2"
                        style={{
                          backgroundColor: item.color,
                          borderColor: darkMode ? "#1F2937" : "#ffffff",
                        }}
                      ></div>
                    </div>
                    <div>
                      <span
                        className={`font-semibold text-sm ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                      >
                        {item.name}
                      </span>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Bank accounts
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-2">
                      <p
                        className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                      >
                        {item.value}
                      </p>
                      <div
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: item.color,
                          color: index === 0 ? "#2563eb" : "#b45309",
                        }}
                      >
                        {item.percentage}%
                      </div>
                    </div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      of total accounts
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Non-Axis Bank Employees Table Toggle */}
        <div className="mt-6">
          <button
            onClick={() => setShowNonAxisTable(!showNonAxisTable)}
            className={`flex items-center justify-between w-full p-4 rounded-xl border transition-all duration-200 ${
              darkMode
                ? "bg-gray-700/70 border-gray-600/50 hover:bg-gray-700"
                : "bg-white/80 border-gray-100/50 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Building size={20} className="text-indigo-500" />
              <div className="text-left">
                <p
                  className={`font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                >
                  Non-Axis Bank Employees
                </p>
                <p
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {bankAccountData.non_axis_bank_employees.length} employees
                  with accounts in other banks
                </p>
              </div>
            </div>
            {showNonAxisTable ? (
              <ChevronUp
                size={20}
                className={darkMode ? "text-gray-400" : "text-gray-500"}
              />
            ) : (
              <ChevronDown
                size={20}
                className={darkMode ? "text-gray-400" : "text-gray-500"}
              />
            )}
          </button>

          {showNonAxisTable && (
            <div
              className={`mt-4 p-4 rounded-xl border shadow-sm ${
                darkMode
                  ? "bg-gray-700/80 border-gray-600/50"
                  : "bg-white/80 border-gray-100/50"
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      className={`border-b ${darkMode ? "border-gray-600" : "border-gray-200/50"}`}
                    >
                      <th
                        className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Employee ID
                      </th>
                      <th
                        className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Name
                      </th>
                      <th
                        className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Bank Name
                      </th>
                      <th
                        className={`text-left py-3 px-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Account Number
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEmployees.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className={`py-8 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          No non-Axis bank employees found.
                        </td>
                      </tr>
                    )}
                    {currentEmployees.map((emp, index) => (
                      <tr
                        key={index}
                        className={`border-b hover:transition-all duration-200 ${
                          darkMode
                            ? "border-gray-700/50 hover:bg-gray-700/50"
                            : "border-gray-100/50 hover:bg-gray-50/50"
                        }`}
                      >
                        <td
                          className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                        >
                          {emp.employee_id || emp.id || "—"}
                        </td>
                        <td
                          className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                        >
                          {emp.employee_name ||
                            emp.name ||
                            emp.full_name ||
                            "—"}
                        </td>
                        <td
                          className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                        >
                          {emp.bank_name || emp.bank || "—"}
                        </td>
                        <td
                          className={`py-3 px-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                        >
                          {emp.account_number || emp.account_no || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div
                  className={`flex items-center justify-between mt-4 pt-4 border-t ${darkMode ? "border-gray-600" : "border-gray-200/50"}`}
                >
                  <div
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, bankAccountData.non_axis_bank_employees.length)}{" "}
                    of {bankAccountData.non_axis_bank_employees.length} entries
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border transition-all duration-200 ${
                        darkMode
                          ? "border-gray-600 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                          : "border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
                      }`}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === page
                              ? "bg-indigo-500 text-white"
                              : darkMode
                                ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
                                : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg border transition-all duration-200 ${
                        darkMode
                          ? "border-gray-600 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                          : "border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
                      }`}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* ============================================================ */}
      {/* ============ CREATE USER DIALOG ============ */}
      {/* ============================================================ */}
      {showCreateUserDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateUserDialog(false)}
          />
          <div
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Header */}
            <div
              className={`sticky top-0 flex items-center justify-between p-6 border-b z-10 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <UserPlus className="text-white" size={20} />
                </div>
                <div>
                  <h3
                    className={`text-xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                  >
                    Create New User
                  </h3>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Add a new user with a specific role
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateUserDialog(false)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <Label
                    className={`mb-1.5 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className={
                      formErrors.first_name
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }
                  />
                  {formErrors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.first_name}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <Label
                    className={`mb-1.5 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className={
                      formErrors.last_name
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }
                  />
                  {formErrors.last_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.last_name}
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <Label
                    className={`mb-1.5 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Mobile Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    className={
                      formErrors.mobile_number
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }
                  />
                  {formErrors.mobile_number && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.mobile_number}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <Label
                    className={`mb-1.5 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Username <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                    className={
                      formErrors.username
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }
                  />
                  {formErrors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.username}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <Label
                  className={`mb-1.5 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={
                    formErrors.email ? "border-red-500 focus:ring-red-500" : ""
                  }
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <Label
                    className={`mb-1.5 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className={`pr-10 ${formErrors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <Label
                    className={`mb-1.5 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className={`pr-10 ${formErrors.confirm_password ? "border-red-500 focus:ring-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {formErrors.confirm_password && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.confirm_password}
                    </p>
                  )}
                </div>
              </div>

              {/* Role */}
              <div>
                <Label
                  className={`mb-1.5 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger
                    className={`w-full ${formErrors.role ? "border-red-500" : ""} ${darkMode ? "bg-gray-800 border-gray-600 text-gray-200" : "bg-white border-gray-200"}`}
                  >
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent
                    className={
                      darkMode
                        ? "bg-gray-800 border-gray-600 text-white"
                        : "bg-white border-gray-200"
                    }
                  >
                    <SelectItem value="superadmin">Superadmin</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.role && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.role}
                  </p>
                )}
              </div>

              {/* Send Email Preference */}
              <div
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  darkMode
                    ? "bg-gray-700/50 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-blue-500" />
                  <div>
                    <p
                      className={`font-medium text-sm ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                    >
                      Send Welcome Email
                    </p>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Email the login credentials to the new user
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSendEmail(!sendEmail)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    sendEmail ? "bg-blue-600" : darkMode ? "bg-gray-600" : "bg-gray-300"
                  }`}
                  aria-pressed={sendEmail}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      sendEmail ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateUserDialog(false)}
                  className={
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 min-w-[140px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating…
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Create User
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ============ DOCUMENT DETAILS DIALOG ============ */}
      {/* ============================================================ */}
      {showDetailsDialog && detailsDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowDetailsDialog(false);
              setDetailsDoc(null);
            }}
          />
          <div
            className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Header */}
            <div
              className={`sticky top-0 flex items-center justify-between p-6 border-b z-10 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${getDocTypeDotColor(detailsDoc.document_type)}20`,
                  }}
                >
                  <FileText
                    size={20}
                    style={{ color: getDocTypeDotColor(detailsDoc.document_type) }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {detailsDoc.document_type_label}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}
                    >
                      #{detailsDoc.id}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Dispatched to {detailsDoc.recipient_name || "unknown recipient"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDetailsDialog(false);
                  setDetailsDoc(null);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Recipient Section */}
              <div>
                <h4
                  className={`text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  <User size={14} />
                  Recipient
                </h4>
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border ${darkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}`}
                >
                  <div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Recipient Name
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {detailsDoc.recipient_name || "—"}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Employee ID
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {detailsDoc.employee_id || "—"}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      To
                    </p>
                    <p
                      className={`font-medium break-words ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {detailsDoc.to_emails || "—"}
                    </p>
                  </div>
                  {detailsDoc.cc_emails && (
                    <div className="sm:col-span-2">
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        CC
                      </p>
                      <p
                        className={`font-medium break-words ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                      >
                        {detailsDoc.cc_emails}
                      </p>
                    </div>
                  )}
                  {detailsDoc.bcc_emails && (
                    <div className="sm:col-span-2">
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        BCC
                      </p>
                      <p
                        className={`font-medium break-words ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                      >
                        {detailsDoc.bcc_emails}
                      </p>
                    </div>
                  )}
                  <div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Total Recipients
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {detailsDoc.recipient_count}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Delivery Section */}
              <div>
                <h4
                  className={`text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  <Send size={14} />
                  Email Delivery
                </h4>
                <div
                  className={`p-4 rounded-xl border ${darkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <EmailStatusBadge status={detailsDoc.email_status} />
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {detailsDoc.email_status === "sent"
                        ? "The email was delivered successfully at dispatch time."
                        : detailsDoc.email_status === "failed"
                          ? "Recipients were supplied but the email could not be sent."
                          : "No email was requested for this document."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Terms Section */}
              <div>
                <h4
                  className={`text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  <Info size={14} />
                  Document Terms
                </h4>
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-xl border ${darkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}`}
                >
                  <div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Designation
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {detailsDoc.designation || "—"}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Annual CTC
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {detailsDoc.annual_ctc != null
                        ? `${formatCurrency(detailsDoc.annual_ctc)} (${formatCTC(detailsDoc.annual_ctc)})`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Date of Joining
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {formatDateOnly(detailsDoc.date_of_joining)}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Relieving Date
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {formatDateOnly(detailsDoc.relieving_date)}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Client Name
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {detailsDoc.client_name || "—"}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Reference Number
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {detailsDoc.reference_number || "—"}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Payslip Period
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {formatPayslipPeriod(
                        detailsDoc.payslip_month,
                        detailsDoc.payslip_year
                      )}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Net Salary
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {detailsDoc.net_salary != null
                        ? formatCurrency(detailsDoc.net_salary)
                        : "—"}
                    </p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Key Details Summary
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {detailsDoc.key_details || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dispatch Info Section */}
              <div>
                <h4
                  className={`text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  <History size={14} />
                  Dispatch Info
                </h4>
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border ${darkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}`}
                >
                  <div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Generated By
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {detailsDoc.generated_by || "—"}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Generated At (IST)
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    >
                      {formatISTDateTime(detailsDoc.generated_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Archive Section */}
              <div>
                <h4
                  className={`text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  <HardDrive size={14} />
                  Archived Copy
                </h4>
                <div
                  className={`p-4 rounded-xl border ${detailsDoc.has_archive ? (darkMode ? "bg-teal-900/20 border-teal-800/50" : "bg-teal-50 border-teal-200") : darkMode ? "bg-orange-900/20 border-orange-800/50" : "bg-orange-50 border-orange-200"}`}
                >
                  {detailsDoc.has_archive ? (
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <HardDrive
                          size={20}
                          className={
                            darkMode ? "text-teal-400" : "text-teal-600"
                          }
                        />
                        <div>
                          <p
                            className={`font-medium text-sm ${darkMode ? "text-teal-300" : "text-teal-700"}`}
                          >
                            Archived PDF available
                          </p>
                          <p
                            className={`text-xs ${darkMode ? "text-teal-400/80" : "text-teal-600"}`}
                          >
                            {detailsDoc.file_size_bytes
                              ? `Size: ${formatBytes(detailsDoc.file_size_bytes)}`
                              : "Exact copy of what was sent"}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownloadDoc(detailsDoc)}
                        disabled={downloadingDocId === detailsDoc.id}
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
                      >
                        {downloadingDocId === detailsDoc.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}
                        Download PDF
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        size={20}
                        className={
                          darkMode ? "text-orange-400" : "text-orange-500"
                        }
                      />
                      <div>
                        <p
                          className={`font-medium text-sm ${darkMode ? "text-orange-300" : "text-orange-700"}`}
                        >
                          No archived copy available
                        </p>
                        {detailsDoc.archive_error ? (
                          <p
                            className={`text-xs ${darkMode ? "text-orange-400/80" : "text-orange-600"}`}
                          >
                            Archive error: {detailsDoc.archive_error}
                          </p>
                        ) : (
                          <p
                            className={`text-xs ${darkMode ? "text-orange-400/80" : "text-orange-600"}`}
                          >
                            The exact PDF sent for this entry cannot be
                            re-downloaded.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`sticky bottom-0 flex items-center justify-end gap-3 p-4 border-t ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <Button
                onClick={() => {
                  const doc = detailsDoc;
                  setShowDetailsDialog(false);
                  setDetailsDoc(null);
                  openSingleDelete(doc);
                }}
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-red-400 hover:bg-gray-600 hover:text-red-300"
                    : "bg-white border-gray-200 text-red-600 hover:bg-red-50"
                }`}
              >
                <Trash2 size={14} />
                Delete Entry
              </Button>
              <Button
                onClick={() => {
                  setShowDetailsDialog(false);
                  setDetailsDoc(null);
                }}
                size="sm"
                className={`${
                  darkMode
                    ? "bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ============ DELETE CONFIRMATION DIALOG ============ */}
      {/* ============================================================ */}
      {showDeleteDialog && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={!isDeleting ? closeDeleteDialog : undefined}
          />
          <div
            className={`relative w-full max-w-md rounded-2xl shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="p-6">
              {/* Icon */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert size={24} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                  >
                    {deleteTarget.type === "bulk"
                      ? `Delete ${selectedDocIds.length} Document History ${selectedDocIds.length === 1 ? "Entry" : "Entries"}?`
                      : "Delete Document History Entry?"}
                  </h3>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Warning Body */}
              <div
                className={`p-4 rounded-xl border mb-4 ${
                  darkMode
                    ? "bg-red-900/20 border-red-800/50"
                    : "bg-red-50 border-red-200"
                }`}
              >
                {deleteTarget.type === "single" && deleteTarget.doc && (
                  <div className="mb-3">
                    <p
                      className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                    >
                      {deleteTarget.doc.document_type_label}
                      {deleteTarget.doc.recipient_name
                        ? ` — ${deleteTarget.doc.recipient_name}`
                        : ""}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      #{deleteTarget.doc.id} • Dispatched{" "}
                      {formatISTDateTime(deleteTarget.doc.generated_at)}
                    </p>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    size={16}
                    className={`mt-0.5 flex-shrink-0 ${darkMode ? "text-orange-400" : "text-orange-500"}`}
                  />
                  <p
                    className={`text-sm leading-relaxed ${darkMode ? "text-orange-300" : "text-orange-700"}`}
                  >
                    This permanently removes the dispatch record
                    {deleteTarget.type === "bulk" ? "s" : ""} and the archived
                    PDF{deleteTarget.type === "bulk" ? "s" : ""} from storage.
                    The audit trail for these documents cannot be recovered.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <Button
                  onClick={closeDeleteDialog}
                  disabled={isDeleting}
                  variant="outline"
                  className={
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteDoc}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 min-w-[120px]"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}