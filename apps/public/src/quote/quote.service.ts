import { Injectable } from '@nestjs/common';
import quotesJson from '../../json/quotes.json';
import { Request } from 'express';
import { filterObjectKeys, getPaginatedPayload } from '@app/comman';
@Injectable()
export class QuoteService {
  getQuotes(req: Request) {
    const page = +(req?.query?.page || 1);
    const limit = +(req?.query?.limit || 10);
    let query: string;
    let inc: Array<keyof (typeof quotesJson)[0]>;
    if (typeof req?.query?.query === 'string' && req?.query?.query) {
      query = req.query.query.toLowerCase();
    }
    if (req?.query?.inc && typeof req?.query?.inc === 'string') {
      inc = req.query.inc.split(',') as Array<keyof (typeof quotesJson)[0]>;
    }
    const quotesArray = query
      ? quotesJson.filter((quote) => {
          return (
            quote.content?.toLowerCase().includes(query) ||
            quote.author?.toLowerCase().includes(query)
          );
        })
      : quotesJson;
    const filterdQuotes = inc
      ? getPaginatedPayload(filterObjectKeys(inc, quotesArray), page, limit)
      : getPaginatedPayload(quotesArray, page, limit);
    return filterdQuotes;
  }

  getARandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotesJson.length);
    return quotesJson[randomIndex];
  }

  getQuoteById(quoteId: string) {
    return quotesJson.find((quote) => +quote.id === +quoteId);
  }
}
