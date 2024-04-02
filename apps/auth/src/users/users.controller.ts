import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Request as ExpressRequest } from 'express';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Req() Request: ExpressRequest,
  ) {
    return this.usersService.create(createUserDto, Request);
  }
}
