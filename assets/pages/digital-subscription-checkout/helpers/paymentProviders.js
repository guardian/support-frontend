// @flow

import {
  loadStripe,
  openDialogBox,
  setupStripeCheckout,
} from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import type { StripeAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { PaymentResult, postRegularPaymentRequest } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
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
    billingPeriod,
  } = state.page.checkout;

  const product = {
    currency: currencyId,
    billingPeriod,
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

function create(
  state: State,
  token: string,
  beginCreateHandler: () => void,
  resultHandler: (PaymentResult) => void,
): Promise<PaymentResult> {
  const data = buildRegularPaymentRequest(state, token);
  beginCreateHandler();
  return postRegularPaymentRequest(
    routes.digitalSubscriptionCreate,
    data,
    state.common.abParticipations,
    state.page.csrf,
    () => {},
    () => {},
  ).then(pr => resultHandler(pr));
}

function showPaymentMethod(state: State, beginCreateHandler: () => void, resultHandler: (PaymentResult) => void) {
  const { currencyId, countryGroupId } = state.common.internationalisation;
  const { paymentMethod, isTestUser } = state.page.checkout;
  const price = getDigitalPrice(countryGroupId, state.page.checkout.billingPeriod);
  switch (paymentMethod) {
    case 'Stripe':
      loadStripe()
        .then(() => setupStripeCheckout((authorisation: StripeAuthorisation) => create(state, authorisation.token, beginCreateHandler, resultHandler), 'REGULAR', currencyId, isTestUser))
        .then(stripe => openDialogBox(stripe, price.value, state.page.checkout.email));
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
