import { Test, TestingModule } from '@nestjs/testing';
import { RandomjokeController } from './randomjoke.controller';
import { RandomjokeService } from './randomjoke.service';

describe('RandomjokeController', () => {
  let controller: RandomjokeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RandomjokeController],
      providers: [RandomjokeService],
    }).compile();

    controller = module.get<RandomjokeController>(RandomjokeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
