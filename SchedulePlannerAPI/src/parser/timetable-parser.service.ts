import { Injectable, Logger } from '@nestjs/common';
import { ClassType, DayOfWeek } from '@prisma/client';
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
import pdfParse = require('pdf-parse');

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
    const textResult = await pdfParse(buffer);
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

    const debugFragments: any[] = [];
    for (const line of candidateLines) {
      const fragments = line
        .split(/(?=[A-Z]{3}-\d{3})/)
        .map((fragment) => this.normalizeWhitespace(fragment))
        .filter(Boolean);
      debugFragments.push({ line, fragments });

      for (const fragment of fragments) {
        const code = this.findCourseCode(fragment);
        if (!code || map[code]) {
          continue;
        }

        let nameFragment = fragment;
        const roomMatches = fragment.match(this.roomRegex) || [];
        const actualRoom = roomMatches.find((r) => r !== code);
        if (actualRoom) {
          nameFragment = fragment.substring(0, fragment.indexOf(actualRoom));
        }

        const cleanedName = this.cleanSubjectName(nameFragment.replace(code, ' '));
        console.log(`FRAGMENT: ${fragment} -> CODE: ${code} -> ACTUAL_ROOM: ${actualRoom} -> NAME_FRAG: ${nameFragment} -> CLEANED: ${cleanedName}`);

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
      const rowItems = items.filter((item) => 
        item.page === row.page && 
        item.y <= row.minY && 
        item.y >= row.maxY
      );

      // Pre-process items in this row to handle merged multi-column lines
      const columnFills: Map<DayOfWeek, string[]> = new Map();

      for (const item of rowItems) {
        const chunks = this.splitCellIntoChunks(item.text);
        
        if (chunks.length <= 1) {
          // Single session chunk, assign to column by centerX
          const centerX = item.x + item.width / 2;
          const column = columnsForPage.find(c => centerX >= c.minX && centerX < c.maxX);
          if (column) {
            const list = columnFills.get(column.dayOfWeek) ?? [];
            list.push(item.text);
            columnFills.set(column.dayOfWeek, list);
          }
        } else {
          // Merged line with multiple sessions spanning columns
          for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const startIndex = item.text.indexOf(chunk);
            if (startIndex === -1) continue;

            const charRatio = (startIndex + chunk.length / 2) / item.text.length;
            const chunkCenterX = item.x + charRatio * item.width;
            
            const column = columnsForPage.find(c => chunkCenterX >= c.minX && chunkCenterX < c.maxX);
            if (column) {
              const list = columnFills.get(column.dayOfWeek) ?? [];
              list.push(chunk);
              columnFills.set(column.dayOfWeek, list);
            }
          }
        }
      }

      for (const column of columnsForPage) {
        const cellChunks = columnFills.get(column.dayOfWeek) ?? [];
        if (cellChunks.length === 0) {
          continue;
        }

        const cellText = this.normalizeWhitespace(cellChunks.join(' '));
        if (!cellText || cellText.length < 3) {
          continue;
        }

        const parsedChunks = this.splitCellIntoChunks(cellText)
          .map((chunk) =>
            this.parseSessionChunk(chunk, row, column.dayOfWeek, subjectMap, row.page),
          )
          .filter((session): session is ParsedSession => Boolean(session));

        if (parsedChunks.length === 0) {
          const uppercaseText = cellText.toUpperCase();
          const isKnownNoise =
            uppercaseText.includes('LUNCH') ||
            uppercaseText.includes('SEMESTER') ||
            uppercaseText.includes('PROGRAM NAME') ||
            uppercaseText.includes('SUBJECT AREA') ||
            uppercaseText.includes('FACULTY NAME') ||
            uppercaseText.includes('CREDIT') ||
            /^[\d.:\s-]+$/.test(uppercaseText); // Only times/numbers

          if (!isKnownNoise && cellText.length > 5) {
            const warning = `Failed parsing row ${row.startTime}-${row.endTime} ${column.dayOfWeek} on page ${row.page}: ${cellText}`;
            warnings.push(warning);
            this.logger.warn(warning);
          }
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
    const candidates: any[] = [];

    for (const item of items) {
      const normalized = item.text.toLowerCase();
      // Look for all day labels in this specific item
      for (const day of this.days) {
        let index = normalized.indexOf(day.label);
        // While loop in case a day appears twice, though unlikely in a header
        while (index !== -1) {
          // Estimate X by mapping character position to visual width
          const charRatio = (index + day.label.length / 2) / normalized.length;
          candidates.push({
            page: item.page,
            x: item.x + charRatio * item.width,
            headerY: item.y,
            dayOfWeek: day.value,
          });
          
          index = normalized.indexOf(day.label, index + 1);
        }
      }
    }

    candidates.sort((a, b) => (a.page - b.page) || (a.x - b.x));

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
        // Ensure leftmost column starts at 0 to capture sessions that might start early
        const minX = previous ? (previous.x + candidate.x) / 2 : 0;
        // Ensure rightmost column extends far enough
        const maxX = next ? (candidate.x + next.x) / 2 : 5000;

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

    // Keep only items whose text is purely time-like: digits, dots, colons, dashes.
    // This strips out letter-based noise (day names, course codes, faculty names, email
    // headers, etc.) so only real time-column fragments remain.
    const timeOnly = pageItems
      .filter((item) => /^[\d.:\u2013\u2014\s-]+$/.test(item.text.trim()) && item.text.trim().length > 0)
      .sort((a, b) => b.y - a.y); // top-to-bottom

    this.logger.debug(
      `[page ${page}] time-only items: ${timeOnly.length} — ` +
        timeOnly.slice(0, 8).map((i) => `"${i.text}"@(${i.x.toFixed(0)},${i.y.toFixed(0)})`).join(', '),
    );

    const seen = new Set<string>();

    for (const anchor of timeOnly) {
      // Cluster: same X column (±30 units) within a 200-unit vertical window below anchor.
      // Tighter X keeps the cluster inside the narrow time-column strip;
      // larger Y handles tall rows whose items span a big vertical range.
      const cluster = timeOnly.filter(
        (item) =>
          Math.abs(item.x - anchor.x) <= 30 &&
          item.y <= anchor.y &&
          anchor.y - item.y <= 200,
      );

      // Join without spaces, normalise dots → colons, then look for HH:MM-HH:MM
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

    this.logger.debug(
      `[page ${page}] fallback rows: ${results.length} — ${results.map((r) => r.startTime).join(', ')}`,
    );

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
    let remaining = text;
    remaining = remaining.replace(/\b[LTP]\b/gi, ' ');
    remaining = remaining.replace(new RegExp(this.escapeRegex(courseCode), 'g'), ' ');
    remaining = remaining.replace(/\bBatch(?:es)?\s*\d+\b/gi, ' ');
    remaining = remaining.replace(/\bBatch(?:es)?\b/gi, ' ');
    remaining = remaining.replace(/\bLUNCH\b/gi, ' ');
    remaining = remaining.replace(/\bAPJ\b/gi, ' ');

    if (room) {
      remaining = remaining.replace(new RegExp(this.escapeRegex(room), 'g'), ' ');
    }

    for (const batch of batches) {
      remaining = remaining.replace(new RegExp(this.escapeRegex(batch), 'g'), ' ');
    }

    const uncleanedTokens = remaining.split(/[,/|:]/).map((t) => t.trim()).filter(Boolean);
    const cleanedTokens = uncleanedTokens.map((token) => {
      return token
        .split(' ')
        .filter((word) => !this.findCourseCode(word))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }).filter(Boolean);

    const uniqueTokens = [...new Set(cleanedTokens)];
    return uniqueTokens.length > 0 ? uniqueTokens.join(', ') : null;
  }

  private splitCellIntoChunks(text: string): string[] {
    const chunks = text
      .split(/(?=[LTP](?:\s+|[.-])[A-Z]{2,4}-?\d{3}\b)/)
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
