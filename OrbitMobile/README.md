## FOLDER STRUCTURE:

src/
├── components/          # Shared UI (GlassCard, AvatarRing, Toast)
├── features/            # Feature-based modules
│   ├── home/            # Home Dashboard & Feed
│   ├── schedule/        # Timetable & Attendance Logic
│   ├── social/          # Campus Feed & Confessions
│   ├── bunk/            # Bunk Manager & Analytics
│   └── profile/         # User & Friend Profiles
├── navigation/          # RootNavigator, BottomTabs, and Dock
├── hooks/               # Custom hooks (useAttendance, useModal)
├── utils/               # Helpers (dateHelpers, styleHelpers)
└── types/               # TypeScript definitions (User, ScheduleItem)

## CORE TECH STACK:

React Native - Core Framework
React Navigation - Stack & Bottom Tab routing
NativeWind - Utility-first styling (Tailwind CSS)
Lucide React Native - Consistent iconography
AsyncStorage - Local persistence for attendace
Linear Gradient - High fidelity header styling

## GETTING STARTED:

# Install Navigation & Icons
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack lucide-react-native react-native-safe-area-context react-native-screens

# Install Styling & Gradients
npm install nativewind react-native-linear-gradient react-native-svg

# Dev Dependencies
npm install --save-dev tailwindcss

## FEATURES:

Smart Dock: a floating tab bar with a central "Speed Dial" for quick action such as Create Post, Add Task.

Bunk Manager: Real-time attendance tracking.

Contextual UI: Automated color-coding of courses for instant recognition such as CS - violet, EE - cyan.

Native Modals: High-fidelity "Page Sheets" for profiles and "Full Screen" views for course details.

## JSON RESPONSE:

{
  "batch": "25EE3",
  "schedule": {
    "Monday": [
      {
        "course": "ESS-102",
        "courseName": "Environmental Science",
        "type": "LECTURE",
        "start": "08:00",
        "end": "08:55",
        "room": "GB-202",
        "faculty": "FacultyNames"
      }
    ],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": []
  }
}