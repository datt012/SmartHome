import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryController } from '../../../src/web/rest/cloudinary.controller';

describe('Cloudinary Controller', () => {
  let controller: CloudinaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudinaryController]
    }).compile();

    controller = module.get<CloudinaryController>(CloudinaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
