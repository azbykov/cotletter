import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormField } from './FormField';

describe('FormField', () => {
  it('should render input field with label', () => {
    render(
      <FormField
        id="test-input"
        label="Test Label"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Label')).toHaveAttribute('type', 'text');
  });

  it('should render textarea when textarea prop is true', () => {
    render(
      <FormField
        id="test-textarea"
        label="Test Textarea"
        textarea
        value=""
        onChange={() => {}}
      />
    );

    const textarea = screen.getByLabelText('Test Textarea');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('should display input value', () => {
    render(
      <FormField
        id="test-input"
        label="Test Label"
        value="Test Value"
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Test Label')).toHaveValue('Test Value');
  });

  it('should call onChange when input value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <FormField
        id="test-input"
        label="Test Label"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Test Label');
    await user.type(input, 'New Value');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should apply error class when error prop is true', () => {
    const { container } = render(
      <FormField
        id="test-input"
        label="Test Label"
        value=""
        onChange={() => {}}
        error
      />
    );

    const input = container.querySelector('input');
    expect(input?.className).toContain('error');
  });

  it('should support different input types', () => {
    render(
      <FormField
        id="test-email"
        label="Email"
        type="email"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
  });

  it('should pass through additional input props', () => {
    render(
      <FormField
        id="test-input"
        label="Test Label"
        value=""
        onChange={() => {}}
        placeholder="Enter text"
        required
      />
    );

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toBeRequired();
  });
});

