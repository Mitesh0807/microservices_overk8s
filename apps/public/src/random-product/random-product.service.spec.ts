import { Test, TestingModule } from '@nestjs/testing';
import { RandomProductService } from './random-product.service';

describe('RandomProductService', () => {
  let service: RandomProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RandomProductService],
    }).compile();

    service = module.get<RandomProductService>(RandomProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
