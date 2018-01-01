// @flow

import {
  loadStripe,
  openDialogBox,
  setupStripeCheckout,
} from 'helpers/paymentIntegrations/stripeCheckout';
import { type IsoCountry } from 'helpers/internationalisation/country';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import {
  type PaymentResult,
} from 'helpers/paymentIntegrations/readerRevenueApis';
import { type Dispatch } from 'redux';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import { finalPrice as paperFinalPrice } from 'helpers/productPrice/paperProductPrices';
import { type State, setSubmissionError, setFormSubmitted, type Action, setStage } from '../paperSubscriptionCheckoutReducer';

function onPaymentAuthorised(paymentAuthorisation: PaymentAuthorisation, dispatch: Dispatch<Action>) {
  const handleSubscribeResult = (result: PaymentResult) => {
    switch (result.paymentStatus) {
      case 'success':
        if (result.subscriptionCreationPending) {
          dispatch(setStage('thankyou-pending'));
        } else {
          dispatch(setStage('thankyou'));
        }
        break;
      default: dispatch(setSubmissionError(result.error));
    }
  };

  dispatch(setFormSubmitted(true));
  Promise.resolve({ paymentStatus: 'success' }).then(handleSubscribeResult);
}

function showStripe(
  dispatch: Dispatch<Action>,
  state: State,
) {
  const { isTestUser } = state.page.checkout;

  const { price, currency } = paperFinalPrice(
    state.page.checkout.productPrices,
    state.page.checkout.fulfilmentOption,
    state.page.checkout.productOption,
  );

  const onAuthorised = (pa: PaymentAuthorisation) => onPaymentAuthorised(pa, dispatch);

  loadStripe()
    .then(() => setupStripeCheckout(onAuthorised, 'REGULAR', currency, isTestUser))
    .then(stripe => openDialogBox(stripe, price, state.page.checkout.email));
}

function showPaymentMethod(
  dispatch: Dispatch<Action>,
  state: State,
): void {
  const { paymentMethod } = state.page.checkout;

  switch (paymentMethod) {
    case 'Stripe':
      showStripe(dispatch, state);
      break;
    case 'DirectDebit':
      dispatch(openDirectDebitPopUp());
      break;
    case null:
    case undefined:
      console.log('Undefined payment method');
      break;
    default:
      console.log(`Unknown payment method ${paymentMethod}`);
  }
}

const countrySupportsDirectDebit = (country: ?IsoCountry): boolean => country !== null && country === 'GB';

export { showPaymentMethod, onPaymentAuthorised, countrySupportsDirectDebit };
