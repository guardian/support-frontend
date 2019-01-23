// @flow

import {
  loadStripe,
  openDialogBox,
  setupStripeCheckout,
} from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import { type IsoCountry } from 'helpers/internationalisation/country';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import {
  type PaymentResult,
  postRegularPaymentRequest, regularPaymentFieldsFromAuthorisation,
} from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { routes } from 'helpers/routes';
import { getOphanIds, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { getDigitalPrice } from 'helpers/subscriptions';
import { type Dispatch } from 'redux';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import { type State, setSubmissionError, setFormSubmitted, type Action, setStage } from '../digitalSubscriptionCheckoutReducer';

function buildRegularPaymentRequest(state: State, paymentAuthorisation: PaymentAuthorisation) {
  const { currencyId } = state.common.internationalisation;
  const {
    firstName,
    lastName,
    email,
    country,
    stateProvince,
    billingPeriod,
  } = state.page.checkout;

  const product = {
    currency: currencyId,
    billingPeriod,
  };

  const paymentFields = regularPaymentFieldsFromAuthorisation(paymentAuthorisation);

  return {
    firstName,
    lastName,
    country: country || 'GB',
    state: stateProvince,
    email,
    product,
    paymentFields,
    ophanIds: getOphanIds(),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    supportAbTests: getSupportAbTests(state.common.abParticipations, state.common.optimizeExperiments),
  };
}

function onPaymentAuthorised(paymentAuthorisation: PaymentAuthorisation, dispatch: Dispatch<Action>, state: State) {
  const data = buildRegularPaymentRequest(state, paymentAuthorisation);

  const handleSubscribeResult = (result: PaymentResult) => {
    switch (result.paymentStatus) {
      case 'success': dispatch(setStage('thankyou'));
        break;
      default: dispatch(setSubmissionError(result.error));
    }
  };

  dispatch(setFormSubmitted(true));
  postRegularPaymentRequest(
    routes.digitalSubscriptionCreate,
    data,
    state.common.abParticipations,
    state.page.csrf,
    () => {},
    () => {},
  ).then(handleSubscribeResult);
}

function showStripe(
  dispatch: Dispatch<Action>,
  state: State,
) {
  const { currencyId, countryGroupId } = state.common.internationalisation;
  const { isTestUser } = state.page.checkout;
  const price = getDigitalPrice(countryGroupId, state.page.checkout.billingPeriod);
  const onAuthorised = (pa: PaymentAuthorisation) => onPaymentAuthorised(pa, dispatch, state);

  loadStripe()
    .then(() => setupStripeCheckout(onAuthorised, 'REGULAR', currencyId, isTestUser))
    .then(stripe => openDialogBox(stripe, price.value, state.page.checkout.email));
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
    default:
      console.log(`Unknown payment method ${paymentMethod}`);
  }
}

const countrySupportsDirectDebit = (country: ?IsoCountry) => country && country === 'GB';

export { showPaymentMethod, onPaymentAuthorised, countrySupportsDirectDebit };
