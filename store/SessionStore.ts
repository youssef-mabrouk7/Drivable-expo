import { create } from "zustand";
import { Session } from "@/types";

interface SessionState {
  sessions: Session[];
  isLoading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
}

// Sample data from the backend
const mockSessions: Session[] = [
  {
    id: 9007199254740991,
    scenario: {
      scenarioID: 1073741824,
      name: "Highway Driving",
      environmentType: "Urban",
      difficulty: "EASY"
    },
    date: "2025-05-29T17:54:19.701Z",
    location: "Main Training Center"
  }
];

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  isLoading: false,
  error: null,

  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulating API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      set({ sessions: mockSessions, isLoading: false });
      
      // TODO: Replace with actual API call when ready
      // const response = await fetch('YOUR_API_ENDPOINT/sessions');
      // const data = await response.json();
      // set({ sessions: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch sessions",
        isLoading: false,
      });
    }
  },
})); 