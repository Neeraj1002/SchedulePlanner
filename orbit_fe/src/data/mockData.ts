import type { User } from '../types/user';
import type {ScheduleItem, Friend} from '../types';
import type { MessMenuSchema } from '../types';

export const MOCK_USER: User = {
  name: "Arjun Sharma",
  email: "arjun.s@campus.edu",
  branch: "Computer Science",
  subBatch: "CS-B",
  year: 3,
  hostel: "Hostel 12",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
  stats: {
    streak: 12,
    avgAttendance: 84,
    friends: 142
  }
};

export const INITIAL_SCHEDULE_DATA: ScheduleItem[] = [
  {
    id: 1,
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
    id: 1, 
    name: "Rahul Mehra", 
    email: "rahul@campus.edu",
    branch: "Computer Science",
    subBatch: "CS-B",
    year: 3,
    hostel: "Hostel 12",
    status: "free", 
    time: "Just now", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    stats: { streak: 5, avgAttendance: 88, friends: 120 }
  },
  { 
    id: 2, 
    name: "Sanya Iyer", 
    email: "sanya@campus.edu",
    branch: "Electrical Eng.",
    subBatch: "EE-A",
    year: 3,
    hostel: "Hostel 15",
    status: "busy", 
    time: "In Class", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanya",
    stats: { streak: 15, avgAttendance: 92, friends: 210 }
  },
  { 
    id: 3, 
    name: "Vikram Singh", 
    email: "vikram@campus.edu",
    branch: "Mechanical Eng.",
    subBatch: "ME-C",
    year: 2,
    hostel: "Hostel 3",
    status: "away", 
    time: "Last seen 2h ago", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    stats: { streak: 2, avgAttendance: 72, friends: 85 }
  }
];

export const FULL_MESS_MENU: MessMenuSchema = {
  Breakfast: {
    time: "07:30 AM - 09:30 AM",
    rating: 4.1,
    theme: "from-amber-500 to-orange-600",
    items: [
      { name: "Onion Poha", icon: "🥣", calories: "210 kcal" },
      { name: "Boiled Eggs", icon: "🥚", calories: "155 kcal" }
    ]
  },
  Lunch: {
    time: "12:00 PM - 02:30 PM",
    rating: 4.5,
    theme: "from-orange-500 to-red-600",
    items: [
      { name: "Rajma Chawal", icon: "🍛", calories: "450 kcal" },
      { name: "Jeera Aloo", icon: "🥔", calories: "120 kcal" }
    ]
  },
  Dinner: {
    time: "07:30 PM - 09:45 PM",
    rating: 4.2,
    theme: "from-indigo-600 to-violet-700",
    items: [
      { name: "Paneer Butter Masala", icon: "🧀", calories: "350 kcal" },
      { name: "Dal Tadka", icon: "🥣", calories: "180 kcal" }
    ]
  }
};