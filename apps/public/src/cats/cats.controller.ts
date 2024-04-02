import { Controller, Get, Param, Request } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Request as ExpressRequest } from 'express';
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
  @Get(':bookId')
  async getBookById(@Param('bookId') bookId: string) {
    return this.catsService.getCatById(bookId);
  }
}
