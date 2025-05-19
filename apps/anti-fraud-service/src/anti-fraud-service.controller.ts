import { Controller } from '@nestjs/common';
import { AntiFraudServiceService } from './anti-fraud-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionCreatedEvent } from '@shared/interface/transaction-created.event';
import { TransactionTopics } from '@shared/enum/transaction-topics.enum';

@Controller()
export class AntiFraudServiceController {
  constructor(
    private readonly antiFraudServiceService: AntiFraudServiceService,
  ) {}

  @EventPattern(TransactionTopics.TRANSACTION_CREATED)
  handleTransactionCreated(@Payload() message: TransactionCreatedEvent) {
    return this.antiFraudServiceService.validateTransaction(message);
  }
}
