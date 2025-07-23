import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import PostListing from './PostListing';
import { AuthContext } from '../../context/AuthContext';

// Mock the marketplaceAPI
jest.mock('../../services/marketplaceAPI', () => ({
  marketplaceAPI: {
    createListing: jest.fn()
  }
}));

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock user context
const mockUser = {
  _id: 'user123',
  name: 'Test User',
  email: 'test@example.com',
  isPremium: true
};

const mockAuthContextValue = {
  user: mockUser,
  loading: false
};

// Helper function to render component with context
const renderWithContext = (component, authValue = mockAuthContextValue) => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={authValue}>
        {component}
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('PostListing Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { marketplaceAPI } = require('../../services/marketplaceAPI');
    marketplaceAPI.createListing.mockResolvedValue({
      _id: 'listing123',
      title: 'Test Item',
      description: 'Test Description',
      price: 100
    });
  });

  test('renders PostListing form with all required fields', () => {
    renderWithContext(<PostListing />);
    
    // Check if main elements are rendered
    expect(screen.getByText('Post a Listing')).toBeInTheDocument();
    expect(screen.getByText('Listing Type')).toBeInTheDocument();
    
    // Check form fields
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post listing/i })).toBeInTheDocument();
  });

  test('successfully creates an item listing with required fields', async () => {
    renderWithContext(<PostListing />);
    
    // Fill out the form for an item listing
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'MacBook Pro' }
    });
    
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Excellent condition MacBook Pro 2023' }
    });
    
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '1500' }
    });
    
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Campus Library' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /post listing/i }));
    
    // Wait for API call
    await waitFor(() => {
      const { marketplaceAPI } = require('../../services/marketplaceAPI');
      expect(marketplaceAPI.createListing).toHaveBeenCalled();
    });
  });

  test('shows validation errors for missing required fields', async () => {
    renderWithContext(<PostListing />);
    
    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /post listing/i }));
    
    // Wait for validation message
    await waitFor(() => {
      expect(screen.getByText(/title and description are required/i)).toBeInTheDocument();
    });
    
    // Verify API was not called
    const { marketplaceAPI } = require('../../services/marketplaceAPI');
    expect(marketplaceAPI.createListing).not.toHaveBeenCalled();
  });

  test('switches to accommodation type and shows correct fields', async () => {
    renderWithContext(<PostListing />);
    
    // Switch to accommodation type
    const accommodationRadio = screen.getByLabelText(/rent place/i);
    fireEvent.click(accommodationRadio);
    
    // Wait for fields to update
    await waitFor(() => {
      expect(screen.getByLabelText(/rent/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    });
  });
});
