import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DayOfWeek } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const DAY_ORDER: DayOfWeek[] = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
];

const DAY_LABELS: Record<DayOfWeek, string> = {
  [DayOfWeek.MONDAY]: 'Monday',
  [DayOfWeek.TUESDAY]: 'Tuesday',
  [DayOfWeek.WEDNESDAY]: 'Wednesday',
  [DayOfWeek.THURSDAY]: 'Thursday',
  [DayOfWeek.FRIDAY]: 'Friday',
  [DayOfWeek.SATURDAY]: 'Saturday',
  [DayOfWeek.SUNDAY]: 'Sunday',
};

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) { }

  async getMySchedule(userId: number | undefined) {
    if (!userId) {
      throw new UnauthorizedException(
        'Missing authenticated user. Provide x-user-id so middleware can populate req.user.id.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { batch: true },
    });

    if (!user) {
      throw new NotFoundException(`User not found for id ${userId}.`);
    }

    if (!user.batchId || !user.semesterId || !user.batch) {
      throw new BadRequestException(
        'User must be assigned to both a batch and a semester to view a schedule.',
      );
    }

    return this.getScheduleForBatch(user.batchId, user.batch.batchCode, user.semesterId);
  }

  async getScheduleByBatchCode(batchCode: string) {
    const batch = await this.prisma.batch.findFirst({
      where: { batchCode },
      orderBy: { id: 'desc' },
    });

    if (!batch) {
      throw new NotFoundException(`Batch ${batchCode} was not found.`);
    }

    return this.getScheduleForBatch(batch.id, batch.batchCode, batch.semesterId);
  }

  private async getScheduleForBatch(
    batchId: number,
    batchCode: string,
    semesterId: number,
  ) {
    const sessions = await this.prisma.classSession.findMany({
      where: {
        semesterId,
        batches: {
          some: {
            batchId,
          },
        },
      },
      include: {
        course: true,
      },
    });

    const grouped = this.buildEmptySchedule();
    const orderedSessions = [...sessions].sort((left, right) => {
      const dayDelta =
        DAY_ORDER.indexOf(left.dayOfWeek) - DAY_ORDER.indexOf(right.dayOfWeek);
      if (dayDelta !== 0) {
        return dayDelta;
      }

      return left.startTime.localeCompare(right.startTime);
    });

    const formatTime = (totalMinutes: number) => {
      const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
      const m = (totalMinutes % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    for (const session of orderedSessions) {
      grouped[DAY_LABELS[session.dayOfWeek]].push({
        course: session.course.courseCode,
        courseName: session.course.courseName,
        type: session.classType,
        start: session.startTime,
        end: session.endTime,
        room: session.room,
        faculty: session.faculty,
      });
    }

    return {
      batch: batchCode,
      schedule: grouped,
    };
  }

  private buildEmptySchedule() {
    return {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    } as Record<string, Array<Record<string, string | null>>>;
  }
}
