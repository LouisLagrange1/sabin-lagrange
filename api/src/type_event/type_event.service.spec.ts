import { Test, TestingModule } from '@nestjs/testing';
import { TypeEventService } from './type_event.service';

describe('TypeEventService', () => {
  let service: TypeEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeEventService],
    }).compile();

    service = module.get<TypeEventService>(TypeEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
