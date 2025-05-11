import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lesson, Instructor, User, BookingFormData, DrivingCenter } from '@/types';

// Base API URL - would be replaced with actual backend URL
const API_URL = 'https://api.drivinglessons.example.com';

// Helper to get auth token
const getToken = async () => {
  return await AsyncStorage.getItem('auth_token');
};

// Generic API request handler with error handling
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const token = await getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    // Parse JSON response
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  register: async (userData: Partial<User>) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },
  
  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
};

// Lessons API
export const lessonsAPI = {
  getUpcomingLessons: async () => {
    return apiRequest('/lessons/upcoming');
  },
  
  getPastLessons: async () => {
    return apiRequest('/lessons/past');
  },
  
  getLessonById: async (id: string) => {
    return apiRequest(`/lessons/${id}`);
  },
  
  bookLesson: async (bookingData: BookingFormData) => {
    return apiRequest('/lessons', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },
  
  cancelLesson: async (id: string) => {
    return apiRequest(`/lessons/${id}/cancel`, {
      method: 'POST',
    });
  },
  
  completeLesson: async (id: string, rating?: number, feedback?: string) => {
    return apiRequest(`/lessons/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ rating, feedback }),
    });
  },
};

// Instructors API
export const instructorsAPI = {
  getAllInstructors: async () => {
    return apiRequest('/instructors');
  },
  
  getInstructorById: async (id: string) => {
    return apiRequest(`/instructors/${id}`);
  },
  
  getInstructorAvailability: async (id: string, date: string) => {
    return apiRequest(`/instructors/${id}/availability?date=${date}`);
  },
};

// Driving Centers API
export const centersAPI = {
  getAllCenters: async () => {
    return apiRequest('/centers');
  },
  
  getCenterById: async (id: string) => {
    return apiRequest(`/centers/${id}`);
  },
};

// User Profile API
export const profileAPI = {
  updateProfile: async (userData: Partial<User>) => {
    return apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  updatePreferences: async (preferences: User['preferences']) => {
    return apiRequest('/profile/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },
};