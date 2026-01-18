/**
 * Input Component Test
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '../../components/common/Input';

describe('Input Component', () => {
  it('renders input with label', () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders input without label', () => {
    render(<Input name="email" placeholder="Enter email" />);
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input name="email" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays error message', () => {
    render(<Input name="email" error="Email is required" />);
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it('displays helper text when no error', () => {
    render(<Input name="email" helperText="Enter your email address" />);
    expect(screen.getByText(/enter your email address/i)).toBeInTheDocument();
  });

  it('does not display helper text when there is an error', () => {
    render(
      <Input 
        name="email" 
        error="Invalid email" 
        helperText="Enter your email address" 
      />
    );
    expect(screen.queryByText(/enter your email address/i)).not.toBeInTheDocument();
  });

  it('applies error class when error is present', () => {
    render(<Input name="email" error="Error" />);
    expect(screen.getByRole('textbox')).toHaveClass('input-error');
  });

  it('shows required marker when required', () => {
    render(<Input label="Email" name="email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input name="email" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
