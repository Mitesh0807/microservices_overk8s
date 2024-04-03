import { Controller, Get, Param, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { CatsService } from './cats.service';
@Controller('public/cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  async getBooks(@Request() req: ExpressRequest) {
    return this.catsService.getCats(req);
  }

  @Get('random')
  async getARandomBook() {
    return this.catsService.getARandomCat();
  }
  @Get(':catId')
  async getBookById(@Param('catId') catId: string) {
    return this.catsService.getCatById(catId);
  }
}
