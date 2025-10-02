import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    if (response.config.metadata) {
      response.duration = new Date() - response.config.metadata.startTime;
    }

    return response;
  },
  (error) => {
    console.error('API Error:', error);

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];

          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden
          console.error('Access forbidden:', data?.message || 'Access denied');
          break;

        case 404:
          console.error('Resource not found:', error.config?.url);
          break;

        case 500:
          console.error('Server error:', data?.message || 'Internal server error');
          break;

        default:
          console.error(`HTTP ${status}:`, data?.message || error.message);
      }

      // Enhance error with user-friendly message
      error.userMessage = getUserFriendlyErrorMessage(status, data);
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      error.userMessage = 'Unable to connect to the server. Please check your internet connection.';
    } else {
      // Other error
      console.error('Unexpected error:', error.message);
      error.userMessage = 'An unexpected error occurred. Please try again.';
    }

    return Promise.reject(error);
  }
);

// Helper function to generate user-friendly error messages
const getUserFriendlyErrorMessage = (status, data) => {
  const message = data?.message || '';

  switch (status) {
    case 400:
      return message || 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return message || 'This action conflicts with existing data.';
    case 422:
      return message || 'The provided data is invalid.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return message || 'An error occurred. Please try again.';
  }
};

// Helper functions for common API patterns
export const apiHelpers = {
  // Handle API response with loading state
  handleRequest: async (request, setLoading, setError) => {
    try {
      if (setLoading) setLoading(true);
      if (setError) setError(null);

      const response = await request();
      return response.data;
    } catch (error) {
      if (setError) setError(error.userMessage || error.message);
      throw error;
    } finally {
      if (setLoading) setLoading(false);
    }
  },

  // Retry failed requests
  retryRequest: async (request, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await request();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  },

  // Format error for display
  formatError: (error) => {
    return error.userMessage || error.message || 'An unexpected error occurred';
  }
};

export default api;
