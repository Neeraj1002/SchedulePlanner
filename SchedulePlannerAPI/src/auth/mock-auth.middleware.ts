import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';

@Injectable()
export class MockAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(MockAuthMiddleware.name);

  use(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
    const userIdHeader = req.header('x-user-id');

    if (!userIdHeader) {
      return next();
    }

    const userId = Number(userIdHeader);
    if (!Number.isInteger(userId) || userId <= 0) {
      this.logger.warn(`Rejected malformed x-user-id header: ${userIdHeader}`);
      throw new UnauthorizedException('Invalid x-user-id header.');
    }

    req.user = { id: userId };
    next();
  }
}
