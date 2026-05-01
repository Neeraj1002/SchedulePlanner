// Re-export specific feature types
export * from './user';
export * from './schedule';

// 1. Navigation Types (Essential for React Navigation)
export type AppTab = 'home' | 'schedule' | 'bunk' | 'social' | 'profile';

export type RootStackParamList = {
  MainTabs: undefined; // The Bottom Tab Navigator
  CourseDetail: { courseId: string; courseData: any };
  FriendProfile: { friendId: string; friendData: any };
  ChatRoom: { chatId: string; title: string; type: 'group' | 'dm' };
  MessMenu: undefined;

  AddFriend: undefined ;
  Notifications: undefined ;
  Messages: undefined ;

  NewClass: undefined ;
  NewMess: undefined ;  
  NewTodo: undefined ;
  NewEvent: undefined ;

  CompareSchedule: {friendName: string} ;
  MutualClasses: { friendName: string } ;
};

// 2. Global UI & State Types
export type ModalType = 'event' | 'task' | 'post' | 'class' | 'mess' | null;

export type ScheduleView = "my_schedule" | "discover";

// 3. API & Data Handling
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// 4. Style System (Mobile-optimized)
export interface CourseStyle {
  icon: any; // Lucide Icon component
  bg: string; // Tailwind class (e.g., 'bg-indigo-500/10')
  border: string; // Tailwind class
  color: string; // Hex code for SVG icons
  headerGradient: string[]; // Array of hex strings for LinearGradient
}

// 5. Auth State (Added for Mobile Session handling)
export interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}