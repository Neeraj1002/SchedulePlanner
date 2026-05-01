import type { User } from '../types/user';
import type { ScheduleItem, Friend, MessMenuSchema } from '../types';

export const MOCK_USER: User = {
  id: "user_001",
  name: "Arjun Sharma",
  email: "arjun.s@campus.edu",
  branch: "Computer Science",
  subBatch: "CS-B",
  year: 3,
  hostel: "Hostel 12",
  avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=Arjun", // Swapped to PNG for better Native support
  stats: {
    streak: 12,
    avgAttendance: 84,
    friendsCount: 142,
    bunkCredits: 8
  }
};

export const INITIAL_SCHEDULE_DATA: ScheduleItem[] = [
  {
    id: 1,
    date: "2026-03-27",
    time: "09:30 AM",
    endTime: "10:30 AM",
    subject: "Data Structures",
    code: "CS201",
    room: "LHC-102",
    type: "L",
    status: "completed",
    attendanceStatus: "present",
    attended: 18,
    total: 20,
    classmates: ["Rahul", "Sanya", "Amit"]
  },
  {
    id: 2,
    date: "2026-03-27",
    time: "11:00 AM",
    endTime: "12:30 PM",
    subject: "Digital Logic",
    code: "EE101",
    room: "DB-Slot-2",
    type: "P",
    status: "live",
    attendanceStatus: null,
    attended: 12,
    total: 18,
    classmates: ["Vikram", "Aditi", "Rahul"]
  },
  {
    id: 3,
    date: "2026-03-27",
    time: "02:00 PM",
    endTime: "03:00 PM",
    subject: "Discrete Maths",
    code: "MA205",
    room: "LHC-201",
    type: "T",
    status: "upcoming",
    attendanceStatus: null,
    attended: 15,
    total: 20,
    classmates: ["Sanya", "Priya"]
  }
];

export const FRIENDS_ONLINE: Friend[] = [
  { 
    id: "f_1", 
    name: "Rahul Mehra", 
    email: "rahul@campus.edu",
    branch: "Computer Science",
    subBatch: "CS-B",
    year: 3,
    hostel: "Hostel 12",
    status: "free", 
    time: "Until 1:00 PM", 
    avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=Rahul",
    lastSeen: "2026-03-28T10:00:00Z",
    isFavorite: true,
    stats: { streak: 5, avgAttendance: 88, friendsCount: 120, bunkCredits: 4 }
  },
  { 
    id: "f_2", 
    name: "Sanya Iyer", 
    email: "sanya@campus.edu",
    branch: "Electrical Eng.",
    subBatch: "EE-A",
    year: 3,
    hostel: "Hostel 15",
    status: "busy", 
    time: "In Class", 
    avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=Sanya",
    lastSeen: "2026-03-28T09:45:00Z",
    isFavorite: false,
    stats: { streak: 15, avgAttendance: 92, friendsCount: 210, bunkCredits: 12 }
  }
];

export const FULL_MESS_MENU: MessMenuSchema = {
  Breakfast: {
    time: "07:30 AM - 09:30 AM",
    rating: 4.1,
    theme: "North Indian",
    items: [
      { name: "Onion Poha", icon: "🥣", calories: "210 kcal" },
      { name: "Boiled Eggs", icon: "🥚", calories: "155 kcal" }
    ]
  },
  Lunch: {
    time: "12:00 PM - 02:30 PM",
    rating: 4.5,
    theme: "Special Thali",
    items: [
      { name: "Rajma Chawal", icon: "🍛", calories: "450 kcal" },
      { name: "Jeera Aloo", icon: "🥔", calories: "120 kcal" }
    ]
  },
  Snacks: { // Added Snacks to fulfill the MealType record
    time: "04:30 PM - 05:30 PM",
    rating: 3.8,
    theme: "Street Food",
    items: [
      { name: "Samosa", icon: "🥟", calories: "250 kcal" },
      { name: "Chai", icon: "☕", calories: "80 kcal" }
    ]
  },
  Dinner: {
    time: "07:30 PM - 09:45 PM",
    rating: 4.2,
    theme: "Continental",
    items: [
      { name: "Paneer Butter Masala", icon: "🧀", calories: "350 kcal" },
      { name: "Dal Tadka", icon: "🥣", calories: "180 kcal" }
    ]
  }
};