import { Injectable, NotFoundException } from '@nestjs/common';
import booksJson from '../../json/books.json';
import { Request } from 'express';
import { filterObjectKeys, getPaginatedPayload } from '@app/comman';
@Injectable()
export class BooksService {
  async getBooks(req: Request) {
    console.log(req?.query);
    const page = +(req?.query?.page || 1);
    const limit = +(req?.query?.limit || 10);
    let query: string;

    let inc:
      | (
          | 'searchInfo'
          | 'kind'
          | 'id'
          | 'etag'
          | 'selfLink'
          | 'volumeInfo'
          | 'saleInfo'
          | 'accessInfo'
        )[]
      | undefined;

    if (typeof req?.query?.query === 'string' && req?.query?.query) {
      query = req.query.query.toLowerCase();
    }
    if (req?.query?.inc && typeof req?.query?.inc === 'string') {
      const incArray = req.query.inc.split(',');
      const incKeys = Object.keys(booksJson[0]);
      const isValidKeys = incArray.every((i) => incKeys.includes(i));
      if (!isValidKeys) {
        throw new NotFoundException('Invalid inc keys');
      }
      inc = req.query.inc.split(',') as (
        | 'searchInfo'
        | 'kind'
        | 'id'
        | 'etag'
        | 'selfLink'
        | 'volumeInfo'
        | 'saleInfo'
        | 'accessInfo'
      )[];
    }
    let booksArray = query
      ? booksJson.filter((book) => {
          return (
            book.searchInfo?.textSnippet.toLowerCase().includes(query) ||
            book.volumeInfo.title?.includes(query) ||
            book.volumeInfo.subtitle?.includes(query)
          );
        })
      : booksJson;
    if (inc && inc[0]?.trim()) {
      inc = inc.map((i) => i.trim() as keyof (typeof booksJson)[0]);
      const updatedBooks = filterObjectKeys(inc, booksArray);
      booksArray = updatedBooks;
    }
    const response = getPaginatedPayload(booksArray, page, limit);
    return response;
  }

  async getBookById(bookId: string) {
    const book = booksJson.find((book) => +book.id === +bookId);
    if (!book) {
      throw new NotFoundException('Book does not exist.');
    }
    return book;
  }

  async getARandomBook() {
    const randomIndex = Math.floor(Math.random() * booksJson.length);
    console.log('Testin');
    const book = booksJson[randomIndex];
    if (!book) {
      throw new NotFoundException('Book aa does not exist.');
    }
    return book;
  }
}
