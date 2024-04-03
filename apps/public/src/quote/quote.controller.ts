import { Controller, Get, Param, Request } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { Request as ExpressRequest } from 'express';
@Controller('public/quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Get()
  getQuotes(@Request() req: ExpressRequest) {
    return this.quoteService.getQuotes(req);
  }

  @Get('random')
  getARandomQuote() {
    return this.quoteService.getARandomQuote();
  }

  @Get(':quoteId')
  getQuoteById(@Param('quoteId') quoteId: string) {
    return this.quoteService.getQuoteById(quoteId);
  }
}
