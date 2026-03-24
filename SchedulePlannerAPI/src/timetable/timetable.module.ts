import { Module } from '@nestjs/common';
import { ParserModule } from '../parser/parser.module';
import { TimetableController } from './timetable.controller';
import { TimetableService } from './timetable.service';

@Module({
  imports: [ParserModule],
  controllers: [TimetableController],
  providers: [TimetableService],
})
export class TimetableModule {}
