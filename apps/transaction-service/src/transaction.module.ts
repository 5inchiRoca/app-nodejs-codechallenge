import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaService } from './prisma/prisma.service';
import { KafkaService } from '@shared/kafka/kafka.service';
import { SharedModule } from '@shared/shared.module';
import { TransactionClient } from './transaction.client';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule.register({
      clientId: 'transaction',
      groupId: 'transaction-consumer',
    }),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    PrismaService,
    KafkaService,
    TransactionClient,
  ],
})
export class TransactionModule {}
