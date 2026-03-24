import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create an application user linked to a batch' })
  create(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Get()
  @ApiOperation({ summary: 'List users' })
  list() {
    return this.userService.listUsers();
  }
}
