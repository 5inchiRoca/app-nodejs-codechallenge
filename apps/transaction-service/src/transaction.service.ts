import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionClient } from './transaction.client';
import { TransactionValidationResult } from '@shared/interface/transaction-validation-result.event';
import { FindTransactionDto } from './dto/find-transaction.dto';

@Injectable()
export class TransactionService {
  transactionResultMessage = 'Transaction updated successfully';

  constructor(private readonly transactionClient: TransactionClient) {}

  async findTransaction(id: string): Promise<FindTransactionDto> {
    return await this.transactionClient.findTransaction(id);
  }

  async validateTransferType(
    transferTypeId: CreateTransactionDto['transferTypeId'],
  ) {
    await this.transactionClient.validateTransferType(transferTypeId);
  }

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const transactionExternalId =
      this.transactionClient.generateTransactionExternalId();

    await this.transactionClient.createTransaction(
      transactionExternalId,
      createTransactionDto,
    );

    return this.transactionClient.emitTransactionCreated(
      transactionExternalId,
      createTransactionDto.value,
    );
  }

  async handleTransactionApproved(message: TransactionValidationResult) {
    await this.transactionClient.handleTransactionApproved(message);

    return {
      message: this.transactionResultMessage,
    };
  }

  async handleTransactionRejected(message: TransactionValidationResult) {
    await this.transactionClient.handleTransactionRejected(message);

    return {
      message: this.transactionResultMessage,
    };
  }
}
