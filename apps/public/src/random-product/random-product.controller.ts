import { Controller, Get, Param, Request } from '@nestjs/common';
import { RandomProductService } from './random-product.service';
import { Request as ExpressRequest } from 'express';

@Controller('public/random-product')
export class RandomProductController {
  constructor(private readonly randomProductService: RandomProductService) {}

  @Get()
  getRandomProducts(@Request() req: ExpressRequest) {
    return this.randomProductService.getRandomProducts(req);
  }

  @Get('random')
  getRandomProduct() {
    return this.randomProductService.getRandomProduct();
  }

  @Get(':id')
  getRandomProductById(@Param('id') id: string) {
    return this.randomProductService.getRandomProductbyId(id);
  }
}
