import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  accountExternalIdDebit: string;

  @ApiProperty()
  @IsString()
  accountExternalIdCredit: string;

  @ApiProperty()
  @IsNumber()
  transferTypeId: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  value: number;
}
