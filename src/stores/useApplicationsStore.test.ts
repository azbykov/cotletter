import { describe, it, expect, beforeEach } from 'vitest';
import { useApplicationsStore } from './useApplicationsStore';
import type { Application } from '../types';

// Мокаем localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useApplicationsStore', () => {
  beforeEach(() => {
    // Очищаем стор перед каждым тестом
    useApplicationsStore.setState({ applications: [] });
    localStorageMock.clear();
  });

  it('should initialize with empty applications array', () => {
    const applications = useApplicationsStore.getState().applications;
    expect(applications).toEqual([]);
  });

  it('should add application', () => {
    const application: Application = {
      id: '1',
      jobTitle: 'Developer',
      company: 'Tech Corp',
      skills: 'React, TypeScript',
      additionalDetails: 'Some details',
      letterText: 'Letter text',
      createdAt: Date.now(),
    };

    useApplicationsStore.getState().addApplication(application);

    const applications = useApplicationsStore.getState().applications;
    expect(applications).toHaveLength(1);
    expect(applications[0]).toEqual(application);
  });

  it('should add multiple applications', () => {
    const application1: Application = {
      id: '1',
      jobTitle: 'Developer',
      company: 'Tech Corp',
      skills: 'React',
      additionalDetails: 'Details 1',
      letterText: 'Letter 1',
      createdAt: Date.now(),
    };

    const application2: Application = {
      id: '2',
      jobTitle: 'Designer',
      company: 'Design Inc',
      skills: 'Figma',
      additionalDetails: 'Details 2',
      letterText: 'Letter 2',
      createdAt: Date.now(),
    };

    useApplicationsStore.getState().addApplication(application1);
    useApplicationsStore.getState().addApplication(application2);

    const applications = useApplicationsStore.getState().applications;
    expect(applications).toHaveLength(2);
    expect(applications[0]).toEqual(application2); // Новые добавляются в начало
    expect(applications[1]).toEqual(application1);
  });

  it('should update application', () => {
    const application: Application = {
      id: '1',
      jobTitle: 'Developer',
      company: 'Tech Corp',
      skills: 'React',
      additionalDetails: 'Details',
      letterText: 'Letter',
      createdAt: Date.now(),
    };

    useApplicationsStore.getState().addApplication(application);
    useApplicationsStore.getState().updateApplication('1', {
      jobTitle: 'Senior Developer',
      skills: 'React, TypeScript',
    });

    const applications = useApplicationsStore.getState().applications;
    expect(applications[0].jobTitle).toBe('Senior Developer');
    expect(applications[0].skills).toBe('React, TypeScript');
    expect(applications[0].company).toBe('Tech Corp'); // Неизмененные поля остаются
  });

  it('should not update non-existent application', () => {
    const application: Application = {
      id: '1',
      jobTitle: 'Developer',
      company: 'Tech Corp',
      skills: 'React',
      additionalDetails: 'Details',
      letterText: 'Letter',
      createdAt: Date.now(),
    };

    useApplicationsStore.getState().addApplication(application);
    useApplicationsStore.getState().updateApplication('999', {
      jobTitle: 'Updated',
    });

    const applications = useApplicationsStore.getState().applications;
    expect(applications[0].jobTitle).toBe('Developer');
  });

  it('should delete application', () => {
    const application1: Application = {
      id: '1',
      jobTitle: 'Developer',
      company: 'Tech Corp',
      skills: 'React',
      additionalDetails: 'Details 1',
      letterText: 'Letter 1',
      createdAt: Date.now(),
    };

    const application2: Application = {
      id: '2',
      jobTitle: 'Designer',
      company: 'Design Inc',
      skills: 'Figma',
      additionalDetails: 'Details 2',
      letterText: 'Letter 2',
      createdAt: Date.now(),
    };

    useApplicationsStore.getState().addApplication(application1);
    useApplicationsStore.getState().addApplication(application2);
    useApplicationsStore.getState().deleteApplication('1');

    const applications = useApplicationsStore.getState().applications;
    expect(applications).toHaveLength(1);
    expect(applications[0].id).toBe('2');
  });

  it('should get all applications', () => {
    const application1: Application = {
      id: '1',
      jobTitle: 'Developer',
      company: 'Tech Corp',
      skills: 'React',
      additionalDetails: 'Details 1',
      letterText: 'Letter 1',
      createdAt: Date.now(),
    };

    const application2: Application = {
      id: '2',
      jobTitle: 'Designer',
      company: 'Design Inc',
      skills: 'Figma',
      additionalDetails: 'Details 2',
      letterText: 'Letter 2',
      createdAt: Date.now(),
    };

    useApplicationsStore.getState().addApplication(application1);
    useApplicationsStore.getState().addApplication(application2);

    const allApplications = useApplicationsStore.getState().getAllApplications();
    expect(allApplications).toHaveLength(2);
  });
});

