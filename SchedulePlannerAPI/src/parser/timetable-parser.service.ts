import { Injectable, Logger } from '@nestjs/common';
import { ClassType, DayOfWeek } from '@prisma/client';
import * as pdfParse from 'pdf-parse';
import {
  BATCH_CODE_GLOBAL_REGEX,
  COURSE_CODE_GLOBAL_REGEX,
  COURSE_CODE_REGEX,
} from '../common/validation-patterns';
import {
  DayColumn,
  ParsedSession,
  ParsedTimetableResult,
  PositionedTextItem,
  TimeRow,
} from './parser.types';

type PdfJsModule = {
  getDocument: (input: { data: Uint8Array }) => {
    promise: Promise<{
      numPages: number;
      getPage: (pageNumber: number) => Promise<{
        getTextContent: () => Promise<{
          items: Array<{
            str?: string;
            width?: number;
            height?: number;
            transform?: number[];
          }>;
        }>;
      }>;
    }>;
  };
};

interface GroupedLine {
  page: number;
  y: number;
  items: PositionedTextItem[];
  text: string;
}

interface ExtractedDocument {
  text: string;
  positionedItems: PositionedTextItem[];
}

@Injectable()
export class TimetableParserService {
  private readonly logger = new Logger(TimetableParserService.name);
  private readonly roomRegex = /\b[A-Z]{2,5}(?:\s+[A-Z]{2,5})?-?\d{3,4}\b/g;
  private readonly timeRangeRegex =
    /(\d{2}[:.]\d{2})\s*(?:-|to|\u2013|\u2014)\s*(\d{2}[:.]\d{2})/i;
  private readonly days = [
    { label: 'monday', value: DayOfWeek.MONDAY },
    { label: 'tuesday', value: DayOfWeek.TUESDAY },
    { label: 'wednesday', value: DayOfWeek.WEDNESDAY },
    { label: 'thursday', value: DayOfWeek.THURSDAY },
    { label: 'friday', value: DayOfWeek.FRIDAY },
    { label: 'saturday', value: DayOfWeek.SATURDAY },
    { label: 'sunday', value: DayOfWeek.SUNDAY },
  ];

  async parseTimetable(buffer: Buffer): Promise<ParsedTimetableResult> {
    const { text, positionedItems } = await this.extractDocument(buffer);

    const subjectMap = this.extractSubjectMapping(text);
    const allBatches = this.extractAllBatches(text);

    const { sessions, warnings } = this.parseGrid(positionedItems, subjectMap);

    this.logger.log(`Extracted ${allBatches.length} batch codes from timetable PDF.`);
    this.logger.log(`Extracted ${sessions.length} class sessions from timetable grid.`);

    return {
      allBatches,
      sessions,
      warnings,
    };
  }

  async parse(buffer: Buffer): Promise<ParsedTimetableResult> {
    return this.parseTimetable(buffer);
  }

  private async extractDocument(buffer: Buffer): Promise<ExtractedDocument> {
    const pdf = (pdfParse as any).default ?? pdfParse;
    const textResult = await pdf(buffer);
    const positionedItems = await this.extractPositionedText(buffer);

    return {
      text: textResult.text ?? '',
      positionedItems,
    };
  }

  private async extractPositionedText(buffer: Buffer): Promise<PositionedTextItem[]> {
    const pdfjs = (await import(
      'pdfjs-dist/legacy/build/pdf.js'
    )) as unknown as PdfJsModule;
    const document = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
    const items: PositionedTextItem[] = [];

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const textContent = await page.getTextContent();

      for (const item of textContent.items) {
        const content = item.str?.replace(/\s+/g, ' ').trim();
        const transform = item.transform ?? [];
        if (!content || transform.length < 6) {
          continue;
        }

        items.push({
          text: content,
          x: transform[4],
          y: transform[5],
          width: item.width ?? 0,
          height: item.height ?? 0,
          page: pageNumber,
        });
      }
    }

