import { useState, useEffect } from "react";
import { Check, ArrowRight, ArrowLeft, AlertCircle, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  getProfileBuilder,
  getCurrentStep, 
  validateStep,
  getStudentProfile,
  saveProfileData,
  getProfileBuilderConfig
} from "@/services/studentProfile";

export default function ProfileBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({});
  const [config, setConfig] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Load all configuration and data
  useEffect(() => {
    if (!user) return;
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    try {
      setIsLoadingData(true);
      
      console.log('[ProfileBuilder] Starting to load profile data...');
      
      // Get profile builder config first - THIS IS THE SOURCE OF TRUTH
      const configData = await getProfileBuilderConfig();
      console.log('[ProfileBuilder] Config data received:', configData);
      
      if (!configData?.data?.configData?.steps) {
        console.error('[ProfileBuilder] No config steps received');
        return;
      }
      
      const configSteps = configData.data.configData.steps;
      setConfig(configData.data.configData);
      console.log('[ProfileBuilder] Config steps:', configSteps.map(s => s.step_id));
      
      // Get profile builder overview
      const builderData = await getProfileBuilder();
      console.log('[ProfileBuilder] Builder data received:', builderData);
      
      if (!builderData?.data) {
        console.error('[ProfileBuilder] No builder data received');
        return;
      }

      const overview = builderData.data.overview || {};
      const stepsStatus = builderData.data.stepsStatus || [];
      
      console.log('[ProfileBuilder] Overview:', overview);
      console.log('[ProfileBuilder] Steps status from backend:', stepsStatus.map(s => s.stepId));
      
      // ✅ DYNAMIC FIX: Create mapping by matching backend steps with config steps
      // Match by checking if stepId contains config step_id or vice versa
      const createStepMapping = (backendSteps, configSteps) => {
        const mapping = {};
        
        backendSteps.forEach(backendStep => {
          // Try exact match first
          let matchedConfig = configSteps.find(cs => cs.step_id === backendStep.stepId);
          
          // If no exact match, try partial matching
          if (!matchedConfig) {
            matchedConfig = configSteps.find(cs => 
              cs.step_id.includes(backendStep.stepId) || 
              backendStep.stepId.includes(cs.step_id) ||
              cs.step_id.replace('testing_', '') === backendStep.stepId ||
              cs.step_id === `testing_${backendStep.stepId}`
            );
          }
          
          if (matchedConfig) {
            mapping[backendStep.stepId] = matchedConfig.step_id;
            console.log(`[ProfileBuilder] Mapped: ${backendStep.stepId} -> ${matchedConfig.step_id}`);
          } else {
            // If no match found, use backend ID as is
            mapping[backendStep.stepId] = backendStep.stepId;
            console.warn(`[ProfileBuilder] No config match for: ${backendStep.stepId}, using as is`);
          }
        });
        
        return mapping;
      };
      
      const stepMapping = createStepMapping(stepsStatus, configSteps);
      console.log('[ProfileBuilder] Step mapping:', stepMapping);
      
      // ✅ Map steps using dynamic mapping
      const mappedSteps = stepsStatus.map((step, index) => {
        const mappedStepId = stepMapping[step.stepId];
        
        return {
          id: index + 1,
          stepId: mappedStepId,
          backendStepId: step.stepId,
          title: step.title,
          order: step.order,
          completed: step.completed,
          required: step.required,
          estimatedTime: step.estimatedTimeMinutes
        };
      });
      
      console.log('[ProfileBuilder] Mapped steps:', mappedSteps);
      setSteps(mappedSteps);
      
      // ✅ FIX: Set completed steps based on BACKEND completed status
      const completedStepIds = mappedSteps
        .filter(step => step.completed === true)
        .map(step => step.id);
      
      console.log('[ProfileBuilder] Completed step IDs (from backend):', completedStepIds);
      setCompletedSteps(completedStepIds);
      
      // ✅ FIX: Calculate progress correctly
      const actualProgress = Math.round((completedStepIds.length / mappedSteps.length) * 100);
      const backendProgress = overview.completionPercentage || 0;
      
      // Use backend progress if available and higher
      const finalProgress = Math.max(actualProgress, backendProgress);
      
      console.log('[ProfileBuilder] Progress calculation:', {
        completedSteps: completedStepIds.length,
        totalSteps: mappedSteps.length,
        calculatedProgress: actualProgress,
        backendProgress: backendProgress,
        finalProgress: finalProgress
      });
      
      setProgress(finalProgress);
      const profileCompleted = finalProgress >= 100;
      setIsProfileComplete(profileCompleted);
      
      // ✅ FIX: Handle current step properly with mapping
      const currentStepId = overview.currentStep;
      console.log('[ProfileBuilder] Current step ID from backend:', currentStepId);
      
      if (currentStepId === 'completed' || profileCompleted) {
        console.log('[ProfileBuilder] Profile completed, showing review');
        setCurrentStepIndex(mappedSteps.length);
      } else if (currentStepId) {
        // Map the current step ID before searching
        const mappedCurrentStepId = stepIdMapping[currentStepId] || currentStepId;
        const currentStep = mappedSteps.find(s => s.stepId === mappedCurrentStepId || s.originalStepId === currentStepId);
        if (currentStep) {
          console.log('[ProfileBuilder] Setting current step index to:', currentStep.id - 1);
          setCurrentStepIndex(currentStep.id - 1);
        }
      } else {
        // Find first incomplete step
        const firstIncomplete = mappedSteps.find(s => !s.completed);
        if (firstIncomplete) {
          setCurrentStepIndex(firstIncomplete.id - 1);
        } else if (profileCompleted) {
          setCurrentStepIndex(mappedSteps.length);
        }
      }
      
      // Load existing profile data
      console.log('[ProfileBuilder] Loading existing profile data...');
      const profileData = await getStudentProfile();
      console.log('[ProfileBuilder] Profile data received:', profileData);
      
      if (profileData?.data) {
        const existingData = profileData.data;
        const formattedData = {};
        
        // Format data by step
        Object.keys(existingData).forEach(stepKey => {
          console.log(`[ProfileBuilder] Processing step key: ${stepKey}`);
          const stepData = existingData[stepKey];
          if (typeof stepData === 'object' && stepData !== null) {
            Object.keys(stepData).forEach(fieldKey => {
              console.log(`[ProfileBuilder] Setting field ${fieldKey}:`, stepData[fieldKey]);
              formattedData[fieldKey] = stepData[fieldKey];
            });
          }
        });
        
        console.log('[ProfileBuilder] Formatted form data:', formattedData);
        setFormData(formattedData);
      }
      
      console.log('[ProfileBuilder] Profile data loading complete');
      
    } catch (error) {
      console.error('[ProfileBuilder] Error loading profile data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // ✅ FIX: Improved step navigation function
  const goToStep = (stepIndex) => {
    const targetStep = steps[stepIndex];
    if (!targetStep) return;
    
    // Allow navigation if:
    // 1. Profile is complete OR
    // 2. Target step is completed OR
    // 3. Target step is the current active step
    if (isProfileComplete || completedSteps.includes(targetStep.id) || stepIndex === currentStepIndex) {
      setCurrentStepIndex(stepIndex);
      setBackendErrors({});
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    const currentStep = steps[currentStepIndex];
    
    if (!currentStep) return true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateWithBackend = async () => {
    const currentStep = steps[currentStepIndex];
    
    if (!currentStep) return false;
    
    setIsValidating(true);
    setBackendErrors({});
    
    try {
      // Get fields for current step from config
      const stepConfig = config?.steps?.find(s => 
        s.step_id === currentStep.stepId
      );
      const stepData = {};
      
      if (stepConfig?.fields) {
        stepConfig.fields.forEach(field => {
          const value = formData[field.name];
          if (value !== undefined && value !== null && value !== '') {
            stepData[field.name] = value;
          } else if (field.default_value !== undefined) {
            stepData[field.name] = field.default_value;
          } else if (field.type === 'boolean') {
            stepData[field.name] = false;
          } else if (field.type === 'multiselect' || field.type === 'array') {
            stepData[field.name] = [];
          } else {
            stepData[field.name] = "";
          }
        });
      }
      
      console.log('[ProfileBuilder] Validating step:', currentStep.stepId, 'with data:', stepData);
      
      const response = await validateStep(currentStep.stepId, stepData);
      const validationData = response.data || response;
      
      if (validationData.valid === false) {
        const errors = validationData.validationErrors || {};
        setBackendErrors(errors);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[ProfileBuilder] Validation error:', error);
      setBackendErrors({ general: 'Failed to validate. Please try again.' });
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear errors
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
    if (backendErrors[fieldName]) {
      setBackendErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const nextStep = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setBackendErrors({});

    const backendValid = await validateWithBackend();
    if (!backendValid) {
      return;
    }

    // Mark current step as completed
    const currentStep = steps[currentStepIndex];
    if (currentStep && !completedSteps.includes(currentStep.id)) {
      const newCompletedSteps = [...completedSteps, currentStep.id];
      setCompletedSteps(newCompletedSteps);
      
      // Update progress based on completed steps
      const newProgress = Math.round((newCompletedSteps.length / steps.length) * 100);
      console.log('[ProfileBuilder] Updated progress:', newProgress);
      setProgress(newProgress);
      
      // Check if profile is complete
      if (newProgress >= 100) {
        setIsProfileComplete(true);
      }
    }

    // Move to next step or complete
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Profile complete - move to review
      setCurrentStepIndex(steps.length);
      setProgress(100);
      setIsProfileComplete(true);
      await completeProfile();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setBackendErrors({});
    }
  };

  const completeProfile = async () => {
    setIsSaving(true);
    try {
      console.log('[ProfileBuilder] Profile completed locally');
      setIsProfileComplete(true);
      setProgress(100);
    } catch (error) {
      console.error("Error completing profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (field) => {
    // Handle default values
    let defaultValue = "";
    if (field.default_value !== undefined && field.default_value !== null) {
      defaultValue = field.default_value;
    } else if (field.type === 'boolean') {
      defaultValue = false;
    } else if (field.type === 'multiselect' || field.type === 'array') {
      defaultValue = [];
    }
    
    const value = formData[field.name] !== undefined ? formData[field.name] : defaultValue;
    const hasError = errors[field.name] || backendErrors[field.name];
    const errorMessage = backendErrors[field.name] || errors[field.name];

    console.log(`[renderField] Rendering field: ${field.name}, type: ${field.type}, value:`, value);

    // Common input classes
    const inputClasses = `w-full px-4 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
      hasError ? "border-red-500" : "border-border"
    }`;

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2">
              {field.label} {field.required && '*'}
            </label>
            {field.help_text && (
              <p className="text-xs text-muted-foreground mb-2">{field.help_text}</p>
            )}
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={inputClasses}
              min={field.validation?.min}
              max={field.validation?.max}
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2">
              {field.label} {field.required && '*'}
            </label>
            {field.help_text && (
              <p className="text-xs text-muted-foreground mb-2">{field.help_text}</p>
            )}
            <input
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={inputClasses}
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2">
              {field.label} {field.required && '*'}
            </label>
            {field.help_text && (
              <p className="text-xs text-muted-foreground mb-2">{field.help_text}</p>
            )}
            <select
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={inputClasses}>
              <option value="">Select {field.label.toLowerCase()}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </div>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : (value ? value.split(',').map(v => v.trim()) : []);
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2">
              {field.label} {field.required && '*'}
            </label>
            {field.help_text && (
              <p className="text-sm text-muted-foreground mb-3">{field.help_text}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {field.options?.map((option) => (
                <label 
                  key={option}
                  className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-card-hover cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...selectedValues, option]
                        : selectedValues.filter(v => v !== option);
                      handleInputChange(field.name, updated);
                    }}
                    className="rounded border-border focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-sm capitalize">
                    {option.replace(/_/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2">
              {field.label} {field.required && '*'}
            </label>
            {field.help_text && (
              <p className="text-xs text-muted-foreground mb-2">{field.help_text}</p>
            )}
            <textarea
              rows={4}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={inputClasses}
              minLength={field.validation?.min_length}
              maxLength={field.validation?.max_length}
            />
            {field.validation?.max_length && (
              <p className="text-xs text-muted-foreground mt-1">
                {value.length}/{field.validation.max_length} characters
              </p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </div>
        );

      case 'boolean':
        return (
          <div key={field.name} className="flex items-center space-x-3 p-4 border border-border rounded-lg">
            <input
              type="checkbox"
              id={field.name}
              checked={value === true || value === 'true'}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="rounded border-border focus:ring-2 focus:ring-primary/20"
            />
            <label htmlFor={field.name} className="flex-1 cursor-pointer">
              <span className="block text-sm font-medium">{field.label}</span>
              {field.help_text && (
                <span className="text-xs text-muted-foreground">{field.help_text}</span>
              )}
            </label>
          </div>
        );

      case 'file':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2">
              {field.label} {field.required && '*'}
            </label>
            {field.help_text && (
              <p className="text-xs text-muted-foreground mb-2">{field.help_text}</p>
            )}
            <input
              type="file"
              onChange={(e) => handleInputChange(field.name, e.target.files[0])}
              className={inputClasses}
              accept={field.metadata?.accepted_formats?.map(f => `.${f}`).join(',')}
              multiple={field.metadata?.multiple}
            />
            {field.metadata?.max_size_mb && (
              <p className="text-xs text-muted-foreground mt-1">
                Max size: {field.metadata.max_size_mb}MB
              </p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderValidationBanner = () => {
    if (Object.keys(backendErrors).length === 0) return null;

    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-800 mb-2">Validation Errors</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
              {Object.entries(backendErrors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // ✅ FIXED: Review Page Component with proper data display
  const renderReviewPage = () => {
    return (
      <motion.div 
        className="space-y-6" 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: -20 }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Profile Complete!</h2>
          <p className="text-muted-foreground">
            Review your information below. You can edit any section by clicking on it.
          </p>
        </div>

        {/* Review all steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            // Get step config to match fields
            const stepConfig = config?.steps?.find(s => s.step_id === step.stepId);
            
            return (
              <div 
                key={step.id}
                className="glass rounded-xl p-6 hover:bg-card-hover cursor-pointer transition-all"
                onClick={() => goToStep(index)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success text-success-foreground flex items-center justify-center">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">Click to review and edit</p>
                    </div>
                  </div>
                  <Eye className="h-5 w-5 text-muted-foreground" />
                </div>
                
                {/* Show summary of data for this step */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {stepConfig?.fields?.map(field => {
                    const value = formData[field.name];
                    if (value !== undefined && value !== null && value !== '' && value !== false && 
                        !(Array.isArray(value) && value.length === 0) &&
                        !(typeof value === 'object' && Object.keys(value).length === 0)) {
                      return (
                        <div key={field.name} className="text-left">
                          <span className="text-muted-foreground">
                            {field.label || field.name.replace(/_/g, ' ')}:
                          </span>{' '}
                          <span className="font-medium">
                            {Array.isArray(value) 
                              ? value.join(', ') 
                              : typeof value === 'boolean'
                              ? (value ? 'Yes' : 'No')
                              : String(value).substring(0, 50)}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-xl hover-lift press-effect font-medium text-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </motion.div>
    );
  };

  const renderStepContent = () => {
    if (isLoadingData) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      );
    }

    // ✅ FIXED: Show review page when profile is complete OR when index is beyond steps
    if (isProfileComplete || currentStepIndex >= steps.length) {
      return renderReviewPage();
    }

    const currentStep = steps[currentStepIndex];
    if (!currentStep) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No step configuration found.</p>
          <p className="text-xs text-muted-foreground mt-2">
            Step index: {currentStepIndex}, Total steps: {steps.length}
          </p>
        </div>
      );
    }

    console.log('[renderStepContent] Rendering step:', currentStep);

    return (
      <motion.div 
        className="space-y-6" 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: -20 }}
        key={currentStep.stepId}
      >
        {renderValidationBanner()}
        
        <DynamicStepFields 
          stepId={currentStep.stepId}
          config={config}
          renderField={renderField}
        />
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
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

        <motion.div 
          className="mb-12" 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-base font-semibold text-foreground">
              Step {Math.min(currentStepIndex + 1, steps.length)} of {steps.length}
            </span>
            <span className="text-base font-medium text-muted-foreground">
              {progress}% Complete
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-4 mb-12 shadow-inner">
            <motion.div
              className="bg-primary h-4 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* ✅ FIXED: Step indicators with proper click handlers */}
          <div className={`grid gap-4 ${steps.length > 7 ? 'grid-cols-5' : 'grid-cols-7'}`}>
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStepIndex === index;
              const isClickable = isProfileComplete || isCompleted || isCurrent;
              
              return (
                <div 
                  key={step.id} 
                  className="flex flex-col items-center text-center"
                  onClick={() => isClickable && goToStep(index)}
                  style={{ 
                    cursor: isClickable ? 'pointer' : 'not-allowed',
                    opacity: isClickable ? 1 : 0.5
                  }}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 shadow-md ${
                      isCurrent
                        ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                        : isCompleted
                        ? "bg-success text-success-foreground shadow-success/25"
                        : "bg-muted text-muted-foreground border-2 border-border"
                    }`}>
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <span className="font-semibold text-lg">{step.id}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className={`text-sm font-semibold leading-tight ${
                      isCurrent ? "text-primary" : "text-foreground"
                    }`}>
                      {step.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div 
          className="glass rounded-2xl p-8 mb-8" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6">
            {currentStepIndex >= steps.length ? 'Review Your Profile' : (steps[currentStepIndex]?.title || 'Loading...')}
          </h2>
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="flex justify-between" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-180 ${
              currentStepIndex === 0
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-card border border-border hover:bg-card-hover hover-lift press-effect"
            }`}>
            <ArrowLeft className="h-5 w-5" />
            Previous
          </button>

          <button
            onClick={isProfileComplete ? () => navigate("/dashboard") : nextStep}
            disabled={isSaving || isValidating}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-180 ${
              isSaving || isValidating
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover-lift press-effect"
            }`}>
            {isSaving
              ? "Saving..."
              : isValidating
              ? "Validating..."
              : (isProfileComplete || currentStepIndex >= steps.length)
              ? "Go to Dashboard"
              : currentStepIndex === steps.length - 1
              ? "Complete Profile"
              : "Next"}
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// Component to dynamically load and render step fields
function DynamicStepFields({ stepId, config, renderField }) {
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStepFields();
  }, [stepId, config]);

  const loadStepFields = async () => {
    try {
      setIsLoading(true);
      console.log('[DynamicStepFields] Loading fields for step:', stepId);
      console.log('[DynamicStepFields] Available config:', config);
      
      // ✅ FIX: Remove the duplicate mapping - stepId is already mapped in loadProfileData
      // First, try to get fields from the config we already have
      if (config?.steps) {
        const step = config.steps.find(s => s.step_id === stepId);
        if (step?.fields) {
          console.log('[DynamicStepFields] Found fields in config:', step.fields.length);
          setFields(step.fields);
          setIsLoading(false);
          return;
        } else {
          console.warn(`[DynamicStepFields] Step ${stepId} not found in config. Available steps:`, 
            config.steps.map(s => s.step_id));
        }
      }
      
      // If not in config, try current step API
      console.log('[DynamicStepFields] Fields not in config, trying current step API...');
      const stepData = await getCurrentStep();
      console.log('[DynamicStepFields] Current step data:', stepData);
      
      // Try multiple paths to get fields
      let fieldsArray = null;
      
      if (stepData?.data?.formData?.fields) {
        console.log('[DynamicStepFields] Found fields at data.formData.fields');
        fieldsArray = stepData.data.formData.fields;
      } else if (stepData?.data?.fields) {
        console.log('[DynamicStepFields] Found fields at data.fields');
        fieldsArray = stepData.data.fields;
      } else if (stepData?.formData?.fields) {
        console.log('[DynamicStepFields] Found fields at formData.fields');
        fieldsArray = stepData.formData.fields;
      } else if (stepData?.fields) {
        console.log('[DynamicStepFields] Found fields at root fields');
        fieldsArray = stepData.fields;
      }
      
      if (fieldsArray && Array.isArray(fieldsArray)) {
        // Convert field structure if needed (helpText -> help_text)
        const normalizedFields = fieldsArray.map(field => ({
          ...field,
          help_text: field.help_text || field.helpText,
          default_value: field.default_value || field.defaultValue
        }));
        
        console.log('[DynamicStepFields] Setting', normalizedFields.length, 'fields');
        setFields(normalizedFields);
      } else {
        console.warn('[DynamicStepFields] No fields found in any location for step:', stepId);
        setFields([]);
      }
      
    } catch (error) {
      console.error('[DynamicStepFields] Error loading fields:', error);
      setFields([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading fields...</p>
      </div>
    );
  }

  if (fields.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No fields configured for this step.</p>
        <p className="text-xs text-muted-foreground mt-2">Step ID: {stepId}</p>
        <button 
          onClick={() => loadStepFields()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
        >
          Retry Loading Fields
        </button>
      </div>
    );
  }

  console.log('[DynamicStepFields] Rendering', fields.length, 'fields');

  return (
    <div className="space-y-6">
      {fields.map((field, index) => {
        console.log(`[DynamicStepFields] Rendering field ${index}:`, field.name, field.type);
        return <div key={field.name || index}>{renderField(field)}</div>;
      })}
    </div>
  );
}