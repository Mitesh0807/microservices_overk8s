import { Controller, Get, Param, Request } from '@nestjs/common';
import { BooksService } from './books.service';
import { Request as ExpressRequest } from 'express';
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Get()
  async getBooks(@Request() req: ExpressRequest) {
    return this.booksService.getBooks(req);
  }

  @Get('random')
  async getARandomBook() {
    return this.booksService.getARandomBook();
  }
  @Get(':bookId')
  async getBookById(@Param('bookId') bookId: string) {
    return this.booksService.getBookById(bookId);
  }
}
