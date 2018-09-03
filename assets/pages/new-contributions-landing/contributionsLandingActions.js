// @flow

// ----- Imports ----- //

import { type PaymentMethod } from 'helpers/checkouts';
import { type Contrib } from 'helpers/contributions';

export type Action =
  | { type: 'UPDATE_CONTRIBUTION_TYPE', contributionType: Contrib }
  | { type: 'UPDATE_PAYMENT_METHOD', paymentMethod: PaymentMethod };

const updateContributionType = (contributionType: Contrib): Action => 
  ({ type: 'UPDATE_CONTRIBUTION_TYPE', contributionType });

const updatePaymentMethod = (paymentMethod: PaymentMethod): Action => 
  ({ type: 'UPDATE_CONTRIBUTION_TYPE', paymentMethod });

export {
  updateContributionType,
  updatePaymentMethod,
};
