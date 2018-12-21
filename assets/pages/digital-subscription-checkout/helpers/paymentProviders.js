// @flow

import {
  loadStripe,
  openDialogBox,
  setupStripeCheckout,
} from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import type { StripeAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { postRegularPaymentRequest } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { routes } from 'helpers/routes';
import { getOphanIds, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { getDigitalPrice } from 'helpers/subscriptions';
import { type State } from '../digitalSubscriptionCheckoutReducer';

function buildRegularPaymentRequest(state: State, token: string) {
  const { currencyId } = state.common.internationalisation;
  const {
    firstName,
    lastName,
    email,
    country,
    stateProvince,
    paymentFrequency,
  } = state.page.checkout;

  const product = {
    currency: currencyId,
    billingPeriod: paymentFrequency,
  };
  return {
    firstName,
    lastName,
    country: country || 'GB',
    state: stateProvince,
    email,
    product,
    paymentFields: { stripeToken: token },
    ophanIds: getOphanIds(),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    supportAbTests: getSupportAbTests(state.common.abParticipations, state.common.optimizeExperiments),
  };
}

function create(state: State, token: string) {

  const data = buildRegularPaymentRequest(state, token);

  postRegularPaymentRequest(
    routes.digitalSubscriptionCreate,
    data,
    state.common.abParticipations,
    state.page.csrf,
    () => {},
    () => {},
  ).then(pr => console.log(pr));
}

function showPaymentMethod(state: State) {
  const { currencyId, countryGroupId } = state.common.internationalisation;
  const { paymentMethod, isTestUser } = state.page.checkout;
  const price = getDigitalPrice(countryGroupId, state.page.checkout.paymentFrequency);
  switch (paymentMethod) {
    case 'Stripe':
      loadStripe()
        .then(() => setupStripeCheckout((authorisation: StripeAuthorisation) => create(state, authorisation.token), 'REGULAR', currencyId, isTestUser))
        .then(stripe => openDialogBox(stripe, price, state.page.checkout.email));
      break;
    case 'DirectDebit':
      console.log('Direct Debit');
      break;
    default:
      console.log(`Unknown payment method ${paymentMethod}`);
  }
}

export {
  showPaymentMethod,
};
