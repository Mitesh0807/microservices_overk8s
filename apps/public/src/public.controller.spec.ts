import { Test, TestingModule } from '@nestjs/testing';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

describe('PublicController', () => {
  let publicController: PublicController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [PublicService],
    }).compile();

    publicController = app.get<PublicController>(PublicController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(publicController.getHello()).toBe('Hello World!');
    });
  });
});
