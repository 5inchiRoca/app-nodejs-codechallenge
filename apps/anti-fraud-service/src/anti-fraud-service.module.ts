import { Module } from '@nestjs/common';
import { AntiFraudServiceController } from './anti-fraud-service.controller';
import { AntiFraudServiceService } from './anti-fraud-service.service';
import { AntiFraudClient } from './anti-fraud.client';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule.register({
      clientId: 'anti-fraud',
      groupId: 'anti-fraud-consumer',
    }),
  ],
  controllers: [AntiFraudServiceController],
  providers: [AntiFraudServiceService, AntiFraudClient],
})
export class AntiFraudServiceModule {}
