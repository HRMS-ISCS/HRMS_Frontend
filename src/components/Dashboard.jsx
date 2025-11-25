// // Dashboard.jsx
// import React, { useState, useEffect } from "react"
// import { Card } from "@/components/ui/card"
// import { Users, UserPlus, Calendar, TrendingUp, Clock, Award, ChevronDown, ChevronUp, Building, ChevronLeft, ChevronRight, X } from "lucide-react"
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
// import { apiRequest } from "../api" // Import our API request function
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// export default function Dashboard() {
//   // Existing states
//   const [employeeCounts, setEmployeeCounts] = useState({
//     internal_employees: 0,
//     external_employees: 0
//   })

//   const [genderCounts, setGenderCounts] = useState({
//     Male: 0,
//     Female: 0,
//     Other: 0,
//     Total_Employees: 0
//   })

//   const [bankAccountData, setBankAccountData] = useState({
//     summary: {
//       Total_Accounts: 0,
//       Axis_Bank_Accounts: 0,
//       Non_Axis_Bank_Accounts: 0
//     },
//     non_axis_bank_employees: []
//   })

//   // New states for user management
//   const [userRoleData, setUserRoleData] = useState({
//     superadmin: 0,
//     hr: 0,
//     employee: 0
//   })
  
//   const [usersList, setUsersList] = useState([])
//   const [showCreateUserDialog, setShowCreateUserDialog] = useState(false)
//   const [showNonAxisTable, setShowNonAxisTable] = useState(false)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [userPage, setUserPage] = useState(1)
//   const rowsPerPage = 3
//   const userRowsPerPage = 5
  
//   // Form state for creating user
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     mobile_number: "",
//     username: "",
//     email: "",
//     password: "",
//     confirm_password: "",
//     role: ""
//   })
  
