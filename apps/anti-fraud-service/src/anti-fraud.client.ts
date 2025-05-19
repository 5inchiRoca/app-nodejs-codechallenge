import { Injectable } from '@nestjs/common';
import { KafkaService } from '@shared/kafka/kafka.service';
import { TransactionValidationResult } from '@shared/interface/transaction-validation-result.event';
import { TransactionTopics } from '@shared/enum/transaction-topics.enum';

@Injectable()
export class AntiFraudClient {
  transactionApproved = 'Transaction approved';
  transactionRejected = 'Transaction rejected';

  constructor(private readonly kafkaService: KafkaService) {}

  async onModuleInit() {
    this.kafkaService.subscribeToResponseOf(
      TransactionTopics.TRANSACTION_CREATED,
    );

    await this.kafkaService.connect();
  }

  emitTransactionApproved(
    transactionExternalId: TransactionValidationResult['key'],
  ) {
    const message = this.transactionApproved;

    this.kafkaService.handleTransactionApproved(transactionExternalId, message);

    return { message };
  }

  emitTransactionRejected(
    transactionExternalId: TransactionValidationResult['key'],
  ) {
    const message = this.transactionRejected;

    this.kafkaService.handleTransactionRejected(transactionExternalId, message);

    return { message };
  }
}
