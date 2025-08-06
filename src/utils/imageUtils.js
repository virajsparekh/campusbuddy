/**
 * Utility functions for handling images in the application
 */

const BACKEND_URL = 'http://localhost:5001';

/**
 * Get the full URL for an image
 * @param {string} imageUrl - The relative image URL from the database
 * @returns {string} The full URL to the image
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl.trim() === '') {
    return null;
  }
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it starts with /, it's a relative path from the backend
  if (imageUrl.startsWith('/')) {
    return `${BACKEND_URL}${imageUrl}`;
  }
  
  // Otherwise, assume it's a relative path and add the backend URL
  return `${BACKEND_URL}/${imageUrl}`;
};

/**
 * Check if an image URL is valid and not empty
 * @param {string} imageUrl - The image URL to check
 * @returns {boolean} True if the image URL is valid
 */
export const isValidImageUrl = (imageUrl) => {
  return imageUrl && imageUrl.trim() !== '';
};

/**
 * Handle image load error
 * @param {Event} event - The error event
 * @param {string} imageUrl - The original image URL for logging
 */
export const handleImageError = (event, imageUrl) => {
  
  event.target.style.display = 'none';
  
  // Show fallback if there's a next sibling (fallback element)
  if (event.target.nextSibling) {
    event.target.nextSibling.style.display = 'flex';
  }
}; 