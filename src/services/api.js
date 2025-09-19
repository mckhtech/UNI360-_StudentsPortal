// Use relative URL since Vite proxy will handle the routing
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, config);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
      
      // If it's a 404 or server error, return empty array for list endpoints
      if (response.status >= 400) {
        if (endpoint.includes('cities') || endpoint.includes('states') || endpoint.includes('subject_areas')) {
          console.warn(`Endpoint ${endpoint} failed, returning empty array`);
          return [];
        }
        if (endpoint.includes('universities') && !endpoint.includes('/')) {
          console.warn(`Universities endpoint failed, returning empty array`);
          return [];
        }
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`API response from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    
    // Return empty arrays for list endpoints to prevent app crashes
    if (endpoint.includes('cities') || endpoint.includes('states') || endpoint.includes('subject_areas')) {
      console.warn(`Returning empty array for failed ${endpoint} request`);
      return [];
    }
    if (endpoint.includes('universities') && !endpoint.includes('/')) {
      console.warn(`Returning empty array for failed universities request`);
      return [];
    }
    
    throw error;
  }
};

// University API endpoints
export const universityAPI = {
  // Get all universities with optional filters
  getUniversities: async (params = {}) => {
    const queryString = new URLSearchParams();
    
    // Add non-empty parameters to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && value !== 'all') {
        queryString.append(key, value);
      }
    });
    
    const endpoint = `/universities/${queryString.toString() ? `?${queryString.toString()}` : ''}`;
    return await apiRequest(endpoint);
  },

  // Get university by ID
  getUniversityById: async (id) => {
    return await apiRequest(`/universities/${id}/`);
  },

  // Get university courses
  getUniversityCourses: async (universityId) => {
    return await apiRequest(`/universities/${universityId}/courses/`);
  },

  // Get all cities
  getCities: async () => {
    return await apiRequest('/universities/cities/');
  },

  // Get all states
  getStates: async () => {
    return await apiRequest('/universities/states/');
  },

  // Get featured universities
  getFeaturedUniversities: async () => {
    return await apiRequest('/universities/featured/');
  },
};

// Course API endpoints
export const courseAPI = {
  // Get all courses with optional filters
  getCourses: async (params = {}) => {
    const queryString = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && value !== 'all') {
        queryString.append(key, value);
      }
    });
    
    const endpoint = `/courses/${queryString.toString() ? `?${queryString.toString()}` : ''}`;
    return await apiRequest(endpoint);
  },

  // Get course by ID
  getCourseById: async (id) => {
    return await apiRequest(`/courses/${id}/`);
  },

  // Get all subject areas
  getSubjectAreas: async () => {
    return await apiRequest('/courses/subject_areas/');
  },

  // Get all degree types
  getDegreeTypes: async () => {
    return await apiRequest('/courses/degree_types/');
  },
};

// Export APIs
export default {
  university: universityAPI,
  course: courseAPI,
};