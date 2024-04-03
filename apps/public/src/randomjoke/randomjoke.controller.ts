import { Controller, Get, Param, Request } from '@nestjs/common';
import { RandomjokeService } from './randomjoke.service';
import { Request as ExpressRequest } from 'express';
@Controller('public/randomjoke')
export class RandomjokeController {
  constructor(private readonly randomjokeService: RandomjokeService) {}

  @Get()
  getRandomJoke(@Request() req: ExpressRequest) {
    return this.randomjokeService.getRandomJoke(req);
  }

  @Get('random')
  getARandomJoke() {
    return this.randomjokeService.getARandomJoke();
  }

  @Get(':id')
  getJokeById(@Param('id') jokeId: string) {
    return this.randomjokeService.getJokeById(jokeId);
  }
}
