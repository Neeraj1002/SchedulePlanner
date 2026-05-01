import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadCoursesDto } from './dto/upload-courses.dto';
import { CoursesService } from './courses.service';
import { PARSER_CONFIGS } from './parser.config';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
      fileFilter: (_request, file, callback) => {
        if (file.mimetype.includes('pdf')) {
          callback(null, true);
          return;
        }

        callback(new BadRequestException('Only PDF uploads are supported.'), false);
      },
    }),
  )
  @ApiOperation({ summary: 'Upload a curriculum PDF and populate courses' })
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
        parserType: {
          type: 'string',
          enum: Object.keys(PARSER_CONFIGS),
        },
      },
      required: ['file', 'universityName', 'departmentName', 'parserType'],
    },
  })
  @ApiResponse({ status: 201, description: 'Courses ingested successfully.' })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadCoursesDto,
  ) {
    return this.coursesService.uploadCourses(file, body);
  }
}
