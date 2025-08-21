import { handleApiError, getToken } from './utils.js';

// Base URL for the API - Update this with your actual ngrok URL
const BASE_URL = 'https://3db7221c2aa9.ngrok-free.app/api';

/**
 * API Helper function to handle requests with proper headers and error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  let url = `${BASE_URL}${endpoint}`;
  
  // Add ngrok bypass header as query parameter
  if (url.includes('ngrok') && !url.includes('ngrok-skip-browser-warning')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}ngrok-skip-browser-warning=true`;
  }

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(options.headers || {}),  // merge safely
    },
    body: options.body, // keep body last
  };

  try {
    console.log(`API Request: ${config.method} ${url}`);
    console.log('Request Body:', options.body ? JSON.parse(options.body) : 'No body');
    
    const response = await fetch(url, config);
    
    console.log(`Response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      let errorData;
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
          console.log('Error Response Data:', errorData);
        } else {
          const textError = await response.text();
          console.log('Error Response Text:', textError);
          
          // Check if it's an HTML error page (common with server errors)
          if (textError.includes('<!DOCTYPE') || textError.includes('<html')) {
            errorData = { 
              error: `Server returned HTML instead of JSON. Status: ${response.status}`,
              details: 'This usually means the API endpoint is not available or there\'s a server configuration issue.'
            };
          } else {
            errorData = { error: textError || `HTTP ${response.status}: ${response.statusText}` };
          }
        }
      } catch (e) {
        console.error('Error parsing response:', e);
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      // Handle specific error cases based on Django REST framework patterns
      let errorMessage = 'An error occurred. Please try again.';
      
      if (response.status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (response.status === 400) {
        // Extract validation errors
        if (errorData && typeof errorData === 'object') {
          const errors = [];
          
          // Handle field-specific errors
          Object.entries(errorData).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              errors.push(...messages);
            } else if (typeof messages === 'string') {
              errors.push(messages);
            }
          });
          
          if (errors.length > 0) {
            errorMessage = errors.join('. ');
          }
        }
      } else if (response.status === 404) {
        errorMessage = `API endpoint not found: ${endpoint}`;
      } else if (response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
      
      throw new Error(errorMessage);
    }
    
    // Check if response is actually JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Non-JSON response received:', textResponse);
      
      // If it's HTML, it's likely an error page
      if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html')) {
        throw new Error('Server returned an error page instead of JSON data. Please check if the API server is running correctly.');
      }
      
      throw new Error('Server did not return JSON data');
    }
    
    const data = await response.json();
    console.log('Success Response:', data);
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please check if the server is running and the URL is correct.');
    }
    
    throw error;
  }
};

/**
 * Login user with credentials
 * @param {Object} credentials - { email, password, rememberMe }
 * @returns {Promise<Object>} - User data with tokens
 */
