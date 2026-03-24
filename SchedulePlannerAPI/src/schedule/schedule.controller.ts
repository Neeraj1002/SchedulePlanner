import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { BatchScheduleParamsDto } from './dto/batch-schedule-params.dto';
import { ScheduleService } from './schedule.service';

@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('me')
  @ApiOperation({ summary: 'Fetch the logged-in user schedule grouped by weekday' })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'Mock auth header consumed by middleware and exposed as req.user.id.',
  })
  getMySchedule(@Req() req: AuthenticatedRequest) {
    return this.scheduleService.getMySchedule(req.user?.id);
  }

  @Get('batch/:batchCode')
  @ApiOperation({ summary: 'Fetch a grouped schedule for a specific batch code' })
  getScheduleByBatch(@Param() params: BatchScheduleParamsDto) {
    return this.scheduleService.getScheduleByBatchCode(params.batchCode);
  }
}
