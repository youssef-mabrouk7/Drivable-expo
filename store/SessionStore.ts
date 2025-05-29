import { create } from "zustand";
import { Session } from "@/types";

interface SessionState {
  sessions: Session[];
  isLoading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  isLoading: false,
  error: null,

  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      const response = await fetch('YOUR_API_ENDPOINT/sessions');
      const data = await response.json();
      set({ sessions: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch sessions",
        isLoading: false,
      });
    }
  },
})); 