// Type definitions for the app - Updated to match backend API

// Auth DTOs
export interface RegisterUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age?: string;
  phone?: string;
  transmissionType?: number; // 0 for automatic, 1 for manual
  handicapType?: number;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface RegisterResponseDTO {
  token: string;
  expiresIn: number; // Token validity in milliseconds
}

export interface LoginResponseDto {
  token: string;
  expiresIn: number; // Token validity in milliseconds
}

// Backend Models
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  created_at: string;
  // Additional fields that might be in your User model
  age?: string;
  phone?: string;
  transmissionType?: number;
  handicapType?: number;
  lessonsCompleted?: number;
  profileImage?: string;
  // Computed properties for frontend
  fullName?: string;
  address?: string;
  preferences?: {
    preferredInstructorId?: string;
    preferredCenterId?: string;
    preferredDays?: string[];
    preferredTimes?: string[];
  };
}

export interface Session {
  id: string;
  datetime: string; // ISO date string
  duration_minutes: number;
  max_capacity: number;
  price: number;
  instructor: string;
  created_at: string;
  // Additional fields that might be in your Session model
  scenario?: Scenario;
  location?: string;
  topic?: string;
  notes?: string;
  status?: string;
}

export interface Registration {
  id: string;
  user_id: string;
  session_id: string;
  payment_status: string;
  score?: number;
  payment_id?: string;
  created_at: string;
  // Include session details when populated
  session?: Session;
  user?: User;
}

// Legacy types for backward compatibility
export interface Scenario {
  scenarioID: number;
  name: string;
  environmentType: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

// Map Session to legacy Lesson for frontend compatibility
export interface Lesson {
  id: string;
  instructorId: string;
  centerId: string;
  scenario: Scenario;
  date: Date;
  duration: number;
  status: string;
  topic: string;
  notes: string;
  price: number;
  location: string;
  rating?: number;
  feedback?: string;
}

// Add BookingFormData type for frontend forms
export interface BookingFormData {
  sessionId?: string;
  date?: Date;
  time?: string;
  duration?: number;
  instructorId?: string;
  topic?: string;
  notes?: string;
}

// ...existing code for other types...
