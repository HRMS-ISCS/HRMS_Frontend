// src/components/Appointment.jsx
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Download,
    RefreshCw,
    AlertCircle,
    User,
    MapPin,
    Briefcase,
    Calendar,
    DollarSign,
    CheckCircle,
} from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";
import { getToken } from "../api";
import { useToast } from "@/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function Appointment() {
    const { darkMode } = useDarkMode();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [generatedFilename, setGeneratedFilename] = useState(null);

    const [formData, setFormData] = useState({
        employee_name: "",
        gender_prefix: "",
        father_name: "",
        address_line1: "",
        address_line2: "",
        address_line3: "",
        designation: "",
        date_of_joining: "",
        annual_ctc: "",
        letter_date: "",
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const buildRequestBody = () => {
        const body = {};
        if (formData.employee_name.trim()) body.employee_name = formData.employee_name.trim();
        if (formData.gender_prefix) body.gender_prefix = formData.gender_prefix;
        if (formData.father_name.trim()) body.father_name = formData.father_name.trim();
        if (formData.address_line1.trim()) body.address_line1 = formData.address_line1.trim();
        if (formData.address_line2.trim()) body.address_line2 = formData.address_line2.trim();
        if (formData.address_line3.trim()) body.address_line3 = formData.address_line3.trim();
        if (formData.designation.trim()) body.designation = formData.designation.trim();
        if (formData.date_of_joining) body.date_of_joining = formData.date_of_joining;
        if (formData.annual_ctc) body.annual_ctc = parseFloat(formData.annual_ctc);
        if (formData.letter_date) body.letter_date = formData.letter_date;
        return body;
    };

    const handleGenerate = async () => {
        setLoading(true);
        setGeneratedFilename(null);

        try {
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/appointment-letter/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(buildRequestBody()),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Failed to generate appointment letter");
            }

            // Extract filename from Content-Disposition header
            const contentDisposition = response.headers.get("Content-Disposition");
            let filename = "Appointment_Letter.pdf";
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match) filename = match[1];
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setGeneratedFilename(filename);

            toast({
                title: "Success",
                description: `Appointment letter generated: ${filename}`,
                className: darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-100"
                    : "bg-white border-gray-200 text-gray-800",
            });
        } catch (err) {
            console.error("Error generating appointment letter:", err);
            toast({
                title: "Generation Failed",
                description: err.message || "Failed to generate appointment letter. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            employee_name: "",
            gender_prefix: "",
            father_name: "",
            address_line1: "",
            address_line2: "",
            address_line3: "",
            designation: "",
            date_of_joining: "",
            annual_ctc: "",
            letter_date: "",
        });
        setGeneratedFilename(null);
    };

    const inputClass = `h-10 text-sm ${
        darkMode
            ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500 placeholder-gray-400"
            : "border-gray-300 focus:border-blue-500"
    }`;

    const labelClass = `text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1 block`;

    const sectionCardClass = `p-4 sm:p-5 mb-4 sm:mb-6 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border border-gray-200"
    } shadow-sm`;

    const sectionTitleClass = `text-base sm:text-lg font-semibold ${
        darkMode ? "text-gray-100" : "text-gray-800"
    }`;

    return (
        <div className={`w-full min-h-screen p-3 sm:p-4 md:p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            {/* Header */}
            <div className="mb-4 sm:mb-6">
                <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"} mb-2`}>
                    Appointment Letter Generator
                </h1>
                <p className={`text-sm sm:text-base ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Generate and download appointment letters for employees as PDF
                </p>
            </div>

            {/* Info Note */}
            <div
                className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border flex items-start gap-3 ${
                    darkMode
                        ? "bg-blue-900/20 border-blue-800 text-blue-300"
                        : "bg-blue-50 border-blue-200 text-blue-700"
                }`}
            >
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm">
                    <strong>Note:</strong> All fields are optional. Omitted fields will be left blank in
                    the generated PDF. If <strong>Annual CTC</strong> is provided, the full salary breakup
                    is auto-calculated. If <strong>Letter Date</strong> is omitted, today's date is used.
                </p>
            </div>

            {/* ── Section 1: Employee Identity ── */}
            <Card className={sectionCardClass}>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <User className={darkMode ? "text-blue-400" : "text-blue-600"} size={16} />
                    <h2 className={sectionTitleClass}>Employee Identity</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Gender Prefix */}
                    <div>
                        <Label className={labelClass}>Salutation</Label>
                        <Select
                            value={formData.gender_prefix}
                            onValueChange={(val) => handleChange("gender_prefix", val)}
                        >
                            <SelectTrigger
                                className={`w-full h-10 text-sm ${
                                    darkMode
                                        ? "bg-gray-700 text-white border-gray-600"
                                        : "bg-white border-gray-300"
                                }`}
                            >
                                <SelectValue placeholder="Select salutation" />
                            </SelectTrigger>
                            <SelectContent
                                className={darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"}
                            >
                                <SelectItem value="Mr.">Mr.</SelectItem>
                                <SelectItem value="Ms.">Ms.</SelectItem>
                                <SelectItem value="Mrs.">Mrs.</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Employee Name */}
                    <div>
                        <Label className={labelClass}>Employee Full Name</Label>
                        <Input
                            value={formData.employee_name}
                            onChange={(e) => handleChange("employee_name", e.target.value)}
                            placeholder="e.g. Rajesh Kumar Sharma"
                            className={inputClass}
                            maxLength={100}
                        />
                    </div>

                    {/* Father Name */}
                    <div>
                        <Label className={labelClass}>Father's / Guardian's Name</Label>
                        <Input
                            value={formData.father_name}
                            onChange={(e) => handleChange("father_name", e.target.value)}
                            placeholder="e.g. Suresh Kumar Sharma"
                            className={inputClass}
                            maxLength={100}
                        />
                    </div>
                </div>
            </Card>

            {/* ── Section 2: Address ── */}
            <Card className={sectionCardClass}>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <MapPin className={darkMode ? "text-green-400" : "text-green-600"} size={16} />
                    <h2 className={sectionTitleClass}>Address</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <Label className={labelClass}>Address Line 1</Label>
                        <Input
                            value={formData.address_line1}
                            onChange={(e) => handleChange("address_line1", e.target.value)}
                            placeholder="e.g. Flat 402, Skyline Apartments"
                            className={inputClass}
                            maxLength={200}
                        />
                    </div>
                    <div>
                        <Label className={labelClass}>Address Line 2</Label>
                        <Input
                            value={formData.address_line2}
                            onChange={(e) => handleChange("address_line2", e.target.value)}
                            placeholder="e.g. Madhapur, Hyderabad"
                            className={inputClass}
                            maxLength={200}
                        />
                    </div>
                    <div>
                        <Label className={labelClass}>Address Line 3</Label>
                        <Input
                            value={formData.address_line3}
                            onChange={(e) => handleChange("address_line3", e.target.value)}
                            placeholder="e.g. Telangana – 500081"
                            className={inputClass}
                            maxLength={200}
                        />
                    </div>
                </div>
            </Card>

            {/* ── Section 3: Appointment Details ── */}
            <Card className={sectionCardClass}>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Briefcase className={darkMode ? "text-purple-400" : "text-purple-600"} size={16} />
                    <h2 className={sectionTitleClass}>Appointment Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Designation */}
                    <div className="sm:col-span-2">
                        <Label className={labelClass}>Designation</Label>
                        <Input
                            value={formData.designation}
                            onChange={(e) => handleChange("designation", e.target.value)}
                            placeholder="e.g. Senior Software Engineer – Consultant"
                            className={inputClass}
                            maxLength={150}
                        />
                    </div>

                    {/* Date of Joining */}
                    <div>
                        <Label className={labelClass}>Date of Joining</Label>
                        <Input
                            type="date"
                            value={formData.date_of_joining}
                            onChange={(e) => handleChange("date_of_joining", e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    {/* Annual CTC */}
                    <div>
                        <Label className={labelClass}>Annual CTC (INR)</Label>
                        <Input
                            type="number"
                            value={formData.annual_ctc}
                            onChange={(e) => handleChange("annual_ctc", e.target.value)}
                            placeholder="e.g. 1200000"
                            className={inputClass}
                            min={1}
                        />
                        <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                            Salary breakup auto-calculated if provided
                        </p>
                    </div>
                </div>
            </Card>

            {/* ── Section 4: Letter Date ── */}
            <Card className={sectionCardClass}>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <FileText className={darkMode ? "text-amber-400" : "text-amber-600"} size={16} />
                    <h2 className={sectionTitleClass}>Letter Settings</h2>
                </div>

                <div className="max-w-xs">
                    <Label className={labelClass}>Letter Date (optional)</Label>
                    <Input
                        type="date"
                        value={formData.letter_date}
                        onChange={(e) => handleChange("letter_date", e.target.value)}
                        className={inputClass}
                    />
                    <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        Defaults to today's date if left blank
                    </p>
                </div>
            </Card>

            {/* ── Success Banner ── */}
            {generatedFilename && (
                <div
                    className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border flex items-start gap-3 ${
                        darkMode
                            ? "bg-green-900/30 border-green-700 text-green-300"
                            : "bg-green-50 border-green-200 text-green-700"
                    }`}
                >
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium">Appointment letter generated successfully!</p>
                        <p className={`text-xs mt-0.5 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                            Downloaded as: <span className="font-mono">{generatedFilename}</span>
                        </p>
                    </div>
                </div>
            )}

            {/* ── Action Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-medium"
                >
                    {loading ? (
                        <>
                            <RefreshCw size={18} className="mr-2 animate-spin" />
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <Download size={18} className="mr-2" />
                            Generate & Download Appointment Letter
                        </>
                    )}
                </Button>

                <Button
                    onClick={handleReset}
                    variant="outline"
                    disabled={loading}
                    className={`px-6 py-6 text-base font-medium ${
                        darkMode
                            ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                            : "border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    Reset
                </Button>
            </div>

            {/* Footer */}
            <Card
                className={`bg-gradient-to-r ${
                    darkMode
                        ? "from-gray-800 to-gray-700 border-gray-600"
                        : "from-gray-50 to-slate-50 border-gray-200"
                } p-3 sm:p-4 md:p-5`}
            >
                <div className="text-center">
                    <h3
                        className={`text-sm sm:text-base font-semibold ${
                            darkMode ? "text-gray-100" : "text-gray-800"
                        } mb-1`}
                    >
                        ISCS Technologies Private Limited
                    </h3>
                    <p className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        APPOINTMENT LETTER MANAGEMENT SYSTEM
                    </p>
                </div>
            </Card>
        </div>
    );
}