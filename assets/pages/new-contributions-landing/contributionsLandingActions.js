// @flow

// ----- Imports ----- //

import { type PaymentMethod } from 'helpers/checkouts';
import { type Amount, type Contrib } from 'helpers/contributions';

export type Action =
  | { type: 'UPDATE_CONTRIBUTION_TYPE', contributionType: Contrib }
  | { type: 'UPDATE_PAYMENT_METHOD', paymentMethod: PaymentMethod }
  | { type: 'UPDATE_FIRST_NAME', firstName: string }
  | { type: 'UPDATE_LAST_NAME', lastName: string }
  | { type: 'UPDATE_EMAIL', email: string }
  | { type: 'SELECT_AMOUNT', amount: Amount | 'other', contributionType: Contrib }
  | { type: 'UPDATE_OTHER_AMOUNT', otherAmount: string }
  | { type: 'PAYMENT_FAILURE', error: string }
  | { type: 'PAYMENT_WAITING', isWaiting: boolean }
  | { type: 'PAYMENT_SUCCESS' };

const updateContributionType = (contributionType: Contrib): Action =>
  ({ type: 'UPDATE_CONTRIBUTION_TYPE', contributionType });

const updatePaymentMethod = (paymentMethod: PaymentMethod): Action =>
  ({ type: 'UPDATE_PAYMENT_METHOD', paymentMethod });

const updateFirstName = (firstName: string): Action => ({ type: 'UPDATE_FIRST_NAME', firstName });

const updateLastName = (lastName: string): Action => ({ type: 'UPDATE_LAST_NAME', lastName });

const updateEmail = (email: string): Action => ({ type: 'UPDATE_EMAIL', email });

const selectAmount = (amount: Amount | 'other', contributionType: Contrib): Action =>
  ({
    type: 'SELECT_AMOUNT', amount, contributionType,
  });

const updateOtherAmount = (otherAmount: string): Action => ({ type: 'UPDATE_OTHER_AMOUNT', otherAmount });

const paymentSuccess = (): Action => ({ type: 'PAYMENT_SUCCESS' });

const paymentWaiting = (isWaiting: boolean): Action => ({ type: 'PAYMENT_WAITING', isWaiting });

const paymentFailure = (error: string): Action => ({ type: 'PAYMENT_FAILURE', error });

export {
  updateContributionType,
  updatePaymentMethod,
  updateFirstName,
  updateLastName,
  updateEmail,
  selectAmount,
  updateOtherAmount,
  paymentFailure,
  paymentWaiting,
  paymentSuccess,
};
