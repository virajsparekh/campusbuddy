// __tests__/AdminPostEvent.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import AdminPostEvent from '../AdminPostEvent';

describe('AdminPostEvent Component', () => {
  test('submits the form and shows success message', () => {
    render(<AdminPostEvent />);

    fireEvent.change(screen.getByLabelText(/Event Title/i), { target: { value: 'CampusBuddy Hackathon' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'An all-night coding competition.' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-08-15' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '18:00' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Main Hall' } });
    fireEvent.mouseDown(screen.getByLabelText(/Category/i)); // open dropdown
    fireEvent.click(screen.getByText('Workshop')); // select category

    fireEvent.click(screen.getByRole('button', { name: /Post Event/i }));

    expect(screen.getByText(/Event posted successfully/i)).toBeInTheDocument();
  });

  test('prevents form submission if required fields are missing', () => {
    render(<AdminPostEvent />);

    fireEvent.click(screen.getByRole('button', { name: /Post Event/i }));

    expect(screen.queryByText(/Event posted successfully/i)).not.toBeInTheDocument();
  });
});
