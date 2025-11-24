import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GenerateButton } from './GenerateButton';

describe('GenerateButton', () => {
  it('should render button with "Generate Now" text', () => {
    const handleClick = vi.fn();

    render(<GenerateButton onClick={handleClick} />);

    expect(screen.getByRole('button', { name: /generate now/i })).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<GenerateButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /generate now/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const handleClick = vi.fn();

    render(<GenerateButton onClick={handleClick} disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should be disabled when loading prop is true', () => {
    const handleClick = vi.fn();

    render(<GenerateButton onClick={handleClick} loading />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<GenerateButton onClick={handleClick} disabled />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not call onClick when loading', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<GenerateButton onClick={handleClick} loading />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should show "Try Again" text when repeat prop is true', () => {
    const handleClick = vi.fn();

    render(<GenerateButton onClick={handleClick} repeat />);

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('should show loading state when loading prop is true', () => {
    const handleClick = vi.fn();

    render(<GenerateButton onClick={handleClick} loading />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.className).toContain('loading');
  });
});

