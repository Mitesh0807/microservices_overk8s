import { Injectable, NotFoundException } from '@nestjs/common';
import booksJson from '../../json/books.json';
import { Request } from 'express';
import { filterObjectKeys, getPaginatedPayload } from '@app/comman';
@Injectable()
export class BooksService {
  async getBooks(req: Request) {
    const page = +(req?.query?.page || 1);
    const limit = +(req?.query?.limit || 10);
    let query: string;
    let inc: Array<keyof (typeof booksJson)[0]>;
    if (typeof req?.query?.query === 'string' && req?.query?.query) {
      query = req.query.query.toLowerCase();
    }
    if (req?.query?.inc && typeof req?.query?.inc === 'string') {
      inc = req.query.inc.split(',') as Array<keyof (typeof booksJson)[0]>;
      inc = inc.map((i) => i.trim() as keyof (typeof booksJson)[0]);
    }
    const booksArray = query
      ? booksJson.filter((book) => {
          return (
            book.searchInfo?.textSnippet.toLowerCase().includes(query) ||
            book.volumeInfo.title?.includes(query) ||
            book.volumeInfo.subtitle?.includes(query)
          );
        })
      : booksJson;
    const paginatedBooks = getPaginatedPayload(booksArray, page, limit);
    const updatedBooks = inc
      ? filterObjectKeys(inc, paginatedBooks.data)
      : paginatedBooks.data;
    return { ...paginatedBooks, data: updatedBooks };
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
