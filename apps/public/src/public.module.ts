import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import * as Joi from 'joi';
import { LoggerModule } from '@app/comman';
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
  ],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
