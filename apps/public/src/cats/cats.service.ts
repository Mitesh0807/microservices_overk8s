import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import catsJson from '../../json/cats.json';
import { filterObjectKeys, getPaginatedPayload } from '@app/comman';
@Injectable()
export class CatsService {
  getCats(req: Request) {
    const page = +(req?.query?.page || 1);
    const limit = +(req?.query?.limit || 10);
    let query: string;
    let inc: Array<keyof (typeof catsJson)[0]>;
    if (typeof req?.query?.query === 'string' && req?.query?.query) {
      query = req.query.query.toLowerCase();
    }
    if (req?.query?.inc && typeof req?.query?.inc === 'string') {
      inc = req.query.inc.split(',') as Array<keyof (typeof catsJson)[0]>;
    }
    const catsArray = query
      ? catsJson.filter((cat) => {
          return (
            cat.name?.toLowerCase().includes(query) ||
            cat.temperament?.includes(query)
          );
        })
      : catsJson;
    const paginatedCats = getPaginatedPayload(catsArray, page, limit);
    const filterdCats = inc
      ? filterObjectKeys(inc, paginatedCats.data)
      : paginatedCats.data;
    return { ...paginatedCats, data: filterdCats };
  }

  getARandomCat() {
    return catsJson[Math.floor(Math.random() * catsJson.length)];
  }

  getCatById(bookId: string) {
    return catsJson.find((cat) => +cat.id === +bookId);
  }
}
