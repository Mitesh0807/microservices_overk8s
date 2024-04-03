import { Injectable } from '@nestjs/common';
import randomProductJson from '../../json/randomjoke.json';
import { getPaginatedPayload, filterObjectKeys } from '@app/comman';
import { Request } from 'express';
@Injectable()
export class RandomProductService {
  getRandomProducts(req: Request) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    let query: string;
    if (
      req?.query?.query &&
      typeof req.query?.query === 'string' &&
      req.query?.query &&
      req?.query?.query?.length > 0
    ) {
      query = req.query.query.toLowerCase();
    }
    let inc: Array<keyof (typeof randomProductJson)[0]>;
    if (
      req?.query?.inc &&
      typeof req.query?.inc === 'string' &&
      req.query?.inc &&
      req?.query?.inc?.length > 0
    ) {
      inc = req.query.inc.split(',') as Array<
        keyof (typeof randomProductJson)[0]
      >;
    }
    const filteredData = query
      ? structuredClone(randomProductJson).filter((p) =>
          p.content.toLowerCase().includes(query),
        )
      : randomProductJson;

    const paginatedData = getPaginatedPayload(filteredData, page, limit);

    return {
      ...paginatedData,
      data: inc
        ? filterObjectKeys(inc, paginatedData.data)
        : paginatedData.data,
    };
  }

  getRandomProduct() {
    return randomProductJson[
      Math.floor(Math.random() * randomProductJson.length)
    ];
  }

  getRandomProductbyId(id: string) {
    return randomProductJson.find((p) => +p.id === +id);
  }
}
