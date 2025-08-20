import { useState } from 'react';
import { Check, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personal: {},
    academics: {},
    exams: {},
    work: {},
    preferences: {},
    documents: {}
  });

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Basic personal information' },
    { id: 2, title: 'Academic Background', description: 'Education history and grades' },
    { id: 3, title: 'Test Scores', description: 'IELTS, TOEFL, GRE, GMAT scores' },
    { id: 4, title: 'Experience', description: 'Work experience and projects' },
    { id: 5, title: 'Preferences', description: 'Study preferences and goals' },
    { id: 6, title: 'Documents', description: 'Upload required documents' },
    { id: 7, title: 'Review', description: 'Review and confirm your profile' }
  ];

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">First Name *</label>
                <input
                  type="text"
                  placeholder="Alex"
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  placeholder="Johnson"
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <input
                type="email"
                placeholder="alex.johnson@email.com"
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Nationality</label>
              <select className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Select your nationality</option>
                <option>United States</option>
                <option>India</option>
                <option>China</option>
                <option>United Kingdom</option>
                <option>Other</option>
              </select>
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div>
              <label className="block text-sm font-medium mb-2">Highest Qualification *</label>
              <select className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Bachelor's Degree</option>
                <option>Master's Degree</option>
                <option>High School Diploma</option>
                <option>PhD</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Institution Name *</label>
                <input
                  type="text"
                  placeholder="University of California, Berkeley"
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Field of Study *</label>
                <input
                  type="text"
                  placeholder="Computer Science"
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Graduation Year</label>
                <select className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GPA/Grade</label>
                <input
                  type="text"
                  placeholder="3.8/4.0"
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Grading System</label>
                <select className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>4.0 Scale</option>
                  <option>10.0 Scale</option>
                  <option>Percentage</option>
                  <option>First Class/Second Class</option>
                </select>
              </div>
            </div>
          </motion.div>
        );
      
      case 7:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Profile Complete!</h2>
              <p className="text-muted-foreground mb-8">
                Congratulations! Your profile is now 100% complete and ready for university applications.
              </p>
              
              {/* Achievement */}
              <div className="glass rounded-2xl p-6 bg-gradient-to-r from-primary/5 to-success/5 mb-8">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-4xl">🎓</div>
                  <div>
                    <h3 className="font-semibold text-lg">Achievement Unlocked!</h3>
                    <p className="text-muted-foreground">Profile Master - Complete your profile 100%</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl hover-lift press-effect font-medium text-lg"
              >
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        );
      
      default:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Step {currentStep} Content</h3>
              <p className="text-muted-foreground">
                This step is under construction. Please continue to see the complete flow.
              </p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-4xl font-bold mb-3">Complete Your Profile</h1>
          <p className="text-xl text-muted-foreground">
            Let's get to know you better to provide personalized recommendations
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-3 mb-8">
            <motion.div 
              className="bg-primary h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Step Indicators */}
          <div className="grid grid-cols-7 gap-2">
            {steps.map((step) => (
              <div key={step.id} className="text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 mx-auto transition-all duration-220 ${
                  currentStep === step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : currentStep > step.id
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <h4 className={`text-sm font-medium ${
                  currentStep === step.id ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </h4>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div 
          className="glass rounded-2xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6">{steps[currentStep - 1].title}</h2>
          
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <motion.div 
          className="flex justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-180 ${
              currentStep === 1
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-card border border-border hover:bg-card-hover hover-lift press-effect'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
            Previous
          </button>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-colors">
              <Save className="h-5 w-5" />
              Save Draft
            </button>
            
            <button
              onClick={nextStep}
              disabled={currentStep === steps.length}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-180 ${
                currentStep === steps.length
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover-lift press-effect'
              }`}
            >
              {currentStep === steps.length - 1 ? 'Complete Profile' : 'Next'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}