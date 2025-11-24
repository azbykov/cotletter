import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextareaField } from './TextareaField';

describe('TextareaField', () => {
  it('should render textarea with label', () => {
    render(
      <TextareaField
        id="test-textarea"
        label="Test Label"
        value=""
        maxLength={100}
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Label').tagName).toBe('TEXTAREA');
  });

  it('should display current length and max length', () => {
    render(
      <TextareaField
        id="test-textarea"
        label="Test Label"
        value="Test"
        maxLength={100}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('4/100')).toBeInTheDocument();
  });

  it('should show error when length exceeds maxLength', () => {
    const longText = 'a'.repeat(101);
    const { container } = render(
      <TextareaField
        id="test-textarea"
        label="Test Label"
        value={longText}
        maxLength={100}
        onChange={() => {}}
      />
    );

    const textarea = container.querySelector('textarea');
    expect(textarea?.className).toContain('error');
    expect(screen.getByText('101/100')).toBeInTheDocument();
  });

  it('should call onChange when textarea value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <TextareaField
        id="test-textarea"
        label="Test Label"
        value=""
        maxLength={100}
        onChange={handleChange}
      />
    );

    const textarea = screen.getByLabelText('Test Label');
    await user.type(textarea, 'New text');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should apply error class when error prop is true', () => {
    const { container } = render(
      <TextareaField
        id="test-textarea"
        label="Test Label"
        value=""
        maxLength={100}
        onChange={() => {}}
        error
      />
    );

    const textarea = container.querySelector('textarea');
    expect(textarea?.className).toContain('error');
  });

  it('should pass through additional textarea props', () => {
    render(
      <TextareaField
        id="test-textarea"
        label="Test Label"
        value=""
        maxLength={100}
        onChange={() => {}}
        placeholder="Enter details"
        rows={6}
      />
    );

    const textarea = screen.getByLabelText('Test Label');
    expect(textarea).toHaveAttribute('placeholder', 'Enter details');
    expect(textarea).toHaveAttribute('rows', '6');
  });
});

