import { useState, useEffect } from 'react';
import { Check, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { saveProfileDraft, getProfileDraft, clearProfileDraft } from '@/services/profile';
import { useNavigate } from 'react-router-dom';

export default function ProfileBuilder() {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(() => ({
    personal: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      nationality: user?.nationality || ''
    },
    academics: {
      educationLevel: user?.educationLevel || '',
      fieldOfStudy: user?.fieldOfStudy || '',
      institution: user?.institution || '',
      graduationYear: user?.graduationYear || '',
      gpa: user?.gpa || '',
      gradingSystem: user?.gradingSystem || ''
    },
    testScores: {
      ieltsOverall: user?.ieltsOverall || '',
      ieltsListening: user?.ieltsListening || '',
      ieltsReading: user?.ieltsReading || '',
      ieltsWriting: user?.ieltsWriting || '',
      ieltsSpeaking: user?.ieltsSpeaking || '',
      toeflTotal: user?.toeflTotal || '',
      greTotal: user?.greTotal || '',
      gmatTotal: user?.gmatTotal || ''
    },
    experience: {
      workExperience: user?.workExperience || '',
      internships: user?.internships || '',
      projects: user?.projects || '',
      certifications: user?.certifications || ''
    },
    preferences: {
      targetCountries: user?.targetCountries || [],
      preferredPrograms: user?.preferredPrograms || [],
      studyLevel: user?.studyLevel || '',
      intakePreference: user?.intakePreference || ''
    }
  }));
  
  // Load draft from localStorage if exists
  useEffect(() => {
    const draft = getProfileDraft();
    if (draft && typeof draft === 'object') {
      // Ensure all nested objects exist to prevent undefined errors
      setFormData(prevData => ({
        personal: { ...prevData.personal, ...(draft.personal || {}) },
        academics: { ...prevData.academics, ...(draft.academics || {}) },
        testScores: { ...prevData.testScores, ...(draft.testScores || {}) },
        experience: { ...prevData.experience, ...(draft.experience || {}) },
        preferences: { ...prevData.preferences, ...(draft.preferences || {}) }
      }));
    }
  }, []);

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Basic personal information' },
    { id: 2, title: 'Academic Background', description: 'Education history and grades' },
    { id: 3, title: 'Test Scores', description: 'IELTS, TOEFL, GRE, GMAT scores' },
    { id: 4, title: 'Experience', description: 'Work experience and projects' },
    { id: 5, title: 'Preferences', description: 'Study preferences and goals' },
    { id: 6, title: 'Review', description: 'Review and confirm your profile' }
  ];
  const progress = (currentStep / steps.length) * 100;

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => {
      // Ensure the section exists before updating
      const currentSection = prev[section as keyof typeof prev] as any;
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
  };

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      // Safety check to ensure formData structure is intact
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
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const completeProfile = async () => {
    setIsSaving(true);
    try {
      // Safety check to ensure formData structure is intact
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
      setCurrentStep(6); // Go to review step
    } catch (error) {
      console.error('Error completing profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = () => {
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
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  placeholder="Johnson"
                  value={formData.personal.lastName}
                  onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <input
                type="email"
                placeholder="alex.johnson@email.com"
                value={formData.personal.email}
                onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.personal.phone}
                  onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
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
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select qualification</option>
                <option value="High School Diploma">High School Diploma</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Institution Name *</label>
                <input
                  type="text"
                  placeholder="University of California, Berkeley"
                  value={formData.academics.institution}
                  onChange={(e) => handleInputChange('academics', 'institution', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Field of Study *</label>
                <input
                  type="text"
                  placeholder="Computer Science"
                  value={formData.academics.fieldOfStudy}
                  onChange={(e) => handleInputChange('academics', 'fieldOfStudy', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
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
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GPA/Grade</label>
                <input
                  type="text"
                  placeholder="3.8/4.0"
                  value={formData.academics.gpa}
                  onChange={(e) => handleInputChange('academics', 'gpa', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
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
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    placeholder="7.5"
                    value={formData.testScores.ieltsOverall}
                    onChange={(e) => handleInputChange('testScores', 'ieltsOverall', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Listening</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    placeholder="8.0"
                    value={formData.testScores.ieltsListening}
                    onChange={(e) => handleInputChange('testScores', 'ieltsListening', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reading</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    placeholder="7.5"
                    value={formData.testScores.ieltsReading}
                    onChange={(e) => handleInputChange('testScores', 'ieltsReading', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Writing</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    placeholder="7.0"
                    value={formData.testScores.ieltsWriting}
                    onChange={(e) => handleInputChange('testScores', 'ieltsWriting', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Speaking</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
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
                    type="number"
                    min="0"
                    max="120"
                    placeholder="100"
                    value={formData.testScores.toeflTotal}
                    onChange={(e) => handleInputChange('testScores', 'toeflTotal', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GRE Total</label>
                  <input
                    type="number"
                    min="0"
                    max="340"
                    placeholder="320"
                    value={formData.testScores.greTotal}
                    onChange={(e) => handleInputChange('testScores', 'greTotal', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GMAT Total</label>
                  <input
                    type="number"
                    min="0"
                    max="800"
                    placeholder="650"
                    value={formData.testScores.gmatTotal}
                    onChange={(e) => handleInputChange('testScores', 'gmatTotal', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
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
                <label className="block text-sm font-medium mb-2">Study Level</label>
                <select 
                  value={formData.preferences.studyLevel}
                  onChange={(e) => handleInputChange('preferences', 'studyLevel', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select study level</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                  <option value="Diploma">Diploma</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Intake Preference</label>
                <select 
                  value={formData.preferences.intakePreference}
                  onChange={(e) => handleInputChange('preferences', 'intakePreference', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select intake</option>
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Spring 2025">Spring 2025</option>
                  <option value="Fall 2025">Fall 2025</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Target Countries</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Germany', 'United Kingdom', 'United States', 'Canada', 'Australia', 'Netherlands', 'Sweden', 'Other'].map((country) => (
                  <label key={country} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.preferences.targetCountries.includes(country)}
                      onChange={(e) => {
                        const countries = formData.preferences.targetCountries;
                        if (e.target.checked) {
                          handleInputChange('preferences', 'targetCountries', [...countries, country]);
                        } else {
                          handleInputChange('preferences', 'targetCountries', countries.filter(c => c !== country));
                        }
                      }}
                      className="rounded border-border focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm">{country}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Programs</label>
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
                  navigate('/');
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