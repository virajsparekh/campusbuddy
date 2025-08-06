// API configuration for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://campusbuddy-backend.onrender.com';

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_BASE_URL; 