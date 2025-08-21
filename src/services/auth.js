import { handleApiError, getToken } from './utils.js';

// Base URL for the API - Update this with your actual ngrok URL
const BASE_URL = 'https://e456b00b708d.ngrok-free.app/api';

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
      ...options.headers,
    },
    ...options,
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
          errorData = { error: textError || `HTTP ${response.status}: ${response.statusText}` };
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
    
    const data = await response.json();
    console.log('Success Response:', data);
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please check if the server is running.');
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
      password_confirm: signUpData.confirmPassword,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    };

    console.log('Registration attempt with:', {
      ...requestData,
      password: '[HIDDEN]',
      password_confirm: '[HIDDEN]'
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
