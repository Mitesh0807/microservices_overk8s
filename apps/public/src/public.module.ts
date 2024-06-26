import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import * as Joi from 'joi';
import { HealthModule, LoggerModule } from '@app/comman';
import { CatsModule } from './cats/cats.module';
import { DogsModule } from './dogs/dogs.module';
import { MealModule } from './meal/meal.module';
import { QuoteModule } from './quote/quote.module';
import { RandomjokeModule } from './randomjoke/randomjoke.module';
import { RandomProductModule } from './random-product/random-product.module';
import { StockModule } from './stock/stock.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
    }),
    BooksModule,
    LoggerModule,
    HealthModule,
    CatsModule,
    DogsModule,
    MealModule,
    QuoteModule,
    RandomjokeModule,
    RandomProductModule,
    StockModule,
  ],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
