// Dashboard.jsx
import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Users, UserPlus, Calendar, TrendingUp, Clock, Award, ChevronDown, ChevronUp, Building, ChevronLeft, ChevronRight } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

export default function Dashboard() {
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

  // New state for bank account data
  const [bankAccountData, setBankAccountData] = useState({
    summary: {
      Total_Accounts: 0,
      Axis_Bank_Accounts: 0,
      Non_Axis_Bank_Accounts: 0
    },
    non_axis_bank_employees: []
  })

  const [showNonAxisTable, setShowNonAxisTable] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 3

  useEffect(() => {
    // Internal & External employees
    fetch("http://127.0.0.1:8000/dashboard/employment-applications/count/internal-external")
      .then((res) => res.json())
      .then((data) => setEmployeeCounts(data))
      .catch((err) => console.error("Error fetching employee counts:", err))

    // Gender count data
    fetch("http://127.0.0.1:8000/dashboard/gender-count")
      .then((res) => res.json())
      .then((data) => setGenderCounts(data))
      .catch((err) => console.error("Error fetching gender counts:", err))

    // Bank account data
    fetch("http://127.0.0.1:8000/db/bank-accounts/axis-summary")
      .then((res) => res.json())
      .then((data) => setBankAccountData(data))
      .catch((err) => console.error("Error fetching bank account data:", err))
  }, [])

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

  // Pagination logic
  const totalPages = Math.ceil(bankAccountData.non_axis_bank_employees.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentEmployees = bankAccountData.non_axis_bank_employees.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

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
    </div>
  )
}