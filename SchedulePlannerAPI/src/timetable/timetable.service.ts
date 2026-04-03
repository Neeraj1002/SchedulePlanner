import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClassSession, Prisma } from '@prisma/client';
import { createHash, randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { TimetableParserService } from '../parser/timetable-parser.service';
import { PrismaService } from '../prisma/prisma.service';
import { UploadTimetableDto } from './dto/upload-timetable.dto';

@Injectable()
export class TimetableService {
  private readonly logger = new Logger(TimetableService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly parser: TimetableParserService,
    private readonly configService: ConfigService,
  ) {}

  async uploadTimetable(
    file: Express.Multer.File | undefined,
    metadata: UploadTimetableDto,
  ) {
    if (!file) {
      throw new BadRequestException('A timetable PDF file is required.');
    }

    if (!file.mimetype.includes('pdf')) {
      throw new BadRequestException('Only PDF timetable uploads are supported.');
    }

    const parsed = await this.parser.parseTimetable(file.buffer);
    const checksum = createHash('sha256').update(file.buffer).digest('hex');
    const storedFilePath = await this.persistUploadedFile(file);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const university = await tx.university.upsert({
          where: { name: metadata.universityName },
          update: {},
          create: { name: metadata.universityName },
        });

        const department = await tx.department.upsert({
          where: {
            universityId_name: {
              universityId: university.id,
              name: metadata.departmentName,
            },
          },
          update: {},
          create: {
            name: metadata.departmentName,
            universityId: university.id,
          },
        });

        const semester = await tx.semester.upsert({
          where: {
            departmentId_semesterNumber_academicYear: {
              departmentId: department.id,
              semesterNumber: metadata.semesterNumber,
              academicYear: metadata.academicYear,
            },
          },
          update: {},
          create: {
            departmentId: department.id,
            semesterNumber: metadata.semesterNumber,
            academicYear: metadata.academicYear,
          },
        });

        await this.replaceSemesterSessions(tx, semester.id);

        const timetableImport = await tx.timetableImport.create({
          data: {
            semesterId: semester.id,
            filename: file.originalname,
            storedFilePath,
            checksum,
            parserWarnings: parsed.warnings.length > 0 ? parsed.warnings : Prisma.JsonNull,
          },
        });

        const courseCache = new Map<string, number>();
        const batchCache = new Map<string, number>();

        for (const batchCode of parsed.allBatches) {
          const batchId = await this.resolveBatchId(
            tx,
            batchCache,
            batchCode,
            department.id,
            semester.id,
          );
          batchCache.set(batchCode, batchId);
        }

        for (const session of parsed.sessions) {
          const courseId = await this.resolveCourseId(
            tx,
            courseCache,
            session.courseCode,
            session.courseName,
          );

          const classSession = await this.createOrResolveClassSession(tx, {
            courseId,
            semesterId: semester.id,
            timetableImportId: timetableImport.id,
            classType: session.classType,
            dayOfWeek: session.dayOfWeek,
            startTime: session.startTime,
            endTime: session.endTime,
            room: session.room,
            faculty: session.faculty,
            rawText: session.rawText,
            sourcePage: session.page,
          });

          const uniqueBatchIds = [
            ...new Set(
              session.batches
                .map((batchCode) => batchCache.get(batchCode))
                .filter((batchId): batchId is number => Boolean(batchId)),
            ),
          ];

          if (uniqueBatchIds.length > 0) {
            await tx.classSessionBatch.createMany({
              data: uniqueBatchIds.map((batchId) => ({
                classSessionId: classSession.id,
                batchId,
              })),
              skipDuplicates: true,
            });
          }
        }

        this.logger.log(
          `Imported ${parsed.sessions.length} sessions and ${parsed.allBatches.length} batches for semester ${semester.id}.`,
        );

        return {
          importId: timetableImport.id,
          filename: file.originalname,
          extractedBatches: parsed.allBatches,
          sessionsImported: parsed.sessions.length,
          warnings: parsed.warnings,
        };
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Upload conflicted with an existing unique record.');
      }

      throw new InternalServerErrorException(
        `Timetable ingestion failed: ${(error as Error).message}`,
      );
    }
  }

  private async persistUploadedFile(file: Express.Multer.File) {
    const uploadDir =
      this.configService.get<string>('UPLOAD_DIR') ?? 'uploads/timetables';
    await mkdir(uploadDir, { recursive: true });

    const fileExt = extname(file.originalname) || '.pdf';
    const filename = `${Date.now()}-${randomUUID()}${fileExt}`;
    const filePath = join(uploadDir, filename);

    await writeFile(filePath, file.buffer);

    return filePath;
  }

  private async resolveCourseId(
    tx: Prisma.TransactionClient,
    cache: Map<string, number>,
    courseCode: string,
    courseName: string | null,
  ) {
    const cached = cache.get(courseCode);
    if (cached) {
      return cached;
    }

    const course = await tx.course.upsert({
      where: { courseCode },
      update: courseName ? { courseName } : {},
      create: {
        courseCode,
        courseName,
      },
    });

    cache.set(courseCode, course.id);
    return course.id;
  }

  private async resolveBatchId(
    tx: Prisma.TransactionClient,
    cache: Map<string, number>,
    batchCode: string,
    departmentId: number,
    semesterId: number,
  ) {
    const cached = cache.get(batchCode);
    if (cached) {
      return cached;
    }

    const batch = await tx.batch.upsert({
      where: {
        batchCode_semesterId: {
          batchCode,
          semesterId,
        },
      },
      update: {},
      create: {
        batchCode,
        departmentId,
        semesterId,
      },
    });

    cache.set(batchCode, batch.id);
    return batch.id;
  }

  private async createOrResolveClassSession(
    tx: Prisma.TransactionClient,
    data: Prisma.ClassSessionUncheckedCreateInput,
  ): Promise<ClassSession> {
    try {
      return await tx.classSession.create({ data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        this.logger.warn(
          `Duplicate session hit unique constraint for ${data.startTime} ${data.dayOfWeek} ${data.courseId}; reusing existing session.`,
        );

        const existing = await tx.classSession.findUnique({
          where: {
            courseId_dayOfWeek_startTime_classType: {
              courseId: data.courseId,
              dayOfWeek: data.dayOfWeek,
              startTime: data.startTime,
              classType: data.classType,
            },
          },
        });

        if (existing) {
          return existing;
        }
      }

      throw error;
    }
  }

  private async replaceSemesterSessions(tx: Prisma.TransactionClient, semesterId: number) {
    await tx.classSessionBatch.deleteMany({
      where: {
        classSession: {
          semesterId,
        },
      },
    });

    await tx.classSession.deleteMany({
      where: { semesterId },
    });

    await tx.timetableImport.deleteMany({
      where: { semesterId },
    });
  }
}
