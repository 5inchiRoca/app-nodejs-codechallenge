import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { randomUUID } from 'crypto';
import { KafkaService } from '@shared/kafka/kafka.service';
import { TransactionStatusId } from '@shared/enum/transaction-status-id.enum';
import { TransactionValidationResult } from '@shared/interface/transaction-validation-result.event';
import { FindTransactionDto } from './dto/find-transaction.dto';
import { TransactionTopics } from '@shared/enum/transaction-topics.enum';

@Injectable()
export class TransactionClient {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly kafkaService: KafkaService,
  ) {}

  async onModuleInit() {
    this.kafkaService.subscribeToResponseOf(
      TransactionTopics.TRANSACTION_APPROVED,
    );
    this.kafkaService.subscribeToResponseOf(
      TransactionTopics.TRANSACTION_REJECTED,
    );

    await this.kafkaService.connect();
  }

  async findTransaction(
    transactionExternalId: string,
  ): Promise<FindTransactionDto> {
    const transaction = await this.prismaService.transaction.findUnique({
      where: {
        transactionExternalId,
      },
      include: {
        transactionType: true,
        transactionStatus: true,
      },
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.transactionType.name,
      },
      transactionStatus: {
        name: transaction.transactionStatus.name,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }

  async validateTransferType(
    transferTypeId: CreateTransactionDto['transferTypeId'],
  ) {
    const transactionType = await this.prismaService.transactionType.findUnique(
      {
        where: { id: transferTypeId },
      },
    );

    if (!transactionType) {
      throw new BadRequestException('Invalid transfer type');
    }
  }

  generateTransactionExternalId() {
    return randomUUID();
  }

  async createTransaction(
    transactionExternalId: string,
    createTransactionDto: CreateTransactionDto,
  ) {
    return this.prismaService.transaction.create({
      data: {
        transactionExternalId,
        accountExternalIdDebit: createTransactionDto.accountExternalIdDebit,
        accountExternalIdCredit: createTransactionDto.accountExternalIdCredit,
        transactionTypeId: createTransactionDto.transferTypeId,
        transactionStatusId: TransactionStatusId.PENDING,
        value: createTransactionDto.value,
      },
    });
  }

  emitTransactionCreated(
    transactionExternalId: string,
    transactionValue: CreateTransactionDto['value'],
  ) {
    this.kafkaService.handleTransactionCreated(
      transactionExternalId,
      transactionValue,
    );

    return {
      transactionExternalId,
      message: 'Transaction created successfully',
    };
  }

  async updateTransactionStatus(
    transactionExternalId: string,
    transactionStatusId: number,
  ) {
    return this.prismaService.transaction.update({
      where: {
        transactionExternalId,
      },
      data: {
        transactionStatusId,
      },
    });
  }

  async handleTransactionApproved({ key, value }: TransactionValidationResult) {
    await this.updateTransactionStatus(key, value.transferStatusId);
  }

  async handleTransactionRejected({ key, value }: TransactionValidationResult) {
    await this.updateTransactionStatus(key, value.transferStatusId);
  }
}
