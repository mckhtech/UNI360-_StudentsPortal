import { getCommonHeaders, handleApiError, getToken } from './utils.js';

// Base URL for documents API endpoints - use Vite proxy
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/student`;

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
      'ngrok-skip-browser-warning': 'true',
      ...getCommonHeaders(),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`Making documents API request to: ${url}`);
    const response = await fetch(url, config);
    
    console.log(`API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`HTTP error! status: ${response.status}`, errorData);
      throw handleApiError(errorData);
    }
    
    const data = await response.json();
    console.log(`Documents API response from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Documents API request failed for ${endpoint}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Get all document templates
 * @returns {Promise<Array>} Array of document templates
 */
export const getDocumentTemplates = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await apiRequest('/document-templates/');
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Get document templates error:', error);
    throw handleApiError(error);
  }
};

/**
 * Get document templates by country
 * @param {string} country - Country code ('uk' or 'germany')
 * @returns {Promise<Object>} Document requirements for the country
 */
export const getDocumentTemplatesByCountry = async (country) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await apiRequest(`/document-templates/by_country/?country=${country.toLowerCase()}`);
    return response;
  } catch (error) {
    console.error('Get document templates by country error:', error);
    throw handleApiError(error);
  }
};

/**
 * Get document status overview
 * @returns {Promise<Object>} Document status overview with applications and summary
 */
export const getDocumentStatusOverview = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await apiRequest('/document-status-overview/');
    return response;
  } catch (error) {
    console.error('Get document status overview error:', error);
    // Return empty data structure instead of throwing to prevent app crashes
    return {
      applications: [],
      summary: {
        total_applications: 0,
        documents_uploaded: 0,
        pending_verification: 0,
        approved_documents: 0,
        rejected_documents: 0,
        not_uploaded: 0
      }
    };
  }
};

/**
 * Upload UK documents
 * @param {Object} documentsData - Form data containing documents and application_id
 * @returns {Promise<Object>} Upload response
 */
export const uploadUKDocuments = async (documentsData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Create FormData for file upload
    const formData = new FormData();
    
    // Add application_id
    if (documentsData.application_id) {
      formData.append('application_id', documentsData.application_id);
    }
    
    // Add document files
    const documentFields = [
      'visa_application_form',
      'passport', 
      'photographs',
      'proof_of_finances',
      'proof_of_accommodation'
    ];
    
    documentFields.forEach(field => {
      if (documentsData[field]) {
        formData.append(field, documentsData[field]);
      }
    });

    const response = await apiRequest('/uk-documents/upload_documents/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
        // Don't set Content-Type for FormData, let browser set it
      },
      body: formData,
    });

    return response;
  } catch (error) {
    console.error('Upload UK documents error:', error);
    throw handleApiError(error);
  }
};

/**
 * Upload Germany documents
 * @param {Object} documentsData - Form data containing documents and application_id
 * @returns {Promise<Object>} Upload response
 */
export const uploadGermanyDocuments = async (documentsData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Create FormData for file upload
    const formData = new FormData();
    
    // Add application_id
    if (documentsData.application_id) {
      formData.append('application_id', documentsData.application_id);
      console.log('✅ Added application_id:', documentsData.application_id);
    }
    
    // Add document files - Completed fields based on typical Germany visa requirements
    const documentFields = [
      'visa_application_form',
      'passport',
      'photographs', 
      'proof_of_accommodation',
      'proof_of_financial_means', 
      'flight_reservation',
      'travel_insurance',
      'proof_of_health_insurance',
      'university_admission_letter',
      'language_proficiency_certificate',
      'cv',
      'motivation_letter',
      'letters_of_recommendation',
      'birth_certificate',
      'marriage_certificate',
      'criminal_record_certificate'
    ];
    
    documentFields.forEach(field => {
      if (documentsData[field]) {
        formData.append(field, documentsData[field]);
      }
    });

    const response = await apiRequest('/germany-documents/upload_documents/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
        // Don't set Content-Type for FormData, let browser set it
      },
      body: formData,
    });

    return response;
  } catch (error) {
    console.error('Upload Germany documents error:', error);
    throw handleApiError(error);
  }
};

/**
 * Download UK document
 * @param {string} documentId - Document ID
 * @param {string} fieldName - Field name of the document
 * @returns {Promise<Blob>} Document file blob
 */
export const downloadUKDocument = async (documentId, fieldName) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${BASE_URL}/uk-documents/${documentId}/download/?field=${fieldName}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw handleApiError(errorData);
    }

    return await response.blob();
  } catch (error) {
    console.error('Download UK document error:', error);
    throw handleApiError(error);
  }
};

/**
 * Download Germany document
 * @param {string} documentId - Document ID
 * @param {string} fieldName - Field name of the document
 * @returns {Promise<Blob>} Document file blob
 */
export const downloadGermanyDocument = async (documentId, fieldName) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${BASE_URL}/germany-documents/${documentId}/download/?field=${fieldName}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw handleApiError(errorData);
    }

    return await response.blob();
  } catch (error) {
    console.error('Download Germany document error:', error);
    throw handleApiError(error);
  }
};

/**
 * Download generic document
 * @param {string} url - Document URL
 * @returns {Promise<Blob>} Document file blob
 */
export const downloadDocument = async (url) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download document');
    }

    return await response.blob();
  } catch (error) {
    console.error('Download document error:', error);
    throw handleApiError(error);
  }
};

/**
 * Get notifications (generic)
 * @returns {Promise<Array>} Array of notifications
 */
export const getNotifications = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await apiRequest('/notifications/');
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Get notifications error:', error);
    return [];
  }
};

/**
 * Get document notifications
 * @returns {Promise<Array>} Array of document-related notifications
 */
export const getDocumentNotifications = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await apiRequest('/document-notifications/');
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Get document notifications error:', error);
    return [];
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Response confirmation
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await apiRequest(`/notifications/${notificationId}/mark_read/`, {
      method: 'PUT',
    });

    return response;
  } catch (error) {
    console.error('Mark notification as read error:', error);
    throw handleApiError(error);
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Response confirmation
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await apiRequest('/notifications/mark_all_read/', {
      method: 'PUT',
    });

    return response;
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    throw handleApiError(error);
  }
};

/**
 * Get legacy documents (for backward compatibility)
 * @returns {Promise<Object>} Legacy document information
 */
export const getLegacyDocuments = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await apiRequest('/documents/legacy_documents/');
    return response;
  } catch (error) {
    console.error('Get legacy documents error:', error);
    // Return empty legacy structure instead of throwing
    return {
      message: 'Legacy document system. Please use country-specific upload APIs.',
      legacy_documents_count: 0,
      note: 'Use /api/student/uk-documents/ or /api/student/germany-documents/ for new uploads.'
    };
  }
};

/**
 * Helper function to validate file types
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {boolean} True if file type is allowed
 */
export const validateFileType = (file, allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']) => {
  return allowedTypes.includes(file.type);
};

/**
 * Helper function to validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum size in MB (default: 10MB)
 * @returns {boolean} True if file size is within limit
 */
export const validateFileSize = (file, maxSizeMB = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Helper function to format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Transform document status data for UI consumption
 * @param {Object} statusData - Raw status data from API
 * @returns {Object} Transformed data for UI
 */
export const transformDocumentStatusForUI = (statusData) => {
  if (!statusData || !statusData.applications) {
    return {
      pending: [],
      uploaded: [],
      reupload: [],
      stats: {
        pending: 0,
        uploaded: 0,
        reupload: 0,
        verified: 0
      }
    };
  }

  const pending = statusData.applications
    .filter(app => !app.documents_uploaded)
    .map(app => ({
      id: app.document_id,
      name: `${app.country} Documents`,
      type: app.country === 'UK' ? 'Academic' : 'Visa',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high',
      description: `Required documents for ${app.university_name}`,
      applicationId: app.application_id,
      universityName: app.university_name,
      country: app.country
    }));

  const uploaded = statusData.applications
    .filter(app => app.documents_uploaded && app.verification_status !== 'rejected')
    .map(app => ({
      id: app.document_id,
      name: `${app.country} Documents`,
      type: app.country === 'UK' ? 'Academic' : 'Visa',
      uploadDate: new Date(app.uploaded_at).toLocaleDateString(),
      status: app.verification_status,
      size: '2.1 MB', // Mock size - you can enhance this
      applicationId: app.application_id,
      universityName: app.university_name,
      country: app.country
    }));

  const reupload = statusData.applications
    .filter(app => app.verification_status === 'rejected')
    .map(app => ({
      id: app.document_id,
      name: `${app.country} Documents`,
      type: app.country === 'UK' ? 'Academic' : 'Visa',
      uploadDate: new Date(app.uploaded_at).toLocaleDateString(),
      status: app.verification_status,
      reason: app.admin_feedback || 'Document requires revision. Please check with admin.',
      size: '1.8 MB', // Mock size
      applicationId: app.application_id,
      universityName: app.university_name,
      country: app.country
    }));

  return {
    pending,
    uploaded,
    reupload,
    stats: {
      pending: pending.length,
      uploaded: uploaded.length,
      reupload: reupload.length,
      verified: statusData.summary?.approved_documents || 0
    }
  };
};

// Export all functions as default object for easy importing
export default {
  getDocumentTemplates,
  getDocumentTemplatesByCountry,
  getDocumentStatusOverview,
  uploadUKDocuments,
  uploadGermanyDocuments,
  downloadUKDocument,
  downloadGermanyDocument,
  downloadDocument,
  getNotifications,
  getDocumentNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getLegacyDocuments,
  validateFileType,
  validateFileSize,
  formatFileSize,
  transformDocumentStatusForUI,
};