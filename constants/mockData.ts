// Mock data for the app
import { Lesson } from '@/types';

// Mock lessons
export const lessons: Lesson[] = [
  {
    id: '1',
    instructorId: '1',
    centerId: '1',
    scenario: {
      scenarioID: 1,
      name: 'Basic City Driving',
      environmentType: 'Urban',
      difficulty: 'EASY'
    },
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    duration: 60,
    status: 'scheduled',
    topic: 'Basic Maneuvers',
    notes: 'Focus on turning and lane changes',
    price: 45,
    location: 'Downtown Driving Center',
  },
  {
    id: '2',
    instructorId: '2',
    centerId: '1',
    scenario: {
      scenarioID: 2,
      name: 'Highway Driving',
      environmentType: 'Highway',
      difficulty: 'MEDIUM'
    },
    date: new Date(Date.now() + 86400000 * 5), // 5 days from now
    duration: 90,
    status: 'scheduled',
    topic: 'Highway Merging',
    notes: 'Practice merging and lane changes on highway',
    price: 65,
    location: 'Highway Training Center',
  },
  {
    id: '3',
    instructorId: '1',
    centerId: '2',
    scenario: {
      scenarioID: 3,
      name: 'Parking Practice',
      environmentType: 'Urban',
      difficulty: 'EASY'
    },
    date: new Date(Date.now() + 86400000 * 7), // 7 days from now
    duration: 60,
    status: 'scheduled',
    topic: 'Parking',
    notes: 'Parallel and perpendicular parking',
    price: 50,
    location: 'City Parking Lot',
  },

  // Past lessons
  {
    id: '4',
    instructorId: '1',
    centerId: '1',
    scenario: {
      scenarioID: 4,
      name: 'Traffic Navigation',
      environmentType: 'Urban',
      difficulty: 'MEDIUM'
    },
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
    duration: 90,
    status: 'completed',
    topic: 'Traffic Rules',
    notes: 'Covered traffic signals and right-of-way',
    price: 65,
    location: 'Downtown Driving Center',
    rating: 5,
    feedback: 'Great session! Learned a lot about proper turning techniques.',
  },
  {
    id: '5',
    instructorId: '2',
    centerId: '2',
    scenario: {
      scenarioID: 5,
      name: 'Pedestrian Awareness',
      environmentType: 'Urban',
      difficulty: 'HARD'
    },
    date: new Date(Date.now() - 86400000 * 10), // 10 days ago
    duration: 90,
    status: 'completed',
    topic: 'Defensive Driving',
    notes: 'Focus on pedestrian safety and crosswalks',
    price: 70,
    location: 'City Center',
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