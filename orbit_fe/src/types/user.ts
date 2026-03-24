// src/types/user.ts
export interface User {
  name: string;
  email: string;
  branch: string;     // e.g., "Computer Science"
  subBatch: string;   // e.g., "A1" or "B2"
  year: number;       // e.g., 2 (for 2nd year)
  hostel: string;
  avatar: string;
  stats: UserStats;
}

export interface UserStats {
  streak: number;
  avgAttendance: number;
  friends: number;
}

export interface Friend extends User {
  id: number;
  status: 'free' | 'busy' | 'away';
  time: string; // e.g., "Until 12:30 PM"
}