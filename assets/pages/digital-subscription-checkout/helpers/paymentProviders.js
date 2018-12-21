// @flow

import { openDialogBox, setupStripeCheckout } from 'helpers/paymentIntegrations/stripeCheckout';
import { postRegularPaymentRequest } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { routes } from 'helpers/routes';
import { getOphanIds, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { getFormFields, type State } from '../digitalSubscriptionCheckoutReducer';

function create(state: State, token: string) {
  // TODO: if we could harmonize the fields between this file and readerRevenueApis.js we could simplify this mapping
  const formFields = getFormFields(state);
  const product = {
    currency: 'GBP',
    billingPeriod: 'Monthly',
  };
  const data = {
    firstName: formFields.firstName,
    lastName: formFields.lastName,
    country: formFields.country || 'GB',
    state: formFields.stateProvince,
    email: state.page.checkout.email,
    product,
    paymentFields: { stripeToken: token },
    ophanIds: getOphanIds(),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    supportAbTests: getSupportAbTests(state.common.abParticipations, state.common.optimizeExperiments),
  };

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
  setupStripeCheckout((token: string) => create(state, token), null, 'GBP', false)
    .then(() => openDialogBox(10, 'test@test.com'));
}

export {
  showPaymentMethod,
};
