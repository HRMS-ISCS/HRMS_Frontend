// // src/components/Calendar.jsx
// import React, { useState, useEffect } from "react"
// import { useDarkMode } from "@/context/DarkModeContext"
// import { CalendarDays, ChevronLeft, ChevronRight, Upload, X, FileSpreadsheet, Plus, Trash2 } from "lucide-react"
// import { toast } from "sonner"
// import { apiRequest } from "@/api"

// export default function CalendarComponent({ user }) {
//   const { darkMode } = useDarkMode()
//   const [currentDate, setCurrentDate] = useState(new Date())
//   const [holidays, setHolidays] = useState([])
//   const [showUploadModal, setShowUploadModal] = useState(false)
//   const [showAddHolidayModal, setShowAddHolidayModal] = useState(false)
//   const [uploadedFile, setUploadedFile] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [newHoliday, setNewHoliday] = useState({
//     date: "",
//     name: "",
//     color: "orange"
//   })
  
//   const monthNames = ["January", "February", "March", "April", "May", "June", 
//                       "July", "August", "September", "October", "November", "December"]
//   const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  
//   // Fetch holidays from API on component mount
//   useEffect(() => {
//     fetchHolidays()
//   }, [])
  
//   const fetchHolidays = async () => {
//     try {
//       setIsLoading(true)
//       const currentYear = new Date().getFullYear()
//       const response = await apiRequest(`/calendar/holidays?year=${currentYear}`)
      
//       // Convert date strings to Date objects for the frontend
//       const formattedHolidays = response.map(holiday => ({
//         ...holiday,
//         date: new Date(holiday.date)
//       }))
      
//       setHolidays(formattedHolidays)
//     } catch (error) {
//       console.error("Error fetching holidays:", error)
//       toast.error("Failed to fetch holidays")
//     } finally {
//       setIsLoading(false)
//     }
//   }
  
//   const getDaysInMonth = (date) => {
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
//   }
  
//   const getFirstDayOfMonth = (date) => {
//     return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
//   }
  
//   const isHoliday = (day) => {
//     return holidays.some(holiday => 
//       holiday.date.getDate() === day &&
//       holiday.date.getMonth() === currentDate.getMonth() &&
//       holiday.date.getFullYear() === currentDate.getFullYear()
//     )
//   }
  
//   const getHolidayName = (day) => {
//     const holiday = holidays.find(h => 
//       h.date.getDate() === day &&
//       h.date.getMonth() === currentDate.getMonth() &&
//       h.date.getFullYear() === currentDate.getFullYear()
//     )
//     return holiday ? holiday.name : ""
//   }
  
//   const isToday = (day) => {
//     const today = new Date()
//     return day === today.getDate() && 
//            currentDate.getMonth() === today.getMonth() && 
//            currentDate.getFullYear() === today.getFullYear()
//   }
  
//   const changeMonth = (direction) => {
//     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
//   }
  
//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setUploadedFile(file)
//       setIsLoading(true)
      
//       try {
//         const formData = new FormData()
//         formData.append("file", file)
        
//         const response = await apiRequest("/calendar/holidays/upload", {
//           method: "POST",
//           body: formData
//         })
        
//         toast.success(response.message)
//         setShowUploadModal(false)
//         setUploadedFile(null)
//         // Refresh holidays after upload
//         fetchHolidays()
//       } catch (error) {
//         console.error("Error uploading file:", error)
//         toast.error(error.message || "Failed to upload holidays")
//       } finally {
//         setIsLoading(false)
//       }
//     }
//   }
  
//   const handleAddHoliday = async () => {
//     if (!newHoliday.date || !newHoliday.name) {
//       toast.error("Please provide both date and name")
//       return
//     }
    
//     setIsLoading(true)
    
//     try {
//       const response = await apiRequest(`/calendar/holidays?holiday_date=${newHoliday.date}&name=${newHoliday.name}&color=${newHoliday.color}`, {
//         method: "POST"
//       })
      
//       toast.success(`Holiday "${response.name}" added successfully`)
//       setShowAddHolidayModal(false)
//       setNewHoliday({ date: "", name: "", color: "orange" })
//       // Refresh holidays after adding
//       fetchHolidays()
//     } catch (error) {
//       console.error("Error adding holiday:", error)
//       toast.error(error.message || "Failed to add holiday")
//     } finally {
//       setIsLoading(false)
//     }
//   }
  
