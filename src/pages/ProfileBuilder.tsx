import { useState, useEffect } from 'react';
import { Check, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { saveProfileDraft, getProfileDraft, clearProfileDraft } from '@/services/profile';
import { useNavigate } from 'react-router-dom';

// Define User interface with all required properties
interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  institution?: string;
  graduationYear?: string;
  gpa?: string;
  gradingSystem?: string;
  educationLevel?: string;
  fieldOfStudy?: string;
  ieltsOverall?: string;
  ieltsListening?: string;
  ieltsReading?: string;
  ieltsWriting?: string;
  ieltsSpeaking?: string;
  toeflTotal?: string;
  greTotal?: string;
  gmatTotal?: string;
  workExperience?: string;
  internships?: string;
  projects?: string;
  certifications?: string;
  targetCountries?: string[];
  preferredPrograms?: string[];
  studyLevel?: string;
  intakePreference?: string;
  profileCompleted?: boolean;
}

interface FormData {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
  };
  academics: {
    educationLevel: string;
    fieldOfStudy: string;
    institution: string;
    graduationYear: string;
    gpa: string;
    gradingSystem: string;
  };
  testScores: {
    ieltsOverall: string;
    ieltsListening: string;
    ieltsReading: string;
    ieltsWriting: string;
    ieltsSpeaking: string;
    toeflTotal: string;
    greTotal: string;
    gmatTotal: string;
  };
  experience: {
    workExperience: string;
    internships: string;
    projects: string;
    certifications: string;
  };
  preferences: {
    targetCountries: string[];
    preferredPrograms: string[];
    studyLevel: string;
    intakePreference: string;
  };
}

