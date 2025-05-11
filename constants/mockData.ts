// Mock data for the app
import { Lesson, Instructor, DrivingCenter } from '@/types';

// Mock instructors
export const instructors: Instructor[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    rating: 4.9,
    reviews: 124,
    experience: '8 years',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    specialties: ['Highway Driving', 'Parallel Parking'],
    bio: 'Patient instructor specializing in nervous beginners. Certified in defensive driving techniques.',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  {
    id: '2',
    name: 'Michael Chen',
    rating: 4.8,
    reviews: 98,
    experience: '5 years',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    specialties: ['City Driving', 'Defensive Techniques'],
    bio: 'Former racing instructor with a calm teaching approach. Specializes in advanced maneuvers.',
    availability: ['Mon', 'Wed', 'Fri', 'Sat'],
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    rating: 4.7,
    reviews: 87,
    experience: '6 years',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    specialties: ['Test Preparation', 'Night Driving'],
    bio: 'Specializes in helping students pass their driving test on the first attempt.',
    availability: ['Tue', 'Thu', 'Sat', 'Sun'],
  },
  {
    id: '4',
    name: 'David Wilson',
    rating: 4.6,
    reviews: 76,
    experience: '4 years',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    specialties: ['Highway Driving', 'Parking Techniques'],
    bio: 'Patient and methodical instructor focused on building confidence in new drivers.',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
];

// Mock driving centers
export const drivingCenters: DrivingCenter[] = [
  {
    id: '1',
    name: 'City Driving School',
    address: 'Maadi, degla',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
  },
  {
    id: '2',
    name: 'Safe Drive Academy',
    address: '456 Park Ave, Midtown',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    coordinates: { latitude: 40.7308, longitude: -73.9973 },
  },
  {
    id: '3',
    name: 'Premier Driving Center',
    address: '789 Broadway, Uptown',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    coordinates: { latitude: 40.7589, longitude: -73.9851 },
  },
];

// Mock lessons
export const upcomingLessons: Lesson[] = [
  {
    id: '1',
    instructorId: '1',
    centerId: '1',
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    duration: 60,
    status: 'confirmed',
    topic: 'Parallel Parking',
    notes: 'Focus on parallel parking techniques',
    price: 45,
  },
  {
    id: '2',
    instructorId: '2',
    centerId: '2',
    date: new Date(Date.now() + 86400000 * 5), // 5 days from now
    duration: 90,
    status: 'confirmed',
    topic: 'Highway Driving',
    notes: 'Practice merging and lane changes',
    price: 65,
  },
  {
    id: '3',
    instructorId: '3',
    centerId: '1',
    date: new Date(Date.now() + 86400000 * 7), // 7 days from now
    duration: 60,
    status: 'pending',
    topic: 'Night Driving',
    notes: 'Introduction to driving in low-light conditions',
    price: 50,
  },
];

export const pastLessons: Lesson[] = [
  {
    id: '4',
    instructorId: '1',
    centerId: '3',
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
    duration: 60,
    status: 'completed',
    topic: 'Basic Maneuvers',
    notes: 'Covered turning, stopping, and basic parking',
    price: 45,
    rating: 5,
    feedback: 'Great session! Learned a lot about proper turning techniques.',
  },
  {
    id: '5',
    instructorId: '4',
    centerId: '2',
    date: new Date(Date.now() - 86400000 * 10), // 10 days ago
    duration: 90,
    status: 'completed',
    topic: 'City Driving',
    notes: 'Navigating busy intersections and one-way streets',
    price: 65,
    rating: 4,
    feedback: 'Good instruction on handling traffic signals and pedestrians.',
  },
];

// Available time slots
export const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

// Lesson topics
export const lessonTopics = [
  'Basic Vehicle Control',
  'Parallel Parking',
  'Highway Driving',
  'City Navigation',
  'Night Driving',
  'Defensive Driving',
  'Test Preparation',
  'Parking Techniques',
  'Lane Changes & Merging',
  'Roundabouts & Intersections'
];