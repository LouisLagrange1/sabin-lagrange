import { Test, TestingModule } from '@nestjs/testing';
import { TypeEventController } from './type_event.controller';
import { TypeEventService } from './type_event.service';

describe('TypeEventController', () => {
  let controller: TypeEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeEventController],
      providers: [TypeEventService],
    }).compile();

    controller = module.get<TypeEventController>(TypeEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
