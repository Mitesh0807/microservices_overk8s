import { Injectable } from '@nestjs/common';
import stocksJson from '../../json/nse-stocks.json';
import { filterObjectKeys, getPaginatedPayload } from '@app/comman';
import { Request } from 'express';
@Injectable()
export class StockService {
  getStocks(req: Request) {
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
    let inc: Array<keyof (typeof stocksJson)[0]>;
    if (
      req?.query?.inc &&
      typeof req.query?.inc === 'string' &&
      req.query?.inc &&
      req?.query?.inc?.length > 0
    ) {
      inc = req.query.inc.split(',') as Array<keyof (typeof stocksJson)[0]>;
    }
    const stocksArray = query
      ? stocksJson.filter(
          (stock) =>
            stock.Name?.toLowerCase().includes(query) ||
            stock.Symbol?.toLowerCase().includes(query),
        )
      : stocksJson;
    const paginatedStocks = getPaginatedPayload(stocksArray, page, limit);
    const filterdStocks = inc
      ? filterObjectKeys(inc, paginatedStocks.data)
      : paginatedStocks.data;
    return { ...paginatedStocks, data: filterdStocks };
  }

  getStockById(id: string) {
    return stocksJson.find((stock) => stock.Symbol === id);
  }

  getRandomStocks() {
    return stocksJson[Math.floor(Math.random() * stocksJson.length)];
  }
}