export default function ProfileBuilder() {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Initialize formData with empty structure
  const getInitialFormData = (): FormData => ({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: ''
    },
    academics: {
      educationLevel: '',
      fieldOfStudy: '',
      institution: '',
      graduationYear: '',
      gpa: '',
      gradingSystem: ''
    },
    testScores: {
      ieltsOverall: '',
      ieltsListening: '',
      ieltsReading: '',
      ieltsWriting: '',
      ieltsSpeaking: '',
      toeflTotal: '',
      greTotal: '',
      gmatTotal: ''
    },
    experience: {
      workExperience: '',
      internships: '',
      projects: '',
      certifications: ''
    },
    preferences: {
      targetCountries: [],
      preferredPrograms: [],
      studyLevel: '',
      intakePreference: ''
    }
  });

  const [formData, setFormData] = useState<FormData>(getInitialFormData());

  // Generate graduation years from 1990 to 2025
  const generateGraduationYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1990; year--) {
      years.push(year.toString());
    }
    return years;
  };

  // Generate intake preferences for Germany and UK till 2030
  const generateIntakePreferences = () => {
    const intakes = [];
    const currentYear = new Date().getFullYear();
    
    for (let year = currentYear; year <= 2030; year++) {
      // German intakes: Winter (October) and Summer (April)
      intakes.push(`Winter ${year} (Germany)`);
      intakes.push(`Summer ${year} (Germany)`);
      
      // UK intakes: September, January
      intakes.push(`September ${year} (UK)`);
      intakes.push(`January ${year + 1} (UK)`);
    }
    
    intakes.push('Flexible');
    return intakes;
  };
  
  // Update formData whenever user changes
  useEffect(() => {
    console.log('ProfileBuilder: User changed, updating form data:', user);
    
    if (user) {
      // Load draft first
      const draft = getProfileDraft();
      
      // Merge current user data with any saved draft
      const updatedFormData: FormData = {
        personal: {
          firstName: draft?.personal?.firstName || (user as User).firstName || '',
          lastName: draft?.personal?.lastName || (user as User).lastName || '',
          email: draft?.personal?.email || (user as User).email || '',
          phone: draft?.personal?.phone || (user as User).phone || '',
          dateOfBirth: draft?.personal?.dateOfBirth || (user as User).dateOfBirth || '',
          nationality: draft?.personal?.nationality || (user as User).nationality || ''
        },
        academics: {
          educationLevel: draft?.academics?.educationLevel || (user as User).educationLevel || '',
          fieldOfStudy: draft?.academics?.fieldOfStudy || (user as User).fieldOfStudy || '',
          institution: draft?.academics?.institution || (user as User).institution || '',
          graduationYear: draft?.academics?.graduationYear || (user as User).graduationYear || '',
          gpa: draft?.academics?.gpa || (user as User).gpa || '',
          gradingSystem: draft?.academics?.gradingSystem || (user as User).gradingSystem || ''
        },
        testScores: {
          ieltsOverall: draft?.testScores?.ieltsOverall || (user as User).ieltsOverall || '',
          ieltsListening: draft?.testScores?.ieltsListening || (user as User).ieltsListening || '',
          ieltsReading: draft?.testScores?.ieltsReading || (user as User).ieltsReading || '',
          ieltsWriting: draft?.testScores?.ieltsWriting || (user as User).ieltsWriting || '',
          ieltsSpeaking: draft?.testScores?.ieltsSpeaking || (user as User).ieltsSpeaking || '',
          toeflTotal: draft?.testScores?.toeflTotal || (user as User).toeflTotal || '',
          greTotal: draft?.testScores?.greTotal || (user as User).greTotal || '',
          gmatTotal: draft?.testScores?.gmatTotal || (user as User).gmatTotal || ''
        },
        experience: {
          workExperience: draft?.experience?.workExperience || (user as User).workExperience || '',
          internships: draft?.experience?.internships || (user as User).internships || '',
          projects: draft?.experience?.projects || (user as User).projects || '',
          certifications: draft?.experience?.certifications || (user as User).certifications || ''
        },
        preferences: {
          targetCountries: draft?.preferences?.targetCountries || (user as User).targetCountries || [],
          preferredPrograms: draft?.preferences?.preferredPrograms || (user as User).preferredPrograms || [],
          studyLevel: draft?.preferences?.studyLevel || (user as User).studyLevel || '',
          intakePreference: draft?.preferences?.intakePreference || (user as User).intakePreference || ''
        }
      };
      
      console.log('ProfileBuilder: Setting form data:', updatedFormData);
      setFormData(updatedFormData);
    } else {
      // Reset to empty if no user
      console.log('ProfileBuilder: No user, resetting form data');
      setFormData(getInitialFormData());
    }
  }, [user]); // Re-run whenever user changes
  
  // Clear draft when user changes (new login)
  useEffect(() => {
    if (user) {
      // Clear any old draft data when a new user logs in
      const currentUserId = (user as User).id || (user as User).email;
      const lastUserId = localStorage.getItem('last_profile_user_id');
      
      if (lastUserId && lastUserId !== currentUserId) {
        console.log('ProfileBuilder: New user detected, clearing old draft');
        clearProfileDraft();
      }
      
      if (currentUserId) {
        localStorage.setItem('last_profile_user_id', currentUserId);
      }
    }
  }, [(user as User)?.id, (user as User)?.email]);

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Basic personal information' },
    { id: 2, title: 'Academic Background', description: 'Education history and grades' },
    { id: 3, title: 'Test Scores', description: 'IELTS, TOEFL, GRE, GMAT scores' },
    { id: 4, title: 'Experience', description: 'Work experience and projects' },
    { id: 5, title: 'Preferences', description: 'Study preferences and goals' },
    { id: 6, title: 'Review', description: 'Review and confirm your profile' }
  ];
  const progress = (currentStep / steps.length) * 100;

  // Validation functions
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateNumericInput = (value: string, min?: number, max?: number): boolean => {
    if (value === '') return true; // Allow empty values
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;
    if (min !== undefined && numValue < min) return false;
    if (max !== undefined && numValue > max) return false;
    return true;
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    switch (currentStep) {
      case 1: // Personal Info
        if (!formData.personal.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        if (!formData.personal.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        }
        if (!formData.personal.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.personal.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (formData.personal.phone && !validatePhoneNumber(formData.personal.phone)) {
          newErrors.phone = 'Please enter a valid phone number';
        }
        break;
        
      case 2: // Academic Background
        if (!formData.academics.educationLevel) {
          newErrors.educationLevel = 'Highest qualification is required';
        }
        if (!formData.academics.institution.trim()) {
          newErrors.institution = 'Institution name is required';
        }
        if (!formData.academics.fieldOfStudy.trim()) {
          newErrors.fieldOfStudy = 'Field of study is required';
        }
        if (formData.academics.gpa && !validateNumericInput(formData.academics.gpa, 0, 10)) {
          newErrors.gpa = 'Please enter a valid GPA (0-10)';
        }
        break;
        
      case 3: // Test Scores - Optional but must be valid if provided
        if (formData.testScores.ieltsOverall && !validateNumericInput(formData.testScores.ieltsOverall, 0, 9)) {
          newErrors.ieltsOverall = 'IELTS score must be between 0-9';
        }
        if (formData.testScores.toeflTotal && !validateNumericInput(formData.testScores.toeflTotal, 0, 120)) {
          newErrors.toeflTotal = 'TOEFL score must be between 0-120';
        }
        if (formData.testScores.greTotal && !validateNumericInput(formData.testScores.greTotal, 260, 340)) {
          newErrors.greTotal = 'GRE score must be between 260-340';
        }
        if (formData.testScores.gmatTotal && !validateNumericInput(formData.testScores.gmatTotal, 200, 800)) {
          newErrors.gmatTotal = 'GMAT score must be between 200-800';
        }
        break;
        
      case 4: // Experience - Optional
        // No required fields for experience
        break;
        
      case 5: // Preferences
        if (!formData.preferences.studyLevel) {
          newErrors.studyLevel = 'Study level is required';
        }
        if (formData.preferences.targetCountries.length === 0) {
          newErrors.targetCountries = 'Please select at least one target country';
        }
        if (formData.preferences.targetCountries.length > 1) {
          newErrors.targetCountries = 'Please select only one target country';
        }
        if (formData.preferences.preferredPrograms.length === 0) {
          newErrors.preferredPrograms = 'Please select at least one preferred program';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (section: keyof FormData, field: string, value: any) => {
    // Handle specific validations
    if (field === 'phone') {
      // Only allow numbers, spaces, hyphens, parentheses, and plus sign
      value = value.replace(/[^0-9\s\-\(\)\+]/g, '');
    } else if (field === 'gpa' || field.includes('ielts') || field.includes('toefl') || field.includes('gre') || field.includes('gmat')) {
      // Only allow numbers and decimal points for numeric fields
      value = value.replace(/[^0-9\.]/g, '');
      // Ensure only one decimal point
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    setFormData(prev => {
      const currentSection = prev[section];
      if (!currentSection) {
        console.error(`Section ${section} does not exist in formData`);
        return prev;
      }
      
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value
        }
      };
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      if (!formData || !formData.personal || !formData.academics || !formData.testScores || !formData.experience || !formData.preferences) {
        console.error('FormData structure is invalid:', formData);
        return;
      }
      
      saveProfileDraft(formData);
      
      // Also save to backend
      const profileData = {
        firstName: formData.personal.firstName || '',
        lastName: formData.personal.lastName || '',
        name: `${formData.personal.firstName || ''} ${formData.personal.lastName || ''}`.trim(),
        phone: formData.personal.phone || '',
        dateOfBirth: formData.personal.dateOfBirth || '',
        nationality: formData.personal.nationality || '',
        educationLevel: formData.academics.educationLevel || '',
        fieldOfStudy: formData.academics.fieldOfStudy || '',
        institution: formData.academics.institution || '',
        graduationYear: formData.academics.graduationYear || '',
        gpa: formData.academics.gpa || '',
        gradingSystem: formData.academics.gradingSystem || '',
        targetCountries: formData.preferences.targetCountries || [],
        preferredPrograms: formData.preferences.preferredPrograms || [],
        studyLevel: formData.preferences.studyLevel || '',
        intakePreference: formData.preferences.intakePreference || '',
        // Test scores
        ieltsOverall: formData.testScores.ieltsOverall || '',
        ieltsListening: formData.testScores.ieltsListening || '',
        ieltsReading: formData.testScores.ieltsReading || '',
        ieltsWriting: formData.testScores.ieltsWriting || '',
        ieltsSpeaking: formData.testScores.ieltsSpeaking || '',
        toeflTotal: formData.testScores.toeflTotal || '',
        greTotal: formData.testScores.greTotal || '',
        gmatTotal: formData.testScores.gmatTotal || '',
        // Experience
        workExperience: formData.experience.workExperience || '',
        internships: formData.experience.internships || '',
        projects: formData.experience.projects || '',
        certifications: formData.experience.certifications || '',
      };
      
      await updateUserProfile(profileData);
      console.log('ProfileBuilder: Draft saved successfully');
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const completeProfile = async () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    setIsSaving(true);
    try {
      if (!formData || !formData.personal || !formData.academics || !formData.testScores || !formData.experience || !formData.preferences) {
        console.error('FormData structure is invalid:', formData);
        return;
      }
      
      const profileData = {
        firstName: formData.personal.firstName || '',
        lastName: formData.personal.lastName || '',
        name: `${formData.personal.firstName || ''} ${formData.personal.lastName || ''}`.trim(),
        phone: formData.personal.phone || '',
        dateOfBirth: formData.personal.dateOfBirth || '',
        nationality: formData.personal.nationality || '',
        educationLevel: formData.academics.educationLevel || '',
        fieldOfStudy: formData.academics.fieldOfStudy || '',
        institution: formData.academics.institution || '',
        graduationYear: formData.academics.graduationYear || '',
        gpa: formData.academics.gpa || '',
        gradingSystem: formData.academics.gradingSystem || '',
        targetCountries: formData.preferences.targetCountries || [],
        preferredPrograms: formData.preferences.preferredPrograms || [],
        studyLevel: formData.preferences.studyLevel || '',
        intakePreference: formData.preferences.intakePreference || '',
        // Test scores
        ieltsOverall: formData.testScores.ieltsOverall || '',
        ieltsListening: formData.testScores.ieltsListening || '',
        ieltsReading: formData.testScores.ieltsReading || '',
        ieltsWriting: formData.testScores.ieltsWriting || '',
        ieltsSpeaking: formData.testScores.ieltsSpeaking || '',
        toeflTotal: formData.testScores.toeflTotal || '',
        greTotal: formData.testScores.greTotal || '',
        gmatTotal: formData.testScores.gmatTotal || '',
        // Experience
        workExperience: formData.experience.workExperience || '',
        internships: formData.experience.internships || '',
        projects: formData.experience.projects || '',
        certifications: formData.experience.certifications || '',
        // Mark profile as complete
        profileCompleted: true
      };
      
      await updateUserProfile(profileData);
      clearProfileDraft();
      console.log('ProfileBuilder: Profile completed successfully');
      setCurrentStep(6); // Go to review step
    } catch (error) {
      console.error('Error completing profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < steps.length) {
      saveDraft(); // Auto-save on navigation
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderError = (fieldName: string) => {
    if (errors[fieldName]) {
      return <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>;
    }
    return null;
  };

  const renderStepContent = () => {
    // Safety check to ensure formData is properly structured
    if (!formData || !formData.personal || !formData.academics || !formData.testScores || !formData.experience || !formData.preferences) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading form data...</p>
        </div>
      );
    }

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
                  value={formData.personal.firstName}
                  onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                  className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.firstName ? 'border-red-500' : 'border-border'
                  }`}
                />
                {renderError('firstName')}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  placeholder="Johnson"
                  value={formData.personal.lastName}
                  onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                  className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.lastName ? 'border-red-500' : 'border-border'
                  }`}
                />
                {renderError('lastName')}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <input
                type="email"
                placeholder="alex.johnson@email.com"
                value={formData.personal.email}
                onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.email ? 'border-red-500' : 'border-border'
                }`}
              />
              {renderError('email')}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.personal.phone}
                  onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                  className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.phone ? 'border-red-500' : 'border-border'
                  }`}
                />
                {renderError('phone')}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.personal.dateOfBirth}
                  onChange={(e) => handleInputChange('personal', 'dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Nationality</label>
              <select 
                value={formData.personal.nationality}
                onChange={(e) => handleInputChange('personal', 'nationality', e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select your nationality</option>
                <option value="United States">United States</option>
                <option value="India">India</option>
                <option value="China">China</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Other">Other</option>
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
              <select 
                value={formData.academics.educationLevel}
                onChange={(e) => handleInputChange('academics', 'educationLevel', e.target.value)}
                className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.educationLevel ? 'border-red-500' : 'border-border'
                }`}
              >
                <option value="">Select qualification</option>
                <option value="High School Diploma">High School Diploma</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
              </select>
              {renderError('educationLevel')}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Institution Name *</label>
                <input
                  type="text"
                  placeholder="University of California, Berkeley"
                  value={formData.academics.institution}
                  onChange={(e) => handleInputChange('academics', 'institution', e.target.value)}
                  className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.institution ? 'border-red-500' : 'border-border'
                  }`}
                />
                {renderError('institution')}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Field of Study *</label>
                <input
                  type="text"
                  placeholder="Computer Science"
                  value={formData.academics.fieldOfStudy}
                  onChange={(e) => handleInputChange('academics', 'fieldOfStudy', e.target.value)}
                  className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.fieldOfStudy ? 'border-red-500' : 'border-border'
                  }`}
                />
                {renderError('fieldOfStudy')}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Graduation Year</label>
                <select 
                  value={formData.academics.graduationYear}
                  onChange={(e) => handleInputChange('academics', 'graduationYear', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select year</option>
                  {generateGraduationYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GPA/Grade</label>
                <input
                  type="text"
                  placeholder="3.8"
                  value={formData.academics.gpa}
                  onChange={(e) => handleInputChange('academics', 'gpa', e.target.value)}
                  className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.gpa ? 'border-red-500' : 'border-border'
                  }`}
                />
                {renderError('gpa')}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Grading System</label>
                <select 
                  value={formData.academics.gradingSystem}
                  onChange={(e) => handleInputChange('academics', 'gradingSystem', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select system</option>
                  <option value="4.0 Scale">4.0 Scale</option>
                  <option value="10.0 Scale">10.0 Scale</option>
                  <option value="Percentage">Percentage</option>
                  <option value="First Class/Second Class">First Class/Second Class</option>
                </select>
              </div>
            </div>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">IELTS Scores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Overall Band</label>
                  <input
                    type="text"
                    placeholder="7.5"
                    value={formData.testScores.ieltsOverall}
                    onChange={(e) => handleInputChange('testScores', 'ieltsOverall', e.target.value)}
                    className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.ieltsOverall ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {renderError('ieltsOverall')}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Listening</label>
                  <input
                    type="text"
                    placeholder="8.0"
                    value={formData.testScores.ieltsListening}
                    onChange={(e) => handleInputChange('testScores', 'ieltsListening', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reading</label>
                  <input
                    type="text"
                    placeholder="7.5"
                    value={formData.testScores.ieltsReading}
                    onChange={(e) => handleInputChange('testScores', 'ieltsReading', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Writing</label>
                  <input
                    type="text"
                    placeholder="7.0"
                    value={formData.testScores.ieltsWriting}
                    onChange={(e) => handleInputChange('testScores', 'ieltsWriting', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Speaking</label>
                  <input
                    type="text"
                    placeholder="7.5"
                    value={formData.testScores.ieltsSpeaking}
                    onChange={(e) => handleInputChange('testScores', 'ieltsSpeaking', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Other Test Scores</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">TOEFL Total</label>
                  <input
                    type="text"
                    placeholder="100"
                    value={formData.testScores.toeflTotal}
                    onChange={(e) => handleInputChange('testScores', 'toeflTotal', e.target.value)}
                    className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.toeflTotal ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {renderError('toeflTotal')}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GRE Total</label>
                  <input
                    type="text"
                    placeholder="320"
                    value={formData.testScores.greTotal}
                    onChange={(e) => handleInputChange('testScores', 'greTotal', e.target.value)}
                    className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.greTotal ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {renderError('greTotal')}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GMAT Total</label>
                  <input
                    type="text"
                    placeholder="650"
                    value={formData.testScores.gmatTotal}
                    onChange={(e) => handleInputChange('testScores', 'gmatTotal', e.target.value)}
                    className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.gmatTotal ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {renderError('gmatTotal')}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div>
              <label className="block text-sm font-medium mb-2">Work Experience</label>
              <textarea
                rows={4}
                placeholder="Describe your work experience, job roles, and responsibilities..."
                value={formData.experience.workExperience}
                onChange={(e) => handleInputChange('experience', 'workExperience', e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Internships</label>
              <textarea
                rows={3}
                placeholder="List your internships and key achievements..."
                value={formData.experience.internships}
                onChange={(e) => handleInputChange('experience', 'internships', e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Projects</label>
              <textarea
                rows={4}
                placeholder="Describe your academic and personal projects..."
                value={formData.experience.projects}
                onChange={(e) => handleInputChange('experience', 'projects', e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Certifications</label>
              <textarea
                rows={3}
                placeholder="List your professional certifications and courses..."
                value={formData.experience.certifications}
                onChange={(e) => handleInputChange('experience', 'certifications', e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Study Level *</label>
                <select 
                  value={formData.preferences.studyLevel}
                  onChange={(e) => handleInputChange('preferences', 'studyLevel', e.target.value)}
                  className={`w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.studyLevel ? 'border-red-500' : 'border-border'
                  }`}
                >
                  <option value="">Select study level</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                  <option value="Diploma">Diploma</option>
                </select>
                {renderError('studyLevel')}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Intake Preference</label>
                <select 
                  value={formData.preferences.intakePreference}
                  onChange={(e) => handleInputChange('preferences', 'intakePreference', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select intake</option>
                  {generateIntakePreferences().map(intake => (
                    <option key={intake} value={intake}>{intake}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Target Country *</label>
              <p className="text-sm text-muted-foreground mb-3">Please select only one target country</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Germany', 'United Kingdom'].map((country) => (
                  <label key={country} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="targetCountry"
                      checked={formData.preferences.targetCountries.includes(country)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('preferences', 'targetCountries', [country]);
                        }
                      }}
                      className="rounded border-border focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm">{country}</span>
                  </label>
                ))}
              </div>
              {renderError('targetCountries')}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Programs *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Computer Science', 'Engineering', 'Business Administration', 'Data Science',
                  'Medicine', 'Law', 'Psychology', 'Economics', 'Arts', 'Other'
                ].map((program) => (
                  <label key={program} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.preferences.preferredPrograms.includes(program)}
                      onChange={(e) => {
                        const programs = formData.preferences.preferredPrograms;
                        if (e.target.checked) {
                          handleInputChange('preferences', 'preferredPrograms', [...programs, program]);
                        } else {
                          handleInputChange('preferences', 'preferredPrograms', programs.filter(p => p !== program));
                        }
                      }}
                      className="rounded border-border focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm">{program}</span>
                  </label>
                ))}
              </div>
              {renderError('preferredPrograms')}
            </div>
          </motion.div>
        );
      
      case 6:
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
                onClick={() => {
                  clearProfileDraft();
                  navigate('/dashboard');
                }}
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
          <div className="grid grid-cols-6 gap-2">
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
            <button 
              onClick={saveDraft}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            
            <button
              onClick={currentStep === steps.length ? completeProfile : nextStep}
              disabled={isSaving}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-180 ${
                isSaving
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover-lift press-effect'
              }`}
            >
              {isSaving ? 'Saving...' : currentStep === steps.length ? 'Complete Profile' : 'Next'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}