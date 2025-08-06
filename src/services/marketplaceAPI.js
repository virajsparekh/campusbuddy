const API_BASE_URL = 'https://campusbuddy-backend.onrender.com';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  console.log('API Request:', { url, hasToken: !!token });
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    console.log('API Response:', { status: response.status, ok: response.ok });
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If we can't parse the error response, use the status
        console.error('Could not parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    console.error('Request config:', config);
    throw error;
  }
};

// Marketplace API functions
export const marketplaceAPI = {
  // Get all listings
  getListings: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    
    const queryString = queryParams.toString();
    const endpoint = `/marketplace/listings${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get user's listings
  getMyListings: async () => {
    return apiRequest('/marketplace/my-listings');
  },

  // Create a new listing
  createListing: async (listingData) => {
    return apiRequest('/marketplace/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  },

  // Update a listing
  updateListing: async (id, listingData) => {
    return apiRequest(`/marketplace/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    });
  },

  // Delete a listing
  deleteListing: async (id) => {
    return apiRequest(`/marketplace/listings/${id}`, {
      method: 'DELETE',
    });
  },

  // Get a single listing
  getListing: async (id) => {
    console.log('Getting listing with ID:', id);
    console.log('Auth token available:', !!getAuthToken());
    return apiRequest(`/marketplace/listings/${id}`);
  },
};

export default marketplaceAPI;
