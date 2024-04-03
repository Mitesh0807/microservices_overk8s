import { Injectable } from '@nestjs/common';
import mealsJson from '../../json/meals.json';
import { Request } from 'express';
import { filterObjectKeys, getPaginatedPayload } from '@app/comman';
@Injectable()
export class MealService {
  getMeals(req: Request) {
    const page = +(req?.query?.page || 1);
    const limit = +(req?.query?.limit || 10);
    let query: string;
    let inc: Array<keyof (typeof mealsJson)[0]>;
    if (typeof req?.query?.query === 'string' && req?.query?.query) {
      query = req.query.query.toLowerCase();
    }
    if (req?.query?.inc && typeof req?.query?.inc === 'string') {
      inc = req.query.inc.split(',') as Array<keyof (typeof mealsJson)[0]>;
    }
    const mealsArray = query
      ? mealsJson.filter((meal) => {
          return (
            meal.strMeal?.toLowerCase().includes(query) ||
            meal.strCategory?.toLowerCase().includes(query)
          );
        })
      : mealsJson;
    const paginatedMeals = getPaginatedPayload(mealsArray, page, limit);
    const filterdMeals = inc
      ? filterObjectKeys(inc, paginatedMeals.data)
      : paginatedMeals.data;
    return { ...paginatedMeals, data: filterdMeals };
  }

  getARandomMeal() {
    return mealsJson[Math.floor(Math.random() * mealsJson.length)];
  }

  getMealById(mealId: string) {
    return mealsJson.find((meal) => +meal.id === +mealId);
  }
}
