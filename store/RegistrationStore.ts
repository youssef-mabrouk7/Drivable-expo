import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Registration } from "@/types";
import { registrationsAPI, sessionsAPI } from "@/services/api";

interface RegistrationState {
  registrations: Registration[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUserRegistrations: () => Promise<Registration[]>;
  getRegistrationById: (id: string) => Promise<Registration | null>;
  cancelRegistration: (id: string) => Promise<void>;
  addRegistration: (registration: Registration) => void;
  clearError: () => void;
}

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set, get) => ({
      registrations: [],
      isLoading: false,
      error: null,

      fetchUserRegistrations: async (): Promise<Registration[]> => {
        set({ isLoading: true, error: null });
        try {
          const registrations = await registrationsAPI.getUserRegistrations();
          
          // Fetch session data for each registration
          const registrationsWithSessions = await Promise.all(
            registrations.map(async (registration) => {
              try {
                const session = await sessionsAPI.getSessionById(registration.session_id);
                return { ...registration, session };
              } catch (error) {
                console.error(`Error fetching session ${registration.session_id}:`, error);
                return registration; // Return registration without session data if fetch fails
              }
            })
          );

          set({
            registrations: registrationsWithSessions,
            isLoading: false,
          });

          return registrationsWithSessions;
        } catch (error) {
          console.error("Error fetching user registrations:", error);
          const errorMessage = error instanceof Error
            ? error.message
            : "Failed to fetch registrations";

          set({
            error: errorMessage,
            isLoading: false,
          });

          // If it's an authentication error, don't retry automatically
          if (
            errorMessage.includes("Authentication failed") ||
            errorMessage.includes("403") || errorMessage.includes("401")
          ) {
            throw error; // Let the component handle the auth error
          }

          return []; // Return empty array on error
        }
      },

      getRegistrationById: async (id: string): Promise<Registration | null> => {
        try {
          return await registrationsAPI.getRegistrationById(id);
        } catch (error) {
          console.error("Error fetching registration by ID:", error);
          return null;
        }
      },

      cancelRegistration: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await registrationsAPI.cancelRegistration(id);

          // Remove the cancelled registration from local state
          set((state) => ({
            registrations: state.registrations.filter(
              (registration) => registration.id !== id,
            ),
            isLoading: false,
          }));
        } catch (error) {
          console.error("Error cancelling registration:", error);
          set({
            error: error instanceof Error
              ? error.message
              : "Failed to cancel registration",
            isLoading: false,
          });
          throw error;
        }
      },

      addRegistration: (registration: Registration) => {
        set((state) => ({
          registrations: [...state.registrations, registration],
        }));
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "registration-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
