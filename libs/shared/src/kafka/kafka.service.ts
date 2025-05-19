import { ClientKafkaProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { TransactionCreatedEvent } from '@shared/interface/transaction-created.event';
import { CreateTransactionDto } from '../../../../apps/transaction-service/src/dto/create-transaction.dto';
import { TransactionTopics } from '@shared/enum/transaction-topics.enum';
import { TransactionStatusId } from '@shared/enum/transaction-status-id.enum';
import { TransactionValidationResult } from '@shared/interface/transaction-validation-result.event';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafkaProxy,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'setup-client',
      brokers: [this.configService.get('KAFKA_BROKER') as string],
    });

    const admin = kafka.admin();

    await admin.connect();

    await admin.createTopics({
      topics: [
        {
          topic: TransactionTopics.TRANSACTION_CREATED,
          numPartitions: 1,
          replicationFactor: 1,
        },
        {
          topic: TransactionTopics.TRANSACTION_APPROVED,
          numPartitions: 1,
          replicationFactor: 1,
        },
        {
          topic: TransactionTopics.TRANSACTION_REJECTED,
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    });

    await admin.disconnect();
  }

  subscribeToResponseOf(topic: string) {
    this.kafkaClient.subscribeToResponseOf(topic);
  }

  connect() {
    return this.kafkaClient.connect();
  }

  handleTransactionCreated(
    transactionExternalId: string,
    transactionValue: CreateTransactionDto['value'],
  ) {
    const data: TransactionCreatedEvent = {
      key: transactionExternalId,
      value: {
        value: transactionValue,
      },
    };

    this.kafkaClient.emit(TransactionTopics.TRANSACTION_CREATED, data);
  }

  getTransactionResultData(
    transactionExternalId: string,
    transferStatusId: TransactionStatusId,
    message: string,
  ): TransactionValidationResult {
    return {
      key: transactionExternalId,
      value: {
        transferStatusId,
        message,
      },
    };
  }

  handleTransactionApproved(transactionExternalId: string, message: string) {
    const data = this.getTransactionResultData(
      transactionExternalId,
      TransactionStatusId.APPROVED,
      message,
    );

    this.kafkaClient.emit(TransactionTopics.TRANSACTION_APPROVED, data);
  }

  handleTransactionRejected(transactionExternalId: string, message: string) {
    const data = this.getTransactionResultData(
      transactionExternalId,
      TransactionStatusId.REJECTED,
      message,
    );

    this.kafkaClient.emit(TransactionTopics.TRANSACTION_REJECTED, data);

    return { message };
  }
}
