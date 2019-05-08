// @flow

import { loadStripe, openDialogBox, setupStripeCheckout } from 'helpers/paymentIntegrations/stripeCheckout';
import { type IsoCountry } from 'helpers/internationalisation/country';
import {
  type PaymentAuthorisation,
  type PaymentResult,
  postRegularPaymentRequest,
  type RegularPaymentRequest,
} from 'helpers/paymentIntegrations/readerRevenueApis';
import { type Dispatch } from 'redux';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import { routes } from 'helpers/routes';
import { type Csrf } from 'helpers/csrf/csrfReducer';
import type { Participations } from 'helpers/abTests/abtest';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { type Option } from 'helpers/types/option';

import {
  type Action,
  setFormSubmitted,
  setStage,
  setSubmissionError,
  type State,
} from '../pages/paper-subscription-checkout/paperSubscriptionCheckoutReducer';
import { DirectDebit, Stripe } from 'helpers/paymentMethods';
import type {IsoCurrency} from "./internationalisation/currency";

function onPaymentAuthorised(dispatch: Dispatch<Action>, data: RegularPaymentRequest, csrf: Csrf, abParticipations: Participations) {
  const handleSubscribeResult = (result: PaymentResult) => {
    if (result.paymentStatus === 'success') {
      if (result.subscriptionCreationPending) {
        dispatch(setStage('thankyou-pending'));
      } else {
        dispatch(setStage('thankyou'));
      }
    } else { dispatch(setSubmissionError(result.error)); }
  };

  dispatch(setFormSubmitted(true));

  postRegularPaymentRequest(
    routes.subscriptionCreate,
    data,
    abParticipations,
    csrf,
    () => {},
    () => {},
  ).then(handleSubscribeResult);
}

function showStripe(
  dispatch: Dispatch<Action>,
  onAuthorised: (pa: PaymentAuthorisation) => void,
  isTestUser: boolean,
  price: number,
  currency: IsoCurrency,
  email: string,
) {
  loadStripe()
    .then(() => setupStripeCheckout(onAuthorised, 'REGULAR', currency, isTestUser))
    .then(stripe => openDialogBox(stripe, price, email));
}

function showPaymentMethod(
  dispatch: Dispatch<Action>,
  onAuthorised: (pa: PaymentAuthorisation) => void,
  isTestUser: boolean,
  price: number,
  currency: IsoCurrency,
  paymentMethod: Option<PaymentMethod>,
  email: string,
): void {

  switch (paymentMethod) {
    case Stripe:
      showStripe(dispatch, onAuthorised, isTestUser, price, currency, email);
      break;
    case DirectDebit:
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
