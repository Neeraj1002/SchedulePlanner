import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ScheduleItem } from "../types/schedule";

const ATTENDANCE_STORAGE_KEY = '@orbit_attendance_state';

export const useAttendance = (initialData: ScheduleItem[]) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Load persisted data on mount
  useEffect(() => {
    const loadPersistedAttendance = async () => {
      try {
        const saved = await AsyncStorage.getItem(ATTENDANCE_STORAGE_KEY);
        if (saved) {
          setSchedule(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load attendance", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistedAttendance();
  }, []);

  // 2. Mark attendance and save to disk
  const markAttendance = async (id: number, status: "present" | "absent" | null) => {
    const updatedSchedule = schedule.map((item) =>
      item.id === id ? { ...item, attendanceStatus: status } : item
    );

    setSchedule(updatedSchedule);

    try {
      await AsyncStorage.setItem(
        ATTENDANCE_STORAGE_KEY, 
        JSON.stringify(updatedSchedule)
      );
    } catch (e) {
      console.error("Failed to save attendance", e);
    }
  };

  return { schedule, markAttendance, isLoading };
};