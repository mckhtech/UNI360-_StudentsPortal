// Student Profile Service - Complete backend integration
import { handleApiError } from './utils.js';
import { makeAuthenticatedRequest } from './tokenService.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Make authenticated API request to student endpoints
 * Now uses centralized token service
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<Object>} - Response data
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  // Use centralized token service for authentication
  const config = {
    method: options.method || 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    console.log(`[StudentProfile] API Request: ${config.method} ${endpoint}`);
    if (options.body) {
      console.log('[StudentProfile] Request Body:', options.body);
    }
    
    // Use centralized token service - it handles auth automatically
    const data = await makeAuthenticatedRequest(endpoint, config);
    
    console.log('[StudentProfile] API Response:', data);
    return data;
  } catch (error) {
    console.error(`[StudentProfile] API request failed for ${endpoint}:`, error);
    
    // Handle specific errors
    if (error.message.includes('401')) {
      throw new Error('Unauthorized. Please log in again.');
    } else if (error.message.includes('403')) {
      throw new Error('Access denied. You do not have permission to access this resource.');
    } else if (error.message.includes('404')) {
      throw new Error('Resource not found.');
    }
    
    throw error;
  }
};

// ==================== PROFILE ENDPOINTS ====================

/**
 * Get student profile
 * GET /api/v1/students/profile
 * @returns {Promise<Object>} - Student profile data
 */
export const getStudentProfile = async () => {
  try {
    const response = await apiRequest('/api/v1/students/profile');
    return response;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw handleApiError(error);
  }
};

/**
 * Get profile builder data
 * GET /api/v1/students/profile/builder
 * @returns {Promise<Object>} - Profile builder data
 */
export const getProfileBuilder = async () => {
  try {
    const response = await apiRequest('/api/v1/students/profile/builder');
    return response;
  } catch (error) {
    console.error('Error fetching profile builder:', error);
    throw handleApiError(error);
  }
};

/**
 * Get profile builder progress
 * GET /api/v1/students/profile/builder/progress
 * @returns {Promise<Object>} - Progress data with percentage, completed steps, etc.
 */
export const getProfileProgress = async () => {
  try {
    const response = await apiRequest('/api/v1/students/profile/builder/progress');
    return response;
  } catch (error) {
    console.error('Error fetching profile progress:', error);
    throw handleApiError(error);
  }
};

/**
 * Get current step in profile builder
 * GET /api/v1/students/profile/builder/current
 * @returns {Promise<Object>} - Current step information
 */
export const getCurrentStep = async () => {
  try {
    const response = await apiRequest('/api/v1/students/profile/builder/current');
    return response;
  } catch (error) {
    console.warn('[StudentProfile] Current step endpoint not available:', error);
    
    // If endpoint doesn't exist (401/404), return null
    if (error.message.includes('401') || error.message.includes('404')) {
      console.log('[StudentProfile] Using fallback - endpoint may not be implemented yet');
      return null;
    }
    
    throw handleApiError(error);
  }
};

/**
 * Get all profile builder steps
 * WORKAROUND: Uses /builder endpoint instead of /steps (which returns 401)
 * @returns {Promise<Array>} - Array of all steps with their status
 */
export const getProfileSteps = async () => {
  try {
    console.log('[StudentProfile] Fetching profile steps...');
    
    // WORKAROUND: /builder/steps returns 401, so use /builder instead
    // and extract stepsStatus from it
    const builderResponse = await apiRequest('/api/v1/students/profile/builder');
    
    console.log('[StudentProfile] Builder response:', builderResponse);
    
    // Extract steps from the builder response
    const data = builderResponse.data || builderResponse;
    const steps = data.stepsStatus || data.steps || [];
    
    console.log('[StudentProfile] Extracted steps:', steps);
    
    return steps;
  } catch (error) {
    console.warn('[StudentProfile] Could not fetch profile steps:', error);
    
    // If even /builder fails, return empty array
    if (error.message.includes('401') || error.message.includes('404')) {
      console.log('[StudentProfile] Returning empty array as fallback');
      return [];
    }
    
    throw handleApiError(error);
  }
};

/**
 * Validate profile data
 * POST /api/v1/students/profile/builder/validate
 * @param {Object} profileData - Profile data to validate
 * @returns {Promise<Object>} - Validation result
 */
export const validateProfile = async (profileData) => {
  try {
    const response = await apiRequest('/api/v1/students/profile/builder/validate', {
      method: 'POST',
      body: profileData,
    });
    return response;
  } catch (error) {
    console.error('Error validating profile:', error);
    throw handleApiError(error);
  }
};

