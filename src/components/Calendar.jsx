// src/components/Calendar.jsx
import React, { useState } from "react"
import { useDarkMode } from "@/context/DarkModeContext"
import { CalendarDays, ChevronLeft, ChevronRight, Upload, X, FileSpreadsheet } from "lucide-react"
import { toast } from "sonner"

export default function CalendarComponent({ user }) {
  const { darkMode } = useDarkMode()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [holidays, setHolidays] = useState([
    { date: new Date(currentDate.getFullYear(), 0, 14), name: "Sankrathi", color: "orange" },
    { date: new Date(currentDate.getFullYear(), 7, 15), name: "Independence Day", color: "orange" },
    { date: new Date(currentDate.getFullYear(), 9, 2), name: "Gandhi Jayanti", color: "orange" },
    { date: new Date(currentDate.getFullYear(), 11, 25), name: "Christmas", color: "orange" }
  ])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"]
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }
  
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }
  
  const isHoliday = (day) => {
    return holidays.some(holiday => 
      holiday.date.getDate() === day &&
      holiday.date.getMonth() === currentDate.getMonth() &&
      holiday.date.getFullYear() === currentDate.getFullYear()
    )
  }
  
  const getHolidayName = (day) => {
    const holiday = holidays.find(h => 
      h.date.getDate() === day &&
      h.date.getMonth() === currentDate.getMonth() &&
      h.date.getFullYear() === currentDate.getFullYear()
    )
    return holiday ? holiday.name : ""
  }
  
  const isToday = (day) => {
    const today = new Date()
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear()
  }
  
  const changeMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      
      if (file.name.endsWith('.csv')) {
        reader.onload = (event) => {
          parseCSV(event.target.result)
        }
        reader.readAsText(file)
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.onload = (event) => {
          parseExcel(event.target.result)
        }
        reader.readAsArrayBuffer(file)
      } else {
        toast.error("Please upload a CSV or Excel file")
      }
    }
  }
  
  const parseCSV = (content) => {
    try {
      const lines = content.split('\n').filter(line => line.trim())
      const newHolidays = []
      
      // Skip header if exists
      const startIndex = lines[0].toLowerCase().includes('date') ? 1 : 0
      
      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(',')
        if (parts.length >= 2) {
          const dateStr = parts[0].trim()
          const name = parts[1].trim()
          
          // Try different date formats
          let date
          if (dateStr.includes('/')) {
            // MM/DD/YYYY or DD/MM/YYYY format
            const [month, day, year] = dateStr.split('/').map(Number)
            date = new Date(year, month - 1, day)
          } else if (dateStr.includes('-')) {
            // YYYY-MM-DD format
            const [year, month, day] = dateStr.split('-').map(Number)
            date = new Date(year, month - 1, day)
          } else {
            continue
          }
          
          if (!isNaN(date.getTime())) {
            newHolidays.push({
              date: date,
              name: name,
              color: "orange"
            })
          }
        }
      }
      
      if (newHolidays.length > 0) {
        setHolidays(newHolidays)
        localStorage.setItem("holidays", JSON.stringify(newHolidays))
        toast.success(`Successfully loaded ${newHolidays.length} holidays`)
        setShowUploadModal(false)
      } else {
        toast.error("No valid holidays found in the file")
      }
    } catch (error) {
      console.error("Error parsing CSV:", error)
      toast.error("Error parsing CSV file")
    }
  }
  
  const parseExcel = (arrayBuffer) => {
    try {
      // For simplicity, we'll convert to CSV-like format
      // In a real app, you'd use a library like xlsx or sheetjs
      const data = new Uint8Array(arrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
      
      const newHolidays = []
      
      // Skip header if exists
      const startIndex = jsonData[0] && jsonData[0][0] && jsonData[0][0].toLowerCase().includes('date') ? 1 : 0
      
      for (let i = startIndex; i < jsonData.length; i++) {
        const row = jsonData[i]
        if (row && row.length >= 2) {
          const dateStr = String(row[0]).trim()
          const name = String(row[1]).trim()
          
          // Try different date formats
          let date
          if (dateStr.includes('/')) {
            const [month, day, year] = dateStr.split('/').map(Number)
            date = new Date(year, month - 1, day)
          } else if (dateStr.includes('-')) {
            const [year, month, day] = dateStr.split('-').map(Number)
            date = new Date(year, month - 1, day)
          } else {
            continue
          }
          
          if (!isNaN(date.getTime())) {
            newHolidays.push({
              date: date,
              name: name,
              color: "orange"
            })
          }
        }
      }
      
      if (newHolidays.length > 0) {
        setHolidays(newHolidays)
        localStorage.setItem("holidays", JSON.stringify(newHolidays))
        toast.success(`Successfully loaded ${newHolidays.length} holidays`)
        setShowUploadModal(false)
      } else {
        toast.error("No valid holidays found in the file")
      }
    } catch (error) {
      console.error("Error parsing Excel:", error)
      toast.error("Error parsing Excel file. Please ensure it's a valid Excel file.")
    }
  }
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isHolidayDay = isHoliday(day)
      const isTodayDay = isToday(day)
      
      days.push(
        <div 
          key={day} 
          className={`h-12 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            isHolidayDay 
              ? darkMode 
                ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-md shadow-orange-500/30 border border-orange-500' 
                : 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-md shadow-orange-400/30 border border-orange-400'
              : isTodayDay 
                ? darkMode 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/30 border border-blue-500' 
                  : 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-md shadow-blue-400/30 border border-blue-400'
                : darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 shadow-sm border border-gray-600' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-200'
          }`}
        >
          <div className="text-sm font-bold">{day}</div>
          {isHolidayDay && (
            <div className="text-xs mt-0.5 font-medium opacity-90 truncate px-1 w-full text-center">{getHolidayName(day)}</div>
          )}
        </div>
      )
    }
    
    return days
  }
  
  return (
    <div className="p-6 w-full h-full">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CalendarDays size={28} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Calendar
          </h1>
        </div>
        
        {/* Upload Button on Right Side */}
        <button
          onClick={() => setShowUploadModal(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
            darkMode 
              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white' 
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
          }`}
        >
          <Upload size={18} />
          Upload Holiday Calendar
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl transform transition-all ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <FileSpreadsheet size={20} className={darkMode ? 'text-green-400' : 'text-green-600'} />
                Upload Holiday Calendar
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className={`p-2 rounded-full transition-all ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            </div>
            
            <div className="mb-6">
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Select File (CSV or Excel)
              </label>
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                darkMode ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileSpreadsheet size={56} className={`mx-auto mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
                  </p>
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    CSV or Excel file with Date and Holiday Name columns
                  </p>
                </label>
              </div>
            </div>
            
            <div className={`mb-4 p-3 rounded-lg text-xs ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              <p className="font-semibold mb-1">Expected format:</p>
              <p>• CSV: Date, Holiday Name</p>
              <p>• Excel: Column A - Date, Column B - Holiday Name</p>
              <p>• Date formats: MM/DD/YYYY or YYYY-MM-DD</p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className={`px-6 py-2.5 rounded-xl transition-all ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Width Calendar Component */}
      <div className={`w-full rounded-2xl p-6 shadow-xl ${
        darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => changeMonth(-1)}
            className={`p-2 rounded-full transition-all ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button 
            onClick={() => changeMonth(1)}
            className={`p-2 rounded-full transition-all ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Week days */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {weekDays.map(day => (
            <div key={day} className={`text-center font-semibold text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days grid - Smaller card-like tiles */}
        <div className="grid grid-cols-7 gap-2 w-full">
          {renderCalendarDays()}
        </div>
      </div>
      
      {/* Full Width Holiday Legend */}
      <div className={`w-full mt-6 rounded-2xl p-6 shadow-xl ${
        darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Holidays ({holidays.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {holidays.map((holiday, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-md"></div>
              <div>
                <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {holiday.name}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {holiday.date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}