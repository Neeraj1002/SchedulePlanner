// src/types/index.ts

// Re-export specific feature types
export * from './user';
export * from './schedule';

// Global UI & State Types
export type AppTab = 'home' | 'schedule' | 'bunk' | 'social' | 'profile';

export type ModalType = 'event' | 'task' | 'post' | 'class' | 'mess' | 'course_detail' | 'friend_profile' | null;

export type ScheduleView = "my_schedule" | "discover" ;

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface NavigationProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

// Common Style interface used by utils/styleHelpers
export interface CourseStyle {
  icon: any;
  bg: string;
  border: string;
  color: string;
  headerGradient: string;
}