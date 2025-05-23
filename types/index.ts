// Type definitions for the app

export type Lesson = {
  id: string;
  date: Date;
  duration: number; // in minutes
  status: "confirmed" | "pending" | "completed" | "cancelled";
  topic: string;
  notes?: string;
  price: number;
  rating?: number;
  feedback?: string;
  location: string;
};

export type Instructor = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  experience: string;
  avatar: string;
  specialties: string[];
  bio: string;
  availability: string[];
};

export type DrivingCenter = {
  id: string;
  name: string;
  address: string;
  rating: number;
  image?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  transmissionType: number; // 0 for automatic, 1 for manual
  phone?: string;
  password?: string;
  role?: number;
  lessonsCompleted: number;
  profileImage?: string;
  preferences?: {
    preferredInstructorId?: string;
    preferredCenterId?: string;
    preferredDays?: string[];
    preferredTimes?: string[];
  };
  handicapType?: number;
};

export type BookingFormData = {
  date: Date;
  time: string;
  duration: number;
  topic: string;
  notes?: string;
  location: string;
};

// API response types
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type ErrorResponse = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type RegisterResponse = {
  token: string;
  user: User;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
};
