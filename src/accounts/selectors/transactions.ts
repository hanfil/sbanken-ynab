import { createSelector } from 'reselect';
import { DateTime } from 'luxon';
import { RootState } from '../../store/root-reducer';
import { TransactionSource, NormalizedTransaction, MatchedTransaction } from '../types';
import { convertAmountFromYnab } from '../utils';
import accountsSelector from './accounts';

// TODO: This needs to be cleaned up and commented a bit

const transactionsSelector = createSelector(
  (state: RootState) => state.sbanken.transactions,
  (state: RootState) => state.ynab.transactions,
  accountsSelector,
  (state: RootState) => DateTime.fromISO(state.transactions.startDate),
  (sbankenTransactions, ynabTransactions, accounts, startDate) => {
    let normalizedTransactions = sbankenTransactions.map((sbankenTransaction) => ({
      amount: sbankenTransaction.amount,
      connectedAccountId: accounts.find(
        (account) => account.sbankenId === sbankenTransaction.accountId)
        .compoundId,
      date: DateTime.fromISO(sbankenTransaction.date),
      description: sbankenTransaction.text,
      id: sbankenTransaction.id,
      payee: sbankenTransaction.text,
      source: TransactionSource.Sbanken,
    } as NormalizedTransaction));

    const matchedTransactions = [] as MatchedTransaction[];
    const matchedTransactionIds = [];

    const unmatchedTransactions = ynabTransactions.map((ynabTransaction) => {
      const transaction = {
        amount: convertAmountFromYnab(ynabTransaction.amount),
        connectedAccountId: accounts.find(
          (account) => account.ynabId === ynabTransaction.account_id)
          .compoundId,
        date: DateTime.fromISO(ynabTransaction.date),
        description: ynabTransaction.memo,
        id: ynabTransaction.id,
        payee: ynabTransaction.payee_name,
        source: TransactionSource.Ynab,
      } as NormalizedTransaction;

      const matchedTransaction = normalizedTransactions.find((sbankenTransaction) => {
        return transaction.amount === sbankenTransaction.amount &&
          transaction.date.equals(sbankenTransaction.date);
      });

      if (matchedTransaction) {
        matchedTransactions.push({
          sbankenTransaction: matchedTransaction,
          ynabTransaction: transaction,
        });
        matchedTransactionIds.push(matchedTransaction.id);
        normalizedTransactions = normalizedTransactions
          .filter((sbankenTransaction) => sbankenTransaction !== matchedTransaction);

        return null;
      }

      return transaction;
    }).filter(Boolean);

    // TODO: Expose matched transactions

    return normalizedTransactions
      .filter((transaction) => !matchedTransactionIds.includes(transaction.id))
      .concat(unmatchedTransactions)
      .filter((transaction) => transaction.date >= startDate);
  }
);

export default transactionsSelector;
