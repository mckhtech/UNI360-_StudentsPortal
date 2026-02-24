import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  FileText,
  Zap,
  Download,
  ArrowRight,
  User,
  Briefcase,
  Wand2,
  Copy,
  RefreshCw,
  Sparkles,
  CheckCircle,
  Clock,
  Settings,
  Save,
  Eye,
  History,
  X,
  ChevronLeft,
  Menu,
  Lock,
  CreditCard,
  Shield,
  DollarSign,
  Unlock,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Globe,
  BookOpen,
  Award,
  Languages,
  Star,
  Plus,
  Minus
} from "lucide-react";
import { getStudentProfile } from "@/services/studentProfile";
import { useAuth } from "@/contexts/AuthContext";
import { getAuthHeaders, makeAuthenticatedRequest } from "@/services/tokenService";

// n8n SOP Generator Configuration
// n8n Configuration - Add at the top of AITools.tsx (around line 30)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.uniflow.kartonmeister.com';

const N8N_CONFIG = {
  sop: {
    webhookUrl: `${API_BASE_URL}/api/v1/ai/sop/generate`,
    timeout: 120000,
  },
  lor: {
    webhookUrl: `${API_BASE_URL}/api/v1/ai/lor/generate`,
    timeout: 120000,
  },
  cover: {
    webhookUrl: `${API_BASE_URL}/api/v1/ai/cover-letter/generate`,
    timeout: 120000,
  }
};

