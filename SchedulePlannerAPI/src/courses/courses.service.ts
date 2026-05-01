import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Prisma, SemesterType } from '@prisma/client';
import pdfParse = require('pdf-parse');
import { PrismaService } from '../prisma/prisma.service';
import { UploadCoursesDto } from './dto/upload-courses.dto';
import {
  PARSER_CONFIGS,
  ParserConfig,
  ParserType,
  SemesterLabel,
} from './parser.config';

interface ParsedCourse {
  courseCode: string;
  courseName: string;
  year: number | null;
  semester: SemesterLabel | null;
}

interface ParseCoursesResult {
  courses: ParsedCourse[];
  warnings: string[];
}

interface ParsedOffering {
  courseCode: string;
  year: number;
  semesterType: SemesterType;
}

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async uploadCourses(
    file: Express.Multer.File | undefined,
    metadata: UploadCoursesDto,
  ) {
    if (!file) {
      throw new BadRequestException('A curriculum PDF file is required.');
    }

    if (!file.mimetype.includes('pdf')) {
      throw new BadRequestException('Only PDF uploads are supported.');
    }

    const parserConfig = PARSER_CONFIGS[metadata.parserType as ParserType];
    if (!parserConfig) {
      throw new BadRequestException(`Unsupported parserType: ${metadata.parserType}`);
    }

    let extractedText = '';
    try {
      const parsedPdf = await pdfParse(file.buffer);
      extractedText = parsedPdf.text ?? '';
    } catch (error) {
      this.logger.error(
        `Failed to extract PDF text from ${file.originalname}`,
        (error as Error).stack,
      );
      throw new BadRequestException(
        'The uploaded PDF could not be read. Please upload a text-based curriculum PDF.',
      );
    }

    const { courses, warnings } = this.parseCourses(extractedText, parserConfig);
    const uniqueCourses = this.deduplicateCourses(courses, warnings);

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
            universityId: university.id,
            name: metadata.departmentName,
          },
        });

        let totalCoursesSaved = 0;
        let totalOfferingsCreated = 0;
        const savedCourseIds = new Map<string, number>();

        for (const course of uniqueCourses.values()) {
          const savedCourse = await tx.course.upsert({
            where: {
              courseCode_departmentId: {
                courseCode: course.courseCode,
                departmentId: department.id,
              },
            },
            update: {
              courseName: course.courseName,
            },
            create: {
              courseCode: course.courseCode,
              courseName: course.courseName,
              departmentId: department.id,
            },
          });

          savedCourseIds.set(course.courseCode, savedCourse.id);
          totalCoursesSaved += 1;
        }

        const uniqueOfferings = this.deduplicateOfferings(courses);

        for (const offering of uniqueOfferings.values()) {
          const courseId = savedCourseIds.get(offering.courseCode);
          if (!courseId) {
            warnings.push(
              `Unable to create offering for ${offering.courseCode} because the course record was not resolved.`,
            );
            continue;
          }

          const offeringWhere = {
            courseId_departmentId_year_semesterType: {
              courseId,
              departmentId: department.id,
              year: offering.year,
              semesterType: offering.semesterType,
            },
          } as const;

          const existingOffering = await tx.courseOffering.findUnique({
            where: offeringWhere,
            select: { id: true },
          });

          await tx.courseOffering.upsert({
            where: offeringWhere,
            update: {},
            create: {
              courseId,
              departmentId: department.id,
              year: offering.year,
              semesterType: offering.semesterType,
            },
          });

          if (!existingOffering) {
            totalOfferingsCreated += 1;
          }
        }

        return {
          totalCoursesParsed: courses.length,
          totalCoursesSaved,
          totalOfferingsCreated,
          warnings: [...new Set(warnings)],
        };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(`Database error while saving courses: ${error.code}`);
      }

      throw new InternalServerErrorException(
        `Course ingestion failed: ${(error as Error).message}`,
      );
    }
  }

  private parseCourses(text: string, parserConfig: ParserConfig): ParseCoursesResult {
    const warnings: string[] = [];
    const courses: ParsedCourse[] = [];
    const lines = text
      .split(/\r?\n/)
      .map((line) => this.normalizeWhitespace(line))
      .filter(Boolean);

    let currentYear: number | null = null;
    let currentSemester: SemesterLabel | null = null;

    lines.forEach((line, index) => {
      const yearMatch = line.match(parserConfig.yearPattern);
      if (yearMatch?.[1]) {
        currentYear = parserConfig.yearMap[yearMatch[1].toUpperCase()] ?? currentYear;
      }

      const semesterEntry = (Object.entries(parserConfig.semesterPatterns) as Array<
        [SemesterLabel, RegExp]
      >).find(([, pattern]) => pattern.test(line));
      if (semesterEntry) {
        currentSemester = semesterEntry[0];
      }

      const courseCode = this.extractCourseCode(line, parserConfig);
      if (!courseCode) {
        return;
      }

      const courseName = this.extractCourseName(line, courseCode);
      if (!courseName) {
        warnings.push(`Line ${index + 1}: could not extract a course name for ${courseCode}.`);
        return;
      }

      if (currentYear === null) {
        warnings.push(
          `Line ${index + 1}: parsed ${courseCode} before any year heading was detected.`,
        );
      }

      if (currentSemester === null) {
        warnings.push(
          `Line ${index + 1}: parsed ${courseCode} before any semester heading was detected.`,
        );
      }

      courses.push({
        courseCode,
        courseName,
        year: currentYear,
        semester: currentSemester,
      });
    });

    if (courses.length === 0) {
      warnings.push('No course entries were detected in the uploaded PDF.');
    }

    return { courses, warnings };
  }

  private deduplicateCourses(
    courses: ParsedCourse[],
    warnings: string[],
  ): Map<string, ParsedCourse> {
    const uniqueCourses = new Map<string, ParsedCourse>();

    for (const course of courses) {
      const existing = uniqueCourses.get(course.courseCode);
      if (!existing) {
        uniqueCourses.set(course.courseCode, course);
        continue;
      }

      if (existing.courseName !== course.courseName) {
        warnings.push(
          `Course ${course.courseCode} appeared multiple times with different names. Keeping "${existing.courseName}".`,
        );
      }
    }

    return uniqueCourses;
  }

  private deduplicateOfferings(courses: ParsedCourse[]): Map<string, ParsedOffering> {
    const uniqueOfferings = new Map<string, ParsedOffering>();

    for (const course of courses) {
      if (course.year === null || course.semester === null) {
        continue;
      }

      const semesterType = this.toSemesterType(course.semester);
      const offeringKey = [
        course.courseCode,
        course.year,
        semesterType,
      ].join('|');

      if (!uniqueOfferings.has(offeringKey)) {
        uniqueOfferings.set(offeringKey, {
          courseCode: course.courseCode,
          year: course.year,
          semesterType,
        });
      }
    }

    return uniqueOfferings;
  }

  private extractCourseCode(line: string, parserConfig: ParserConfig): string | null {
    const tokens = line.split(/\s+/);

    for (const token of tokens) {
      const normalizedToken = token.replace(/^[^A-Z0-9]+|[^A-Z0-9-]+$/gi, '');
      if (parserConfig.codePattern.test(normalizedToken)) {
        return normalizedToken;
      }
    }

    return null;
  }

  private extractCourseName(line: string, courseCode: string): string | null {
    const codeIndex = line.indexOf(courseCode);
    if (codeIndex === -1) {
      return null;
    }

    const rawName = line.slice(codeIndex + courseCode.length);
    const cleanedName = this.normalizeWhitespace(
      rawName
        .replace(/^[-:|]+/, ' ')
        .replace(/\s+(?:\d+(?:\.\d+)?\s*)+$/, '')
        .replace(/[-:|]+$/, ' '),
    );

    return cleanedName || null;
  }

  private normalizeWhitespace(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
  }

  private toSemesterType(semester: SemesterLabel): SemesterType {
    return semester === 'AUTUMN' ? SemesterType.AUTUMN : SemesterType.SPRING;
  }
}
