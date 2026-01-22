// DeclarationForm.jsx
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox component
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  PenTool,
  Save,
  CheckCircle, 
  AlertCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDarkMode } from "@/context/DarkModeContext";
import { apiRequest } from "../api";

export default function DeclarationForm({ initialData, generatedEmployeeId, onSubmit, onBack }) {
  const { darkMode } = useDarkMode();
  const { toast } = useToast();
  
  // Initialize form data with new fields and default values
  const [formData, setFormData] = useState({
    ...initialData,
    sign_policies: true, // Default to true
    signature_font: "SignatureFont", // Default font
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // API-specific states
  const [declarationLoading, setDeclarationLoading] = useState(false);
  const [declarationSuccess, setDeclarationSuccess] = useState(false);
  const [declarationEmployeeId, setDeclarationEmployeeId] = useState("");

  useEffect(() => {
    if (generatedEmployeeId) {
      setDeclarationEmployeeId(generatedEmployeeId);
    }
  }, [generatedEmployeeId]);

  const declarationText = `I hereby certify that to the best of my knowledge and belief information given are correct and if during my employment with ISCS Technologies Private Limited Hyderabad or any of its offices, any of the above answers are found to be false or if there is any omission of material fact, I agree it may result in my discharge without other cause.

I voluntarily consent to a thorough investigation by ISCS Technologies Private Limited of my past employment and activities of my background. I release ISCS Technologies Private Limited from all claims arising as a result of such investigation & I release from all liability or responsibility, all persons, Companies or Corporation supplying such information.

I agree that I will take Medical Examination whenever requested and I will comply to all office safety regulations and abide by Company Rules, agreements, service rules, standing orders etc. which may be amended from time to time.`;

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const submitDeclaration = async () => {
    if (!declarationEmployeeId.trim()) {
      setErrors(prev => ({ ...prev, declarationEmployeeId: "Employee ID is required" }));
      return;
    }

    if (!formData.applicantName?.trim()) {
      setErrors(prev => ({ ...prev, applicantName: "Applicant name is required" }));
      return;
    }

    if (!formData.date) {
      setErrors(prev => ({ ...prev, date: "Date is required" }));
      return;
    }

    setDeclarationLoading(true);
    setDeclarationSuccess(false);
    
    try {
      // API payload now uses values from the form state
      const apiData = {
        name: formData.applicantName,
        date_of_declaration: formData.date,
        declaration_text: declarationText,
        sign_policies: formData.sign_policies,
        signature_font: formData.signature_font,
      };

      await apiRequest(`/users/Declaration?employee_id=${declarationEmployeeId}`, {
        method: 'POST',
        body: JSON.stringify(apiData)
      });

      setDeclarationSuccess(true);
      setErrors(prev => ({ ...prev, declarationGeneral: "" }));
      
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Declaration Saved Successfully</span>
          </div>
        ),
        description: `Your declaration has been submitted. Policies were ${formData.sign_policies ? 'signed' : 'not signed'}.`,
        className: darkMode ? "bg-green-900/80 border-green-700 text-green-100" : "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error) {
      console.error('Declaration API Error:', error);
      setErrors(prev => ({ ...prev, declarationGeneral: error.message || 'Failed to save declaration' }));
      
      toast({
        title: "Error",
        description: error.message || "Failed to save declaration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeclarationLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.place?.trim()) {
      newErrors.place = "Place is required";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    
    if (!formData.applicantName?.trim()) {
      newErrors.applicantName = "Applicant name is required";
    }
    
    if (!formData.signature?.trim()) {
      newErrors.signature = "Digital signature is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubmit(formData);
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>Declaration</h1>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Please read and acknowledge following declaration</p>
      </div>

      {generatedEmployeeId && (
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-3 px-6 py-3 ${darkMode ? 'bg-green-900/50 border-green-700' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'} rounded-full shadow-sm`}>
            <CheckCircle size={20} className={darkMode ? "text-green-400" : "text-green-600"} />
            <span className={`text-gray-700 font-medium ${darkMode ? 'text-gray-200' : ''}`}>Auto-filled Employee ID:</span>
            <span className={`text-lg font-bold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>{generatedEmployeeId}</span>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <Card className={`p-8 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileText className={darkMode ? "text-blue-400" : "text-blue-600"} size={24} />
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>DECLARATION</h2>
            </div>
            {declarationSuccess && <CheckCircle className={darkMode ? "text-green-400" : "text-green-600"} size={20} />}
          </div>
          
          <div className="mb-6">
            <Label htmlFor="declarationEmployeeId" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
              Employee ID {generatedEmployeeId ? '(Auto-filled)' : '*'}
            </Label>
            <Input
              id="declarationEmployeeId"
              value={declarationEmployeeId}
              onChange={(e) => setDeclarationEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
              className={`${errors.declarationEmployeeId ? 'border-red-500' : ''} ${generatedEmployeeId ? 
                darkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-300'
                : ''
              } ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
              readOnly={!!generatedEmployeeId}
            />
            {errors.declarationEmployeeId && <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.declarationEmployeeId}</p>}
            {generatedEmployeeId && (
              <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} mt-1`}>✓ Auto-filled from previous step</p>
            )}
          </div>
          
          <div className={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
            <p className="text-justify">
              I hereby certify that to the best of my knowledge and belief information given are correct and if during my 
              employment with ISCS Technologies Private Limited Hyderabad or any of its offices, any of the above answers are 
              found to be false or if there is any omission of material fact, I agree it may result in my discharge without other 
              cause.
            </p>
            
            <p className="text-justify">
              I voluntarily consent to a thorough investigation by ISCS Technologies Private Limited of my past employment and 
              activities of my background. I release ISCS Technologies Private Limited from all claims arising as a result of such 
              investigation & I release from all liability or responsibility, all persons, Companies or Corporation supplying such 
              information.
            </p>
            
            <p className="text-justify">
              I agree that I will take Medical Examination whenever requested and I will comply to all office safety regulations and 
              abide by Company Rules, agreements, service rules, standing orders etc. which may be amended from time to 
              time.
            </p>
          </div>
        </Card>

        <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Applicant Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm flex items-center gap-2`}>
                <MapPin size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                Place *
              </Label>
              <Input
                value={formData.place}
                onChange={(e) => handleChange('place', e.target.value)}
                placeholder="Enter place"
                className={`text-sm ${errors.place ? 'border-red-500' : ''} ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
              />
              {errors.place && <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.place}</p>}
            </div>

            <div className="space-y-2">
              <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm flex items-center gap-2`}>
                <Calendar size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                Date *
              </Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`text-sm ${errors.date ? 'border-red-500' : ''} ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
              />
              {errors.date && <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm flex items-center gap-2`}>
                <User size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                Applicant Name *
              </Label>
              <Input
                value={formData.applicantName}
                onChange={(e) => handleChange('applicantName', e.target.value)}
                placeholder="Enter your full name"
                className={`text-sm ${errors.applicantName ? 'border-red-500' : ''} ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
              />
              {errors.applicantName && <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.applicantName}</p>}
            </div>

            <div className="space-y-2">
              <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm flex items-center gap-2`}>
                <PenTool size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                Digital Signature *
              </Label>
              <Input
                value={formData.signature}
                onChange={(e) => handleChange('signature', e.target.value)}
                placeholder="Type your full name as digital signature"
                className={`text-sm ${errors.signature ? 'border-red-500' : ''} ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
              />
              {errors.signature && <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.signature}</p>}
            </div>
          </div>

          {/* --- NEW FIELDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-6">
            <div className="space-y-2 md:col-span-2">
              <Label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
                Signing Options
              </Label>
              <div className="flex items-center space-x-2 p-3 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}">
                <Checkbox
                  id="sign_policies"
                  checked={formData.sign_policies}
                  onCheckedChange={(checked) => handleChange('sign_policies', checked)}
                />
                <Label
                  htmlFor="sign_policies"
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Also sign all company policy documents
                </Label>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>By checking this, you agree to digitally sign all relevant company policy documents.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signature_font" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-sm`}>
                Signature Font Style
              </Label>
              <select
                id="signature_font"
                value={formData.signature_font}
                onChange={(e) => handleChange('signature_font', e.target.value)}
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              >
                <option value="SignatureFont">Default Cursive</option>
                <option value="DancingScript">Dancing Script</option>
                <option value="GreatVibes">Great Vibes</option>
                <option value="Allura">Allura</option>
              </select>
            </div>
          </div>

          {errors.declarationGeneral && (
            <div className={`mb-4 p-3 ${darkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'} rounded-lg flex items-center gap-2`}>
              <AlertCircle className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{errors.declarationGeneral}</p>
            </div>
          )}

          <Button
            onClick={submitDeclaration}
            disabled={declarationLoading}
            className={`w-full ${declarationSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {declarationLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving Declaration...
              </div>
            ) : declarationSuccess ? (
              <>
                <CheckCircle size={16} className="mr-2" />
                Declaration Saved
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Declaration
              </>
            )}
          </Button>
        </Card>

        <Card className={`bg-gradient-to-r ${darkMode ? 'from-gray-800 to-gray-700 border-gray-600' : 'from-gray-50 to-slate-50 border-gray-200'} p-6`}>
          <div className="text-center">
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>
              ISCS Technologies Private Limited
            </h3>
            <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>TRUSTED IT CONSULTING PARTNER</p>
          </div>
        </Card>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className={`px-8 py-3 flex items-center gap-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Submitting Application...
              </div>
            ) : (
              <>
                <CheckCircle2 size={16} className="mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}