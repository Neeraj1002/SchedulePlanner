import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { PARSER_CONFIGS } from '../parser.config';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class UploadCoursesDto {
  @ApiProperty({ example: 'Indian Institute of Technology Roorkee' })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  universityName: string;

  @ApiProperty({ example: 'Electrical Engineering' })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  departmentName: string;

  @ApiProperty({ example: 'IIT_ROORKEE', enum: Object.keys(PARSER_CONFIGS) })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.keys(PARSER_CONFIGS))
  parserType: string;
}
