import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { CreateButton } from './CreateButton';

const mockNavigate = vi.fn();
const mockLocation = { pathname: '/' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

describe('CreateButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.pathname = '/';
  });

  it('should render button with "Create New" text', () => {
    render(
      <BrowserRouter>
        <CreateButton />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /create new/i })).toBeInTheDocument();
  });

  it('should navigate to /generator when clicked from dashboard', async () => {
    const user = userEvent.setup();
    mockLocation.pathname = '/';

    render(
      <BrowserRouter>
        <CreateButton />
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /create new/i });
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/generator');
  });

  it('should call onResetForm when clicked from generator page', async () => {
    const user = userEvent.setup();
    const onResetForm = vi.fn();
    mockLocation.pathname = '/generator';

    render(
      <BrowserRouter>
        <CreateButton onResetForm={onResetForm} />
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /create new/i });
    await user.click(button);

    expect(onResetForm).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(
      <BrowserRouter>
        <CreateButton className="custom-class" />
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /create new/i });
    expect(button.className).toContain('custom-class');
  });

  it('should apply fullWidth class when fullWidth prop is true', () => {
    render(
      <BrowserRouter>
        <CreateButton fullWidth />
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /create new/i });
    expect(button.className).toContain('fullWidth');
  });
});

