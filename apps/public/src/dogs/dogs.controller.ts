import { Controller, Get, Param, Request } from '@nestjs/common';
import { DogsService } from './dogs.service';
import { Request as ExpressRequest } from 'express';

@Controller('public/dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}
  @Get()
  async getBooks(@Request() req: ExpressRequest) {
    return this.dogsService.getDogs(req);
  }

  @Get('random')
  async getARandomBook() {
    return this.dogsService.getARandomDog();
  }
  @Get(':dogId')
  async getBookById(@Param('dogId') dogId: string) {
    return this.dogsService.getDogById(dogId);
  }
}
