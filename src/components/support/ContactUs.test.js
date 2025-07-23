// __tests__/ContactUs.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import ContactUs from '../ContactUs';

describe('ContactUs Component', () => {
  test('shows success message after form submission', () => {
    render(<ContactUs />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'CampusBuddy Tester' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'tester@campusbuddy.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Feedback on Contact Page' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'The contact form is working smoothly.' } });

    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    expect(screen.getByText(/Message Sent Successfully/i)).toBeInTheDocument();
  });

  test('does not submit form if required fields are empty', () => {
    render(<ContactUs />);

    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);

    expect(screen.queryByText(/Message Sent Successfully/i)).not.toBeInTheDocument();
  });
});
