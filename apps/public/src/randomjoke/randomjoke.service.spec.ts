import { Test, TestingModule } from '@nestjs/testing';
import { RandomjokeService } from './randomjoke.service';

describe('RandomjokeService', () => {
  let service: RandomjokeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RandomjokeService],
    }).compile();

    service = module.get<RandomjokeService>(RandomjokeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
