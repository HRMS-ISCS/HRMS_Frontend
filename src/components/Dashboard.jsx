// Dashboard.jsx
import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Users, UserPlus, Calendar, TrendingUp, Clock, Award, AlertTriangle, CheckCircle } from "lucide-react"

export default function Dashboard() {
  const [employeeCounts, setEmployeeCounts] = useState({
    internal_employees: 0,
    external_employees: 0
  })

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard/employment-applications/count/internal-external")
      .then((res) => res.json())
      .then((data) => {
        setEmployeeCounts(data)
      })
      .catch((err) => {
        console.error("Error fetching employee counts:", err)
      })
  }, [])

  const totalEmployees = employeeCounts.internal_employees + employeeCounts.external_employees

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Internal Employees",
      value: employeeCounts.internal_employees,
      change: "+3%",
      changeType: "increase",
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "External Employees",
      value: employeeCounts.external_employees,
      change: "+2%",
      changeType: "increase",
      icon: Users,
      color: "bg-yellow-500"
    },
    {
      title: "Performance",
      value: "92%",
      change: "+8%",
      changeType: "increase",
      icon: TrendingUp,
      color: "bg-purple-500"
    }
  ]

  const recentActivities = [
    { id: 1, action: "New employee onboarded", employee: "Sarah Johnson", time: "2 hours ago", type: "success" },
    { id: 2, action: "Leave request approved", employee: "Mike Chen", time: "4 hours ago", type: "info" },
    { id: 3, action: "Performance review completed", employee: "Emily Davis", time: "6 hours ago", type: "success" },
    { id: 4, action: "Document uploaded", employee: "Alex Rodriguez", time: "1 day ago", type: "warning" }
  ]

  const pendingTasks = [
    { id: 1, task: "Review performance evaluations", deadline: "Today", priority: "high" },
    { id: 2, task: "Approve leave requests", deadline: "Tomorrow", priority: "medium" },
    { id: 3, task: "Update employee handbook", deadline: "This week", priority: "low" }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
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
            <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "success" ? "bg-green-100" : activity.type === "info" ? "bg-blue-100" : "bg-yellow-100"
                    }`}
                  >
                    {activity.type === "success" ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : activity.type === "info" ? (
                      <Clock size={16} className="text-blue-600" />
                    ) : (
                      <AlertTriangle size={16} className="text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.employee}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
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
                <div key={task.id} className="p-3 border border-gray-200 rounded-lg">
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

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <UserPlus size={24} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Add Employee</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar size={24} className="text-green-600" />
            <span className="text-sm font-medium text-gray-700">Schedule Meeting</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Award size={24} className="text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Performance Review</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp size={24} className="text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Generate Report</span>
          </button>
        </div>
      </Card>
    </div>
  )
}