//   const handleDeleteHoliday = async (holidayId) => {
//     if (!window.confirm("Are you sure you want to delete this holiday?")) {
//       return
//     }
    
//     setIsLoading(true)
    
//     try {
//       await apiRequest(`/calendar/holidays/${holidayId}`, {
//         method: "DELETE"
//       })
      
//       toast.success("Holiday deleted successfully")
//       // Refresh holidays after deletion
//       fetchHolidays()
//     } catch (error) {
//       console.error("Error deleting holiday:", error)
//       toast.error(error.message || "Failed to delete holiday")
//     } finally {
//       setIsLoading(false)
//     }
//   }
  
//   const handleDeleteAllHolidays = async () => {
//     if (!window.confirm("Are you sure you want to delete all holidays? This action cannot be undone.")) {
//       return
//     }
    
//     setIsLoading(true)
    
//     try {
//       const response = await apiRequest("/calendar/holidays", {
//         method: "DELETE"
//       })
      
//       toast.success(response.message)
//       // Refresh holidays after deletion
//       fetchHolidays()
//     } catch (error) {
//       console.error("Error deleting all holidays:", error)
//       toast.error(error.message || "Failed to delete holidays")
//     } finally {
//       setIsLoading(false)
//     }
//   }
  
//   const renderCalendarDays = () => {
//     const daysInMonth = getDaysInMonth(currentDate)
//     const firstDay = getFirstDayOfMonth(currentDate)
//     const days = []
    
//     // Add empty cells for days before the first day of the month
//     for (let i = 0; i < firstDay; i++) {
//       days.push(<div key={`empty-${i}`} className="h-10 md:h-12"></div>)
//     }
    
//     // Add days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const isHolidayDay = isHoliday(day)
//       const isTodayDay = isToday(day)
      
//       days.push(
//         <div 
//           key={day} 
//           className={`h-10 md:h-12 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
//             isHolidayDay 
//               ? darkMode 
//                 ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-md shadow-orange-500/30 border border-orange-500' 
//                 : 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-md shadow-orange-400/30 border border-orange-400'
//               : isTodayDay 
//                 ? darkMode 
//                   ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/30 border border-blue-500' 
//                   : 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-md shadow-blue-400/30 border border-blue-400'
//                 : darkMode 
//                   ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 shadow-sm border border-gray-600' 
//                   : 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-200'
//           }`}
//         >
//           <div className="text-sm font-bold">{day}</div>
//           {isHolidayDay && (
//             <div className="text-xs mt-0.5 font-medium opacity-90 truncate px-1 w-full text-center">{getHolidayName(day)}</div>
//           )}
//         </div>
//       )
//     }
    
//     return days
//   }
  
//   // Check if user has admin privileges (you may need to adjust this based on your user model)
//   const canManageHolidays = user && (user.role === 'superadmin' || user.role === 'admin' || user.role === 'hr')
  
//   return (
//     <div className="p-4 md:p-6 w-full h-full">
//       <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div className="flex items-center gap-3">
//           <CalendarDays size={28} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
//           <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//             Calendar
//           </h1>
//         </div>
        
//         {canManageHolidays && (
//           <div className="flex gap-2">
//             <button
//               onClick={() => setShowAddHolidayModal(true)}
//               className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
//                 darkMode 
//                   ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white' 
//                   : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
//               }`}
//             >
//               <Plus size={16} className="hidden sm:block" />
//               <span className="text-sm">Add Holiday</span>
//             </button>
            
//             <button
//               onClick={() => setShowUploadModal(true)}
//               className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
//                 darkMode 
//                   ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white' 
//                   : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
//               }`}
//             >
//               <Upload size={16} className="hidden sm:block" />
//               <span className="text-sm">Upload</span>
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Upload Modal */}
//       {showUploadModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl transform transition-all ${
//             darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
//           }`}>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className={`text-xl font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//                 <FileSpreadsheet size={20} className={darkMode ? 'text-green-400' : 'text-green-600'} />
//                 Upload Holiday Calendar
//               </h2>
//               <button
//                 onClick={() => setShowUploadModal(false)}
//                 className={`p-2 rounded-full transition-all ${
//                   darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
//                 }`}
//               >
//                 <X size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
//               </button>
//             </div>
            