export const loginUser = async (credentials) => {
  try {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    // Extract username from email if it looks like an email
    // Convert email to username by taking the part before @
    let username = credentials.email.toLowerCase().trim();
    if (username.includes('@')) {
      username = username.split('@')[0];
    }
    
    const requestData = {
      username: username, // Use username part only
      password: credentials.password,
    };

    console.log('Login attempt with:', { 
      username: requestData.username,
      password: `[${requestData.password.length} characters]`
    });

    const response = await apiRequest('/student/auth/login/', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });

    // Validate response structure
    if (!response.user || !response.access_token) {
      console.error('Invalid response structure:', response);
      throw new Error('Invalid response from server. Please try again.');
    }

    return {
      user: {
        id: response.user.id,
        email: response.user.email,
        name: `${response.user.first_name || ''} ${response.user.last_name || ''}`.trim() || response.user.username,
        username: response.user.username,
        firstName: response.user.first_name || '',
        lastName: response.user.last_name || '',
        isVerified: true,
        createdAt: response.user.date_joined || new Date().toISOString(),
        lastLogin: response.user.last_login || new Date().toISOString(),
      },
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Register new user
 * @param {Object} signUpData - { name, email, password, confirmPassword, acceptTerms }
 * @returns {Promise<Object>} - User data with tokens
 */
export const registerUser = async (signUpData) => {
  try {
    if (!signUpData.name || !signUpData.email || !signUpData.password) {
      throw new Error('Name, email, and password are required');
    }

    if (!signUpData.acceptTerms) {
      throw new Error('You must accept the terms and conditions');
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Extract first and last name
    const nameParts = signUpData.name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    if (!firstName || !lastName) {
      throw new Error('Please provide both first and last name');
    }

    // Generate username from email - use email prefix as username
    let username = signUpData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    // Ensure username is at least 3 characters
    if (username.length < 3) {
      username = (firstName + lastName).toLowerCase().replace(/[^a-z0-9_]/g, '').substring(0, 15);
    }

    // Add some randomness if still too short
    if (username.length < 3) {
      username += Math.random().toString(36).substring(2, 5);
    }

    const requestData = {
      username: username,
      email: signUpData.email.toLowerCase().trim(),
      password: signUpData.password,
      confirm_password: signUpData.confirmPassword,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    };

    console.log('Registration attempt with:', {
      ...requestData,
      password: '[HIDDEN]',
      confirm_password: '[HIDDEN]'
    });

    const response = await apiRequest('/student/auth/register/', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });

    if (!response.user || !response.access_token) {
      throw new Error('Invalid response from server. Please try again.');
    }

    return {
      user: {
        id: response.user.id,
        email: response.user.email,
        name: `${response.user.first_name} ${response.user.last_name}`,
        username: response.user.username,
        firstName: response.user.first_name,
        lastName: response.user.last_name,
        isVerified: false,
        createdAt: new Date().toISOString(),
      },
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Google OAuth login
 * @param {string} googleToken - Google OAuth token
 * @returns {Promise<Object>} - User data with tokens
 */
export const googleLogin = async (googleToken) => {
  try {
    if (!googleToken) {
      throw new Error('Google token is required');
    }

    const response = await apiRequest('/student/auth/google/', {
      method: 'POST',
      body: JSON.stringify({
        google_token: googleToken,
      }),
    });

    if (!response.user || !response.access_token) {
      throw new Error('Invalid response from server. Please try again.');
    }

    return {
      user: {
        id: response.user.id,
        email: response.user.email,
        name: `${response.user.first_name || ''} ${response.user.last_name || ''}`.trim(),
        username: response.user.username,
        firstName: response.user.first_name || '',
        lastName: response.user.last_name || '',
        isVerified: true,
        createdAt: response.user.date_joined || new Date().toISOString(),
        lastLogin: response.user.last_login || new Date().toISOString(),
      },
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} - New access token
 */
export const refreshToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    const response = await apiRequest('/student/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (!response.access) {
      throw new Error('Invalid refresh token response');
    }

    return {
      accessToken: response.access,
      refreshToken: response.refresh || refreshToken,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    const token = getToken();
    
    if (token) {
      await apiRequest('/student/auth/logout/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};

/**
 * Verify current user with token
 * @returns {Promise<Object>} - Current user data
 */
export const verifyUser = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiRequest('/student/auth/me/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.id) {
      throw new Error('Invalid user verification response');
    }

    return {
      id: response.id,
      email: response.email,
      name: `${response.first_name || ''} ${response.last_name || ''}`.trim() || response.username,
      username: response.username,
      firstName: response.first_name || '',
      lastName: response.last_name || '',
      isVerified: true,
      createdAt: response.date_joined || new Date().toISOString(),
      lastLogin: response.last_login || new Date().toISOString(),
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} - Reset request response
 */
export const requestPasswordReset = async (email) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    const response = await apiRequest('/student/auth/password-reset/', {
      method: 'POST',
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
      }),
    });

    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} password - New password
 * @returns {Promise<Object>} - Reset response
 */
export const resetPassword = async (token, password) => {
  try {
    if (!token || !password) {
      throw new Error('Token and password are required');
    }

    const response = await apiRequest('/student/auth/password-reset/confirm/', {
      method: 'POST',
      body: JSON.stringify({
        token: token,
        password: password,
      }),
    });

    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Change user password
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Change password response
 */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!oldPassword || !newPassword) {
      throw new Error('Both old and new passwords are required');
    }

    const response = await apiRequest('/student/auth/change-password/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ==================== APPLICATION APIs ====================

/**
 * Get all applications for the current user
 * @returns {Promise<Array>} - Array of user applications
 */
export const getApplications = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await apiRequest('/student/applications/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw handleApiError(error);
  }
};

/**
 * Create a new application
 * @param {Object} applicationData - { university, course, country }
 * @returns {Promise<Object>} - Created application data
 */
export const createApplication = async (applicationData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    if (!applicationData.university || !applicationData.course || !applicationData.country) {
      throw new Error('University, course, and country are required');
    }

    // Validate country format
    const validCountries = ['germany', 'united_kingdom'];
    if (!validCountries.includes(applicationData.country.toLowerCase())) {
      throw new Error('Invalid country. Must be "germany" or "united_kingdom"');
    }

    const requestData = {
      university: applicationData.university,
      course: applicationData.course,
      country: applicationData.country.toLowerCase(),
    };

    console.log('Creating application with data:', requestData);

    const response = await apiRequest('/student/applications/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.id) {
      throw new Error('Invalid response from server. Application may not have been created.');
    }

    return response;
  } catch (error) {
    console.error('Error creating application:', error);
    throw handleApiError(error);
  }
};

/**
 * Submit an application (change status from draft to submitted)
 * @param {string} applicationId - Application ID
 * @returns {Promise<Object>} - Submit response
 */
export const submitApplication = async (applicationId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    if (!applicationId) {
      throw new Error('Application ID is required');
    }

    console.log('Submitting application:', applicationId);

    const response = await apiRequest(`/student/applications/${applicationId}/submit_application/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error submitting application:', error);
    
    // Handle specific error case
    if (error.message.includes('can only be submitted when in draft status')) {
      throw new Error('This application has already been submitted or is not in draft status.');
    }
    
    throw handleApiError(error);
  }
};

/**
 * Get application by ID
 * @param {string} applicationId - Application ID
 * @returns {Promise<Object>} - Application data
 */
export const getApplicationById = async (applicationId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    if (!applicationId) {
      throw new Error('Application ID is required');
    }

    const response = await apiRequest(`/student/applications/${applicationId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error(`Error fetching application ${applicationId}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Update application data
 * @param {string} applicationId - Application ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated application data
 */
export const updateApplication = async (applicationId, updateData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    if (!applicationId) {
      throw new Error('Application ID is required');
    }

    console.log('Updating application:', applicationId, updateData);

    const response = await apiRequest(`/student/applications/${applicationId}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    return response;
  } catch (error) {
    console.error(`Error updating application ${applicationId}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Delete application
 * @param {string} applicationId - Application ID
 * @returns {Promise<void>}
 */
export const deleteApplication = async (applicationId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    if (!applicationId) {
      throw new Error('Application ID is required');
    }

    console.log('Deleting application:', applicationId);

    await apiRequest(`/student/applications/${applicationId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Error deleting application ${applicationId}:`, error);
    throw handleApiError(error);
  }
};

// ==================== NOTIFICATIONS APIs ====================

/**
* Get all notifications for the current user
 * @param {boolean} unreadOnly - If true, returns only unread notifications
 * @param {string} type - Filter by notification type (e.g., 'document_request')
 * @returns {Promise<Array>} - Array of notifications
 */
export const getNotifications = async (unreadOnly = false, type = null) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    // Try the student-specific endpoint first
    let endpoint = '/student/notifications/';
    const queryParams = new URLSearchParams();
    
    if (unreadOnly) {
      queryParams.append('unread_only', 'true');
    }
    
    if (type) {
      queryParams.append('type', type);
    }
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }

    console.log('Fetching notifications from:', endpoint);

    const response = await apiRequest(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // The API returns an array directly according to your documentation
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    
    // If the student endpoint doesn't work, try the generic one
    if (error.message.includes('API endpoint not found')) {
      try {
        console.log('Trying alternative notifications endpoint...');
        const alternativeResponse = await apiRequest('/notifications/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        return Array.isArray(alternativeResponse) ? alternativeResponse : [];
      } catch (altError) {
        console.error('Alternative endpoint also failed:', altError);
        // Return empty array and let the UI handle it gracefully
        return [];
      }
    }
    
    throw handleApiError(error);
  }
};

/**
 * Mark a notification as read
 * @param {string|number} notificationId - Notification ID
 * @returns {Promise<Object>} - Response with success message
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    if (!notificationId) {
      throw new Error('Notification ID is required');
    }

    console.log('Marking notification as read:', notificationId);

    // Try student endpoint first
    let endpoint = `/student/notifications/${notificationId}/mark_read/`;
    
    try {
      const response = await apiRequest(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      if (error.message.includes('API endpoint not found')) {
        // Try alternative endpoint
        endpoint = `/notifications/${notificationId}/mark_read/`;
        const response = await apiRequest(endpoint, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        return response;
      }
      throw error;
    }
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error);
    throw handleApiError(error);
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} - Response with success message
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    console.log('Marking all notifications as read');

    // Try student endpoint first
    let endpoint = '/student/notifications/mark_all_read/';
    
    try {
      const response = await apiRequest(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      if (error.message.includes('API endpoint not found')) {
        // Try alternative endpoint
        endpoint = '/notifications/mark_all_read/';
        const response = await apiRequest(endpoint, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        return response;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw handleApiError(error);
  }
};