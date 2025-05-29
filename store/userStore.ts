import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import { authAPI, profileAPI } from "@/services/api";

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: User["preferences"]) => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: {
        id: "1",
        firstName: "",
        lastName: "",
        password: "",
        transmissionType: 0,
        age: "0",
        email: "james.wilson@example.com",
        phone: "(555) 123-4567",
        lessonsCompleted: 5,
        profileImage:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
        preferences: {
          preferredInstructorId: "1",
          preferredDays: ["Mon", "Wed", "Fri"],
          preferredTimes: ["4:00 PM", "5:00 PM"],
        },
      },
      isLoading: false,
      error: null,
      isAuthenticated: true, // Set to true for demo purposes

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app with backend integration:
          // const response = await authAPI.login(email, password);
          // await AsyncStorage.setItem('auth_token', response.token);
          const response = await authAPI.login(email, password);
          await AsyncStorage.setItem("auth_token", response.token);

          const userData: User = await authAPI.getCurrentUser();

          if (response.token) {
            set({
              user: {
                id: "1",
                firstName: userData.firstName,
                lastName: userData.lastName,
                password: "",
                transmissionType: 0, // 0 for automatic
                age: userData.age,
                email: email,
                lessonsCompleted: 0,
                profileImage:
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
              },
              isLoading: false,
              isAuthenticated: true,
            });
          } else {
            throw new Error("No token provided");
          }
        } catch (error) {
          console.error("Login error:", error);
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
            isAuthenticated: false,
          });
        }
      },

      register: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app with backend integration:
          const response = await authAPI.register(userData);
          await AsyncStorage.setItem("auth_token", response.token);

          set({
            user: {
              id: "1",
              firstName: userData.firstName || "John",
              lastName: userData.lastName || "Doe",
              password: userData.password || "password123",
              transmissionType: userData.transmissionType || 0,
              age: userData.age || "25",
              email: userData.email || "user@example.com",
              lessonsCompleted: 0,
              ...userData,
            },
            isLoading: false,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Registration error:", error);
          set({
            error: error instanceof Error
              ? error.message
              : "Registration failed",
            isLoading: false,
          });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // In a real app with backend integration:
          // await authAPI.logout();
          await AsyncStorage.removeItem("auth_token");

          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          console.error("Logout error:", error);
          set({ isLoading: false });
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app with backend integration:
          // const updatedUser = await profileAPI.updateProfile(userData);

          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
            isLoading: false,
          }));
        } catch (error) {
          console.error("Profile update error:", error);
          set({
            error: error instanceof Error
              ? error.message
              : "Failed to update profile",
            isLoading: false,
          });
        }
      },

      updatePreferences: async (preferences: User["preferences"]) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app with backend integration:
          // await profileAPI.updatePreferences(preferences);

          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => ({
            user: state.user
              ? {
                ...state.user,
                preferences: { ...state.user.preferences, ...preferences },
              }
              : null,
            isLoading: false,
          }));
        } catch (error) {
          console.error("Preferences update error:", error);
          set({
            error: error instanceof Error
              ? error.message
              : "Failed to update preferences",
            isLoading: false,
          });
        }
      },

      checkAuthStatus: async () => {
        set({ isLoading: true });
        try {
          // In a real app with backend integration:
          // const token = await AsyncStorage.getItem('auth_token');
          // if (token) {
          //   const userData = await authAPI.getCurrentUser();
          //   set({ user: userData, isAuthenticated: true, isLoading: false });
          //   return true;
          // }

          // For demo, check if we have a user already
          const isAuthenticated = !!get().user;
          set({ isAuthenticated, isLoading: false });
          return isAuthenticated;
        } catch (error) {
          console.error("Auth check error:", error);
          set({ isAuthenticated: false, isLoading: false });
          return false;
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