//             <div className="mb-6">
//               <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 Select File (CSV or Excel)
//               </label>
//               <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
//                 darkMode ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
//               }`}>
//                 <input
//                   type="file"
//                   accept=".csv,.xlsx,.xls"
//                   onChange={handleFileUpload}
//                   className="hidden"
//                   id="file-upload"
//                   disabled={isLoading}
//                 />
//                 <label htmlFor="file-upload" className="cursor-pointer">
//                   <FileSpreadsheet size={48} className={`mx-auto mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
//                   <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                     {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
//                   </p>
//                   <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                     CSV or Excel file with Date and Holiday Name columns
//                   </p>
//                 </label>
//               </div>
//             </div>
            
//             <div className={`mb-4 p-3 rounded-lg text-xs ${
//               darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
//             }`}>
//               <p className="font-semibold mb-1">Expected format:</p>
//               <p>• CSV: Date, Holiday Name</p>
//               <p>• Excel: Column A - Date, Column B - Holiday Name</p>
//               <p>• Date formats: MM/DD/YYYY or YYYY-MM-DD</p>
//             </div>
            
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowUploadModal(false)}
//                 className={`px-6 py-2.5 rounded-xl transition-all ${
//                   darkMode 
//                     ? 'bg-gray-700 hover:bg-gray-600 text-white' 
//                     : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
//                 }`}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Holiday Modal */}
//       {showAddHolidayModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl transform transition-all ${
//             darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
//           }`}>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className={`text-xl font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//                 <Plus size={20} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
//                 Add Holiday
//               </h2>
//               <button
//                 onClick={() => setShowAddHolidayModal(false)}
//                 className={`p-2 rounded-full transition-all ${
//                   darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
//                 }`}
//               >
//                 <X size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
//               </button>
//             </div>
            
//             <div className="mb-4">
//               <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 Date
//               </label>
//               <input
//                 type="date"
//                 value={newHoliday.date}
//                 onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
//                 className={`w-full px-3 py-2 rounded-lg border ${
//                   darkMode 
//                     ? 'bg-gray-700 border-gray-600 text-white' 
//                     : 'bg-white border-gray-300 text-gray-800'
//                 }`}
//               />
//             </div>
            
//             <div className="mb-4">
//               <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 Holiday Name
//               </label>
//               <input
//                 type="text"
//                 value={newHoliday.name}
//                 onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})}
//                 className={`w-full px-3 py-2 rounded-lg border ${
//                   darkMode 
//                     ? 'bg-gray-700 border-gray-600 text-white' 
//                     : 'bg-white border-gray-300 text-gray-800'
//                 }`}
//                 placeholder="e.g., New Year's Day"
//               />
//             </div>
            
//             <div className="mb-6">
//               <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 Color
//               </label>
//               <div className="flex gap-2">
//                 {['orange', 'red', 'green', 'blue', 'purple'].map(color => (
//                   <button
//                     key={color}
//                     onClick={() => setNewHoliday({...newHoliday, color})}
//                     className={`w-8 h-8 rounded-full border-2 ${
//                       newHoliday.color === color 
//                         ? 'border-gray-800 dark:border-white' 
//                         : 'border-transparent'
//                     }`}
//                     style={{ backgroundColor: color }}
//                   />
//                 ))}
//               </div>
//             </div>
            
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowAddHolidayModal(false)}
//                 className={`px-6 py-2.5 rounded-xl transition-all ${
//                   darkMode 
//                     ? 'bg-gray-700 hover:bg-gray-600 text-white' 
//                     : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
//                 }`}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddHoliday}
//                 className={`px-6 py-2.5 rounded-xl transition-all ${
//                   darkMode 
//                     ? 'bg-blue-600 hover:bg-blue-700 text-white' 
//                     : 'bg-blue-500 hover:bg-blue-600 text-white'
//                 }`}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Adding..." : "Add Holiday"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Calendar Component */}
//       <div className={`w-full rounded-2xl p-4 md:p-6 shadow-xl ${
//         darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
//       }`}>
//         <div className="flex justify-between items-center mb-4 md:mb-6">
//           <button 
//             onClick={() => changeMonth(-1)}
//             className={`p-2 rounded-full transition-all ${
//               darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
//             }`}
//           >
//             <ChevronLeft size={20} />
//           </button>
          
