import React, { useState } from 'react';
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

const AITools = () => {
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
      isPremium: false
    },
    {
      id: 'cv',
      name: "CV/Resume Builder",
      title: 'CV/Resume Builder',
      description: "Build ATS-friendly resumes optimized for international applications",
      icon: Briefcase,
      features: ["ATS optimization", "Europass format", "Skills highlighting", "Export options"],
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

  const startGeneration = (toolId) => {
    const tool = aiTools.find(t => t.id === toolId);
    if (tool.isPremium && !paymentStatus[toolId]) {
      // Show payment modal first
      setSelectedTool(toolId);
      setGenerationStep(0.5); // Payment step
    } else {
      setSelectedTool(toolId);
      setGenerationStep(1);
    }
    setIsMobileMenuOpen(false);
  };

  const handlePayment = () => {
    // Simulate payment process
    setPaymentStatus(prev => ({ ...prev, [selectedTool]: true }));
    setGenerationStep(1);
  };

  const simulateGeneration = () => {
    setIsGenerating(true);
    setGenerationStep(2);
    // Simulate AI generation process
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationStep(3);
    }, 3000);
  };

  const resetGeneration = () => {
    setSelectedTool(null);
    setGenerationStep(0);
    setIsGenerating(false);
    setFormData({});
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          onClick={handlePayment}
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
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold">Statement of Purpose Details</h3>
      
      {/* University and Program */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Target University *</label>
          <input
            type="text"
            placeholder="e.g., Technical University of Munich"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.university || ''}
            onChange={(e) => updateFormData('university', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Program *</label>
          <input
            type="text"
            placeholder="e.g., MSc Computer Science"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.program || ''}
            onChange={(e) => updateFormData('program', e.target.value)}
          />
        </div>
      </div>

      {/* Academic Background */}
      <div>
        <label className="block text-sm font-medium mb-1">Academic Background *</label>
        <textarea
          placeholder="Describe your educational background, GPA, major subjects, academic achievements..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
          value={formData.academicBackground || ''}
          onChange={(e) => updateFormData('academicBackground', e.target.value)}
        />
      </div>

      {/* Career Goals */}
      <div>
        <label className="block text-sm font-medium mb-1">Career Goals & Future Plans *</label>
        <div className="space-y-2">
          <textarea
            placeholder="Describe your short-term and long-term career goals..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.careerGoals || ''}
            onChange={(e) => updateFormData('careerGoals', e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => updateFormData('careerGoals', 'AI will generate compelling career goals based on your profile and target program.')}
            >
              <Wand2 size={12} className="mr-1" />
              Generate with AI
            </Button>
          </div>
        </div>
      </div>

      {/* Work Experience */}
      <div>
        <label className="block text-sm font-medium mb-1">Professional Experience</label>
        <textarea
          placeholder="Describe your work experience, internships, projects, and achievements..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
          value={formData.workExperience || ''}
          onChange={(e) => updateFormData('workExperience', e.target.value)}
        />
      </div>

      {/* Why This University */}
      <div>
        <label className="block text-sm font-medium mb-1">Why This University & Program? *</label>
        <textarea
          placeholder="Explain why you chose this specific university and program..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
          value={formData.whyUniversity || ''}
          onChange={(e) => updateFormData('whyUniversity', e.target.value)}
        />
      </div>

      {/* Financial Arrangements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Financial Arrangements *</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.financialArrangement || ''}
            onChange={(e) => updateFormData('financialArrangement', e.target.value)}
          >
            <option value="">Select funding source</option>
            <option value="self-funded">Self-funded</option>
            <option value="scholarship">Scholarship</option>
            <option value="loan">Education Loan</option>
            <option value="sponsorship">Family/Company Sponsorship</option>
            <option value="mixed">Mixed Funding</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Estimated Budget</label>
          <input
            type="text"
            placeholder="e.g., €20,000 per year"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.budget || ''}
            onChange={(e) => updateFormData('budget', e.target.value)}
          />
        </div>
      </div>

      {/* Family Background */}
      <div>
        <label className="block text-sm font-medium mb-1">Family Background & Support</label>
        <textarea
          placeholder="Describe your family background and their support for your education..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
          value={formData.familyBackground || ''}
          onChange={(e) => updateFormData('familyBackground', e.target.value)}
        />
      </div>

      {/* Research Interests */}
      <div>
        <label className="block text-sm font-medium mb-1">Research Interests (Optional)</label>
        <textarea
          placeholder="Describe your research interests and any specific areas you want to explore..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
          value={formData.researchInterests || ''}
          onChange={(e) => updateFormData('researchInterests', e.target.value)}
        />
      </div>
    </motion.div>
  );

  const renderLORForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold">Letter of Recommendation Details</h3>
      
      {/* Recommender Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Recommender Name *</label>
          <input
            type="text"
            placeholder="Dr. Jane Smith"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.recommenderName || ''}
            onChange={(e) => updateFormData('recommenderName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Recommender Title *</label>
          <input
            type="text"
            placeholder="Professor of Computer Science"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.recommenderTitle || ''}
            onChange={(e) => updateFormData('recommenderTitle', e.target.value)}
          />
        </div>
      </div>

      {/* Relationship with Recommender */}
      <div>
        <label className="block text-sm font-medium mb-1">Relationship with Recommender *</label>
        <select 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
          value={formData.relationship || ''}
          onChange={(e) => updateFormData('relationship', e.target.value)}
        >
          <option value="">Select relationship</option>
          <option value="professor">Professor/Academic Advisor</option>
          <option value="supervisor">Work Supervisor</option>
          <option value="mentor">Research Mentor</option>
          <option value="manager">Project Manager</option>
          <option value="director">Department Head/Director</option>
        </select>
      </div>

      {/* Duration of Relationship */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Duration of Relationship *</label>
          <input
            type="text"
            placeholder="e.g., 2 years (2022-2024)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.duration || ''}
            onChange={(e) => updateFormData('duration', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Context of Interaction *</label>
          <input
            type="text"
            placeholder="e.g., Advanced Algorithms Course"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.context || ''}
            onChange={(e) => updateFormData('context', e.target.value)}
          />
        </div>
      </div>

      {/* Major Subjects at University */}
      <div>
        <label className="block text-sm font-medium mb-1">Major Subjects in Current/Previous University *</label>
        <textarea
          placeholder="List your major subjects (e.g., Data Structures, Algorithms, Database Systems, Machine Learning...)"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
          value={formData.majorSubjects || ''}
          onChange={(e) => updateFormData('majorSubjects', e.target.value)}
        />
      </div>

      {/* Intended Major Subjects */}
      <div>
        <label className="block text-sm font-medium mb-1">Major Subjects You Plan to Take *</label>
        <textarea
          placeholder="List the major subjects you plan to study in your target program..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
          value={formData.intendedSubjects || ''}
          onChange={(e) => updateFormData('intendedSubjects', e.target.value)}
        />
      </div>

      {/* Key Achievements */}
      <div>
        <label className="block text-sm font-medium mb-1">Key Achievements & Strengths *</label>
        <textarea
          placeholder="Describe your academic achievements, projects, awards, leadership roles..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
          value={formData.achievements || ''}
          onChange={(e) => updateFormData('achievements', e.target.value)}
        />
      </div>

      {/* Student Characteristics */}
      <div>
        <label className="block text-sm font-medium mb-1">Student Characteristics & Skills</label>
        <textarea
          placeholder="Describe the student's personality, work ethic, analytical skills, teamwork abilities..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
          value={formData.characteristics || ''}
          onChange={(e) => updateFormData('characteristics', e.target.value)}
        />
      </div>

      {/* Specific Examples */}
      <div>
        <label className="block text-sm font-medium mb-1">Specific Examples/Projects</label>
        <textarea
          placeholder="Provide specific examples of work, projects, or situations that showcase the student's abilities..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
          value={formData.examples || ''}
          onChange={(e) => updateFormData('examples', e.target.value)}
        />
      </div>
    </motion.div>
  );

  const renderCVForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold">CV/Resume Builder (Europass Format)</h3>
      
      {/* Personal Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-blue-600">Personal Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
              value={formData.address || ''}
              onChange={(e) => updateFormData('address', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div>
        <h4 className="font-medium text-blue-600 mb-2">Professional Summary</h4>
        <div className="space-y-2">
          <textarea
            placeholder="Write a brief professional summary (2-3 sentences)..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.summary || ''}
            onChange={(e) => updateFormData('summary', e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => updateFormData('summary', 'AI will generate a compelling professional summary based on your experience and skills.')}
            >
              <Wand2 size={12} className="mr-1" />
              Generate with AI
            </Button>
          </div>
        </div>
      </div>

      {/* Work Experience */}
      <div>
        <h4 className="font-medium text-blue-600 mb-2">Work Experience</h4>
        {workExperiences.map((exp, index) => (
          <div key={index} className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Experience {index + 1}</span>
              {workExperiences.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem('workExperiences', index)}
                >
                  <Minus size={14} />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Company Name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                value={exp.company}
                onChange={(e) => updateArrayItem('workExperiences', index, 'company', e.target.value)}
              />
              <input
                type="text"
                placeholder="Position/Role"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                value={exp.position}
                onChange={(e) => updateArrayItem('workExperiences', index, 'position', e.target.value)}
              />
              <input
                type="text"
                placeholder="Duration (e.g., Jan 2022 - Dec 2023)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                value={exp.duration}
                onChange={(e) => updateArrayItem('workExperiences', index, 'duration', e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                value={exp.location}
                onChange={(e) => updateArrayItem('workExperiences', index, 'location', e.target.value)}
              />
            </div>
            <textarea
              placeholder="Job description and key achievements..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
              value={exp.description}
              onChange={(e) => updateArrayItem('workExperiences', index, 'description', e.target.value)}
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addArrayItem('workExperiences', { company: '', position: '', duration: '', location: '', description: '' })}
          className="w-full"
        >
          <Plus size={14} className="mr-1" />
          Add Work Experience
        </Button>
      </div>

      {/* Education */}
      <div>
        <h4 className="font-medium text-blue-600 mb-2">Education</h4>
        {educationEntries.map((edu, index) => (
          <div key={index} className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Education {index + 1}</span>
              {educationEntries.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem('educationEntries', index)}
                >
                  <Minus size={14} />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Institution Name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                value={edu.institution}
                onChange={(e) => updateArrayItem('educationEntries', index, 'institution', e.target.value)}
              />
              <input
                type="text"
                placeholder="Degree/Qualification"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                value={edu.degree}
                onChange={(e) => updateArrayItem('educationEntries', index, 'degree', e.target.value)}
              />
              <input
                type="text"
                placeholder="Year/Duration"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                value={edu.year}
                onChange={(e) => updateArrayItem('educationEntries', index, 'year', e.target.value)}
              />
              <input
                type="text"
                placeholder="Grade/GPA"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                value={edu.grade}
                onChange={(e) => updateArrayItem('educationEntries', index, 'grade', e.target.value)}
              />
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addArrayItem('educationEntries', { institution: '', degree: '', year: '', grade: '' })}
          className="w-full"
        >
          <Plus size={14} className="mr-1" />
          Add Education
        </Button>
      </div>

      {/* Skills */}
      <div>
        <h4 className="font-medium text-blue-600 mb-2">Skills & Competencies</h4>
        <div className="space-y-2">
          {skills.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., JavaScript, Project Management, Data Analysis"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                value={skill}
                onChange={(e) => updateArrayItem('skills', index, null, e.target.value)}
              />
              {skills.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem('skills', index)}
                >
                  <Minus size={14} />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('skills', '')}
            className="w-full"
          >
            <Plus size={14} className="mr-1" />
            Add Skill
          </Button>
        </div>
      </div>

      {/* Languages */}
      <div>
        <h4 className="font-medium text-blue-600 mb-2">Language Skills</h4>
        {languages.map((lang, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Language (e.g., English)"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
              value={lang.language}
              onChange={(e) => updateArrayItem('languages', index, 'language', e.target.value)}
            />
            <select
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
              value={lang.proficiency}
              onChange={(e) => updateArrayItem('languages', index, 'proficiency', e.target.value)}
            >
              <option value="Basic">Basic (A1-A2)</option>
              <option value="Independent">Independent (B1-B2)</option>
              <option value="Proficient">Proficient (C1-C2)</option>
              <option value="Native">Native</option>
            </select>
            {languages.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeArrayItem('languages', index)}
              >
                <Minus size={14} />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addArrayItem('languages', { language: '', proficiency: 'Basic' })}
          className="w-full"
        >
          <Plus size={14} className="mr-1" />
          Add Language
        </Button>
      </div>

      {/* Key Achievements for CV */}
      <div>
        <h4 className="font-medium text-blue-600 mb-2">Key Achievements</h4>
        <div className="space-y-2">
          <textarea
            placeholder="List your key professional and academic achievements..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.cvAchievements || ''}
            onChange={(e) => updateFormData('cvAchievements', e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => updateFormData('cvAchievements', 'AI will generate compelling achievements based on your experience and profile.')}
            >
              <Wand2 size={12} className="mr-1" />
              Generate with AI
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Certifications</label>
          <textarea
            placeholder="List relevant certifications and courses..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.certifications || ''}
            onChange={(e) => updateFormData('certifications', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hobbies & Interests</label>
          <textarea
            placeholder="Your hobbies and personal interests..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
            value={formData.hobbies || ''}
            onChange={(e) => updateFormData('hobbies', e.target.value)}
          />
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
          className="fixed  bg-black/50 z-50 flex items-center justify-center h-screen w-screen top-0 left-0 "
          style={{marginTop: 0, marginBottom: 0}}
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
                  {selectedTool === 'cv' && renderCVForm()}
                </>
              )}

              {generationStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-center py-8"
                >
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
                    <h3 className="text-xl font-semibold mb-2">
                      {isGenerating ? 'AI is working its magic...' : 'Ready to generate!'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {isGenerating 
                        ? 'Creating your personalized content using advanced AI algorithms'
                        : 'Click the button below to start the AI generation process'}
                    </p>
                  </div>

                  {!isGenerating && (
                    <Button
                      onClick={simulateGeneration}
                      className="px-8 py-3"
                      size="lg"
                    >
                      <Wand2 size={16} className="mr-2" />
                      Generate with AI
                    </Button>
                  )}
                </motion.div>
              )}

              {generationStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-green-600 mb-4">
                    <CheckCircle size={20} />
                    <span className="font-semibold">Generation Complete!</span>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 max-h-48 sm:max-h-60 overflow-y-auto">
                    <h4 className="font-semibold mb-2">Generated Content Preview:</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {selectedTool === 'sop' && (
                        <p>
                          "My passion for computer science began during my undergraduate studies in Engineering, where I discovered the transformative power of technology in solving real-world problems. Through various projects and internships, I have developed strong analytical skills and a deep understanding of software development principles. My goal is to pursue a Master's degree in Computer Science at {formData.university || '[University]'} to advance my knowledge in artificial intelligence and machine learning. With strong family support and a well-planned financial arrangement through {formData.financialArrangement || '[funding source]'}, I am fully prepared to commit to this academic journey..."
                        </p>
                      )}
                      {selectedTool === 'lor' && (
                        <p>
                          "I am pleased to recommend {formData.studentName || '[Student Name]'} for admission to your graduate program. During their time as my {formData.relationship || '[relationship]'} in {formData.context || '[context]'}, they consistently demonstrated exceptional analytical abilities and creative problem-solving skills. Their strong foundation in {formData.majorSubjects || '[major subjects]'} and planned focus on {formData.intendedSubjects || '[intended subjects]'} shows remarkable academic preparation. {formData.studentName || '[Student Name]'} possesses the intellectual curiosity and dedication necessary for success in graduate-level studies..."
                        </p>
                      )}
                      {selectedTool === 'cv' && (
                        <div className="space-y-2">
                          <p><strong>{formData.fullName || '[Your Name]'}</strong></p>
                          <p>Email: {formData.email || '[email]'} | Phone: {formData.phone || '[phone]'}</p>
                          <p><strong>Professional Summary:</strong></p>
                          <p>{formData.summary || 'AI-generated professional summary will appear here based on your experience and skills.'}</p>
                          <p><strong>Experience:</strong> {workExperiences[0]?.position || '[Position]'} at {workExperiences[0]?.company || '[Company]'}</p>
                          <p><strong>Education:</strong> {educationEntries[0]?.degree || '[Degree]'}, {educationEntries[0]?.institution || '[Institution]'}</p>
                          <p><strong>Skills:</strong> {skills.filter(s => s).join(', ') || '[Skills]'}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <Copy size={14} className="mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <RefreshCw size={14} className="mr-1" />
                      Regenerate
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
                        className="flex-1"
                        onClick={() => setGenerationStep(2)}
                      >
                        Continue
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </>
                  )}
                  {generationStep === 3 && (
                    <>
                      <Button variant="outline" className="flex-1">
                        <Save size={16} className="mr-2" />
                        Save Draft
                      </Button>
                      <Button className="flex-1" onClick={resetGeneration}>
                        <CheckCircle size={16} className="mr-2" />
                        Finalize
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
                {tool.isPremium && (
                  <div className="absolute top-3 right-3">
                    {isUnlocked ? (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        <Unlock size={10} className="mr-1" />
                        Unlocked
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                        <Lock size={10} className="mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                )}

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
                  {tool.features.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{tool.features.length - 3} more features
                    </div>
                  )}
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
         