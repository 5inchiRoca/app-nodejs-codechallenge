import { IsString, IsNumber, Min, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

interface TransactionType {
  name: string;
}

interface TransactionStatus {
  name: string;
}

export class FindTransactionDto {
  @ApiProperty()
  @IsString()
  transactionExternalId: string;

  @ApiProperty()
  transactionType: TransactionType;

  @ApiProperty()
  transactionStatus: TransactionStatus;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  value: number;

  @ApiProperty()
  @IsDate()
  createdAt: Date;
}