const AITools = () => {
  const { user } = useAuth();
  const [selectedTool, setSelectedTool] = useState(null);
  const [generationStep, setGenerationStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({});
  const [formData, setFormData] = useState({});
  const [workExperiences, setWorkExperiences] = useState([{ company: '', position: '', duration: '', description: '' }]);
  const [educationEntries, setEducationEntries] = useState([{ institution: '', degree: '', year: '', grade: '' }]);
  const [languages, setLanguages] = useState([{ language: '', proficiency: 'Basic' }]);
  const [skills, setSkills] = useState(['']);
  const [sopType, setSopType] = useState(''); // Add this line
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generationError, setGenerationError] = useState(null);

  // Enhanced AI tools data
  const aiTools = [
    {
      id: 'sop',
      name: "SOP Generator",
      title: 'Statement of Purpose Generator',
      description: "Create compelling Statements of Purpose tailored to your target universities",
      icon: FileText,
      features: ["University-specific customization", "Multiple tone options", "Real-time preview", "Export formats"],
      color: "bg-blue-100 text-blue-600",
      bgGradient: "from-blue-500 to-blue-600",
      price: "₹499",
      isPremium: true
    },
    {
      id: 'lor',
      name: "LOR Generator", 
      title: 'Letter of Recommendation Assistant',
      description: "Generate professional Letters of Recommendation with proper formatting",
      icon: User,
      features: ["Academic/Professional templates", "Multiple formats", "Export to PDF/DOC", "Customizable"],
      color: "bg-green-100 text-green-600",
      bgGradient: "from-green-500 to-green-600",
      price: "₹299",
      isPremium: true
    },
    {
  id: 'cover',
  name: "Cover Letter Generator",
  title: 'Professional Cover Letter Generator',
  description: "Create compelling cover letters tailored to your job applications",
  icon: FileText,
  features: ["Job-specific customization", "Multiple formats", "Real-time preview", "Export options"],
  color: "bg-purple-100 text-purple-600",
  bgGradient: "from-purple-500 to-purple-600",
  price: "₹399",
  isPremium: true
}
  ];

  // Mock generation history
  const generationHistory = [
    {
      id: '1',
      type: 'sop',
      title: 'Computer Science SOP - TU Munich',
      createdAt: '2024-02-15T10:30:00Z',
      status: 'completed',
      wordCount: 847
    },
    {
      id: '2',
      type: 'cv',
      title: 'Software Engineer CV - International',
      createdAt: '2024-02-12T14:20:00Z',
      status: 'completed',
      wordCount: 0
    },
    {
      id: '3',
      type: 'lor',
      title: 'Professor LOR Template',
      createdAt: '2024-02-10T09:15:00Z',
      status: 'draft',
      wordCount: 623
    }
  ];

  // Mock templates
  const templates = {
    sop: [
      { id: '1', name: 'Engineering Focus', description: 'For technical programs' },
      { id: '2', name: 'Business School', description: 'For MBA and business programs' },
      { id: '3', name: 'Research Oriented', description: 'For PhD and research programs' }
    ],
    lor: [
      { id: '1', name: 'Academic Supervisor', description: 'From professor or advisor' },
      { id: '2', name: 'Professional Manager', description: 'From work supervisor' },
      { id: '3', name: 'Research Mentor', description: 'For research-focused programs' }
    ],
    cv: [
      { id: '1', name: 'Modern Professional', description: 'Clean and contemporary design' },
      { id: '2', name: 'Academic Format', description: 'For academic positions' },
      { id: '3', name: 'Creative Portfolio', description: 'For design and creative fields' }
    ]
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { scale: 0.9, opacity: 0 },
    show: { scale: 1, opacity: 1 }
  };

  // Load profile data when SOP tool is selected
// Load profile data when SOP, LOR, or Cover Letter tool is selected
useEffect(() => {
  if ((selectedTool === 'lor' || selectedTool === 'cover') && generationStep === 1) {
    loadProfileData();
  }
}, [selectedTool, generationStep]);

// n8n SOP Generator API Integration
const generateSOPWithN8N = async (formData) => {
  try {
    console.log('[SOP Generator] Starting generation with API...');

    const result = await makeAuthenticatedRequest(N8N_CONFIG.sop.webhookUrl, {
      method: 'POST',
      body: {}, // Empty body - API uses profile data
    });

    console.log('[SOP Generator] Success:', result);

    return {
      success: true,
      text: result.data?.generatedSop || result.generatedSop || '',
      wordCount: (result.data?.generatedSop || result.generatedSop || '').split(/\s+/).length
    };

  } catch (error) {
    console.error('[SOP Generator] Error:', error);
    throw error;
  }
};

// n8n LOR Generator API Integration
const generateLORWithN8N = async (formData) => {
  try {
    console.log('[LOR Generator] Starting generation with API...');
    console.log('[LOR Generator] Form data:', formData);

    const requestPayload = {
      seniorName: formData.seniorName || ''
    };

    console.log('[LOR Generator] Request payload:', requestPayload);

    const result = await makeAuthenticatedRequest(N8N_CONFIG.lor.webhookUrl, {
      method: 'POST',
      body: requestPayload,
    });

    console.log('[LOR Generator] Success:', result);

    return {
      success: true,
      text: result.data?.generatedLor || result.generatedLor || '',
      wordCount: (result.data?.generatedLor || result.generatedLor || '').split(/\s+/).length
    };

  } catch (error) {
    console.error('[LOR Generator] Error:', error);
    throw error;
  }
};

// n8n Cover Letter Generator API Integration
const generateCoverLetterWithN8N = async (formData) => {
  try {
    console.log('[Cover Letter Generator] Starting generation with API...');
    console.log('[Cover Letter Generator] Form data:', formData);

    const requestPayload = {
      studentName: formData.studentName || '',
      passportNumber: formData.passportNumber || '',
      universityName: formData.universityName || '',
      universityLocation: formData.universityLocation || '',
      courseName: formData.courseName || '',
      courseDuration: formData.courseDuration || '',
      courseStartDate: formData.courseStartDate || '',
      tuitionFees: formData.tuitionFees || '',
      blockedAccountBank: formData.blockedAccountBank || '',
      blockedAccountBalance: formData.blockedAccountBalance || '',
      sponsorName: formData.sponsorName || '',
      sscSchool: formData.sscSchool || '',
      sscYear: formData.sscYear || '',
      sscMarks: formData.sscMarks || '',
      hscInstitution: formData.hscInstitution || '',
      hscYear: formData.hscYear || '',
      hscMarks: formData.hscMarks || '',
      bachelorsUniversity: formData.bachelorsUniversity || '',
      bachelorsCourse: formData.bachelorsCourse || '',
      bachelorsCgpa: formData.bachelorsCgpa || ''
    };

    console.log('[Cover Letter Generator] Request payload:', requestPayload);

    const result = await makeAuthenticatedRequest(N8N_CONFIG.cover.webhookUrl, {
      method: 'POST',
      body: requestPayload,
    });

    console.log('[Cover Letter Generator] Success:', result);

    return {
      success: true,
      text: result.data?.generatedCoverLetter || result.generatedCoverLetter || '',
      wordCount: (result.data?.generatedCoverLetter || result.generatedCoverLetter || '').split(/\s+/).length
    };

  } catch (error) {
    console.error('[Cover Letter Generator] Error:', error);
    throw error;
  }
};

const loadProfileData = async () => {
  try {
    const result = await makeAuthenticatedRequest('/api/v1/students/profile', {
      method: 'GET',
    });
    
    const profileData = result.data;
    
    // Map profile data to form fields for Cover Letter
    if (selectedTool === 'cover') {
      const mappedData = {
        studentName: profileData.basic_info?.full_name || '',
        passportNumber: profileData.basic_info?.passport_number || '',
        courseName: profileData.automation_service?.bachelors_course || '',
        universityName: profileData.automation_service?.target_university || '',
        universityLocation: profileData.automation_service?.university_location || '',
        courseDuration: profileData.automation_service?.course_duration || '',
        courseStartDate: profileData.automation_service?.course_start_date || '',
        tuitionFees: profileData.automation_service?.tuition_fees || '',
        blockedAccountBank: profileData.automation_service?.blocked_account_bank || '',
        blockedAccountBalance: profileData.automation_service?.blocked_account_balance || '',
        sponsorName: profileData.automation_service?.sponsor_name || '',
        sscSchool: profileData.automation_service?.ssc_school || '',
        sscYear: profileData.automation_service?.ssc_year || '',
        sscMarks: profileData.automation_service?.ssc_marks || '',
        hscInstitution: profileData.automation_service?.hsc_institution || '',
        hscYear: profileData.automation_service?.hsc_year || '',
        hscMarks: profileData.automation_service?.hsc_marks || '',
        bachelorsUniversity: profileData.automation_service?.bachelors_university || '',
        bachelorsCourse: profileData.automation_service?.bachelors_course || '',
        bachelorsCgpa: profileData.automation_service?.bachelors_cgpa || '',
      };
      
      setFormData(mappedData);
    }
  } catch (error) {
    console.error('Error loading profile data:', error);
    alert('Failed to load profile data. Please check if you are logged in.');
  }
};
const startGeneration = (toolId) => {
  const tool = aiTools.find(t => t.id === toolId);
  setSelectedTool(toolId);
  setIsMobileMenuOpen(false);
  
  // SOP has no form, go directly to payment
  if (toolId === 'sop') {
    if (tool.isPremium && !paymentStatus[toolId]) {
      setGenerationStep(0.5); // Payment step
    } else {
      // Already paid or not premium, start generation directly
      setGenerationStep(2); // Loading step
      setTimeout(() => simulateGeneration(), 100);
    }
  } else {
    // LOR and Cover Letter have forms, go to step 1
    setGenerationStep(1);
  }
};

  const handlePayment = () => {
  // Mark as paid
  setPaymentStatus(prev => ({ ...prev, [selectedTool]: true }));
  
  // If SOP, start generation immediately after payment
  if (selectedTool === 'sop') {
    setGenerationStep(2); // Go to loading
    setTimeout(() => simulateGeneration(), 100);
  } else {
    // For LOR and Cover Letter, go to form
    setGenerationStep(1);
  }
};

  const simulateGeneration = async () => {
  setIsGenerating(true);
  setGenerationError(null); // Clear previous errors
  
  try {
    console.log('[AITools] Starting generation for tool:', selectedTool);
    console.log('[AITools] Form data:', formData);
    
    let result;
    
    // Call the appropriate generation function based on selected tool
    if (selectedTool === 'sop') {
      result = await generateSOPWithN8N(formData);
    } else if (selectedTool === 'lor') {
      result = await generateLORWithN8N(formData);
    } else if (selectedTool === 'cover') {
      result = await generateCoverLetterWithN8N(formData);
    }
    
    console.log('[AITools] Generation result:', result);
    
    // Only proceed to step 3 if we got a successful result
    // Only proceed to step 3 if we got a successful result
if (result && result.success) {
  setGeneratedContent(result);
  
  // Wait for 1 minute (60 seconds) before showing output screen
  setTimeout(() => {
    setIsGenerating(false);
    setGenerationStep(3);
  }, 40000); // 60000 milliseconds = 60 seconds = 1 minute
  
} else {
  throw new Error('Generation failed - no content received');
}
    
  } catch (error) {
    console.error('[AITools] Generation error:', error);
    setIsGenerating(false);
    setGenerationError(error.message || 'Failed to generate document. Please try again.');
    
    // Don't auto-navigate - let user see error and retry
  }
};

  const resetGeneration = () => {
  setSelectedTool(null);
  setGenerationStep(0);
  setIsGenerating(false);
  setFormData({});
  setSopType('');
  setGeneratedContent(null);
};

  const updateFormData = (field, value) => {
  setFormData(prev => {
    const updated = { ...prev, [field]: value };
    
    // Clear Bachelor's fields when checkbox is unchecked
    if (field === 'hasBachelors' && !value) {
      delete updated.bachelorsUniversityName;
      delete updated.bachelorsCourseName;
      delete updated.bachelorsStartDate;
      delete updated.bachelorsEndDate;
      delete updated.bachelorsCGPA;
    }
    
    // Clear Master's fields when checkbox is unchecked
    if (field === 'hasMasters' && !value) {
      delete updated.mastersUniversityName;
      delete updated.mastersCourseName;
      delete updated.mastersStartDate;
      delete updated.mastersEndDate;
      delete updated.mastersCGPA;
    }
    
    // Clear HSC fields when switching to Diploma
    if (field === 'afterSSCType' && value === 'diploma') {
      delete updated.hscSchoolName;
      delete updated.hscPassingDate;
      delete updated.hscMarks;
    }
    
    // Clear Diploma fields when switching to HSC
    if (field === 'afterSSCType' && value === 'hsc') {
      delete updated.diplomaUniversityName;
      delete updated.diplomaCourseName;
      delete updated.diplomaStartDate;
      delete updated.diplomaEndDate;
      delete updated.diplomaCGPA;
    }
    
    return updated;
  });
};

  const addArrayItem = (arrayName, newItem) => {
    switch (arrayName) {
      case 'workExperiences':
        setWorkExperiences(prev => [...prev, newItem]);
        break;
      case 'educationEntries':
        setEducationEntries(prev => [...prev, newItem]);
        break;
      case 'languages':
        setLanguages(prev => [...prev, newItem]);
        break;
      case 'skills':
        setSkills(prev => [...prev, '']);
        break;
    }
  };

  const removeArrayItem = (arrayName, index) => {
    switch (arrayName) {
      case 'workExperiences':
        setWorkExperiences(prev => prev.filter((_, i) => i !== index));
        break;
      case 'educationEntries':
        setEducationEntries(prev => prev.filter((_, i) => i !== index));
        break;
      case 'languages':
        setLanguages(prev => prev.filter((_, i) => i !== index));
        break;
      case 'skills':
        setSkills(prev => prev.filter((_, i) => i !== index));
        break;
    }
  };

  const updateArrayItem = (arrayName, index, field, value) => {
    switch (arrayName) {
      case 'workExperiences':
        setWorkExperiences(prev => prev.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        ));
        break;
      case 'educationEntries':
        setEducationEntries(prev => prev.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        ));
        break;
      case 'languages':
        setLanguages(prev => prev.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        ));
        break;
      case 'skills':
        setSkills(prev => prev.map((item, i) => 
          i === index ? value : item
        ));
        break;
    }
  };

  const getToolIcon = (type) => {
    switch (type) {
      case 'sop': return <FileText size={16} className="text-blue-600" />;
      case 'lor': return <User size={16} className="text-green-600" />;
      case 'cv': return <Briefcase size={16} className="text-purple-600" />;
      default: return <Bot size={16} className="text-gray-600" />;
    }
  };

  const renderPaymentModal = () => {
    const currentTool = aiTools.find(tool => tool.id === selectedTool);
    if (!currentTool) return null;

    const IconComponent = currentTool.icon;

    return (
      <motion.div
        className="space-y-6 text-center py-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex justify-center">
          <div className={`p-4 rounded-full text-white bg-gradient-to-r ${currentTool.bgGradient}`}>
            <Lock size={32} />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Premium Tool Access</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {currentTool.title} is a premium tool that requires payment to access
          </p>
          <div className="text-3xl font-bold text-primary mb-2">
            {currentTool.price}
          </div>
          <p className="text-sm text-gray-500">One-time payment • Lifetime access</p>
        </div>

        <div className="space-y-3 text-left max-w-md mx-auto">
          <h4 className="font-semibold text-center">What you get:</h4>
          {currentTool.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

      

<Button
  onClick={() => {
    handlePayment(); // Mark as paid
    setGenerationStep(2); // Go to generation
  }}
  className="px-8 py-3 bg-green-600 hover:bg-green-700"
  size="lg"
>
  <CreditCard size={16} className="mr-2" />
  Pay with Razorpay
</Button>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Shield size={12} />
          <span>Secure payment powered by Razorpay</span>
        </div>
      </motion.div>
    );
  };

  const renderSOPForm = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-6 text-center py-8"
  >
    <div className="flex justify-center mb-4">
      <div className={`p-4 rounded-full bg-gradient-to-r ${aiTools.find(t => t.id === 'sop')?.bgGradient}`}>
        <FileText className="text-white" size={32} />
      </div>
    </div>
    <h3 className="text-xl font-semibold">Generate Statement of Purpose</h3>
    <p className="text-gray-600 dark:text-gray-400">
      Your SOP will be automatically generated using your profile information.
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-500">
      Click "Generate SOP" below to proceed.
    </p>
  </motion.div>
);

 const renderLORForm = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-6"
  >
    <h3 className="text-lg font-semibold">Letter of Recommendation Details</h3>
    
    <div className="border-t pt-6">
      <h4 className="font-semibold mb-4 text-primary">Senior Information</h4>
      
      <div>
        <label className="block text-sm font-medium mb-1">Name of Senior Writing LOR *</label>
        <input
          type="text"
          placeholder="e.g., Dr. Priya Venkatesh"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
          value={formData.seniorName || ''}
          onChange={(e) => updateFormData('seniorName', e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter the full name and title of the person writing the recommendation
        </p>
      </div>
    </div>
  </motion.div>
);
 const renderCoverLetterForm = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-6"
  >
    <h3 className="text-lg font-semibold">Cover Letter Details</h3>

    {/* Student Information */}
    <div className="border-t pt-6">
      <h4 className="font-semibold mb-4 text-primary">Student Information</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Student Name *</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.studentName || ''}
            onChange={(e) => updateFormData('studentName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Passport Number *</label>
          <input
            type="text"
            placeholder="e.g., A1234567"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.passportNumber || ''}
            onChange={(e) => updateFormData('passportNumber', e.target.value)}
          />
        </div>
      </div>
    </div>

    {/* Course Information */}
    <div className="border-t pt-6">
      <h4 className="font-semibold mb-4 text-primary">Course Information</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Course Name *</label>
          <input
            type="text"
            placeholder="e.g., MSc Computer Science"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.courseName || ''}
            onChange={(e) => updateFormData('courseName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">University Name *</label>
          <input
            type="text"
            placeholder="e.g., Technical University of Munich"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.universityName || ''}
            onChange={(e) => updateFormData('universityName', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">University Location *</label>
          <input
            type="text"
            placeholder="City, Country"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.universityLocation || ''}
            onChange={(e) => updateFormData('universityLocation', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Course Duration *</label>
          <input
            type="text"
            placeholder="e.g., 2 years"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.courseDuration || ''}
            onChange={(e) => updateFormData('courseDuration', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Course Start Date</label>
          <input
            type="text"
            placeholder="e.g., October 2024"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.courseStartDate || ''}
            onChange={(e) => updateFormData('courseStartDate', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tuition Fees *</label>
          <input
            type="text"
            placeholder="e.g., €15,000 or 0 (if free)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.tuitionFees || ''}
            onChange={(e) => updateFormData('tuitionFees', e.target.value)}
          />
        </div>
      </div>
    </div>

    {/* Financial Information */}
    <div className="border-t pt-6">
      <h4 className="font-semibold mb-4 text-primary">Financial Information</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Blocked Account Bank *</label>
          <input
            type="text"
            placeholder="e.g., Deutsche Bank"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.blockedAccountBank || ''}
            onChange={(e) => updateFormData('blockedAccountBank', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Blocked Account Balance *</label>
          <input
            type="text"
            placeholder="e.g., 11,208 EUR"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.blockedAccountBalance || ''}
            onChange={(e) => updateFormData('blockedAccountBalance', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Sponsor Name</label>
        <input
          type="text"
          placeholder="e.g., Mr. Vijay Sharma (Father)"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
          value={formData.sponsorName || ''}
          onChange={(e) => updateFormData('sponsorName', e.target.value)}
        />
      </div>
    </div>

    {/* Education Information */}
    <div className="border-t pt-6">
      <h4 className="font-semibold mb-4 text-primary">Education Background</h4>
      
      {/* SSC */}
      <div className="mb-4">
        <h5 className="font-medium mb-2 text-sm">SSC (10th Grade)</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">School Name</label>
            <input
              type="text"
              placeholder="School name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
              value={formData.sscSchool || ''}
              onChange={(e) => updateFormData('sscSchool', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="text"
              placeholder="e.g., 2016"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
              value={formData.sscYear || ''}
              onChange={(e) => updateFormData('sscYear', e.target.value)}
            />
          </div>
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">Marks/Percentage</label>
          <input
            type="text"
            placeholder="e.g., 92%"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.sscMarks || ''}
            onChange={(e) => updateFormData('sscMarks', e.target.value)}
          />
        </div>
      </div>

      {/* HSC */}
      <div className="mb-4">
        <h5 className="font-medium mb-2 text-sm">HSC (12th Grade)</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Institution Name</label>
            <input
              type="text"
              placeholder="Institution name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
              value={formData.hscInstitution || ''}
              onChange={(e) => updateFormData('hscInstitution', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="text"
              placeholder="e.g., 2018"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
              value={formData.hscYear || ''}
              onChange={(e) => updateFormData('hscYear', e.target.value)}
            />
          </div>
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">Marks/Percentage</label>
          <input
            type="text"
            placeholder="e.g., 89%"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.hscMarks || ''}
            onChange={(e) => updateFormData('hscMarks', e.target.value)}
          />
        </div>
      </div>

      {/* Bachelors */}
      <div>
        <h5 className="font-medium mb-2 text-sm">Bachelor's Degree</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">University Name</label>
            <input
              type="text"
              placeholder="University name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
              value={formData.bachelorsUniversity || ''}
              onChange={(e) => updateFormData('bachelorsUniversity', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Course Name</label>
            <input
              type="text"
              placeholder="e.g., B.Tech Computer Science"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
              value={formData.bachelorsCourse || ''}
              onChange={(e) => updateFormData('bachelorsCourse', e.target.value)}
            />
          </div>
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">CGPA/Percentage</label>
          <input
            type="text"
            placeholder="e.g., 8.5 CGPA"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.bachelorsCgpa || ''}
            onChange={(e) => updateFormData('bachelorsCgpa', e.target.value)}
          />
        </div>
      </div>
    </div>
  </motion.div>
);
  const renderGenerationModal = () => {
    const currentTool = aiTools.find(tool => tool.id === selectedTool);
    if (!currentTool) return null;

    const IconComponent = currentTool.icon;
    const isPaymentRequired = currentTool.isPremium && !paymentStatus[selectedTool];

    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center mt-0 mb-0"
          style={{marginTop: 0, marginBottom: 0}}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetGeneration();
            }
          }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full text-white bg-gradient-to-r ${currentTool.bgGradient}`}>
                  <IconComponent size={24} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    {currentTool.title}
                    {currentTool.isPremium && !paymentStatus[selectedTool] && (
                      <Lock size={16} className="text-yellow-600" />
                    )}
                    {paymentStatus[selectedTool] && (
                      <Unlock size={16} className="text-green-600" />
                    )}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {generationStep === 0.5 ? 'Payment Required' : 
                     generationStep === 0 ? 'Getting Started' :
                     `Step ${generationStep} of 3`}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetGeneration}
              >
                <X size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {generationStep === 0.5 && renderPaymentModal()}
              
              {generationStep === 1 && (
                <>
                  {selectedTool === 'sop' && renderSOPForm()}
                  {selectedTool === 'lor' && renderLORForm()}
                  {selectedTool === 'cover' && renderCoverLetterForm()}
                </>
              )}

              {generationStep === 2 && (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-6 text-center py-8"
  >
    {!generationError ? (
      // Loading state
      <>
        <div className="flex justify-center">
          <div className="relative">
            <motion.div
              className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 border-t-blue-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Bot className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">AI is working its magic...</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Creating your personalized document using advanced AI algorithms
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            This may take 30-60 seconds. Please don't close this window.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="max-w-xs mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Processing...</span>
            <span>{isGenerating ? 'In Progress' : 'Complete'}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: isGenerating ? "75%" : "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
        </div>
      </>
    ) : (
      // Error state
      <>
        <div className="flex justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <X className="text-red-600 dark:text-red-400" size={32} />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">Generation Failed</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {generationError}
          </p>
        </div>

        {/* Retry and Cancel buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setGenerationError(null);
              setGenerationStep(1);
            }}
          >
            <ChevronLeft size={18} className="mr-2" />
            Go Back
          </Button>
          <Button
            onClick={() => {
              setGenerationError(null);
              simulateGeneration();
            }}
          >
            <RefreshCw size={18} className="mr-2" />
            Retry
          </Button>
        </div>
      </>
    )}
  </motion.div>
)}

              {generationStep === 3 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className="flex items-center gap-2 text-green-600 mb-4">
      <CheckCircle size={20} />
      <span className="font-semibold">Document Generated Successfully!</span>
    </div>

    {/* Document Info Card */}
    <div className="border-2 border-primary/20 rounded-xl p-6 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${aiTools.find(t => t.id === selectedTool)?.bgGradient}`}>
          <FileText className="text-white" size={24} />
        </div>
        <div>
          <h4 className="font-bold text-lg">
            {selectedTool === 'sop' ? 'Statement of Purpose' : 
             selectedTool === 'lor' ? 'Letter of Recommendation' : 
             'Cover Letter'}.docx
          </h4>
          <p className="text-sm text-muted-foreground">
            Generated on {new Date().toLocaleDateString()} • {generatedContent?.wordCount || 0} words
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-muted-foreground text-center">
          Your document is ready! Click the buttons below to view or download.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          size="lg"
          className="w-full"
          onClick={() => {
            // Show document in a modal or new view
            if (generatedContent?.text) {
              // Create a modal or expand view to show content
              const modal = document.createElement('div');
              modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:9999;overflow:auto;padding:20px;';
              modal.innerHTML = `
                <div style="max-width:800px;margin:40px auto;background:white;padding:40px;border-radius:12px;position:relative;">
                  <button onclick="this.parentElement.parentElement.remove()" style="position:absolute;top:20px;right:20px;background:#ef4444;color:white;border:none;border-radius:8px;padding:8px 16px;cursor:pointer;font-weight:600;">Close</button>
                  <h2 style="margin-bottom:20px;color:#1f2937;font-size:24px;font-weight:700;">${selectedTool === 'sop' ? 'Statement of Purpose' : selectedTool === 'lor' ? 'Letter of Recommendation' : 'Cover Letter'}</h2>
                  <div style="white-space:pre-wrap;line-height:1.8;color:#374151;font-size:16px;">${generatedContent.text}</div>
                </div>
              `;
              document.body.appendChild(modal);
            }
          }}
        >
          <Eye size={18} className="mr-2" />
          View Document
        </Button>
        <Button 
          size="lg"
          className="w-full bg-primary hover:bg-primary/90"
          onClick={() => {
            if (generatedContent?.text) {
              // Create a proper Word document structure
              const docContent = `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <title>${selectedTool === 'sop' ? 'Statement of Purpose' : selectedTool === 'lor' ? 'Letter of Recommendation' : 'Cover Letter'}</title>
                </head>
                <body>
                  <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 2; white-space: pre-wrap;">
                    ${generatedContent.text}
                  </div>
                </body>
                </html>
              `;
              
              const blob = new Blob([docContent], { type: 'application/msword' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              const fileName = selectedTool === 'sop' ? 'Statement_of_Purpose.doc' : 
                              selectedTool === 'lor' ? 'Letter_of_Recommendation.doc' : 
                              'Cover_Letter.doc';
              a.download = fileName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          }}
        >
          <Download size={18} className="mr-2" />
          Download as Word
        </Button>
      </div>
    </div>

    {/* Generate Another Button */}
    <div className="text-center pt-4">
      <Button
  variant="outline"
  onClick={() => {
    setGenerationStep(1);
    setGeneratedContent(null);
  }}
>
  <RefreshCw size={18} className="mr-2" />
  Generate Another {selectedTool === 'sop' ? 'SOP' : selectedTool === 'lor' ? 'LOR' : 'Document'}
</Button>
    </div>
  </motion.div>
)}
            </div>

            {/* Footer Actions */}
            {(generationStep === 1 || generationStep === 3) && (
              <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  {generationStep === 1 && (
  <>
    <Button
      variant="outline"
      className="flex-1"
      onClick={resetGeneration}
    >
      Cancel
    </Button>
    <Button
  size="lg"
  className="w-full"
  onClick={() => {
    const tool = aiTools.find(t => t.id === selectedTool);
    
    // LOR validation
    if (selectedTool === 'lor') {
      if (!formData.seniorName) {
        alert('Please enter the name of the senior writing the LOR');
        return;
      }
      // If premium and not paid, go to payment
      if (tool.isPremium && !paymentStatus[selectedTool]) {
        setGenerationStep(0.5);
      } else {
        // Start generation
        setGenerationStep(2);
        setTimeout(() => simulateGeneration(), 100);
      }
      return;
    }
    
    // Cover Letter validation
    if (selectedTool === 'cover') {
      const requiredFields = [
        'studentName', 'passportNumber', 'courseName', 'universityName',
        'universityLocation', 'courseDuration', 'tuitionFees',
        'blockedAccountBank', 'blockedAccountBalance'
      ];
      
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields marked with *\n\nMissing: ${missingFields.join(', ')}`);
        return;
      }
      // If premium and not paid, go to payment
      if (tool.isPremium && !paymentStatus[selectedTool]) {
        setGenerationStep(0.5);
      } else {
        // Start generation
        setGenerationStep(2);
        setTimeout(() => simulateGeneration(), 100);
      }
      return;
    }
  }}
>
  Continue
  <ArrowRight size={16} className="ml-2" />
</Button>
  </>
)}
                  
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderTemplates = () => (
    <AnimatePresence>
      {showTemplates && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6"
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Available Templates</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates(false)}
                className="sm:hidden"
              >
                <X size={16} />
              </Button>
            </div>
            <div className="space-y-6">
              {Object.entries(templates).map(([type, typeTemplates]) => (
                <div key={type}>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    {getToolIcon(type)}
                    {type.toUpperCase()} Templates
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {typeTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                      >
                        <h5 className="font-medium mb-1 text-sm sm:text-base">
                          {template.name}
                        </h5>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {template.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderHistory = () => (
    <AnimatePresence>
      {showHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6"
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <History size={20} />
                Recent Generations
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(false)}
                className="sm:hidden"
              >
                <X size={16} />
              </Button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {generationHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {getToolIcon(item.type)}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm sm:text-base truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                        <Clock size={12} />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        {item.wordCount > 0 && (
                          <>
                            <span>•</span>
                            <span className="hidden sm:inline">{item.wordCount} words</span>
                            <span className="sm:hidden">{item.wordCount}w</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.status === 'completed' ? (
                      <CheckCircle className="text-green-600" size={16} />
                    ) : (
                      <Clock className="text-yellow-600" size={16} />
                    )}
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <Eye size={14} className="mr-1" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div 
      className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div 
        className="text-center max-w-2xl mx-auto"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">AI-Powered Tools</h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Generate professional documents with our AI assistants
        </p>
      </motion.div>

      {/* Mobile Action Buttons */}
      <div className="flex flex-wrap gap-2 sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTemplates(!showTemplates)}
        >
          <Eye size={16} className="mr-1" />
          Templates
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History size={16} className="mr-1" />
          History
        </Button>
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden sm:flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History size={20} className="mr-2" />
          {showHistory ? 'Hide' : 'View'} History
        </Button>
      </div>

      {/* AI Tools Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {aiTools.map((tool, index) => {
          const IconComponent = tool.icon;
          const isUnlocked = !tool.isPremium || paymentStatus[tool.id];
          
          return (
            <motion.div
              key={tool.id}
              variants={item}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-4 sm:p-6 h-full flex flex-col hover:shadow-lg transition-all duration-200 relative">
                {/* Premium Badge */}
                

                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${tool.color}`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  {tool.isPremium && !isUnlocked && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{tool.price}</div>
                      <div className="text-xs text-gray-500">one-time</div>
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-lg sm:text-xl mb-2">{tool.name}</h3>
                <p className="text-muted-foreground text-sm sm:text-base mb-4 flex-1">{tool.description}</p>
                
                <div className="space-y-2 mb-4 sm:mb-6">
                  {tool.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                  
                </div>
                
                <Button 
  className="w-full rounded-xl group"
  onClick={() => startGeneration(tool.id)}
  variant={tool.isPremium && !isUnlocked ? "default" : "default"}
>
  {tool.isPremium && !isUnlocked ? (
  <>
    <CreditCard className="w-4 h-4 mr-2" />
    Buy & Open Tool
  </>
) : (
  <>
    Open Tool
    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
  </>
)}
</Button>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Templates Section */}
      {renderTemplates()}

      {/* History Section */}
      {renderHistory()}

      {/* Generation Modal */}
      {selectedTool && renderGenerationModal()}

      {/* Mobile Bottom Navigation Spacer */}
      <div className="h-20 sm:hidden" />
    </motion.div>
  );
};

export default AITools;    