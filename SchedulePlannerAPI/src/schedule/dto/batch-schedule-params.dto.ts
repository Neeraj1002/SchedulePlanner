import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { BATCH_CODE_REGEX } from '../../common/validation-patterns';

export class BatchScheduleParamsDto {
  @ApiProperty({ example: '25EE3' })
  @Matches(BATCH_CODE_REGEX, {
    message: 'batchCode must match the format 25EE3.',
  })
  batchCode: string;
}
