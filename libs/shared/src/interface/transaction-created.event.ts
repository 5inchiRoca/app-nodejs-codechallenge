import { TransactionBaseEvent } from './transaction-base.event';

export interface TransactionCreatedEvent extends TransactionBaseEvent {
  value: {
    value: number;
  };
}
