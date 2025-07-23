// __tests__/AdminUserManagement.test.js

import { render, screen, fireEvent, within } from '@testing-library/react';
import AdminUserManagement from '../AdminUserManagement';

describe('AdminUserManagement Component', () => {
  test('creates a new user', () => {
    render(<AdminUserManagement />);

    fireEvent.click(screen.getByRole('button', { name: /Create User/i }));

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'CampusBuddy Tester' } });
    fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: 'tester@campusbuddy.com' } });
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'student' } });
    fireEvent.change(screen.getByLabelText(/College/i), { target: { value: 'Test College' } });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    expect(screen.getByText('CampusBuddy Tester')).toBeInTheDocument();
  });

  test('edits an existing user’s role', () => {
    render(<AdminUserManagement />);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'admin' } });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    const firstRow = screen.getAllByRole('row')[1];
    expect(within(firstRow).getByText('admin')).toBeInTheDocument();
  });
});
