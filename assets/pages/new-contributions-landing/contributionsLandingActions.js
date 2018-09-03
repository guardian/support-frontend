// @flow

// ----- Imports ----- //

import { type PaymentMethod } from 'helpers/checkouts';
import { type Contrib } from 'helpers/contributions';

export type Action =
  | { type: 'UPDATE_CONTRIBUTION_TYPE', contributionType: Contrib }
  | { type: 'UPDATE_PAYMENT_METHOD', paymentMethod: PaymentMethod }
  | { type: 'SELECT_AMOUNT', amount: Amount }
  | { type: 'SELECT_OTHER_AMOUNT' };
const updateContributionType = (contributionType: Contrib): Action =>
  ({ type: 'UPDATE_CONTRIBUTION_TYPE', contributionType });

const updatePaymentMethod = (paymentMethod: PaymentMethod): Action =>
  ({ type: 'UPDATE_CONTRIBUTION_TYPE', paymentMethod });

const selectAmount = (amount: string): Action => ({ type: 'SELECT_AMOUNT', amount });

const selectOtherAmount = (): Action => ({ type: 'SELECT_OTHER_AMOUNT' });

export {
  updateContributionType,
  updatePaymentMethod,
  selectAmount,
  selectOtherAmount,
};