/**
 * Reset profile builder
 * POST /api/v1/students/profile/builder/reset
 * @returns {Promise<Object>} - Reset confirmation
 */
export const resetProfileBuilder = async () => {
  try {
    const response = await apiRequest('/api/v1/students/profile/builder/reset', {
      method: 'POST',
    });
    return response;
  } catch (error) {
    console.error('Error resetting profile builder:', error);
    throw handleApiError(error);
  }
};

// ==================== APPLICATIONS ENDPOINTS ====================

/**
 * Get all student applications
 * GET /api/v1/students/applications
 * @returns {Promise<Array>} - Array of applications
 */
export const getStudentApplications = async () => {
  try {
    const response = await apiRequest('/api/v1/students/applications');
    return Array.isArray(response) ? response : (response.data || []);
  } catch (error) {
    console.error('Error fetching student applications:', error);
    throw handleApiError(error);
  }
};

/**
 * Create new application
 * POST /api/v1/students/applications
 * @param {Object} applicationData - Application data
 * @param {string} applicationData.studentId - Student UUID
 * @param {string} applicationData.targetUniversityId - University UUID
 * @param {string} applicationData.targetCourseId - Course UUID (optional)
 * @param {string} applicationData.targetSemester - Semester (SPRING/SUMMER/FALL/WINTER)
 * @param {number} applicationData.targetYear - Target year
 * @returns {Promise<Object>} - Created application
 */
// Replace the createApplication function in studentProfile.js with this:

/**
 * Create new application
 * POST /api/v1/students/applications
 * @param {Object} applicationData - Application data
 * @param {string} applicationData.studentId - Student UUID
 * @param {string} applicationData.targetUniversityId - University UUID
 * @param {string} applicationData.targetCourseId - Course UUID
 * @param {string} applicationData.targetSemester - Semester (SPRING/SUMMER/FALL/WINTER)
 * @param {number} applicationData.targetYear - Target year
 * @returns {Promise<Object>} - Created application
 */
export const createApplication = async (applicationData) => {
  try {
    // Validate required fields
    if (!applicationData.studentId) {
      throw new Error('Student ID is required');
    }
    if (!applicationData.targetUniversityId) {
      throw new Error('University ID is required');
    }
    if (!applicationData.targetCourseId) {
      throw new Error('Course ID is required');
    }
    if (!applicationData.targetSemester) {
      throw new Error('Target semester is required');
    }
    if (!applicationData.targetYear) {
      throw new Error('Target year is required');
    }

    // Build payload matching backend API structure
    const payload = {
      studentId: applicationData.studentId,
      targetUniversityId: applicationData.targetUniversityId,
      targetCourseId: applicationData.targetCourseId,
      targetSemester: applicationData.targetSemester.toUpperCase(),
      targetYear: parseInt(applicationData.targetYear, 10),
    };

    console.log('=== CREATING APPLICATION ===');
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await apiRequest('/api/v1/students/applications', {
      method: 'POST',
      body: payload,
    });

    console.log('✅ Application created successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error creating application:', error);
    throw handleApiError(error);
  }
};
/**
 * Get application by ID
 * GET /api/v1/applications/{applicationId}
 * @param {string} applicationId - Application UUID
 * @returns {Promise<Object>} - Application details
 */
