import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  // revision required for type and populated fields
  async findOne(
    filterQuery: FilterQuery<TDocument>,
    keysToRemove = [],
    notFoundExceptionMessage: string = null,
  ): Promise<TDocument> {
    let document: TDocument;
    if (keysToRemove && keysToRemove.length > 0) {
      // appending - and joing as string
      const removedKeys = keysToRemove.reduce(
        (acc, curr, index) => (index === 0 ? `-${curr}` : `${acc},-${curr}`),
        '',
      );
      document = await this.model
        .findOne(filterQuery)
        .select(removedKeys)
        .lean<TDocument>(true);
      return document;
    } else {
      document = await this.model.findOne(filterQuery).lean<TDocument>(true);
    }
    if (!document) {
      this.logger.warn(
        notFoundExceptionMessage
          ? notFoundExceptionMessage
          : 'Document was not found with filterQuery',
        filterQuery,
      );
      throw new NotFoundException(
        NotFoundException || 'Document was not found',
      );
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
  }
}
