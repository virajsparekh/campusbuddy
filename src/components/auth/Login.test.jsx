import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import { MemoryRouter } from 'react-router-dom';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ token: 'fake-token', user: { name: 'Test User', email: 'testuser@example.com' } })
    })
  );
});
afterEach(() => {
  jest.resetAllMocks();
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const blockedUser = {
  isBlocked: true,
  role: 'student',
  isPremium: true
};
const adminUser = {
  isBlocked: false,
  role: 'admin',
  isPremium: true
};
const nonPremiumUser = {
  isBlocked: false,
  role: 'student',
  isPremium: false
};
const normalUser = {
  isBlocked: false,
  role: 'student',
  isPremium: true
};

describe('Login Component and ProtectedRoute', () => {
  test('renders login form and submits with valid input (detailed)', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test@1234' } });
    fireEvent.click(loginButton);
    // Wait for navigation or success
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.objectContaining({ method: 'POST' })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('blocks access for blocked user', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute user={blockedUser}>
          <div>Blocked Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByText('Blocked Content')).not.toBeInTheDocument();
  });

  test('redirects admin user from user-only route', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute user={adminUser} requiredRole="student">
          <div>User Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByText('User Content')).not.toBeInTheDocument();
  });

  test('redirects non-premium user from premium route', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute user={nonPremiumUser} requirePremium>
          <div>Premium Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByText('Premium Content')).not.toBeInTheDocument();
  });

  test('allows normal user to access protected content', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute user={normalUser} requiredRole="student" requirePremium>
          <div>Allowed Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('Allowed Content')).toBeInTheDocument();
  });
}); 