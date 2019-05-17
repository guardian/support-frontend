// @flow

// ----- Imports ----- //

import { type Dispatch } from 'redux';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import {
  buildRegularPaymentRequest,
  onPaymentAuthorised,
  showPaymentMethod,
} from 'pages/weekly-subscription-checkout/helpers/paymentProviders';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { validateWithDeliveryForm } from 'helpers/subscriptionsForms/formValidation';

// ----- Functions ----- //


function submitForm(dispatch: Dispatch<Action>, state: WithDeliveryCheckoutState) {
  if (validateWithDeliveryForm(dispatch, state)) {
    const testUser = state.page.checkout.isTestUser;

    const { price, currency } = { price: 99.99, currency: 'GBP' }; //TODO

    const onAuthorised = (pa: PaymentAuthorisation) =>
      onPaymentAuthorised(
        dispatch,
        buildRegularPaymentRequest(state, pa),
        state.page.csrf,
        state.common.abParticipations,
      );

    const { paymentMethod, email } = state.page.checkout;

    showPaymentMethod(dispatch, onAuthorised, testUser, price, currency, paymentMethod, email);
  }
}

// ----- Export ----- //

export {
  submitForm,
};
