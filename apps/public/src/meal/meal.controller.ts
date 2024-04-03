import { Controller, Get, Param, Request } from '@nestjs/common';
import { MealService } from './meal.service';
import { Request as ExpressRequest } from 'express';
@Controller('public/meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Get()
  async getMeals(@Request() req: ExpressRequest) {
    return this.mealService.getMeals(req);
  }

  @Get('random')
  async getARandomMeal() {
    return this.mealService.getARandomMeal();
  }

  @Get(':mealId')
  async getMealById(@Param('mealId') mealId: string) {
    return this.mealService.getMealById(mealId);
  }
}
