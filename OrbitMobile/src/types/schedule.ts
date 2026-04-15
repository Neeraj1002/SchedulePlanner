// L = Lecture, P = Practical, T = Tutorial
export type ClassType = "L" | "P" | "T";

// 1. Core Schedule Data
export interface ScheduleItem {
  id: number;
  date: string;       // ISO format (e.g., "2026-03-27") for local persistence
  time: string;       // Start time (e.g., "09:00 AM")
  endTime: string;    // End time (e.g., "10:00 AM")
  subject: string;
  code: string;
  room: string;
  type: ClassType;
  status: "completed" | "live" | "upcoming";
  
  // Attendance tracking
  attendanceStatus: "present" | "absent" | null;
  attended: number;
  total: number;
  
  // Social Context
  classmates: string[];
}

// 2. Bunk Management Utility
export interface AttendanceStats {
  subjectCode: string;
  percentage: number;
  canSkip: number;     // Calculated: How many classes can be skipped to stay above 75%
  mustAttend: number;  // Calculated: How many consecutive classes needed to reach 75%
}

// 3. Mess & Nutrition Types
export interface MenuItem {
  name: string;
  icon: string;        // Emoji or Icon name
  calories: string;
}

export interface MealData {
  time: string;
  rating: number;
  theme: string;       // e.g., "North Indian", "South Indian", "Continental"
  items: MenuItem[];
}

// Using a Record instead of a string index for type safety
export type MealType = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';

export type MessMenuSchema = Record<MealType, MealData>;