// Student Profile Service - Complete backend integration with dynamic configuration
import { handleApiError } from './utils.js';
import { makeAuthenticatedRequest } from './tokenService.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Make authenticated API request to student endpoints
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
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
    
    const data = await makeAuthenticatedRequest(endpoint, config);
    
    console.log('[StudentProfile] API Response:', data);
    return data;
  } catch (error) {
    console.error(`[StudentProfile] API request failed for ${endpoint}:`, error);
    
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

export const getStudentProfile = async () => {
  try {
    const response = await apiRequest('/api/v1/students/profile');
    return response;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw handleApiError(error);
  }
};

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
 * Get profile builder configuration
 * GET /api/v1/students/profile/builder/config
 * @returns {Promise<Object>} - Configuration with all steps and fields
 */
export const getProfileBuilderConfig = async () => {
  try {
    console.log('[StudentProfile] Fetching profile builder config...');
    const response = await apiRequest('/api/v1/students/profile/builder/config');
    console.log('[StudentProfile] Config response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching profile builder config:', error);
    throw handleApiError(error);
  }
};

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
 * Get current step in profile builder with form data and template
 * GET /api/v1/students/profile/builder/current
 * @returns {Promise<Object>} - Current step with data and requestBodyTemplate
 */
export const getCurrentStep = async () => {
  try {
    console.log('[StudentProfile] Fetching current step...');
    const response = await apiRequest('/api/v1/students/profile/builder/current');
    console.log('[StudentProfile] Current step response:', response);
    return response;
  } catch (error) {
    console.warn('[StudentProfile] Current step endpoint error:', error);
    
    if (error.message.includes('401') || error.message.includes('404')) {
      console.log('[StudentProfile] Using fallback - endpoint may not be implemented yet');
      return null;
    }
    
    throw handleApiError(error);
  }
};

export const getProfileSteps = async () => {
  try {
    console.log('[StudentProfile] Fetching profile steps...');
    const builderResponse = await apiRequest('/api/v1/students/profile/builder');
    console.log('[StudentProfile] Builder response:', builderResponse);
    
    const data = builderResponse.data || builderResponse;
    const steps = data.stepsStatus || data.steps || [];
    
    console.log('[StudentProfile] Extracted steps:', steps);
    return steps;
  } catch (error) {
    console.warn('[StudentProfile] Could not fetch profile steps:', error);
    
    if (error.message.includes('401') || error.message.includes('404')) {
      console.log('[StudentProfile] Returning empty array as fallback');
      return [];
    }
    
    throw handleApiError(error);
  }
};

/**
 * Validate specific step data
 * POST /api/v1/students/profile/builder/validate/{stepId}
 * @param {string} stepId - Step identifier (e.g., 'testing_basic_info', 'education')
 * @param {Object} stepData - Step data to validate (snake_case keys)
 * @returns {Promise<Object>} - Validation result with errors, warnings, suggestions, and requestBodyTemplate
 */
export const validateStep = async (stepId, stepData) => {
  try {
    console.log(`[StudentProfile] Validating step: ${stepId}`, stepData);
    
    const response = await apiRequest(`/api/v1/students/profile/builder/validate/${stepId}`, {
      method: 'POST',
      body: stepData,
    });
    
    console.log(`[StudentProfile] Validation response for ${stepId}:`, response);
    return response;
  } catch (error) {
    console.error(`Error validating step ${stepId}:`, error);
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
    console.log('[StudentProfile] Resetting profile builder...');
    const response = await apiRequest('/api/v1/students/profile/builder/reset', {
      method: 'POST',
    });
    console.log('[StudentProfile] Reset response:', response);
    return response;
  } catch (error) {
    console.error('Error resetting profile builder:', error);
    throw handleApiError(error);
  }
};

// Keep legacy functions for backward compatibility
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

export const saveProfileData = async (profileData) => {
  try {
    console.log('[StudentProfile] Saving profile data (legacy method):', profileData);
    const response = await apiRequest('/api/v1/students/profile', {
      method: 'PUT',
      body: profileData,
    });
    console.log('[StudentProfile] Profile saved successfully:', response);
    return response;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw handleApiError(error);
  }
};

export const loadProfileData = async () => {
  try {
    console.log('[StudentProfile] Loading profile data');
    const response = await getStudentProfile();
    return response;
  } catch (error) {
    console.error('Error loading profile:', error);
    throw handleApiError(error);
  }
};

// ==================== APPLICATIONS ENDPOINTS ====================

export const getStudentApplications = async (countryCode) => {
  try {
    // Build the endpoint with optional countryCode parameter
    let endpoint = '/api/v1/students/applications';
    
    // Only add countryCode param for DE (Germany) and UK tabs
    if (countryCode === 'DE') {
      endpoint += '?countryCode=Germany';
    } else if (countryCode === 'UK') {
      endpoint += '?countryCode=UK';
    }
    // For 'ALL' or undefined, use endpoint without params
    
    console.log('Fetching applications from:', endpoint);
    
    const response = await apiRequest(endpoint);
    return Array.isArray(response) ? response : (response.data || []);
  } catch (error) {
    console.error('Error fetching student applications:', error);
    throw handleApiError(error);
  }
};

export const createApplication = async (applicationData) => {
  try {
    if (!applicationData.studentId) throw new Error('Student ID is required');
    if (!applicationData.targetUniversityId) throw new Error('University ID is required');
    if (!applicationData.targetCourseId) throw new Error('Course ID is required');
    if (!applicationData.targetSemester) throw new Error('Target semester is required');
    if (!applicationData.targetYear) throw new Error('Target year is required');

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

export const getApplicationById = async (applicationId) => {
  try {
    if (!applicationId) throw new Error('Application ID is required');
    const response = await apiRequest(`/api/v1/applications/${applicationId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching application ${applicationId}:`, error);
    throw handleApiError(error);
  }
};

export const updateApplication = async (applicationId, updateData) => {
  try {
    if (!applicationId) throw new Error('Application ID is required');
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

export const submitApplication = async (applicationId, submissionData) => {
  try {
    if (!applicationId) throw new Error('Application ID is required');
    if (!submissionData.confirmationStatement) throw new Error('Confirmation statement is required');
    if (!submissionData.agreeToTerms) throw new Error('You must agree to the terms and conditions');

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

export const getApplicationProgress = async (applicationId) => {
  try {
    if (!applicationId) throw new Error('Application ID is required');
    const response = await apiRequest(`/api/v1/students/applications/${applicationId}/progress`);
    return response;
  } catch (error) {
    console.error(`Error fetching application progress ${applicationId}:`, error);
    throw handleApiError(error);
  }
};

// ==================== HELPER FUNCTIONS ====================

export const isProfileComplete = async () => {
  try {
    const progress = await getProfileProgress();
    const data = progress.data || progress;
    return data.percentage >= 100 || data.completionPercentage >= 100;
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return false;
  }
};

export const getProfileCompletionPercentage = async () => {
  try {
    const progress = await getProfileProgress();
    const data = progress.data || progress;
    return data.percentage || data.completionPercentage || 0;
  } catch (error) {
    console.error('Error getting profile completion percentage:', error);
    return 0;
  }
};

// ==================== NOTIFICATIONS ENDPOINTS ====================

export const getNotifications = async () => {
  try {
    const response = await apiRequest('/api/v1/notifications');
    return Array.isArray(response) ? response : (response.data || []);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw handleApiError(error);
  }
};

export const getNotificationById = async (notificationId) => {
  try {
    if (!notificationId) throw new Error('Notification ID is required');
    const response = await apiRequest(`/api/v1/notifications/${notificationId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching notification ${notificationId}:`, error);
    throw handleApiError(error);
  }
};

export const getUnreadNotificationsCount = async () => {
  try {
    const response = await apiRequest('/api/v1/notifications/unread/count');
    return response;
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    throw handleApiError(error);
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    if (!notificationId) throw new Error('Notification ID is required');
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

// ==================== COURSES ENDPOINTS ====================

export const getAllCourses = async () => {
  try {
    const response = await apiRequest('/api/v1/students/courses');
    return Array.isArray(response) ? response : (response.data || []);
  } catch (error) {
    console.error('Error fetching all courses:', error);
    throw handleApiError(error);
  }
};

export const addCourseToFavorites = async (courseId) => {
  try {
    if (!courseId) throw new Error('Course ID is required');
    console.log('Adding course to favorites:', courseId);
    const response = await apiRequest(`/api/v1/students/courses/favorite/${courseId}`, {
      method: 'POST',
    });
    return response;
  } catch (error) {
    console.error(`Error adding course ${courseId} to favorites:`, error);
    throw handleApiError(error);
  }
};

export const removeCourseFromFavorites = async (courseId) => {
  try {
    if (!courseId) throw new Error('Course ID is required');
    console.log('Removing course from favorites:', courseId);
    const response = await apiRequest(`/api/v1/students/courses/favorite/${courseId}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error(`Error removing course ${courseId} from favorites:`, error);
    throw handleApiError(error);
  }
};

export default {
  getStudentProfile,
  getProfileBuilder,
  getProfileBuilderConfig,
  getProfileProgress,
  getCurrentStep,
  getProfileSteps,
  validateStep,
  validateProfile,
  resetProfileBuilder,
  getStudentApplications,
  createApplication,
  getApplicationById,
  updateApplication,
  submitApplication,
  getApplicationProgress,
  getAllCourses,
  addCourseToFavorites,
  removeCourseFromFavorites,
  getNotifications,
  getNotificationById,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  isProfileComplete,
  getProfileCompletionPercentage,
  saveProfileData,
  loadProfileData,
};