import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BookingFormData,
  Lesson,
  LoginResponseDto,
  LoginUserDto,
  RegisterResponseDTO,
  RegisterUserDto,
  Registration,
  Scenario,
  Session,
  User,
} from "@/types";

// Base API URL - Update this to match your backend
const API_URL = "http://192.168.1.23:8080/api/v1";

// Helper to get auth token
const getToken = async () => {
  return await AsyncStorage.getItem("auth_token");
};

// Generic API request handler with error handling and timeout
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    // Do not include Authorization header for login or registration
    const isAuthEndpoint = endpoint === "/auth/login" || endpoint === "/auth/signup";
    const token = isAuthEndpoint ? null : await getToken();

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401 || response.status === 403) {
        // Clear invalid token
        await AsyncStorage.removeItem("auth_token");
        throw new Error(
          `Authentication failed (${response.status}): Please log in again`,
        );
      }

      if (response.status === 404) {
        throw new Error("Resource not found");
      }

      if (response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }

      // Try to get error message from response
      try {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      } catch {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      // Parse JSON and log result
      const rawText = await response.clone().text();
      const json = JSON.parse(rawText || '{}');
      return json;
    } else {
      return {}; // Return empty object for non-JSON responses
    }
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout");
      }

      // Re-throw our custom errors
      throw error;
    }

    console.error("API request failed:", error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponseDto> => {
    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      return response;
    } catch (error) {
      // Development fallback when backend is not available
      console.warn("Backend not available, using mock authentication");
      if (email === "test@example.com" && password === "password") {
        return {
          token: "mock-jwt-token-" + Date.now(),
          expiresIn: 86400000, // 24 hours
          refreshToken: "mock-refresh-token-" + Date.now(),
          refreshExpirationTime: new Date(Date.now() + 86400000).toISOString(),
        };
      }
      throw new Error(
        "Invalid credentials (use test@example.com / password for dev mode)",
      );
    }
  },

  register: async (userData: RegisterUserDto): Promise<RegisterResponseDTO> => {
    try {
      const response = await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      // Development fallback when backend is not available
      console.warn("Backend not available, using mock registration");
      return {
        token: "mock-jwt-token-" + Date.now(),
        expiresIn: 86400000, // 24 hours
      };
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      return await apiRequest("/testing/me");
    } catch (error) {
      // Development fallback when backend is not available
      console.warn("Backend not available, using mock user data");
      return {
        id: "mock-user-" + Date.now(),
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        created_at: new Date().toISOString(),
        fullName: "Test User",
      };
    }
  },
};

// Sessions API
export const sessionsAPI = {
  getAllSessions: async (): Promise<Session[]> => {
    return apiRequest("/sessions");
  },

  searchSessions: async (query: string): Promise<Session[]> => {
    return apiRequest(`/sessions/search?query=${encodeURIComponent(query)}`);
  },

  getSessionById: async (id: string): Promise<Session> => {
    return apiRequest(`/sessions/${id}`);
  },

  registerForSession: async (sessionId: string): Promise<any> => {
    return apiRequest(`/sessions/${sessionId}/register`, {
      method: "POST",
    });
  },
};

// Registrations API
export const registrationsAPI = {
  getUserRegistrations: async (): Promise<Registration[]> => {
    try {
      return await apiRequest("/registrations", {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${await getToken()}`,
        },
      });
    } catch (error) {
      // Development fallback when backend is not available
      console.warn(
        "Backend not available, returning empty registrations array",
      );
      return [];
    }
  },

  getRegistrationById: async (id: string): Promise<Registration> => {
    return apiRequest(`/registrations/${id}`);
  },

  cancelRegistration: async (id: string): Promise<void> => {
    return apiRequest(`/registrations/${id}`, {
      method: "DELETE",
    });
  },
};

// Admin Dashboard API
export const adminAPI = {
  // Users management
  users: {
    getAll: async (): Promise<User[]> => {
      return apiRequest("/admin-dashboard/users");
    },

    getById: async (id: string): Promise<User> => {
      return apiRequest(`/admin-dashboard/users/${id}`);
    },

    updateName: async (
      id: string,
      firstName: string,
      lastName: string,
    ): Promise<User> => {
      return apiRequest(
        `/admin-dashboard/users/name/${id}?firstName=${
          encodeURIComponent(firstName)
        }&lastName=${encodeURIComponent(lastName)}`,
        {
          method: "PUT",
        },
      );
    },

    delete: async (id: string): Promise<void> => {
      return apiRequest(`/admin-dashboard/users/${id}`, {
        method: "DELETE",
      });
    },
  },

  // Sessions management
  sessions: {
    getAll: async (): Promise<Session[]> => {
      return apiRequest("/admin-dashboard/sessions");
    },

    getById: async (id: string): Promise<Session> => {
      return apiRequest(`/admin-dashboard/sessions/${id}`);
    },

    create: async (session: Partial<Session>): Promise<Session> => {
      return apiRequest("/admin-dashboard/sessions", {
        method: "POST",
        body: JSON.stringify(session),
      });
    },

    delete: async (id: string): Promise<void> => {
      return apiRequest(`/admin-dashboard/sessions/${id}`, {
        method: "DELETE",
      });
    },
  },

  // Registrations management
  registrations: {
    getAll: async (): Promise<Registration[]> => {
      return apiRequest("/admin-dashboard/registrations");
    },

    getById: async (id: string): Promise<Registration> => {
      return apiRequest(`/admin-dashboard/registrations/${id}`);
    },

    delete: async (id: string): Promise<void> => {
      return apiRequest(`/admin-dashboard/registrations/${id}`, {
        method: "DELETE",
      });
    },
  },
};

// Legacy API for backward compatibility - converts Sessions to Lessons
export const lessonsAPI = {
  getLessons: async (): Promise<Lesson[]> => {
    try {
      const sessions = await sessionsAPI.getAllSessions();
      return sessions.map(sessionToLesson);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      // Fallback to mock data in development
      const { lessons } = await import("@/constants/mockData");
      return lessons;
    }
  },

  getLessonById: async (id: string): Promise<Lesson> => {
    const session = await sessionsAPI.getSessionById(id);
    return sessionToLesson(session);
  },

  bookLesson: async (sessionId: string): Promise<Registration> => {
    return sessionsAPI.registerForSession(sessionId);
  },

  cancelLesson: async (registrationId: string): Promise<void> => {
    return registrationsAPI.cancelRegistration(registrationId);
  },
};

// Helper function to convert Session to Lesson for backward compatibility
const sessionToLesson = (session: Session): Lesson => {
  return {
    id: session.id,
    instructorId: session.instructor,
    centerId: "1", // Default center ID
    scenario: session.scenario || {
      scenarioID: parseInt(session.id),
      name: session.topic || "Driving Lesson",
      environmentType: "Urban",
      difficulty: "EASY",
    },
    date: new Date(session.datetime),
    duration: session.duration_minutes,
    status: session.status || "scheduled",
    topic: session.topic || "General Driving",
    notes: session.notes || "",
    price: session.price,
    location: session.location || "Driving Center",
    rating: undefined,
    feedback: undefined,
  };
};

// Webhook API (if needed for payment processing)
export const webhookAPI = {
  processPayment: async (paymentData: any): Promise<any> => {
    return apiRequest("/webhook/payments", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  },
};

// Error types for better error handling
export interface ApiError {
  status: number;
  message: string;
}

export const isApiError = (error: any): error is ApiError => {
  return error && typeof error.status === "number" &&
    typeof error.message === "string";
};
