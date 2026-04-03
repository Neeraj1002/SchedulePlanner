import { useState } from "react";
import type { ScheduleItem } from "../types/schedule";

export const useAttendance = (initialData: ScheduleItem[]) => {
  const [schedule, setSchedule] = useState(initialData);

  const markAttendance = (id: number, status: "present" | "absent") => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, attendanceStatus: status } : item
      )
    );
  };

  return { schedule, markAttendance };
};
