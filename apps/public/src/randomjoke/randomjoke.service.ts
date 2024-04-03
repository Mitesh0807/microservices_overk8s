import { Injectable } from '@nestjs/common';
import randomJokesJson from '../../json/randomjoke.json';
import { Request } from 'express';
import { getPaginatedPayload, filterObjectKeys } from '@app/comman';
@Injectable()
export class RandomjokeService {
  getRandomJoke(req: Request) {
    const page = +(req?.query?.page || 1);
    const limit = +(req?.query?.limit || 10);
    let query: string;
    if (typeof req?.query?.query === 'string' && req?.query?.query) {
      query = req.query.query.toLowerCase();
    }
    let inc: Array<keyof (typeof randomJokesJson)[0]>;
    if (req?.query?.inc && typeof req?.query?.inc === 'string') {
      inc = req.query.inc.split(',') as Array<
        keyof (typeof randomJokesJson)[0]
      >;
    }
    const randomJokesArray = query
      ? structuredClone(randomJokesJson).filter((joke) =>
          joke.content?.toLowerCase().includes(query),
        )
      : structuredClone(randomJokesJson);
    const paginatedJokes = getPaginatedPayload(randomJokesArray, page, limit);
    const filterdJokes = inc
      ? filterObjectKeys(inc, paginatedJokes.data)
      : paginatedJokes.data;
    return { ...paginatedJokes, data: filterdJokes };
  }

  getARandomJoke() {
    return structuredClone(randomJokesJson)[
      Math.floor(Math.random() * randomJokesJson.length)
    ];
  }

  getJokeById(jokeId: string) {
    const joke = structuredClone(randomJokesJson).find(
      (joke) => +joke.id === +jokeId,
    );
    return joke;
  }
}
