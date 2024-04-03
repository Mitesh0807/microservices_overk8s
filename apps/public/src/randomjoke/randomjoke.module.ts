import { Module } from '@nestjs/common';
import { RandomjokeService } from './randomjoke.service';
import { RandomjokeController } from './randomjoke.controller';

@Module({
  controllers: [RandomjokeController],
  providers: [RandomjokeService],
})
export class RandomjokeModule {}
