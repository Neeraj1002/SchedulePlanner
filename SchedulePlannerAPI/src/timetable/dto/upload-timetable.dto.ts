import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class UploadTimetableDto {
  @ApiProperty({ example: 'Example University' })
  @IsString()
  @IsNotEmpty()
  universityName: string;

  @ApiProperty({ example: 'Electrical Engineering' })
  @IsString()
  @IsNotEmpty()
  departmentName: string;

  @ApiProperty({ example: 3 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(12)
  semesterNumber: number;

  @ApiProperty({ example: '2026-2027' })
  @IsString()
  @IsNotEmpty()
  academicYear: string;
}
