import { Test, TestingModule } from '@nestjs/testing';
import { RandomProductController } from './random-product.controller';
import { RandomProductService } from './random-product.service';

describe('RandomProductController', () => {
  let controller: RandomProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RandomProductController],
      providers: [RandomProductService],
    }).compile();

    controller = module.get<RandomProductController>(RandomProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