//           <h2 className={`text-lg md:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//             {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
//           </h2>
          
//           <button 
//             onClick={() => changeMonth(1)}
//             className={`p-2 rounded-full transition-all ${
//               darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
//             }`}
//           >
//             <ChevronRight size={20} />
//           </button>
//         </div>
        
//         {/* Week days */}
//         <div className="grid grid-cols-7 gap-2 mb-3">
//           {weekDays.map(day => (
//             <div key={day} className={`text-center font-semibold text-xs md:text-sm ${
//               darkMode ? 'text-gray-400' : 'text-gray-600'
//             }`}>
//               {day}
//             </div>
//           ))}
//         </div>
        
//         {/* Calendar days grid */}
//         <div className="grid grid-cols-7 gap-2 w-full">
//           {renderCalendarDays()}
//         </div>
//       </div>
      
//       {/* Holiday Legend */}
//       <div className={`w-full mt-4 md:mt-6 rounded-2xl p-4 md:p-6 shadow-xl ${
//         darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
//       }`}>
//         <div className="flex justify-between items-center mb-3 md:mb-4">
//           <h2 className={`text-lg md:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//             Holidays ({holidays.length})
//           </h2>
//           {canManageHolidays && holidays.length > 0 && (
//             <button
//               onClick={handleDeleteAllHolidays}
//               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
//                 darkMode 
//                   ? 'bg-red-600 hover:bg-red-700 text-white' 
//                   : 'bg-red-500 hover:bg-red-600 text-white'
//               }`}
//               disabled={isLoading}
//             >
//               <Trash2 size={16} />
//               <span className="text-sm">Delete All</span>
//             </button>
//           )}
//         </div>
        
//         {isLoading ? (
//           <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//           </div>
//         ) : holidays.length === 0 ? (
//           <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//             No holidays found. {canManageHolidays && "Upload a holiday calendar or add holidays manually."}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
//             {holidays.map((holiday, index) => (
//               <div key={index} className="flex items-center gap-2 md:gap-3 p-2 rounded-lg hover:bg-opacity-50 transition-all">
//                 <div 
//                   className="w-3 h-3 md:w-4 md:h-4 rounded-full shadow-md" 
//                   style={{ backgroundColor: holiday.color || 'orange' }}
//                 ></div>
//                 <div className="min-w-0 flex-1">
//                   <div className={`font-medium text-sm md:text-base truncate ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
//                     {holiday.name}
//                   </div>
//                   <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                     {holiday.date.toLocaleDateString('en-US', { 
//                       month: 'short', 
//                       day: 'numeric', 
//                       year: 'numeric' 
//                     })}
//                   </div>
//                 </div>
//                 {canManageHolidays && (
//                   <button
//                     onClick={() => handleDeleteHoliday(holiday.id)}
//                     className={`p-1 rounded-full transition-all ${
//                       darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
//                     }`}
//                   >
//                     <X size={16} />
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
// src/components/Calendar.jsx
import React, { useState, useEffect } from "react"
import { useDarkMode } from "@/context/DarkModeContext"
import { CalendarDays, ChevronLeft, ChevronRight, Upload, X, FileSpreadsheet, Plus, Trash2, Download } from "lucide-react"
import { toast } from "sonner"
import { apiRequest } from "@/api"

