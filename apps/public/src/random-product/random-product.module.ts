import { Module } from '@nestjs/common';
import { RandomProductService } from './random-product.service';
import { RandomProductController } from './random-product.controller';

@Module({
  controllers: [RandomProductController],
  providers: [RandomProductService],
})
export class RandomProductModule {}
