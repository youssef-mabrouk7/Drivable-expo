import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrivingCenter, Instructor, Lesson, User } from "@/types";

// Base API URL - would be replaced with actual backend URL
const API_URL = "http://192.168.1.48:8080/api/v1";

// Helper to get auth token
const getToken = async () => {
  return await AsyncStorage.getItem("auth_token");
};

// Generic API request handler with error handling
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const token = await getToken();

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
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
    console.error("API request failed:", error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  //make it returns type user
  login: async (email: string, password: string) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData: Partial<User>) => {
    return apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return apiRequest("/auth/logout", {
      method: "POST",
    });
  },

  getCurrentUser: async () => {
    return apiRequest("/testing/me");
  },
};

// Lessons API
export const lessonsAPI = {
  getLessons: async () => {
    return apiRequest("/sessions");
  },

  getLessonById: async (id: string) => {
    return apiRequest(`/sessions/${id}`);
  },

  bookLesson: async (id: string) => {
    const idNumber = parseInt(id);
    return apiRequest(`/sessions/${idNumber}/register`, {
      method: "POST",
    });
  },

  cancelLesson: async (id: string) => {
    return apiRequest(`/registrations/${id}`, {
      method: "DELETE",
    });
  },
};
// Instructors API
export const instructorsAPI = {
  getAllInstructors: async () => {
    return apiRequest("/instructors");
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
    return apiRequest("/centers");
  },

  getCenterById: async (id: string) => {
    return apiRequest(`/centers/${id}`);
  },
};

// User Profile API
export const profileAPI = {
  updateProfile: async (userData: Partial<User>) => {
    return apiRequest("/testing/me", {
      method: "GET",
    });
  },
};
