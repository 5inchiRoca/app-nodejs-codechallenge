import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudServiceController } from './anti-fraud-service.controller';
import { AntiFraudServiceService } from './anti-fraud-service.service';

describe('AntiFraudServiceController', () => {
  let antiFraudServiceController: AntiFraudServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudServiceController],
      providers: [AntiFraudServiceService],
    }).compile();

    antiFraudServiceController = app.get<AntiFraudServiceController>(
      AntiFraudServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(antiFraudServiceController.getHello()).toBe('Hello World!');
    });
  });
});
