import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { COURSE_CODE_REGEX } from '../validation-patterns';

export class CourseCodeParamDto {
  @ApiProperty({ example: 'ESS-102' })
  @Matches(COURSE_CODE_REGEX, {
    message: 'courseCode must match the format ESS-102.',
  })
  courseCode: string;
}
