import { Controller, Get, Param, Request } from '@nestjs/common';
import { StockService } from './stock.service';
import { Request as ExpressRequest } from 'express';

@Controller('public/stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  getStocks(@Request() req: ExpressRequest) {
    return this.stockService.getStocks(req);
  }

  @Get('random')
  getRandomStocks() {
    return this.stockService.getRandomStocks();
  }
  @Get(':id')
  getStockById(@Param('id') id: string) {
    return this.stockService.getStockById(id);
  }
}
