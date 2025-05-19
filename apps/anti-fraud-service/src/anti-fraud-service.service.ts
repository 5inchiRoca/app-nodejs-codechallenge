import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionCreatedEvent } from '@shared/interface/transaction-created.event';
import { AntiFraudClient } from './anti-fraud.client';

@Injectable()
export class AntiFraudServiceService {
  maxTransactionValue: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly antifraudClient: AntiFraudClient,
  ) {
    this.maxTransactionValue = parseInt(
      this.configService.get('MAX_TRANSACTION_VALUE') as string,
    );
  }

  validateTransaction(message: TransactionCreatedEvent) {
    if (message.value.value > this.maxTransactionValue) {
      return this.antifraudClient.emitTransactionRejected(message.key);
    }

    return this.antifraudClient.emitTransactionApproved(message.key);
  }
}
