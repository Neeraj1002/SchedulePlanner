import { ClassType, DayOfWeek } from '@prisma/client';

export interface PositionedTextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

export interface DayColumn {
  dayOfWeek: DayOfWeek;
  minX: number;
  maxX: number;
  headerY: number;
  page: number;
}

export interface TimeRow {
  startTime: string;
  endTime: string;
  minY: number;
  maxY: number;
  centerY: number;
  page: number;
}

export interface ParsedSession {
  courseCode: string;
  courseName: string | null;
  classType: ClassType;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room: string | null;
  faculty: string | null;
  batches: string[];
  rawText: string;
  page: number;
}

export interface ParsedTimetableResult {
  allBatches: string[];
  sessions: ParsedSession[];
  warnings: string[];
}
