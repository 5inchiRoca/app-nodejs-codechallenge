import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApiBody } from '@nestjs/swagger';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionTopics } from '@shared/enum/transaction-topics.enum';
import { TransactionValidationResult } from '@shared/interface/transaction-validation-result.event';
import { FindTransactionDto } from './dto/find-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':id')
  findTransaction(@Param('id') id: string): Promise<FindTransactionDto> {
    return this.transactionService.findTransaction(id);
  }

  @Post()
  @ApiBody({ type: CreateTransactionDto })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    await this.transactionService.validateTransferType(
      createTransactionDto.transferTypeId,
    );

    return this.transactionService.createTransaction(createTransactionDto);
  }

  @EventPattern(TransactionTopics.TRANSACTION_APPROVED)
  async handleTransactionApproved(
    @Payload() message: TransactionValidationResult,
  ) {
    await this.transactionService.handleTransactionApproved(message);
  }

  @EventPattern(TransactionTopics.TRANSACTION_REJECTED)
  async handleTransactionRejected(
    @Payload() message: TransactionValidationResult,
  ) {
    await this.transactionService.handleTransactionRejected(message);
  }
}
