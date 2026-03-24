import { Module } from '@nestjs/common';
import { TimetableParserService } from './timetable-parser.service';

@Module({
  providers: [TimetableParserService],
  exports: [TimetableParserService],
})
export class ParserModule {}
