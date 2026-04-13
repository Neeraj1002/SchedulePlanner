import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadTimetableDto } from './dto/upload-timetable.dto';
import { TimetableService } from './timetable.service';

@ApiTags('timetable')
@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload and ingest a timetable PDF' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        universityName: {
          type: 'string',
        },
        departmentName: {
          type: 'string',
        },
        semesterNumber: {
          type: 'integer',
        },
        academicYear: {
          type: 'string',
        },
        batchCode: {
          type: 'string',
        },
      },
      required: ['file', 'universityName', 'departmentName', 'semesterNumber', 'academicYear', 'batchCode'],
    },
  })
  @ApiResponse({ status: 201, description: 'Timetable imported successfully.' })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadTimetableDto,
  ) {
    return this.timetableService.uploadTimetable(file, body);
  }
}
