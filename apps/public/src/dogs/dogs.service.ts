import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import dogsJson from '../../json/dogs.json';
import { filterObjectKeys, getPaginatedPayload } from '@app/comman';
@Injectable()
export class DogsService {
  getDogs(req: Request) {
    const page = +(req?.query?.page || 1);
    const limit = +(req?.query?.limit || 10);
    let query: string;
    let inc: Array<keyof (typeof dogsJson)[0]>;
    if (typeof req?.query?.query === 'string' && req?.query?.query) {
      query = req.query.query.toLowerCase();
    }
    if (req?.query?.inc && typeof req?.query?.inc === 'string') {
      inc = req.query.inc.split(',') as Array<keyof (typeof dogsJson)[0]>;
    }
    const dogsArray = query
      ? dogsJson.filter((dog) => {
          return (
            dog.name?.toLowerCase().includes(query) ||
            dog.temperament?.includes(query)
          );
        })
      : dogsJson;
    const filterdDogs = filterObjectKeys(inc, dogsArray);
    return getPaginatedPayload(filterdDogs, page, limit);
  }

  getARandomDog() {
    return dogsJson[Math.floor(Math.random() * dogsJson.length)];
  }

  getDogById(dogId: string) {
    return dogsJson.find((dog) => +dog.id === +dogId);
  }
}
