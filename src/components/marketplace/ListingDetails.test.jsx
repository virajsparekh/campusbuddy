import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ListingDetails from './ListingDetails';
import { AuthContext } from '../../context/AuthContext';

// Mock the marketplaceAPI
jest.mock('../../services/marketplaceAPI', () => ({
  marketplaceAPI: {
    getListing: jest.fn()
  }
}));

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'listing123' })
}));

// Mock user context
const mockUser = {
  _id: 'user123',
  name: 'Test User',
  email: 'test@example.com'
};

const mockAuthContextValue = {
  user: mockUser,
  loading: false
};

// Sample listing data
const mockItemListing = {
  _id: 'listing123',
  title: 'MacBook Pro 2023',
  description: 'Excellent condition MacBook Pro with M2 chip.',
  type: 'item',
  price: 1500,
  category: 'Electronics',
  location: 'Campus Library',
  image: 'data:image/jpeg;base64,test',
  priority: true,
  isActive: true,
  createdAt: '2025-01-15T10:30:00Z',
  updatedAt: '2025-01-15T10:30:00Z',
  userId: {
    _id: 'seller123',
    name: 'John Seller',
    email: 'seller@example.com'
  }
};

// Helper function to render component with context
const renderWithContext = (component, authValue = mockAuthContextValue) => {
  return render(
    <MemoryRouter initialEntries={['/marketplace/listing/listing123']}>
      <AuthContext.Provider value={authValue}>
        {component}
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('ListingDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log to avoid debug output in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders loading state initially', () => {
    const { marketplaceAPI } = require('../../services/marketplaceAPI');
    marketplaceAPI.getListing.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithContext(<ListingDetails />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays item listing details correctly', async () => {
    const { marketplaceAPI } = require('../../services/marketplaceAPI');
    marketplaceAPI.getListing.mockResolvedValue(mockItemListing);
    
    renderWithContext(<ListingDetails />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    // Check listing details
    expect(screen.getByText('MacBook Pro 2023')).toBeInTheDocument();
    expect(screen.getByText('$1,500.00')).toBeInTheDocument();
    expect(screen.getByText('Excellent condition MacBook Pro with M2 chip.')).toBeInTheDocument();
    
    // Check priority listing badge
    expect(screen.getByText('Priority Listing')).toBeInTheDocument();
    
    // Check seller information
    expect(screen.getByText('Seller Information')).toBeInTheDocument();
    expect(screen.getByText('John Seller')).toBeInTheDocument();
  });

  test('shows owner-specific UI when user owns the listing', async () => {
    const ownedListing = {
      ...mockItemListing,
      userId: {
        _id: 'user123', // Same as mockUser._id
        name: 'Test User',
        email: 'test@example.com'
      }
    };
    
    const { marketplaceAPI } = require('../../services/marketplaceAPI');
    marketplaceAPI.getListing.mockResolvedValue(ownedListing);
    
    renderWithContext(<ListingDetails />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    // Check owner-specific UI
    expect(screen.getByText('This is your listing')).toBeInTheDocument();
    expect(screen.getByText('View All My Listings')).toBeInTheDocument();
    
    // Contact seller button should not be shown
    expect(screen.queryByText('Contact Seller')).not.toBeInTheDocument();
  });

  test('shows contact seller button for non-owners', async () => {
    const { marketplaceAPI } = require('../../services/marketplaceAPI');
    marketplaceAPI.getListing.mockResolvedValue(mockItemListing);
    
    renderWithContext(<ListingDetails />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    // Contact seller button should be shown
    expect(screen.getByText('Contact Seller')).toBeInTheDocument();
    
    // Owner-specific UI should not be shown
    expect(screen.queryByText('This is your listing')).not.toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    const { marketplaceAPI } = require('../../services/marketplaceAPI');
    marketplaceAPI.getListing.mockRejectedValue(new Error('Failed to fetch listing'));
    
    renderWithContext(<ListingDetails />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    // Check error message
    expect(screen.getByText('Failed to fetch listing')).toBeInTheDocument();
  });

  test('API is called with correct listing ID', async () => {
    const { marketplaceAPI } = require('../../services/marketplaceAPI');
    marketplaceAPI.getListing.mockResolvedValue(mockItemListing);
    
    renderWithContext(<ListingDetails />);
    
    await waitFor(() => {
      expect(marketplaceAPI.getListing).toHaveBeenCalledWith('listing123');
    });
  });
});
