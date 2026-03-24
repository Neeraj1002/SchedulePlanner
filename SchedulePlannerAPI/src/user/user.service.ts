import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(input: CreateUserDto) {
    let batchId: number | undefined;

    if (input.batchCode) {
      if (!input.semesterId) {
        throw new BadRequestException(
          'semesterId is required when batchCode is provided.',
        );
      }

      const batch = await this.prisma.batch.findUnique({
        where: {
          batchCode_semesterId: {
            batchCode: input.batchCode,
            semesterId: input.semesterId,
          },
        },
      });

      if (!batch) {
        throw new NotFoundException(
          `Batch ${input.batchCode} was not found for the provided semester.`,
        );
      }

      batchId = batch.id;
    }

    try {
      return await this.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          batchId,
          departmentId: input.departmentId,
          semesterId: input.semesterId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A user with this email already exists.');
      }

      throw error;
    }
  }

  listUsers() {
    return this.prisma.user.findMany({
      include: {
        batch: true,
        department: true,
        semester: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
