// @flow

// ----- Imports ----- //

import { type PaymentMethod } from 'helpers/checkouts';
import { type Amount, type Contrib } from 'helpers/contributions';

export type Action =
  | { type: 'UPDATE_CONTRIBUTION_TYPE', contributionType: Contrib }
  | { type: 'UPDATE_PAYMENT_METHOD', paymentMethod: PaymentMethod }
  | { type: 'SELECT_AMOUNT', amount: Amount, contributionType: Contrib, index: number }
  | { type: 'SELECT_OTHER_AMOUNT', contributionType: Contrib, index: number }
  | { type: 'UPDATE_OTHER_AMOUNT', otherAmount: string }
  | { type: 'PAYMENT_FAILURE', error: string }
  | { type: 'PAYMENT_SUCCESS' };

const updateContributionType = (contributionType: Contrib): Action =>
  ({ type: 'UPDATE_CONTRIBUTION_TYPE', contributionType });

const updatePaymentMethod = (paymentMethod: PaymentMethod): Action =>
  ({ type: 'UPDATE_PAYMENT_METHOD', paymentMethod });

const selectAmount = (amount: Amount, contributionType: Contrib, index: number): Action =>
  ({
    type: 'SELECT_AMOUNT', amount, contributionType, index,
  });

const selectOtherAmount = (contributionType: Contrib, index: number): Action =>
  ({ type: 'SELECT_OTHER_AMOUNT', contributionType, index });

const updateOtherAmount = (otherAmount: string): Action => ({ type: 'UPDATE_OTHER_AMOUNT', otherAmount });

const paymentSuccess = (): Action => ({ type: 'PAYMENT_SUCCESS' });

const paymentFailure = (error: string): Action => ({ type: 'PAYMENT_FAILURE', error });

export {
  updateContributionType,
  updatePaymentMethod,
  selectAmount,
  selectOtherAmount,
  updateOtherAmount,
  paymentFailure,
  paymentSuccess,
};
