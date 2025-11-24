import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Generator } from './Generator';
import { useApplicationsStore } from '../../stores/useApplicationsStore';
import { useCompletion } from '@ai-sdk/react';

vi.mock('../../stores/useApplicationsStore', () => ({
  useApplicationsStore: vi.fn(),
}));
vi.mock('@ai-sdk/react');
vi.mock('../../hooks/useIsMobile', () => ({
  useIsMobile: () => ({ isMobile: false }),
}));

describe('Generator', () => {
  const mockComplete = vi.fn();
  const mockAddApplication = vi.fn();
  const mockUpdateApplication = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useApplicationsStore).mockImplementation((selector) => {
      const state = {
        applications: [],
        addApplication: mockAddApplication,
        updateApplication: mockUpdateApplication,
        deleteApplication: vi.fn(),
        getAllApplications: vi.fn(),
      };
      return selector ? selector(state) : state;
    });

    vi.mocked(useCompletion).mockReturnValue({
      complete: mockComplete,
      completion: '',
      isLoading: false,
      error: undefined,
      stop: vi.fn(),
      setCompletion: vi.fn(),
    } as ReturnType<typeof useCompletion>);
  });

  it('should render generator form', () => {
    render(
      <BrowserRouter>
        <Generator />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i am good at/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/additional details/i)).toBeInTheDocument();
  });

  it('should render "New Application" title initially', () => {
    render(
      <BrowserRouter>
        <Generator />
      </BrowserRouter>
    );

    expect(screen.getByText('New Application')).toBeInTheDocument();
  });

  it('should update title when job title and company are filled', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Generator />
      </BrowserRouter>
    );

    const jobTitleInput = screen.getByLabelText(/job title/i);
    const companyInput = screen.getByLabelText(/company/i);

    await user.type(jobTitleInput, 'Developer');
    await user.type(companyInput, 'Tech Corp');

    await waitFor(() => {
      expect(screen.getByText(/developer, tech corp/i)).toBeInTheDocument();
    });
  });

  it('should disable generate button when form is invalid', () => {
    render(
      <BrowserRouter>
        <Generator />
      </BrowserRouter>
    );

    const generateButton = screen.getByRole('button', { name: /generate now/i });
    expect(generateButton).toBeDisabled();
  });

  it('should enable generate button when form is valid', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Generator />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/job title/i), 'Developer');
    await user.type(screen.getByLabelText(/company/i), 'Tech Corp');
    await user.type(screen.getByLabelText(/i am good at/i), 'React, TypeScript');
    await user.type(screen.getByLabelText(/additional details/i), 'Some details');

    await waitFor(() => {
      const generateButton = screen.getByRole('button', { name: /generate now/i });
      expect(generateButton).not.toBeDisabled();
    });
  });

  it('should call complete when generate button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Generator />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/job title/i), 'Developer');
    await user.type(screen.getByLabelText(/company/i), 'Tech Corp');
    await user.type(screen.getByLabelText(/i am good at/i), 'React');
    await user.type(screen.getByLabelText(/additional details/i), 'Details');

    const generateButton = screen.getByRole('button', { name: /generate now/i });
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockComplete).toHaveBeenCalled();
    });
  });

  it('should show goal banner when applications count is less than minimum', () => {
    render(
      <BrowserRouter>
        <Generator />
      </BrowserRouter>
    );

    expect(screen.getByText(/hit your goal/i)).toBeInTheDocument();
  });

  it('should not show goal banner when applications count reaches minimum', () => {
    const applications = Array.from({ length: 5 }, (_, i) => ({
      id: `${i}`,
      jobTitle: `Job ${i}`,
      company: `Company ${i}`,
      skills: 'Skills',
      additionalDetails: 'Details',
      letterText: `Letter ${i}`,
      createdAt: Date.now(),
    }));

    vi.mocked(useApplicationsStore).mockImplementation((selector) => {
      const state = {
        applications,
        addApplication: mockAddApplication,
        updateApplication: mockUpdateApplication,
        deleteApplication: vi.fn(),
        getAllApplications: vi.fn(),
      };
      return selector ? selector(state) : state;
    });

    render(
      <BrowserRouter>
        <Generator />
      </BrowserRouter>
    );

    expect(screen.queryByText(/hit your goal/i)).not.toBeInTheDocument();
  });

  it('should show loading state when generating', () => {
    vi.mocked(useCompletion).mockReturnValue({
      complete: mockComplete,
      completion: '',
      isLoading: true,
      error: undefined,
      stop: vi.fn(),
      setCompletion: vi.fn(),
    } as ReturnType<typeof useCompletion>);

    render(
      <BrowserRouter>
        <Generator />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    const generateButton = buttons.find(button => button.disabled && button.className.includes('generateButton'));
    expect(generateButton).toBeDefined();
    expect(generateButton).toBeDisabled();
  });
});

