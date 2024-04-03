import { Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';

@Module({
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}
