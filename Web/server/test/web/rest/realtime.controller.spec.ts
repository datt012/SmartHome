import { Test, TestingModule } from '@nestjs/testing';
import { RealtimeController } from '../../../src/web/rest/realtime.controller';

describe('Realtime Controller', () => {
  let controller: RealtimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RealtimeController],
    }).compile();

    controller = module.get<RealtimeController>(RealtimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
