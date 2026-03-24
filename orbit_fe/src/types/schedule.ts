export type ClassType = "L" | "P" | "T";

export interface ScheduleItem {
  id: number;
  time: string;
  endTime: string;
  subject: string;
  code: string;
  room: string;
  type: ClassType;
  status: "completed" | "live" | "upcoming";
  attendanceStatus: "present" | "absent" | null;
  attended: number;
  total: number;
  classmates: string[];
}

export interface MenuItem {
  name: string;
  icon: string;
  calories: string;
}

export interface MealData {
  time: string;
  rating: number;
  theme: string;
  items: MenuItem[];
}

// This allows us to use FULL_MESS_MENU['Lunch'] safely
export interface MessMenuSchema {
  [key: string]: MealData;
}