export default function CalendarComponent({ user }) {
  const { darkMode } = useDarkMode()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [holidays, setHolidays] = useState([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showAddHolidayModal, setShowAddHolidayModal] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [newHoliday, setNewHoliday] = useState({
    date: "",
    name: "",
    color: "orange"
  })
  
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"]
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Fetch holidays from API on component mount
  useEffect(() => {
    fetchHolidays()
  }, [])
  
  const fetchHolidays = async () => {
    try {
      setIsLoading(true)
      const currentYear = new Date().getFullYear()
      const response = await apiRequest(`/calendar/holidays?year=${currentYear}`)
      
      // Convert date strings to Date objects for the frontend
      const formattedHolidays = response.map(holiday => ({
        ...holiday,
        date: new Date(holiday.date)
      }))
      
      setHolidays(formattedHolidays)
    } catch (error) {
      console.error("Error fetching holidays:", error)
      toast.error("Failed to fetch holidays")
    } finally {
      setIsLoading(false)
    }
  }
  
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
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
      setIsLoading(true)
      
      try {
        const formData = new FormData()
        formData.append("file", file)
        
        const response = await apiRequest("/calendar/holidays/upload", {
          method: "POST",
          body: formData
        })
        
        toast.success(response.message)
        setShowUploadModal(false)
        setUploadedFile(null)
        // Refresh holidays after upload
        fetchHolidays()
      } catch (error) {
        console.error("Error uploading file:", error)
        toast.error(error.message || "Failed to upload holidays")
      } finally {
        setIsLoading(false)
      }
    }
  }
  
  const handleAddHoliday = async () => {
    if (!newHoliday.date || !newHoliday.name) {
      toast.error("Please provide both date and name")
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await apiRequest(`/calendar/holidays?holiday_date=${newHoliday.date}&name=${newHoliday.name}&color=${newHoliday.color}`, {
        method: "POST"
      })
      
      toast.success(`Holiday "${response.name}" added successfully`)
      setShowAddHolidayModal(false)
      setNewHoliday({ date: "", name: "", color: "orange" })
      // Refresh holidays after adding
      fetchHolidays()
    } catch (error) {
      console.error("Error adding holiday:", error)
      toast.error(error.message || "Failed to add holiday")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDeleteHoliday = async (holidayId) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) {
      return
    }
    
    setIsLoading(true)
    
    try {
      await apiRequest(`/calendar/holidays/${holidayId}`, {
        method: "DELETE"
      })
      
      toast.success("Holiday deleted successfully")
      // Refresh holidays after deletion
      fetchHolidays()
    } catch (error) {
      console.error("Error deleting holiday:", error)
      toast.error(error.message || "Failed to delete holiday")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDeleteAllHolidays = async () => {
    if (!window.confirm("Are you sure you want to delete all holidays? This action cannot be undone.")) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await apiRequest("/calendar/holidays", {
        method: "DELETE"
      })
      
      toast.success(response.message)
      // Refresh holidays after deletion
      fetchHolidays()
    } catch (error) {
      console.error("Error deleting all holidays:", error)
      toast.error(error.message || "Failed to delete holidays")
    } finally {
      setIsLoading(false)
    }
  }
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 md:h-12"></div>)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isHolidayDay = isHoliday(day)
      const isTodayDay = isToday(day)
      
      days.push(
        <div 
          key={day} 
          className={`h-8 sm:h-10 md:h-12 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
            isMobile ? 'text-xs' : 'text-sm'
          } ${
            isHolidayDay 
              ? darkMode 
                ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-md border border-orange-500' 
                : 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-md border border-orange-400'
              : isTodayDay 
                ? darkMode 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md border border-blue-500' 
                  : 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-md border border-blue-400'
                : darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 shadow-sm border border-gray-600' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-200'
          }`}
        >
          <div className="font-bold">{day}</div>
          {isHolidayDay && !isMobile && (
            <div className="text-xs mt-0.5 font-medium opacity-90 truncate px-1 w-full text-center hidden sm:block">
              {getHolidayName(day)}
            </div>
          )}
          {isHolidayDay && isMobile && (
            <div className="w-1 h-1 rounded-full bg-white/80 mt-0.5"></div>
          )}
        </div>
      )
    }
    
    return days
  }
  
  // Check if user has admin privileges
  const canManageHolidays = user && (user.role === 'superadmin' || user.role === 'admin' || user.role === 'hr')
  
  return (
    <div className="p-3 sm:p-4 md:p-6 w-full h-full overflow-x-hidden">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <CalendarDays size={isMobile ? 24 : 28} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
          <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Calendar
          </h1>
        </div>
        
        {canManageHolidays && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddHolidayModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-md text-sm ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
              }`}
            >
              <Plus size={16} />
              <span className={isMobile ? 'hidden sm:inline' : ''}>Add Holiday</span>
            </button>
            
            <button
              onClick={() => setShowUploadModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-md text-sm ${
                darkMode 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
              }`}
            >
              <Upload size={16} />
              <span className={isMobile ? 'hidden sm:inline' : ''}>Upload</span>
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md p-4 sm:p-6 rounded-2xl shadow-2xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className={`text-lg sm:text-xl font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <FileSpreadsheet size={20} className={darkMode ? 'text-green-400' : 'text-green-600'} />
                Upload Holiday Calendar
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className={`p-1 sm:p-2 rounded-full transition-all ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            </div>
            
            <div className="mb-4 sm:mb-6">
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Select File (CSV or Excel)
              </label>
              <div className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center transition-all ${
                darkMode ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={isLoading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileSpreadsheet size={isMobile ? 36 : 48} className={`mx-auto mb-2 sm:mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {uploadedFile ? uploadedFile.name : "Click to upload"}
                  </p>
                  <p className={`text-xs mt-1 sm:mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    CSV or Excel file
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
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className={`px-4 sm:px-6 py-2 rounded-xl transition-all text-sm ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Holiday Modal */}
      {showAddHolidayModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md p-4 sm:p-6 rounded-2xl shadow-2xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className={`text-lg sm:text-xl font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Plus size={20} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                Add Holiday
              </h2>
              <button
                onClick={() => setShowAddHolidayModal(false)}
                className={`p-1 sm:p-2 rounded-full transition-all ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Date
              </label>
              <input
                type="date"
                value={newHoliday.date}
                onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
            </div>
            
            <div className="mb-4">
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Holiday Name
              </label>
              <input
                type="text"
                value={newHoliday.name}
                onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
                placeholder="e.g., New Year's Day"
              />
            </div>
            
            <div className="mb-4 sm:mb-6">
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Color
              </label>
              <div className="flex gap-2">
                {['orange', 'red', 'green', 'blue', 'purple'].map(color => (
                  <button
                    key={color}
                    onClick={() => setNewHoliday({...newHoliday, color})}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 ${
                      newHoliday.color === color 
                        ? 'border-gray-800 dark:border-white' 
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddHolidayModal(false)}
                className={`px-4 sm:px-6 py-2 rounded-xl transition-all text-sm ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddHoliday}
                className={`px-4 sm:px-6 py-2 rounded-xl transition-all text-sm ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Component */}
      <div className={`w-full rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl ${
        darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
          <button 
            onClick={() => changeMonth(-1)}
            className={`p-1 sm:p-2 rounded-full transition-all ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronLeft size={isMobile ? 18 : 20} />
          </button>
          
          <h2 className={`text-base sm:text-lg md:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button 
            onClick={() => changeMonth(1)}
            className={`p-1 sm:p-2 rounded-full transition-all ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronRight size={isMobile ? 18 : 20} />
          </button>
        </div>
        
        {/* Week days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3">
          {weekDays.map(day => (
            <div key={day} className={`text-center font-semibold text-xs sm:text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 w-full">
          {renderCalendarDays()}
        </div>
      </div>
      
      {/* Holiday Legend */}
      <div className={`w-full mt-3 sm:mt-4 md:mt-6 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl ${
        darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className={`text-base sm:text-lg md:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Holidays ({holidays.length})
          </h2>
          {canManageHolidays && holidays.length > 0 && (
            <button
              onClick={handleDeleteAllHolidays}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg transition-all text-sm ${
                darkMode 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              disabled={isLoading}
            >
              <Trash2 size={14} className="sm:size-4" />
              <span className={isMobile ? 'hidden sm:inline' : ''}>Delete All</span>
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : holidays.length === 0 ? (
          <div className={`text-center py-6 sm:py-8 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No holidays found. {canManageHolidays && "Upload a holiday calendar or add holidays manually."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {holidays.map((holiday, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-opacity-50 transition-all">
                <div 
                  className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full shadow-md flex-shrink-0" 
                  style={{ backgroundColor: holiday.color || 'orange' }}
                ></div>
                <div className="min-w-0 flex-1">
                  <div className={`font-medium text-xs sm:text-sm md:text-base truncate ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {holiday.name}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {holiday.date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
                {canManageHolidays && (
                  <button
                    onClick={() => handleDeleteHoliday(holiday.id)}
                    className={`p-1 rounded-full transition-all flex-shrink-0 ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                    }`}
                  >
                    <X size={14} className="sm:size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}