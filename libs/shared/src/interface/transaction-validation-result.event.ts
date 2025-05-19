import { TransactionBaseEvent } from './transaction-base.event';

export interface TransactionValidationResult extends TransactionBaseEvent {
  value: {
    transferStatusId: number;
    message: string;
  };
}
