import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';
import { BATCH_CODE_REGEX } from '../../common/validation-patterns';

export class CreateUserDto {
  @ApiProperty({ example: 'Aarav Sharma' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'aarav@example.edu' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '25EE3',
    description: 'Batch code to resolve within the supplied semester.',
  })
  @IsOptional()
  @IsString()
  @Matches(BATCH_CODE_REGEX, {
    message: 'batchCode must match the format 25EE3.',
  })
  batchCode?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  departmentId?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  semesterId?: number;
}