export const getApplicationById = async (applicationId) => {
  try {
    if (!applicationId) {
      throw new Error('Application ID is required');
    }

    const response = await apiRequest(`/api/v1/applications/${applicationId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching application ${applicationId}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Update application
 * PUT /api/v1/applications/{applicationId}
 * @param {string} applicationId - Application UUID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated application
 */
export const updateApplication = async (applicationId, updateData) => {
  try {
    if (!applicationId) {
      throw new Error('Application ID is required');
    }

    console.log('Updating application:', applicationId, updateData);

    const response = await apiRequest(`/api/v1/applications/${applicationId}`, {
      method: 'PUT',
      body: updateData,
    });

    return response;
  } catch (error) {
    console.error(`Error updating application ${applicationId}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Submit application
 * POST /api/v1/students/applications/{applicationId}/submit
 * @param {string} applicationId - Application UUID
 * @param {Object} submissionData - Submission data
 * @param {string} submissionData.confirmationStatement - Confirmation statement
 * @param {boolean} submissionData.agreeToTerms - Terms agreement
 * @param {string} submissionData.additionalNotes - Additional notes (optional)
 * @returns {Promise<Object>} - Submission confirmation
 */
export const submitApplication = async (applicationId, submissionData) => {
  try {
    if (!applicationId) {
      throw new Error('Application ID is required');
    }

    if (!submissionData.confirmationStatement) {
      throw new Error('Confirmation statement is required');
    }

    if (!submissionData.agreeToTerms) {
      throw new Error('You must agree to the terms and conditions');
    }

    const payload = {
      confirmationStatement: submissionData.confirmationStatement,
      agreeToTerms: submissionData.agreeToTerms,
      additionalNotes: submissionData.additionalNotes || '',
    };

    console.log('Submitting application:', applicationId, payload);

    const response = await apiRequest(`/api/v1/students/applications/${applicationId}/submit`, {
      method: 'POST',
      body: payload,
    });

    return response;
  } catch (error) {
    console.error(`Error submitting application ${applicationId}:`, error);
    throw handleApiError(error);
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if profile is complete based on progress
 * @returns {Promise<boolean>} - True if profile is 100% complete
 */
export const isProfileComplete = async () => {
  try {
    const progress = await getProfileProgress();
    return progress.percentage >= 100 || progress.completionPercentage >= 100;
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return false;
  }
};
/**
 * Get application progress with workflow tracking
 * GET /api/v1/students/applications/{applicationId}/progress
 * @param {string} applicationId - Application UUID
 * @returns {Promise<Object>} - Progress data with stages and document status
 */
export const getApplicationProgress = async (applicationId) => {
  try {
    if (!applicationId) {
      throw new Error('Application ID is required');
    }

    const response = await apiRequest(`/api/v1/students/applications/${applicationId}/progress`);
    return response;
  } catch (error) {
    console.error(`Error fetching application progress ${applicationId}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Get profile completion percentage
 * @returns {Promise<number>} - Completion percentage (0-100)
 */
export const getProfileCompletionPercentage = async () => {
  try {
    const progress = await getProfileProgress();
    return progress.percentage || progress.completionPercentage || 0;
  } catch (error) {
    console.error('Error getting profile completion percentage:', error);
    return 0;
  }
};

// ==================== NOTIFICATIONS ENDPOINTS ====================

/**
 * Get all notifications for the current user
 * GET /api/v1/notifications
 * @returns {Promise<Array>} - Array of notifications
 */
export const getNotifications = async () => {
  try {
    const response = await apiRequest('/api/v1/notifications');
    return Array.isArray(response) ? response : (response.data || []);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw handleApiError(error);
  }
};

/**
 * Get notification by ID
 * GET /api/v1/notifications/{notificationId}
 * @param {string} notificationId - Notification UUID
 * @returns {Promise<Object>} - Notification details
 */
export const getNotificationById = async (notificationId) => {
  try {
    if (!notificationId) {
      throw new Error('Notification ID is required');
    }

    const response = await apiRequest(`/api/v1/notifications/${notificationId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching notification ${notificationId}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Get unread notifications count
 * GET /api/v1/notifications/unread/count
 * @returns {Promise<Object>} - Unread count data { count: number, ... }
 */
export const getUnreadNotificationsCount = async () => {
  try {
    const response = await apiRequest('/api/v1/notifications/unread/count');
    return response;
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    throw handleApiError(error);
  }
};

/**
 * Mark notification as read
 * PUT /api/v1/notifications/{notificationId}/read
 * @param {string} notificationId - Notification UUID
 * @returns {Promise<Object>} - Updated notification
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    if (!notificationId) {
      throw new Error('Notification ID is required');
    }

    console.log('Marking notification as read:', notificationId);

    const response = await apiRequest(`/api/v1/notifications/${notificationId}/read`, {
      method: 'PUT',
    });

    return response;
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error);
    throw handleApiError(error);
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise<void>}
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const notifications = await getNotifications();
    const unreadNotifications = notifications.filter(n => !n.read && !n.isRead);
    
    await Promise.all(
      unreadNotifications.map(notification => 
        markNotificationAsRead(notification.id)
      )
    );
    
    console.log(`Marked ${unreadNotifications.length} notifications as read`);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw handleApiError(error);
  }
};

/**
 * Save/Update student profile data
 * PUT /api/v1/students/profile
 * @param {Object} profileData - Profile data to save
 * @returns {Promise<Object>} - Updated profile
 */
export const saveProfileData = async (profileData) => {
  try {
    console.log('[StudentProfile] Saving profile data:', profileData);
    
    // Map frontend fields to backend structure
    const backendData = {
      basic_info: {
        phone: profileData.phone || '',
        nationality: profileData.nationality || '',
        date_of_birth: profileData.dateOfBirth || '',
        current_location: profileData.currentLocation || '',
      },
      education: {
        education_level: profileData.educationLevel || '',
        field_of_study: profileData.fieldOfStudy || '',
        institution: profileData.institution || '',
        graduation_year: profileData.graduationYear || '',
        gpa: profileData.gpa || '',
        grading_system: profileData.gradingSystem || '',
      },
      test_scores: {
        ielts_overall: profileData.ieltsOverall || '',
        ielts_listening: profileData.ieltsListening || '',
        ielts_reading: profileData.ieltsReading || '',
        ielts_writing: profileData.ieltsWriting || '',
        ielts_speaking: profileData.ieltsSpeaking || '',
        toefl_total: profileData.toeflTotal || '',
        gre_total: profileData.greTotal || '',
        gmat_total: profileData.gmatTotal || '',
      },
      preferences: {
        target_countries: profileData.targetCountries || [],
        preferred_programs: profileData.preferredPrograms || [],
        study_level: profileData.studyLevel || '',
        intake_preference: profileData.intakePreference || '',
      },
      experience: {
        work_experience: profileData.workExperience || '',
        internships: profileData.internships || '',
        projects: profileData.projects || '',
        certifications: profileData.certifications || '',
      },
    };
    
    const response = await apiRequest('/api/v1/students/profile', {
      method: 'PUT',
      body: backendData,
    });
    
    console.log('[StudentProfile] Profile saved successfully:', response);
    return response;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw handleApiError(error);
  }
};

/**
 * Load student profile data from backend
 * GET /api/v1/students/profile
 * @returns {Promise<Object>} - Profile data mapped to frontend format
 */
export const loadProfileData = async () => {
  try {
    console.log('[StudentProfile] Loading profile data from backend');
    
    const response = await getStudentProfile();
    const data = response.data || response;
    
    console.log('[StudentProfile] Raw profile data:', data);
    
    // Map backend structure to frontend format
    const mappedData = {
      // Personal
      phone: data.basic_info?.phone || '',
      dateOfBirth: data.basic_info?.date_of_birth || '',
      nationality: data.basic_info?.nationality || '',
      currentLocation: data.basic_info?.current_location || '',
      
      // Education
      educationLevel: data.education?.education_level || '',
      fieldOfStudy: data.education?.field_of_study || '',
      institution: data.education?.institution || '',
      graduationYear: data.education?.graduation_year || '',
      gpa: data.education?.gpa || '',
      gradingSystem: data.education?.grading_system || '',
      
      // Test Scores
      ieltsOverall: data.test_scores?.ielts_overall || '',
      ieltsListening: data.test_scores?.ielts_listening || '',
      ieltsReading: data.test_scores?.ielts_reading || '',
      ieltsWriting: data.test_scores?.ielts_writing || '',
      ieltsSpeaking: data.test_scores?.ielts_speaking || '',
      toeflTotal: data.test_scores?.toefl_total || '',
      greTotal: data.test_scores?.gre_total || '',
      gmatTotal: data.test_scores?.gmat_total || '',
      
      // Preferences
      targetCountries: data.preferences?.target_countries || [],
      preferredPrograms: data.preferences?.preferred_programs || [],
      studyLevel: data.preferences?.study_level || '',
      intakePreference: data.preferences?.intake_preference || '',
      
      // Experience
      workExperience: data.experience?.work_experience || '',
      internships: data.experience?.internships || '',
      projects: data.experience?.projects || '',
      certifications: data.experience?.certifications || '',
    };
    
    console.log('[StudentProfile] Mapped profile data:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('Error loading profile:', error);
    throw handleApiError(error);
  }
};

// Export all functions
export default {
  // Profile
  getStudentProfile,
  getProfileBuilder,
  getProfileProgress,
  getCurrentStep,
  getProfileSteps,
  validateProfile,
  resetProfileBuilder,
  
  // Applications
  getStudentApplications,
  createApplication,
  getApplicationById,
  updateApplication,
  submitApplication,
  
  // Notifications
  getNotifications,
  getNotificationById,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  
  // Helpers
  isProfileComplete,
  getProfileCompletionPercentage,
  
  // Save/Load
  saveProfileData,
  loadProfileData,
};
