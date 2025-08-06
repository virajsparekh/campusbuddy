import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Signup from './Signup';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ msg: 'User created successfully!' })
    })
  );
});
afterEach(() => {
  jest.resetAllMocks();
});

const mockSetUser = jest.fn();
const mockAuthContextValue = {
  user: null,
  setUser: mockSetUser,
};

describe('Signup Component', () => {
  test('renders signup form and submits with valid input', async () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Test@1234' } });
    fireEvent.change(screen.getByLabelText(/student id/i), { target: { value: 'S123456' } });
    fireEvent.mouseDown(screen.getByLabelText(/select college/i));
    fireEvent.click(screen.getByText('University of Toronto'));
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/user created successfully/i)).toBeInTheDocument();
    });
  });
}); 