    return items;
  }

  private extractSubjectMapping(text: string): Record<string, string> {
    const lines = text
      .split(/\r?\n/)
      .map((line) => this.normalizeWhitespace(line))
      .filter(Boolean);
    const map: Record<string, string> = {};

    const subjectHeaderIndex = lines.findIndex((line) =>
      /subject\s+code(?:\s*&\s*slot|\s+and\s+slot)?/i.test(line),
    );
    const candidateLines = subjectHeaderIndex >= 0 ? lines.slice(subjectHeaderIndex + 1) : lines;

    for (const line of candidateLines) {
      const fragments = line
        .split(/(?=[A-Z]{3,4}-?\d{3})/)
        .map((fragment) => this.normalizeWhitespace(fragment))
        .filter(Boolean);

      for (const fragment of fragments) {
        const code = this.findCourseCode(fragment);
        if (!code || map[code]) {
          continue;
        }

        const cleanedName = this.cleanSubjectName(fragment.replace(code, ' '));
        if (!cleanedName || this.looksLikeGridPayload(cleanedName)) {
          continue;
        }

        map[code] = cleanedName;
      }
    }

    return map;
  }

  private extractAllBatches(text: string): string[] {
    const batches = text.match(/\d{2}[A-Z]{2}\d/g) || [];
    return [...new Set(batches)].sort();
  }

  private parseGrid(
    items: PositionedTextItem[],
    subjectMap: Record<string, string>,
  ): { sessions: ParsedSession[]; warnings: string[] } {
    const warnings: string[] = [];
    const sessions: ParsedSession[] = [];
    const dayColumns = this.detectDayColumns(items);
    const timeRows = this.detectTimeRows(items);

    if (dayColumns.length === 0) {
      warnings.push('No day columns were detected from the timetable grid.');
      this.logger.warn(warnings[warnings.length - 1]);
    }

    if (timeRows.length === 0) {
      warnings.push('No time-slot rows were detected from the timetable grid.');
      this.logger.warn(warnings[warnings.length - 1]);
    }

    for (const row of timeRows) {
      const columnsForPage = dayColumns.filter((column) => column.page === row.page);

      for (const column of columnsForPage) {
        const cellItems = items.filter(
          (item) =>
            item.page === row.page &&
            item.x >= column.minX &&
            item.x < column.maxX &&
            item.y <= row.minY &&
            item.y >= row.maxY &&
            item.y < column.headerY - 5,
        );

        const cellText = this.normalizeWhitespace(this.groupCellText(cellItems));
        if (!cellText) {
          continue;
        }

        const parsedChunks = this.splitCellIntoChunks(cellText)
          .map((chunk) =>
            this.parseSessionChunk(chunk, row, column.dayOfWeek, subjectMap, row.page),
          )
          .filter((session): session is ParsedSession => Boolean(session));

        if (parsedChunks.length === 0) {
          const warning = `Failed parsing row ${row.startTime}-${row.endTime} ${column.dayOfWeek} on page ${row.page}: ${cellText}`;
          warnings.push(warning);
          this.logger.warn(warning);
          continue;
        }

        sessions.push(...parsedChunks);
      }
    }

    return {
      sessions: this.deduplicateSessions(sessions),
      warnings,
    };
  }

  private detectDayColumns(items: PositionedTextItem[]): DayColumn[] {
    const candidates = items
      .flatMap((item) => {
        const normalized = item.text.toLowerCase();
        const found: Array<{ page: number; x: number; headerY: number; dayOfWeek: DayOfWeek }> = [];
        for (const day of this.days) {
          if (normalized.includes(day.label)) {
            found.push({
              page: item.page,
              x: item.x + item.width / 2,
              headerY: item.y,
              dayOfWeek: day.value,
            });
          }
        }
        return found;
      })
      .sort((a, b) => (a.page - b.page) || (a.x - b.x));

    const groupedByPage = new Map<number, typeof candidates>();
    for (const candidate of candidates) {
      const pageEntries = groupedByPage.get(candidate.page) ?? [];
      pageEntries.push(candidate);
      groupedByPage.set(candidate.page, pageEntries);
    }

    const columns: DayColumn[] = [];
    for (const [page, pageCandidates] of groupedByPage.entries()) {
      const uniqueDays = pageCandidates.filter((candidate, index, list) => {
        return (
          index === 0 ||
          candidate.dayOfWeek !== list[index - 1].dayOfWeek ||
          Math.abs(candidate.x - list[index - 1].x) > 5
        );
      });

      const xs = uniqueDays.map((c) => c.x);
      let edgeMargin = 70;
      if (xs.length > 1) {
        const spacings = xs.slice(1).map((x, i) => x - xs[i]);
        edgeMargin = spacings.reduce((a, b) => a + b, 0) / spacings.length / 2;
      }

      uniqueDays.forEach((candidate, index) => {
        const previous = uniqueDays[index - 1];
        const next = uniqueDays[index + 1];
        const minX = previous ? (previous.x + candidate.x) / 2 : candidate.x - edgeMargin;
        const maxX = next ? (candidate.x + next.x) / 2 : candidate.x + edgeMargin;

        columns.push({
          page,
          dayOfWeek: candidate.dayOfWeek,
          minX,
          maxX,
          headerY: candidate.headerY,
        });
      });
    }

    return columns;
  }

  private detectTimeRows(items: PositionedTextItem[]): TimeRow[] {
    const lines = this.groupItemsIntoLines(items);
    const timeLines = lines
      .map((line) => {
        const match = line.text.match(this.timeRangeRegex);
        if (!match) {
          return null;
        }

        return {
          page: line.page,
          y: line.y,
          startTime: this.normalizeTime(match[1]),
          endTime: this.normalizeTime(match[2]),
        };
      })
      .filter((line): line is NonNullable<typeof line> => Boolean(line))
      .sort((a, b) => (a.page - b.page) || (b.y - a.y));

    const groupedByPage = new Map<number, typeof timeLines>();
    for (const timeLine of timeLines) {
      const pageEntries = groupedByPage.get(timeLine.page) ?? [];
      pageEntries.push(timeLine);
      groupedByPage.set(timeLine.page, pageEntries);
    }

    // Fallback for pages where the time column renders as stacked single items
    // (e.g. "08." / "00" / "-" / "08." / "55" instead of "08.00 - 08.55")
    const allPages = [...new Set(items.map((i) => i.page))];
    for (const page of allPages) {
      if (groupedByPage.get(page)?.length) {
        continue;
      }
      const fallback = this.detectTimeRangesFromVerticalClusters(
        items.filter((i) => i.page === page),
        page,
      );
      if (fallback.length > 0) {
        groupedByPage.set(page, fallback);
      }
    }

    const rows: TimeRow[] = [];
    for (const [page, pageLines] of groupedByPage.entries()) {
      const sorted = [...pageLines].sort((a, b) => b.y - a.y);

      let rowMargin = 18;
      if (sorted.length > 1) {
        const heights = sorted.slice(0, -1).map((line, i) => Math.abs(line.y - sorted[i + 1].y));
        rowMargin = heights.reduce((a, b) => a + b, 0) / heights.length / 2;
      }

      sorted.forEach((line, index) => {
        const previous = sorted[index - 1];
        const next = sorted[index + 1];

        rows.push({
          page,
          startTime: line.startTime,
          endTime: line.endTime,
          minY: previous ? (previous.y + line.y) / 2 : line.y + rowMargin,
          maxY: next ? (line.y + next.y) / 2 : line.y - rowMargin,
          centerY: line.y,
        });
      });
    }

    return rows;
  }

  private detectTimeRangesFromVerticalClusters(
    pageItems: PositionedTextItem[],
    page: number,
  ): Array<{ page: number; y: number; startTime: string; endTime: string }> {
    const results: Array<{ page: number; y: number; startTime: string; endTime: string }> = [];
    if (pageItems.length === 0) {
      return results;
    }

    // Sort top-to-bottom
    const sorted = [...pageItems].sort((a, b) => b.y - a.y);

    this.logger.debug(
      `[page ${page}] detectTimeRangesFromVerticalClusters: ${sorted.length} items, ` +
        `X range [${Math.min(...sorted.map((i) => i.x)).toFixed(1)}, ` +
        `${Math.max(...sorted.map((i) => i.x + i.width)).toFixed(1)}]`,
    );
    this.logger.debug(
      `[page ${page}] Sample items: ${sorted
        .slice(0, 10)
        .map((i) => `"${i.text}"@(${i.x.toFixed(0)},${i.y.toFixed(0)})`)
        .join(', ')}`,
    );

    const seen = new Set<string>();

    for (const anchor of sorted) {
      // Collect items at a similar X position (within ±50 units) and
      // within a 150-unit vertical window below this anchor.
      // Using X-proximity instead of a page-width percentage makes this
      // layout-agnostic — no assumptions about how wide the page is.
      const cluster = sorted.filter(
        (item) =>
          Math.abs(item.x - anchor.x) <= 50 &&
          item.y <= anchor.y &&
          anchor.y - item.y <= 150,
      );

      // Join text, remove spaces, normalise dots to colons, then look for HH:MM-HH:MM
      const combined = cluster
        .map((item) => item.text.replace(/\s+/g, ''))
        .join('')
        .replace(/\./g, ':');

      const match = combined.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
      if (match) {
        const startTime = this.normalizeTime(match[1]);
        if (!seen.has(startTime)) {
          seen.add(startTime);
          results.push({ page, y: anchor.y, startTime, endTime: this.normalizeTime(match[2]) });
        }
      }
    }

    this.logger.debug(`[page ${page}] Fallback found ${results.length} time rows: ${results.map((r) => r.startTime).join(', ')}`);

    return results;
  }

  private parseSessionChunk(
    chunk: string,
    row: TimeRow,
    dayOfWeek: DayOfWeek,
    subjectMap: Record<string, string>,
    page: number,
  ): ParsedSession | null {
    const normalizedChunk = this.normalizeWhitespace(chunk);
    const courseCode = this.findCourseCode(normalizedChunk);
    if (!courseCode) {
      return null;
    }

    const classType = this.extractClassType(normalizedChunk);
    if (!classType) {
      return null;
    }

    const batches = this.extractAllBatches(normalizedChunk);
    const room = this.extractRoom(normalizedChunk, courseCode);
    const faculty = this.extractFaculty(normalizedChunk, courseCode, room, batches);

    return {
      courseCode,
      courseName: subjectMap[courseCode] ?? null,
      classType,
      dayOfWeek,
      startTime: row.startTime,
      endTime: row.endTime,
      room,
      faculty,
      batches,
      rawText: normalizedChunk,
      page,
    };
  }

  private findCourseCode(text: string): string | null {
    const match = text.match(COURSE_CODE_GLOBAL_REGEX)?.[0] ?? null;
    if (!match || !COURSE_CODE_REGEX.test(match)) {
      return null;
    }

    return match;
  }

  private extractClassType(text: string): ClassType | null {
    const leading = text.match(/\b([LTP])\b/i)?.[1]?.toUpperCase();
    if (!leading) {
      return null;
    }

    switch (leading) {
      case 'L':
        return ClassType.LECTURE;
      case 'T':
        return ClassType.TUTORIAL;
      case 'P':
        return ClassType.PRACTICAL;
      default:
        return null;
    }
  }

  private extractRoom(text: string, courseCode: string): string | null {
    const candidates = [...new Set(text.match(this.roomRegex) ?? [])]
      .map((match) => this.normalizeWhitespace(match))
      .filter((match) => match !== courseCode)
      .filter((match) => !(match.match(BATCH_CODE_GLOBAL_REGEX) ?? []).length)
      .sort((left, right) => right.length - left.length);

    return candidates[0] ?? null;
  }

  private extractFaculty(
    text: string,
    courseCode: string,
    room: string | null,
    batches: string[],
  ): string | null {
    let remaining = ` ${text} `;
    remaining = remaining.replace(/\b[LTP]\b/gi, ' ');
    remaining = remaining.replace(new RegExp(this.escapeRegex(courseCode), 'g'), ' ');
    remaining = remaining.replace(/\bBatch(?:es)?\s*\d+\b/gi, ' ');
    remaining = remaining.replace(/\bBatch(?:es)?\b/gi, ' ');

    if (room) {
      remaining = remaining.replace(new RegExp(this.escapeRegex(room), 'g'), ' ');
    }

    for (const batch of batches) {
      remaining = remaining.replace(new RegExp(this.escapeRegex(batch), 'g'), ' ');
    }

    remaining = remaining
      .replace(/\s+/g, ' ')
      .replace(/[,:/]/g, ' ')
      .trim();

    if (!remaining) {
      return null;
    }

    const cleaned = remaining
      .split(' ')
      .filter((token) => !this.findCourseCode(token))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    return cleaned || null;
  }

  private splitCellIntoChunks(text: string): string[] {
    const chunks = text
      .split(/(?=\b[LTP]\b\s+[A-Z]{2,4}-?\d{3}\b)/)
      .map((chunk) => this.normalizeWhitespace(chunk))
      .filter(Boolean);

    return chunks.length > 0 ? chunks : [text];
  }

  private deduplicateSessions(sessions: ParsedSession[]): ParsedSession[] {
    const seen = new Set<string>();

    return sessions.filter((session) => {
      const batchList = [...new Set(session.batches)].sort();
      session.batches = batchList;

      const key = [
        session.courseCode,
        session.classType,
        session.dayOfWeek,
        session.startTime,
        session.endTime,
        session.room ?? '',
        batchList.join(','),
      ].join('|');

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }

  private groupItemsIntoLines(items: PositionedTextItem[]): GroupedLine[] {
    const sorted = [...items].sort(
      (a, b) => (a.page - b.page) || (b.y - a.y) || (a.x - b.x),
    );
    const lines: GroupedLine[] = [];
    const tolerance = 3;

    for (const item of sorted) {
      const existing = lines.find(
        (line) => line.page === item.page && Math.abs(line.y - item.y) <= tolerance,
      );

      if (existing) {
        existing.items.push(item);
        existing.items.sort((a, b) => a.x - b.x);
        existing.text = existing.items.map((entry) => entry.text).join(' ');
        continue;
      }

      lines.push({
        page: item.page,
        y: item.y,
        items: [item],
        text: item.text,
      });
    }

    return lines;
  }

  private groupCellText(items: PositionedTextItem[]): string {
    return this.groupItemsIntoLines(items)
      .sort((a, b) => b.y - a.y)
      .map((line) => line.text)
      .join(' ');
  }

  private cleanSubjectName(value: string): string | null {
    const cleaned = this.normalizeWhitespace(
      value
        .replace(/\[.*?\]/g, ' ')
        .replace(/\b[A-Z]\d+\b/g, ' ')
        .replace(/\b\d+(?:\.\d+)?\s*credits?\b/gi, ' ')
        .replace(/\bslot\b/gi, ' ')
        .replace(BATCH_CODE_GLOBAL_REGEX, ' ')
        .replace(this.roomRegex, ' ')
        .replace(/[|]/g, ' ')
        .replace(/^[^A-Za-z]+|[^A-Za-z)]+$/g, ' '),
    );

    return cleaned || null;
  }

  private looksLikeGridPayload(value: string): boolean {
    if (/\b[LTP]\b/i.test(value)) {
      return true;
    }

    if ((value.match(BATCH_CODE_GLOBAL_REGEX) ?? []).length > 0) {
      return true;
    }

    return (value.match(this.roomRegex) ?? []).length > 0;
  }

  private normalizeWhitespace(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
  }

  private normalizeTime(value: string): string {
    const normalized = value.replace(/\./g, ':').trim();
    const [hour, minute] = normalized.split(':');
    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
