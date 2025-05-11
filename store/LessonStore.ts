import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lesson, BookingFormData } from '@/types';
import { lessonsAPI } from '@/services/api';

interface LessonState {
  upcomingLessons: Lesson[];
  pastLessons: Lesson[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchLessons: () => Promise<void>;
  bookLesson: (bookingData: BookingFormData) => Promise<void>;
  cancelLesson: (lessonId: string) => Promise<void>;
  completeLesson: (lessonId: string, rating?: number, feedback?: string) => Promise<void>;
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
          // In a real app with backend integration:
          // const upcomingLessons = await lessonsAPI.getUpcomingLessons();
          // const pastLessons = await lessonsAPI.getPastLessons();
          
          // For now, simulate API call with mock data
          const { upcomingLessons, pastLessons } = require('@/constants/mockData');
          const data = { upcomingLessons, pastLessons };
          
          set({ 
            upcomingLessons: data.upcomingLessons,
            pastLessons: data.pastLessons,
            isLoading: false 
          });
        } catch (error) {
          console.error('Error fetching lessons:', error);
          set({ 
            error: error instanceof Error ? error.message : "Failed to fetch lessons", 
            isLoading: false 
          });
        }
      },

      bookLesson: async (bookingData: BookingFormData) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app with backend integration:
          // const newLesson = await lessonsAPI.bookLesson(bookingData);
          
          // For now, simulate API call
          const newLesson: Lesson = {
            id: Date.now().toString(),
            instructorId: bookingData.instructorId,
            centerId: bookingData.centerId,
            date: new Date(`${bookingData.date.toDateString()} ${bookingData.time}`),
            duration: bookingData.duration,
            status: 'pending',
            topic: bookingData.topic,
            notes: bookingData.notes,
            price: bookingData.duration === 60 ? 45 : 65, // Simple price calculation
          };
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            upcomingLessons: [...state.upcomingLessons, newLesson],
            isLoading: false
          }));
        } catch (error) {
          console.error('Error booking lesson:', error);
          set({ 
            error: error instanceof Error ? error.message : "Failed to book lesson", 
            isLoading: false 
          });
        }
      },

      cancelLesson: async (lessonId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app with backend integration:
          // await lessonsAPI.cancelLesson(lessonId);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            upcomingLessons: state.upcomingLessons.filter(
              lesson => lesson.id !== lessonId
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error cancelling lesson:', error);
          set({ 
            error: error instanceof Error ? error.message : "Failed to cancel lesson", 
            isLoading: false 
          });
        }
      },

      completeLesson: async (lessonId: string, rating?: number, feedback?: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app with backend integration:
          // await lessonsAPI.completeLesson(lessonId, rating, feedback);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => {
            const lesson = state.upcomingLessons.find(l => l.id === lessonId);
            if (!lesson) return state;
            
            const completedLesson: Lesson = {
              ...lesson,
              status: 'completed',
              rating,
              feedback
            };
            
            return {
              upcomingLessons: state.upcomingLessons.filter(l => l.id !== lessonId),
              pastLessons: [completedLesson, ...state.pastLessons],
              isLoading: false
            };
          });
        } catch (error) {
          console.error('Error completing lesson:', error);
          set({ 
            error: error instanceof Error ? error.message : "Failed to complete lesson", 
            isLoading: false 
          });
        }
      }
    }),
    {
      name: 'lesson-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);