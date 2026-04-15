// 1. Core User Definition
export interface User {
  id: string; // Changed to string for UUID/Firebase compatibility
  name: string;
  email: string;
  branch: string;     // e.g., "Computer Science"
  subBatch: string;   // e.g., "A1"
  year: number;       
  hostel: string;
  avatar: string;
  bio?: string;       // Added for the FriendProfile screen
  stats: UserStats;
}

// 2. Performance & Social Metrics
export interface UserStats {
  streak: number;
  avgAttendance: number;
  friendsCount: number;
  bunkCredits: number; // How many classes can be skipped safely across all subjects
}

// 3. The "Live" Social Type
export interface Friend extends User {
  status: 'free' | 'busy' | 'away';
  time: string;           // Display string: "Until 12:30 PM"
  currentClass?: string;  // e.g., "CS101" if they are busy
  lastSeen: string;       // ISO Timestamp for "Last seen 5m ago" logic
  isFavorite: boolean;    // For pinning friends to the top of the feed
}

// 4. Mock Data Helper (Optional but recommended for testing)
export type UserStatusMap = {
  [key in Friend['status']]: string; // Maps status to a hex color
};