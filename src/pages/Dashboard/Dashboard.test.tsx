import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { useApplicationsStore } from '../../stores/useApplicationsStore';
import type { Application } from '../../types';

// Мокаем useApplicationsStore
vi.mock('../../stores/useApplicationsStore', () => ({
  useApplicationsStore: vi.fn(),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard with title', () => {
    vi.mocked(useApplicationsStore).mockImplementation((selector) => {
      const state = {
        applications: [],
        addApplication: vi.fn(),
        updateApplication: vi.fn(),
        deleteApplication: vi.fn(),
        getAllApplications: vi.fn(),
      };
      return selector ? selector(state) : state;
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Applications')).toBeInTheDocument();
  });

  it('should render applications list', () => {
    const applications: Application[] = [
      {
        id: '1',
        jobTitle: 'Developer',
        company: 'Tech Corp',
        skills: 'React',
        additionalDetails: 'Details 1',
        letterText: 'Letter 1',
        createdAt: Date.now(),
      },
      {
        id: '2',
        jobTitle: 'Designer',
        company: 'Design Inc',
        skills: 'Figma',
        additionalDetails: 'Details 2',
        letterText: 'Letter 2',
        createdAt: Date.now(),
      },
    ];

    const deleteApplication = vi.fn();

    vi.mocked(useApplicationsStore).mockImplementation((selector) => {
      const state = {
        applications,
        addApplication: vi.fn(),
        updateApplication: vi.fn(),
        deleteApplication,
        getAllApplications: vi.fn(),
      };
      return selector ? selector(state) : state;
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Letter 1')).toBeInTheDocument();
    expect(screen.getByText('Letter 2')).toBeInTheDocument();
  });

  it('should show goal banner when applications count is less than minimum', () => {
    vi.mocked(useApplicationsStore).mockImplementation((selector) => {
      const state = {
        applications: [],
        addApplication: vi.fn(),
        updateApplication: vi.fn(),
        deleteApplication: vi.fn(),
        getAllApplications: vi.fn(),
      };
      return selector ? selector(state) : state;
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/hit your goal/i)).toBeInTheDocument();
  });

  it('should not show goal banner when applications count reaches minimum', () => {
    const applications: Application[] = Array.from({ length: 5 }, (_, i) => ({
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
        addApplication: vi.fn(),
        updateApplication: vi.fn(),
        deleteApplication: vi.fn(),
        getAllApplications: vi.fn(),
      };
      return selector ? selector(state) : state;
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.queryByText(/hit your goal/i)).not.toBeInTheDocument();
  });

  it('should render create button', () => {
    vi.mocked(useApplicationsStore).mockImplementation((selector) => {
      const state = {
        applications: [],
        addApplication: vi.fn(),
        updateApplication: vi.fn(),
        deleteApplication: vi.fn(),
        getAllApplications: vi.fn(),
      };
      return selector ? selector(state) : state;
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button', { name: /create new/i });
    expect(buttons.length).toBeGreaterThan(0);
  });
});

