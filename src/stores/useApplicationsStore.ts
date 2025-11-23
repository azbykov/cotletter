import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Application } from '../types';

interface ApplicationsState {
  applications: Application[];
  addApplication: (application: Application) => void;
  updateApplication: (id: string, application: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  getAllApplications: () => Application[];
}

const STORAGE_KEY = 'cotletter-applications';

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    (set, get) => ({
      applications: [],

      addApplication: (application: Application) => {
        set((state) => ({
          applications: [application, ...state.applications],
        }));
      },

      updateApplication: (id: string, updates: Partial<Application>) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, ...updates } : app
          ),
        }));
      },

      deleteApplication: (id: string) => {
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        }));
      },

      getAllApplications: () => {
        return get().applications;
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
);

