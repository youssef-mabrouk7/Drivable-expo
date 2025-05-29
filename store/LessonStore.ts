import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BookingFormData, Lesson, Scenario } from "@/types";
import { lessonsAPI } from "@/services/api";

interface LessonState {
  upcomingLessons: Lesson[];
  pastLessons: Lesson[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchLessons: () => Promise<void>;
  bookLesson: (bookingData: BookingFormData) => Promise<void>;
  cancelLesson: (lessonId: number) => Promise<void>;
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set, get) => ({
      upcomingLessons: [],
      pastLessons: [],
      isLoading: false,
      error: null,

      fetchLessons: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await lessonsAPI.getLessons();
          set({
            upcomingLessons: data,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error fetching lessons:", error);
          set({
            error: error instanceof Error
              ? error.message
              : "Failed to fetch lessons",
            isLoading: false,
          });
        }
      },

      bookLesson: async (bookingData: BookingFormData) => {
        set({ isLoading: true, error: null });
        try {
          // For now, simulate API call
          const newLesson: Lesson = {
            id: Date.now(),
            scenario: {
              scenarioID: Math.floor(Math.random() * 1000000),
              name: bookingData.topic,
              environmentType: "Urban", // Default value
              difficulty: "EASY", // Default value
            },
            date: new Date(
              `${bookingData.date.toDateString()} ${bookingData.time}`,
            ).toISOString(),
            location: bookingData.location,
          };

          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => ({
            upcomingLessons: [...state.upcomingLessons, newLesson],
            isLoading: false,
          }));
        } catch (error) {
          console.error("Error booking lesson:", error);
          set({
            error: error instanceof Error
              ? error.message
              : "Failed to book lesson",
            isLoading: false,
          });
        }
      },

      cancelLesson: async (lessonId: number) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => ({
            upcomingLessons: state.upcomingLessons.filter(
              (lesson) => lesson.id !== lessonId,
            ),
            isLoading: false,
          }));
        } catch (error) {
          console.error("Error cancelling lesson:", error);
          set({
            error: error instanceof Error
              ? error.message
              : "Failed to cancel lesson",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "lesson-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