//   const [formErrors, setFormErrors] = useState({})
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   useEffect(() => {
//     // Existing API calls
//     // Internal & External employees
//     apiRequest("/dashboard/employment-applications/count/internal-external")
//       .then((data) => setEmployeeCounts(data))
//       .catch((err) => console.error("Error fetching employee counts:", err))

//     // Gender count data
//     apiRequest("/dashboard/gender-count")
//       .then((data) => setGenderCounts(data))
//       .catch((err) => console.error("Error fetching gender counts:", err))

//     // Bank account data
//     apiRequest("/db/bank-accounts/axis-summary")
//       .then((data) => setBankAccountData(data))
//       .catch((err) => console.error("Error fetching bank account data:", err))
      
//     // New API calls for user management
//     // Fetch user role data
//     apiRequest("/admin/users")
//       .then((data) => {
//         // Process the data based on the response structure
//         if (data.superadmin_data) {
//           // Superadmin sees all users grouped by role
//           setUserRoleData({
//             superadmin: data.superadmin_data.superadmin.length,
//             hr: data.superadmin_data.hr.length,
//             employee: data.superadmin_data.employee.length
//           })
//           // Combine all users for the table
//           const allUsers = [
//             ...data.superadmin_data.superadmin,
//             ...data.superadmin_data.hr,
//             ...data.superadmin_data.employee
//           ]
//           setUsersList(allUsers)
//         } else if (data.hr_data) {
//           // HR sees HR + Employee in their tenant
//           setUserRoleData({
//             superadmin: 0,
//             hr: data.hr_data.filter(u => u.role === 'hr').length,
//             employee: data.hr_data.filter(u => u.role === 'employee').length
//           })
//           setUsersList(data.hr_data)
//         } else if (data.admin_data) {
//           // Admin sees Admin + Employee in their tenant
//           setUserRoleData({
//             superadmin: 0,
//             hr: 0,
//             employee: data.admin_data.filter(u => u.role === 'employee').length
//           })
//           setUsersList(data.admin_data)
//         }
//       })
//       .catch((err) => console.error("Error fetching user data:", err))
//   }, [])

//   // Form validation
//   const validateForm = () => {
//     const errors = {}
    
//     if (!formData.first_name.trim()) {
//       errors.first_name = "First name is required"
//     }
    
//     if (!formData.last_name.trim()) {
//       errors.last_name = "Last name is required"
//     }
    
//     if (!formData.mobile_number.trim()) {
//       errors.mobile_number = "Mobile number is required"
//     } else if (!/^\d{10}$/.test(formData.mobile_number)) {
//       errors.mobile_number = "Mobile number must be 10 digits"
//     }
    
//     if (!formData.username.trim()) {
//       errors.username = "Username is required"
//     }
    
//     if (!formData.email.trim()) {
//       errors.email = "Email is required"
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       errors.email = "Email is invalid"
//     }
    
//     if (!formData.password.trim()) {
//       errors.password = "Password is required"
//     } else if (formData.password.length < 6) {
//       errors.password = "Password must be at least 6 characters"
//     }
    
//     if (!formData.confirm_password.trim()) {
//       errors.confirm_password = "Please confirm your password"
//     } else if (formData.password !== formData.confirm_password) {
//       errors.confirm_password = "Passwords do not match"
//     }
    
//     if (!formData.role) {
//       errors.role = "Role is required"
//     }
    
//     setFormErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//     // Clear error for this field when user starts typing
//     if (formErrors[name]) {
//       setFormErrors(prev => ({ ...prev, [name]: "" }))
//     }
//   }

//   // Handle role selection
//   const handleRoleChange = (value) => {
//     setFormData(prev => ({ ...prev, role: value }))
//     if (formErrors.role) {
//       setFormErrors(prev => ({ ...prev, role: "" }))
//     }
//   }

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     if (!validateForm()) {
//       return
//     }
    
//     setIsSubmitting(true)
    
//     try {
//       // Call the API to create a user
//       await apiRequest("/admin/create-user", {
//         method: "POST",
//         body: JSON.stringify(formData)
//       })
      
//       // Reset form
//       setFormData({
//         first_name: "",
//         last_name: "",
//         mobile_number: "",
//         username: "",
//         email: "",
//         password: "",
//         confirm_password: "",
//         role: ""
//       })
      
//       // Close dialog
//       setShowCreateUserDialog(false)
      
//       // Refresh user data
//       const data = await apiRequest("/admin/users")
//       if (data.superadmin_data) {
//         setUserRoleData({
//           superadmin: data.superadmin_data.superadmin.length,
//           hr: data.superadmin_data.hr.length,
//           employee: data.superadmin_data.employee.length
//         })
//         const allUsers = [
//           ...data.superadmin_data.superadmin,
//           ...data.superadmin_data.hr,
//           ...data.superadmin_data.employee
//         ]
//         setUsersList(allUsers)
//       } else if (data.hr_data) {
//         setUserRoleData({
//           superadmin: 0,
//           hr: data.hr_data.filter(u => u.role === 'hr').length,
//           employee: data.hr_data.filter(u => u.role === 'employee').length
//         })
//         setUsersList(data.hr_data)
//       } else if (data.admin_data) {
//         setUserRoleData({
//           superadmin: 0,
//           hr: 0,
//           employee: data.admin_data.filter(u => u.role === 'employee').length
//         })
//         setUsersList(data.admin_data)
//       }
      
//       // Show success message (you can use a toast notification here)
//       alert("User created successfully!")
      
//     } catch (error) {
//       console.error("Error creating user:", error)
//       alert(`Error creating user: ${error.message}`)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Rest of the component remains the same...
//   const totalEmployees = employeeCounts.internal_employees + employeeCounts.external_employees

//   const stats = [
//     { title: "Total Employees", value: totalEmployees, change: "+12%", changeType: "increase", icon: Users, color: "bg-blue-500" },
//     { title: "Internal Employees", value: employeeCounts.internal_employees, change: "+3%", changeType: "increase", icon: Users, color: "bg-green-500" },
//     { title: "External Employees", value: employeeCounts.external_employees, change: "+2%", changeType: "increase", icon: Users, color: "bg-yellow-500" },
//     { title: "Performance", value: "92%", change: "+8%", changeType: "increase", icon: TrendingUp, color: "bg-purple-500" }
//   ]

//   const pieChartData = [
//     {
//       name: "Internal Employees",
//       value: employeeCounts.internal_employees,
//       color: "#f8a688",
//       percentage: totalEmployees > 0 ? ((employeeCounts.internal_employees / totalEmployees) * 100).toFixed(1) : 0
//     },
//     {
//       name: "External Employees",
//       value: employeeCounts.external_employees,
//       color: "#53c9cf",
//       percentage: totalEmployees > 0 ? ((employeeCounts.external_employees / totalEmployees) * 100).toFixed(1) : 0
//     }
//   ]

//   // Gender pie chart (full circle)
//   const genderPieData = [
//     { name: "Male", value: genderCounts.Male, color: "#23989a" },  // teal
//     { name: "Female", value: genderCounts.Female, color: "#d6ad3a" } // mustard
//   ]

//   // User role pie chart data
//   const userRolePieData = [
//     { name: "Superadmin", value: userRoleData.superadmin, color: "#8b5cf6" }, // purple
//     { name: "HR", value: userRoleData.hr, color: "#10b981" }, // green
//     { name: "Employee", value: userRoleData.employee, color: "#3b82f6" } // blue
//   ]

//   // Bank account data for charts with pale colors
//   const bankAccountChartData = [
//     {
//       name: "Axis Bank",
//       value: bankAccountData.summary.Axis_Bank_Accounts,
//       color: "#E6F3FF", // Pale blue
//       percentage: bankAccountData.summary.Total_Accounts > 0 ? 
//         ((bankAccountData.summary.Axis_Bank_Accounts / bankAccountData.summary.Total_Accounts) * 100).toFixed(1) : 0
//     },
//     {
//       name: "Non-Axis Bank",
//       value: bankAccountData.summary.Non_Axis_Bank_Accounts,
//       color: "#FFEAD0", // Pale orange
//       percentage: bankAccountData.summary.Total_Accounts > 0 ? 
//         ((bankAccountData.summary.Non_Axis_Bank_Accounts / bankAccountData.summary.Total_Accounts) * 100).toFixed(1) : 0
//     }
//   ]

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload
//       return (
//         <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
//           <p className="font-medium text-gray-800">{data.name}</p>
//           <p className="text-blue-600">Count: {data.value}</p>
//           {data.percentage && <p className="text-gray-600">Percentage: {data.percentage}%</p>}
//         </div>
//       )
//     }
//     return null
//   }

//   const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//     const RADIAN = Math.PI / 180
//     const radius = outerRadius + 25
//     const x = cx + radius * Math.cos(-midAngle * RADIAN)
//     const y = cy + radius * Math.sin(-midAngle * RADIAN)
//     return (
//       <text
//         x={x}
//         y={y}
//         fill="#374151"
//         textAnchor={x > cx ? "start" : "end"}
//         dominantBaseline="central"
//         className="font-semibold text-sm"
//       >
//         {`${(percent * 100).toFixed(1)}%`}
//       </text>
//     )
//   }

//   const pendingTasks = [
//     { id: 1, task: "Review performance evaluations", deadline: "Today", priority: "high" },
//     { id: 2, task: "Approve leave requests", deadline: "Tomorrow", priority: "medium" },
//     { id: 3, task: "Update employee handbook", deadline: "This week", priority: "low" }
//   ]

//   // Pagination logic for bank accounts
//   const totalPages = Math.ceil(bankAccountData.non_axis_bank_employees.length / rowsPerPage)
//   const startIndex = (currentPage - 1) * rowsPerPage
//   const endIndex = startIndex + rowsPerPage
//   const currentEmployees = bankAccountData.non_axis_bank_employees.slice(startIndex, endIndex)

//   // Pagination logic for users table
//   const totalUserPages = Math.ceil(usersList.length / userRowsPerPage)
//   const userStartIndex = (userPage - 1) * userRowsPerPage
//   const userEndIndex = userStartIndex + userRowsPerPage
//   const currentUsers = usersList.slice(userStartIndex, userEndIndex)

//   const handlePageChange = (page) => {
//     setCurrentPage(page)
//   }

//   const handleUserPageChange = (page) => {
//     setUserPage(page)
//   }


//   useEffect(() => {
//   if (showCreateUserDialog) {
//     document.body.style.overflow = 'hidden'
//   } else {
//     document.body.style.overflow = 'unset'
//   }
  
//   return () => {
//     document.body.style.overflow = 'unset'
//   }
// }, [showCreateUserDialog])

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
//           <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <Clock size={16} />
//           <span>Last updated: {new Date().toLocaleTimeString()}</span>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat) => {
//           const Icon = stat.icon
//           return (
//             <Card key={stat.title} className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                   <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
//                   <p className={`text-sm mt-1 ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
//                     {stat.change} from last month
//                   </p>
//                 </div>
//                 <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
//                   <Icon size={24} className="text-white" />
//                 </div>
//               </div>
//             </Card>
//           )
//         })}
//       </div>

//       {/* Employee Distribution Pie Chart */}
//       <Card className="p-6 bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-lg">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h3 className="text-xl font-bold text-gray-800 mb-1">Employee Distribution</h3>
//             <p className="text-sm text-gray-500">Internal vs External workforce breakdown</p>
//           </div>
//           <div className="text-right bg-white rounded-xl p-3 shadow-sm border border-gray-100">
//             <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Employees</p>
//             <p className="text-2xl font-bold text-blue-600 mt-1">{totalEmployees}</p>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
//           {/* Pie Chart */}
//           <div className="lg:col-span-2 flex justify-center">
//             <div className="relative">
//               <div className="h-72 w-72">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={pieChartData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={renderLabel}
//                       outerRadius={90}
//                       innerRadius={45}
//                       fill="#8884d8"
//                       dataKey="value"
//                       stroke="#ffffff"
//                       strokeWidth={3}
//                       paddingAngle={0}
//                       isAnimationActive={true}
//                     >
//                       {pieChartData.map((entry, index) => (
//                         <Cell 
//                           key={`cell-${index}`} 
//                           fill={entry.color}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip 
//                       content={<CustomTooltip />} 
//                       cursor={{ fill: 'transparent' }}
//                       wrapperStyle={{ outline: 'none', zIndex: 1000 }}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               {/* Center Label */}
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div className="text-center bg-white rounded-full p-4 shadow-sm border border-gray-100">
//                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
//                   <p className="text-2xl font-bold text-gray-800">{totalEmployees}</p>
//                   <p className="text-xs text-gray-500">Employees</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Statistics Summary */}
//           <div className="lg:col-span-3 space-y-4">
//             {pieChartData.map((item, index) => (
//               <div key={index} className="group hover:shadow-md transition-all duration-300">
//                 <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
//                   <div className="flex items-center gap-4">
//                     <div className="relative">
//                       <div className="w-6 h-6 rounded-full shadow-sm border-2 border-white" style={{ backgroundColor: item.color }}></div>
//                     </div>
//                     <div>
//                       <span className="font-semibold text-gray-800 text-base">{item.name}</span>
//                       <p className="text-xs text-gray-500 mt-1">Active employees</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="flex items-baseline gap-2">
//                       <p className="text-2xl font-bold text-gray-800">{item.value}</p>
//                       <div className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: item.color }}>
//                         {item.percentage}%
//                       </div>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">of workforce</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </Card>

//       {/* Gender Distribution Chart (Full Pie) */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <Card className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">Gender Distribution</h3>
//               <span className="text-sm text-gray-500">Total: {genderCounts.Total_Employees}</span>
//             </div>
//             <div className="flex justify-center">
//               <div className="h-72 w-72">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={genderPieData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={renderLabel}
//                       outerRadius={100}
//                       innerRadius={0}
//                       dataKey="value"
//                       stroke="#ffffff"
//                       strokeWidth={3}
//                     >
//                       {genderPieData.map((entry, index) => (
//                         <Cell key={`cell-gender-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* Pending Tasks */}
//         <div>
//           <Card className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">Pending Tasks</h3>
//               <span className="text-sm text-gray-500">{pendingTasks.length} tasks</span>
//             </div>
//             <div className="space-y-3">
//               {pendingTasks.map((task) => (
//                 <div key={task.id} className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-300">
//                   <div className="flex items-center justify-between mb-2">
//                     <span
//                       className={`text-xs px-2 py-1 rounded-full ${
//                         task.priority === "high"
//                           ? "bg-red-100 text-red-700"
//                           : task.priority === "medium"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-green-100 text-green-700"
//                       }`}
//                     >
//                       {task.priority.toUpperCase()}
//                     </span>
//                     <span className="text-xs text-gray-500">{task.deadline}</span>
//                   </div>
//                   <p className="text-sm font-medium text-gray-800">{task.task}</p>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </div>
//       </div>

//       {/* Bank Account Distribution - Replacing Quick Actions */}
//       <Card className="p-6 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 border-0 shadow-lg">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h3 className="text-xl font-bold text-gray-800 mb-1">Bank Account Distribution</h3>
//             <p className="text-sm text-gray-500">Axis Bank vs Non-Axis Bank accounts</p>
//           </div>
//           <div className="text-right bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100">
//             <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Accounts</p>
//             <p className="text-2xl font-bold text-indigo-600 mt-1">{bankAccountData.summary.Total_Accounts}</p>
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
//                       innerRadius={65} // Larger inner radius for a thinner ring
//                       fill="#8884d8"
//                       dataKey="value"
//                       stroke="#ffffff"
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
//                           stroke="#ffffff"
//                           strokeWidth={2}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip 
//                       content={<CustomTooltip />} 
//                       cursor={{ fill: 'transparent' }}
//                       wrapperStyle={{ outline: 'none', zIndex: 1000 }}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               {/* Center Label */}
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div className="text-center bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-sm border border-gray-100">
//                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
//                   <p className="text-xl font-bold text-gray-800">{bankAccountData.summary.Total_Accounts}</p>
//                   <p className="text-xs text-gray-500">Accounts</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Statistics Summary */}
//           <div className="space-y-4">
//             {bankAccountChartData.map((item, index) => (
//               <div key={index} className="group hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
//                 <div 
//                   className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100/50 shadow-sm cursor-pointer"
//                   onClick={() => item.name === "Non-Axis Bank" && setShowNonAxisTable(!showNonAxisTable)}
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="relative">
//                       <div className="w-6 h-6 rounded-full shadow-sm border-2 border-white/80" style={{ backgroundColor: item.color }}></div>
//                     </div>
//                     <div>
//                       <span className="font-semibold text-gray-800 text-base flex items-center gap-2">
//                         {item.name}
//                         {item.name === "Non-Axis Bank" && (
//                           showNonAxisTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />
//                         )}
//                       </span>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {item.name === "Non-Axis Bank" ? "Click to view details" : "Bank accounts"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="flex items-baseline gap-2">
//                       <p className="text-2xl font-bold text-gray-800">{item.value}</p>
//                       <div className="px-2 py-1 rounded-full text-xs font-medium text-gray-700" style={{ backgroundColor: item.color }}>
//                         {item.percentage}%
//                       </div>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">of total accounts</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Non-Axis Bank Employees Table with Pagination */}
//         {showNonAxisTable && bankAccountData.non_axis_bank_employees.length > 0 && (
//           <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100/50 shadow-sm transition-all duration-500">
//             <div className="flex items-center justify-between mb-4">
//               <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 <Building size={20} className="text-orange-500" />
//                 Non-Axis Bank Employees
//               </h4>
//               <span className="text-sm text-gray-500">{bankAccountData.non_axis_bank_employees.length} employees</span>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b border-gray-200/50">
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">Employee ID</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">Bank Name</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">Account Number</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">IFSC Code</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentEmployees.map((employee, index) => (
//                     <tr key={index} className="border-b border-gray-100/50 hover:bg-gray-50/50 transition-all duration-200">
//                       <td className="py-3 px-4 text-gray-800">{employee.employee_id}</td>
//                       <td className="py-3 px-4 text-gray-800">{employee.name}</td>
//                       <td className="py-3 px-4 text-gray-800">{employee.mail_id}</td>
//                       <td className="py-3 px-4 text-gray-800">{employee.bank_name}</td>
//                       <td className="py-3 px-4 text-gray-800">{employee.account_number}</td>
//                       <td className="py-3 px-4 text-gray-800">{employee.ifsc_code}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
            
//             {/* Pagination Controls */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
//                 <div className="text-sm text-gray-600">
//                   Showing {startIndex + 1} to {Math.min(endIndex, bankAccountData.non_axis_bank_employees.length)} of {bankAccountData.non_axis_bank_employees.length} entries
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                   >
//                     <ChevronLeft size={16} />
//                   </button>
                  
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                     <button
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
//                         currentPage === page
//                           ? 'bg-indigo-500 text-white'
//                           : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ))}
                  
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                   >
//                     <ChevronRight size={16} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </Card>

//       {/* User Role Distribution - NEW SECTION */}
//       <Card className="p-6 bg-gradient-to-br from-white via-purple-50/20 to-indigo-50/30 border-0 shadow-lg">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h3 className="text-xl font-bold text-gray-800 mb-1">User Role Distribution</h3>
//             <p className="text-sm text-gray-500">Distribution of users by role</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="text-right bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100">
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Users</p>
//               <p className="text-2xl font-bold text-indigo-600 mt-1">
//                 {userRoleData.superadmin + userRoleData.hr + userRoleData.employee}
//               </p>
//             </div>
//             <Button 
//               onClick={() => setShowCreateUserDialog(true)}
//               className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-2"
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
//                       stroke="#ffffff"
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
//                           stroke="#ffffff"
//                           strokeWidth={2}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip 
//                       content={<CustomTooltip />} 
//                       cursor={{ fill: 'transparent' }}
//                       wrapperStyle={{ outline: 'none', zIndex: 1000 }}
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
//               <div key={index} className="group hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
//                 <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100/50 shadow-sm">
//                   <div className="flex items-center gap-4">
//                     <div className="relative">
//                       <div className="w-6 h-6 rounded-full shadow-sm border-2 border-white/80" style={{ backgroundColor: item.color }}></div>
//                     </div>
//                     <div>
//                       <span className="font-semibold text-gray-800 text-base">{item.name}</span>
//                       <p className="text-xs text-gray-500 mt-1">Users with this role</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="flex items-baseline gap-2">
//                       <p className="text-2xl font-bold text-gray-800">{item.value}</p>
//                       <div className="px-2 py-1 rounded-full text-xs font-medium text-gray-700" style={{ backgroundColor: item.color }}>
//                         {item.value > 0 ? ((item.value / (userRoleData.superadmin + userRoleData.hr + userRoleData.employee)) * 100).toFixed(1) : 0}%
//                       </div>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">of total users</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Users Table */}
//         <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100/50 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//               <Users size={20} className="text-indigo-500" />
//               Users List
//             </h4>
//             <span className="text-sm text-gray-500">{usersList.length} users</span>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-200/50">
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">Username</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">Mobile</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">Created At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentUsers.map((user, index) => (
//                   <tr key={index} className="border-b border-gray-100/50 hover:bg-gray-50/50 transition-all duration-200">
//                     <td className="py-3 px-4 text-gray-800">{user.id}</td>
//                     <td className="py-3 px-4 text-gray-800">{user.first_name} {user.last_name}</td>
//                     <td className="py-3 px-4 text-gray-800">{user.username}</td>
//                     <td className="py-3 px-4 text-gray-800">{user.email}</td>
//                     <td className="py-3 px-4 text-gray-800">{user.mobile_number}</td>
//                     <td className="py-3 px-4">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' :
//                         user.role === 'hr' ? 'bg-green-100 text-green-700' :
//                         'bg-blue-100 text-blue-700'
//                       }`}>
//                         {user.role}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4 text-gray-800">
//                       {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Pagination Controls */}
//           {totalUserPages > 1 && (
//             <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
//               <div className="text-sm text-gray-600">
//                 Showing {userStartIndex + 1} to {Math.min(userEndIndex, usersList.length)} of {usersList.length} entries
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => handleUserPageChange(userPage - 1)}
//                   disabled={userPage === 1}
//                   className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                 >
//                   <ChevronLeft size={16} />
//                 </button>
                
//                 {Array.from({ length: totalUserPages }, (_, i) => i + 1).map((page) => (
//                   <button
//                     key={page}
//                     onClick={() => handleUserPageChange(page)}
//                     className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
//                       userPage === page
//                         ? 'bg-indigo-500 text-white'
//                         : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}
                
//                 <button
//                   onClick={() => handleUserPageChange(userPage + 1)}
//                   disabled={userPage === totalUserPages}
//                   className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                 >
//                   <ChevronRight size={16} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Create User Dialog - MODIFIED */}
//   {showCreateUserDialog && (
//   <div 
//     className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto pointer-events-none"
//   >
//     <div 
//       className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 my-8 relative animate-in fade-in zoom-in duration-200 pointer-events-auto"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-xl font-bold text-gray-800">Create New User</h3>
//         <button
//           onClick={() => setShowCreateUserDialog(false)}
//           className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
//           type="button"
//         >
//           <X size={24} />
//         </button>
//       </div>
      
//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* First Row: First Name, Last Name, Mobile Number */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 mb-1 block">
//               First Name <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="first_name"
//               name="first_name"
//               type="text"
//               placeholder="Enter first name"
//               value={formData.first_name}
//               onChange={handleInputChange}
//               className={`w-full ${formErrors.first_name ? 'border-red-500 focus:ring-red-500' : ''}`}
//               disabled={isSubmitting}
//             />
//             {formErrors.first_name && (
//               <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                 <span>⚠</span> {formErrors.first_name}
//               </p>
//             )}
//           </div>
          
//           <div>
//             <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 mb-1 block">
//               Last Name <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="last_name"
//               name="last_name"
//               type="text"
//               placeholder="Enter last name"
//               value={formData.last_name}
//               onChange={handleInputChange}
//               className={`w-full ${formErrors.last_name ? 'border-red-500 focus:ring-red-500' : ''}`}
//               disabled={isSubmitting}
//             />
//             {formErrors.last_name && (
//               <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                 <span>⚠</span> {formErrors.last_name}
//               </p>
//             )}
//           </div>
          
//           <div>
//             <Label htmlFor="mobile_number" className="text-sm font-medium text-gray-700 mb-1 block">
//               Mobile Number <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="mobile_number"
//               name="mobile_number"
//               type="text"
//               placeholder="10-digit number"
//               value={formData.mobile_number}
//               onChange={handleInputChange}
//               maxLength={10}
//               className={`w-full ${formErrors.mobile_number ? 'border-red-500 focus:ring-red-500' : ''}`}
//               disabled={isSubmitting}
//             />
//             {formErrors.mobile_number && (
//               <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                 <span>⚠</span> {formErrors.mobile_number}
//               </p>
//             )}
//           </div>
//         </div>
        
//         {/* Second Row: Username, Email, Role */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-1 block">
//               Username <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="username"
//               name="username"
//               type="text"
//               placeholder="Enter username"
//               value={formData.username}
//               onChange={handleInputChange}
//               className={`w-full ${formErrors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
//               disabled={isSubmitting}
//             />
//             {formErrors.username && (
//               <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                 <span>⚠</span> {formErrors.username}
//               </p>
//             )}
//           </div>
          
//           <div>
//             <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
//               Email <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="email"
//               name="email"
//               type="email"
//               placeholder="email@example.com"
//               value={formData.email}
//               onChange={handleInputChange}
//               className={`w-full ${formErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
//               disabled={isSubmitting}
//             />
//             {formErrors.email && (
//               <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                 <span>⚠</span> {formErrors.email}
//               </p>
//             )}
//           </div>
          
//           <div>
//             <Label htmlFor="role" className="text-sm font-medium text-gray-700 mb-1 block">
//               Role <span className="text-red-500">*</span>
//             </Label>
//             <Select 
//               value={formData.role} 
//               onValueChange={handleRoleChange}
//               disabled={isSubmitting}
//             >
//               <SelectTrigger className={`w-full ${formErrors.role ? 'border-red-500 focus:ring-red-500' : ''}`}>
//                 <SelectValue placeholder="Select role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="superadmin">Superadmin</SelectItem>
//                 <SelectItem value="hr">HR</SelectItem>
//                 <SelectItem value="employee">Employee</SelectItem>
//               </SelectContent>
//             </Select>
//             {formErrors.role && (
//               <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                 <span>⚠</span> {formErrors.role}
//               </p>
//             )}
//           </div>
//         </div>
        
//         {/* Third Row: Password, Confirm Password */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
//               Password <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="password"
//               name="password"
//               type="password"
//               placeholder="Min. 6 characters"
//               value={formData.password}
//               onChange={handleInputChange}
//               className={`w-full ${formErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
//               disabled={isSubmitting}
//             />
//             {formErrors.password && (
//               <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                 <span>⚠</span> {formErrors.password}
//               </p>
//             )}
//           </div>
          
//           <div>
//             <Label htmlFor="confirm_password" className="text-sm font-medium text-gray-700 mb-1 block">
//               Confirm Password <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="confirm_password"
//               name="confirm_password"
//               type="password"
//               placeholder="Re-enter password"
//               value={formData.confirm_password}
//               onChange={handleInputChange}
//               className={`w-full ${formErrors.confirm_password ? 'border-red-500 focus:ring-red-500' : ''}`}
//               disabled={isSubmitting}
//             />
//             {formErrors.confirm_password && (
//               <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                 <span>⚠</span> {formErrors.confirm_password}
//               </p>
//             )}
//           </div>
//         </div>
        
//         {/* Action Buttons */}
//         <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => setShowCreateUserDialog(false)}
//             disabled={isSubmitting}
//             className="px-6"
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6"
//           >
//             {isSubmitting ? (
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
//                 <span>Creating...</span>
//               </div>
//             ) : (
//               <div className="flex items-center gap-2">
//                 <UserPlus size={16} />
//                 <span>Create User</span>
//               </div>
//             )}
//           </Button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}



      
//     </div>
//   )
// }
    
// Dashboard.jsx
import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Users, UserPlus, Calendar, TrendingUp, Clock, Award, ChevronDown, ChevronUp, Building, ChevronLeft, ChevronRight, X, CheckCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { apiRequest } from "../api" // Import our API request function
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast" // Import the useToast hook

export default function Dashboard() {
  // Existing states
  const [employeeCounts, setEmployeeCounts] = useState({
    internal_employees: 0,
    external_employees: 0
  })

  const [genderCounts, setGenderCounts] = useState({
    Male: 0,
    Female: 0,
    Other: 0,
    Total_Employees: 0
  })

  const [bankAccountData, setBankAccountData] = useState({
    summary: {
      Total_Accounts: 0,
      Axis_Bank_Accounts: 0,
      Non_Axis_Bank_Accounts: 0
    },
    non_axis_bank_employees: []
  })

  // New states for user management
  const [userRoleData, setUserRoleData] = useState({
    superadmin: 0,
    hr: 0,
    employee: 0
  })
  
  const [usersList, setUsersList] = useState([])
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false)
  const [showNonAxisTable, setShowNonAxisTable] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [userPage, setUserPage] = useState(1)
  const rowsPerPage = 3
  const userRowsPerPage = 5
  
  // Form state for creating user
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    role: ""
  })
  
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Initialize toast
  const { toast } = useToast()

  useEffect(() => {
    // Existing API calls
    // Internal & External employees
    apiRequest("/dashboard/employment-applications/count/internal-external")
      .then((data) => setEmployeeCounts(data))
      .catch((err) => console.error("Error fetching employee counts:", err))

    // Gender count data
    apiRequest("/dashboard/gender-count")
      .then((data) => setGenderCounts(data))
      .catch((err) => console.error("Error fetching gender counts:", err))

    // Bank account data
    apiRequest("/db/bank-accounts/axis-summary")
      .then((data) => setBankAccountData(data))
      .catch((err) => console.error("Error fetching bank account data:", err))
      
    // New API calls for user management
    // Fetch user role data
    apiRequest("/admin/users")
      .then((data) => {
        // Process the data based on the response structure
        if (data.superadmin_data) {
          // Superadmin sees all users grouped by role
          setUserRoleData({
            superadmin: data.superadmin_data.superadmin.length,
            hr: data.superadmin_data.hr.length,
            employee: data.superadmin_data.employee.length
          })
          // Combine all users for the table
          const allUsers = [
            ...data.superadmin_data.superadmin,
            ...data.superadmin_data.hr,
            ...data.superadmin_data.employee
          ]
          setUsersList(allUsers)
        } else if (data.hr_data) {
          // HR sees HR + Employee in their tenant
          setUserRoleData({
            superadmin: 0,
            hr: data.hr_data.filter(u => u.role === 'hr').length,
            employee: data.hr_data.filter(u => u.role === 'employee').length
          })
          setUsersList(data.hr_data)
        } else if (data.admin_data) {
          // Admin sees Admin + Employee in their tenant
          setUserRoleData({
            superadmin: 0,
            hr: 0,
            employee: data.admin_data.filter(u => u.role === 'employee').length
          })
          setUsersList(data.admin_data)
        }
      })
      .catch((err) => console.error("Error fetching user data:", err))
  }, [])

  // Form validation
  const validateForm = () => {
    const errors = {}
    
    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required"
    }
    
    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required"
    }
    
    if (!formData.mobile_number.trim()) {
      errors.mobile_number = "Mobile number is required"
    } else if (!/^\d{10}$/.test(formData.mobile_number)) {
      errors.mobile_number = "Mobile number must be 10 digits"
    }
    
    if (!formData.username.trim()) {
      errors.username = "Username is required"
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }
    
    if (!formData.password.trim()) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }
    
    if (!formData.confirm_password.trim()) {
      errors.confirm_password = "Please confirm your password"
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = "Passwords do not match"
    }
    
    if (!formData.role) {
      errors.role = "Role is required"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  // Handle role selection
  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }))
    if (formErrors.role) {
      setFormErrors(prev => ({ ...prev, role: "" }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Call the API to create a user
      await apiRequest("/admin/create-user", {
        method: "POST",
        body: JSON.stringify(formData)
      })
      
      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        mobile_number: "",
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        role: ""
      })
      
      // Close dialog
      setShowCreateUserDialog(false)
      
      // Refresh user data
      const data = await apiRequest("/admin/users")
      if (data.superadmin_data) {
        setUserRoleData({
          superadmin: data.superadmin_data.superadmin.length,
          hr: data.superadmin_data.hr.length,
          employee: data.superadmin_data.employee.length
        })
        const allUsers = [
          ...data.superadmin_data.superadmin,
          ...data.superadmin_data.hr,
          ...data.superadmin_data.employee
        ]
        setUsersList(allUsers)
      } else if (data.hr_data) {
        setUserRoleData({
          superadmin: 0,
          hr: data.hr_data.filter(u => u.role === 'hr').length,
          employee: data.hr_data.filter(u => u.role === 'employee').length
        })
        setUsersList(data.hr_data)
      } else if (data.admin_data) {
        setUserRoleData({
          superadmin: 0,
          hr: 0,
          employee: data.admin_data.filter(u => u.role === 'employee').length
        })
        setUsersList(data.admin_data)
      }
      
      // Show success toast notification
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>User Created Successfully</span>
          </div>
        ),
        description: `${formData.first_name} ${formData.last_name} has been added as ${formData.role}`,
        className: "bg-green-50 border-green-200 text-green-800",
      })
      
    } catch (error) {
      console.error("Error creating user:", error)
      // Show error toast notification
      toast({
        title: "Error",
        description: error.message || "Failed to create user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Rest of the component remains the same...
  const totalEmployees = employeeCounts.internal_employees + employeeCounts.external_employees

  const stats = [
    { title: "Total Employees", value: totalEmployees, change: "+12%", changeType: "increase", icon: Users, color: "bg-blue-500" },
    { title: "Internal Employees", value: employeeCounts.internal_employees, change: "+3%", changeType: "increase", icon: Users, color: "bg-green-500" },
    { title: "External Employees", value: employeeCounts.external_employees, change: "+2%", changeType: "increase", icon: Users, color: "bg-yellow-500" },
    { title: "Performance", value: "92%", change: "+8%", changeType: "increase", icon: TrendingUp, color: "bg-purple-500" }
  ]

  const pieChartData = [
    {
      name: "Internal Employees",
      value: employeeCounts.internal_employees,
      color: "#f8a688",
      percentage: totalEmployees > 0 ? ((employeeCounts.internal_employees / totalEmployees) * 100).toFixed(1) : 0
    },
    {
      name: "External Employees",
      value: employeeCounts.external_employees,
      color: "#53c9cf",
      percentage: totalEmployees > 0 ? ((employeeCounts.external_employees / totalEmployees) * 100).toFixed(1) : 0
    }
  ]

  // Gender pie chart (full circle)
  const genderPieData = [
    { name: "Male", value: genderCounts.Male, color: "#23989a" },  // teal
    { name: "Female", value: genderCounts.Female, color: "#d6ad3a" } // mustard
  ]

  // User role pie chart data
  const userRolePieData = [
    { name: "Superadmin", value: userRoleData.superadmin, color: "#8b5cf6" }, // purple
    { name: "HR", value: userRoleData.hr, color: "#10b981" }, // green
    { name: "Employee", value: userRoleData.employee, color: "#3b82f6" } // blue
  ]

  // Bank account data for charts with pale colors
  const bankAccountChartData = [
    {
      name: "Axis Bank",
      value: bankAccountData.summary.Axis_Bank_Accounts,
      color: "#E6F3FF", // Pale blue
      percentage: bankAccountData.summary.Total_Accounts > 0 ? 
        ((bankAccountData.summary.Axis_Bank_Accounts / bankAccountData.summary.Total_Accounts) * 100).toFixed(1) : 0
    },
    {
      name: "Non-Axis Bank",
      value: bankAccountData.summary.Non_Axis_Bank_Accounts,
      color: "#FFEAD0", // Pale orange
      percentage: bankAccountData.summary.Total_Accounts > 0 ? 
        ((bankAccountData.summary.Non_Axis_Bank_Accounts / bankAccountData.summary.Total_Accounts) * 100).toFixed(1) : 0
    }
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-blue-600">Count: {data.value}</p>
          {data.percentage && <p className="text-gray-600">Percentage: {data.percentage}%</p>}
        </div>
      )
    }
    return null
  }

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = outerRadius + 25
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    )
  }

  const pendingTasks = [
    { id: 1, task: "Review performance evaluations", deadline: "Today", priority: "high" },
    { id: 2, task: "Approve leave requests", deadline: "Tomorrow", priority: "medium" },
    { id: 3, task: "Update employee handbook", deadline: "This week", priority: "low" }
  ]

  // Pagination logic for bank accounts
  const totalPages = Math.ceil(bankAccountData.non_axis_bank_employees.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentEmployees = bankAccountData.non_axis_bank_employees.slice(startIndex, endIndex)

  // Pagination logic for users table
  const totalUserPages = Math.ceil(usersList.length / userRowsPerPage)
  const userStartIndex = (userPage - 1) * userRowsPerPage
  const userEndIndex = userStartIndex + userRowsPerPage
  const currentUsers = usersList.slice(userStartIndex, userEndIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleUserPageChange = (page) => {
    setUserPage(page)
  }


  useEffect(() => {
  if (showCreateUserDialog) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
  }
  
  return () => {
    document.body.style.overflow = 'unset'
  }
}, [showCreateUserDialog])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Employee Distribution Pie Chart */}
      <Card className="p-6 bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Employee Distribution</h3>
            <p className="text-sm text-gray-500">Internal vs External workforce breakdown</p>
          </div>
          <div className="text-right bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Employees</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{totalEmployees}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
          {/* Pie Chart */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative">
              <div className="h-72 w-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderLabel}
                      outerRadius={90}
                      innerRadius={45}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="#ffffff"
                      strokeWidth={3}
                      paddingAngle={0}
                      isAnimationActive={true}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={<CustomTooltip />} 
                      cursor={{ fill: 'transparent' }}
                      wrapperStyle={{ outline: 'none', zIndex: 1000 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Center Label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center bg-white rounded-full p-4 shadow-sm border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
                  <p className="text-2xl font-bold text-gray-800">{totalEmployees}</p>
                  <p className="text-xs text-gray-500">Employees</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="lg:col-span-3 space-y-4">
            {pieChartData.map((item, index) => (
              <div key={index} className="group hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full shadow-sm border-2 border-white" style={{ backgroundColor: item.color }}></div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 text-base">{item.name}</span>
                      <p className="text-xs text-gray-500 mt-1">Active employees</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                      <div className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: item.color }}>
                        {item.percentage}%
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">of workforce</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Gender Distribution Chart (Full Pie) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Gender Distribution</h3>
              <span className="text-sm text-gray-500">Total: {genderCounts.Total_Employees}</span>
            </div>
            <div className="flex justify-center">
              <div className="h-72 w-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderLabel}
                      outerRadius={100}
                      innerRadius={0}
                      dataKey="value"
                      stroke="#ffffff"
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
          </Card>
        </div>

        {/* Pending Tasks */}
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Pending Tasks</h3>
              <span className="text-sm text-gray-500">{pendingTasks.length} tasks</span>
            </div>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{task.deadline}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{task.task}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bank Account Distribution - Replacing Quick Actions */}
      <Card className="p-6 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Bank Account Distribution</h3>
            <p className="text-sm text-gray-500">Axis Bank vs Non-Axis Bank accounts</p>
          </div>
          <div className="text-right bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Accounts</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{bankAccountData.summary.Total_Accounts}</p>
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
                      innerRadius={65} // Larger inner radius for a thinner ring
                      fill="#8884d8"
                      dataKey="value"
                      stroke="#ffffff"
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
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={<CustomTooltip />} 
                      cursor={{ fill: 'transparent' }}
                      wrapperStyle={{ outline: 'none', zIndex: 1000 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Center Label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-sm border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
                  <p className="text-xl font-bold text-gray-800">{bankAccountData.summary.Total_Accounts}</p>
                  <p className="text-xs text-gray-500">Accounts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="space-y-4">
            {bankAccountChartData.map((item, index) => (
              <div key={index} className="group hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <div 
                  className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100/50 shadow-sm cursor-pointer"
                  onClick={() => item.name === "Non-Axis Bank" && setShowNonAxisTable(!showNonAxisTable)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full shadow-sm border-2 border-white/80" style={{ backgroundColor: item.color }}></div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 text-base flex items-center gap-2">
                        {item.name}
                        {item.name === "Non-Axis Bank" && (
                          showNonAxisTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.name === "Non-Axis Bank" ? "Click to view details" : "Bank accounts"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                      <div className="px-2 py-1 rounded-full text-xs font-medium text-gray-700" style={{ backgroundColor: item.color }}>
                        {item.percentage}%
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">of total accounts</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Non-Axis Bank Employees Table with Pagination */}
        {showNonAxisTable && bankAccountData.non_axis_bank_employees.length > 0 && (
          <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100/50 shadow-sm transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Building size={20} className="text-orange-500" />
                Non-Axis Bank Employees
              </h4>
              <span className="text-sm text-gray-500">{bankAccountData.non_axis_bank_employees.length} employees</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200/50">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Employee ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Bank Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Account Number</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">IFSC Code</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((employee, index) => (
                    <tr key={index} className="border-b border-gray-100/50 hover:bg-gray-50/50 transition-all duration-200">
                      <td className="py-3 px-4 text-gray-800">{employee.employee_id}</td>
                      <td className="py-3 px-4 text-gray-800">{employee.name}</td>
                      <td className="py-3 px-4 text-gray-800">{employee.mail_id}</td>
                      <td className="py-3 px-4 text-gray-800">{employee.bank_name}</td>
                      <td className="py-3 px-4 text-gray-800">{employee.account_number}</td>
                      <td className="py-3 px-4 text-gray-800">{employee.ifsc_code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, bankAccountData.non_axis_bank_employees.length)} of {bankAccountData.non_axis_bank_employees.length} entries
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-indigo-500 text-white'
                          : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* User Role Distribution - NEW SECTION */}
      <Card className="p-6 bg-gradient-to-br from-white via-purple-50/20 to-indigo-50/30 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">User Role Distribution</h3>
            <p className="text-sm text-gray-500">Distribution of users by role</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Users</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">
                {userRoleData.superadmin + userRoleData.hr + userRoleData.employee}
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateUserDialog(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-2"
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
                      stroke="#ffffff"
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
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={<CustomTooltip />} 
                      cursor={{ fill: 'transparent' }}
                      wrapperStyle={{ outline: 'none', zIndex: 1000 }}
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
              <div key={index} className="group hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100/50 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full shadow-sm border-2 border-white/80" style={{ backgroundColor: item.color }}></div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 text-base">{item.name}</span>
                      <p className="text-xs text-gray-500 mt-1">Users with this role</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                      <div className="px-2 py-1 rounded-full text-xs font-medium text-gray-700" style={{ backgroundColor: item.color }}>
                        {item.value > 0 ? ((item.value / (userRoleData.superadmin + userRoleData.hr + userRoleData.employee)) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">of total users</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users size={20} className="text-indigo-500" />
              Users List
            </h4>
            <span className="text-sm text-gray-500">{usersList.length} users</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Username</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Mobile</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={index} className="border-b border-gray-100/50 hover:bg-gray-50/50 transition-all duration-200">
                    <td className="py-3 px-4 text-gray-800">{user.id}</td>
                    <td className="py-3 px-4 text-gray-800">{user.first_name} {user.last_name}</td>
                    <td className="py-3 px-4 text-gray-800">{user.username}</td>
                    <td className="py-3 px-4 text-gray-800">{user.email}</td>
                    <td className="py-3 px-4 text-gray-800">{user.mobile_number}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'hr' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalUserPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
              <div className="text-sm text-gray-600">
                Showing {userStartIndex + 1} to {Math.min(userEndIndex, usersList.length)} of {usersList.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUserPageChange(userPage - 1)}
                  disabled={userPage === 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalUserPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handleUserPageChange(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      userPage === page
                        ? 'bg-indigo-500 text-white'
                        : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handleUserPageChange(userPage + 1)}
                  disabled={userPage === totalUserPages}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Create User Dialog - MODIFIED */}
      {showCreateUserDialog && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto pointer-events-none"
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 my-8 relative animate-in fade-in zoom-in duration-200 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Create New User</h3>
              <button
                onClick={() => setShowCreateUserDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                type="button"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Row: First Name, Last Name, Mobile Number */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 mb-1 block">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="Enter first name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={`w-full ${formErrors.first_name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  {formErrors.first_name && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <span>⚠</span> {formErrors.first_name}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 mb-1 block">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Enter last name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`w-full ${formErrors.last_name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  {formErrors.last_name && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <span>⚠</span> {formErrors.last_name}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="mobile_number" className="text-sm font-medium text-gray-700 mb-1 block">
                    Mobile Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mobile_number"
                    name="mobile_number"
                    type="text"
                    placeholder="10-digit number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    maxLength={10}
                    className={`w-full ${formErrors.mobile_number ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  {formErrors.mobile_number && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <span>⚠</span> {formErrors.mobile_number}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Second Row: Username, Email, Role */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-1 block">
                    Username <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full ${formErrors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  {formErrors.username && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <span>⚠</span> {formErrors.username}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full ${formErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <span>⚠</span> {formErrors.email}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700 mb-1 block">
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={handleRoleChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className={`w-full bg-white border-gray-300 ${formErrors.role ? 'border-red-500 focus:ring-red-500' : ''}`}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      <SelectItem value="superadmin">Superadmin</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.role && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <span>⚠</span> {formErrors.role}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Third Row: Password, Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full ${formErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  {formErrors.password && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <span>⚠</span> {formErrors.password}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="confirm_password" className="text-sm font-medium text-gray-700 mb-1 block">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    placeholder="Re-enter password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className={`w-full ${formErrors.confirm_password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  {formErrors.confirm_password && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <span>⚠</span> {formErrors.confirm_password}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateUserDialog(false)}
                  disabled={isSubmitting}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus size={16} />
                      <span>Create User</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}