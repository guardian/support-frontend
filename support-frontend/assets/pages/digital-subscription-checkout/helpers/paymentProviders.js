// @flow

import { loadStripe, openDialogBox, setupStripeCheckout } from 'helpers/paymentIntegrations/stripeCheckout';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import {
  type PaymentResult,
  postRegularPaymentRequest,
  regularPaymentFieldsFromAuthorisation,
  type RegularPaymentRequest,
} from 'helpers/paymentIntegrations/readerRevenueApis';
import { routes } from 'helpers/routes';
import { getOphanIds, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { type Dispatch } from 'redux';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import { getQueryParameter } from 'helpers/url';
import { finalPrice as dpFinalPrice } from 'helpers/productPrice/digitalProductPrices';
import { getBillingAddressFields, type State } from 'helpers/subscriptionsForms/formFields';
import { type Action, setFormSubmitted, setStage, setSubmissionError } from 'helpers/subscriptionsForms/formActions';
import { DirectDebit, PayPal, Stripe } from 'helpers/paymentMethods';

function buildRegularPaymentRequest(state: State, paymentAuthorisation: PaymentAuthorisation): RegularPaymentRequest {
  const { currencyId } = state.common.internationalisation;
  const {
    firstName,
    lastName,
    email,
    billingPeriod,
    telephone,
  } = state.page.checkout;

  const addressFields = getBillingAddressFields(state);

  const product = {
    currency: currencyId,
    billingPeriod,
  };

  const paymentFields = regularPaymentFieldsFromAuthorisation(paymentAuthorisation);

  return {
    firstName,
    lastName,
    billingAddress: addressFields,
    deliveryAddress: null,
    email,
    telephoneNumber: telephone,
    product,
    firstDeliveryDate: null,
    paymentFields,
    ophanIds: getOphanIds(),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    supportAbTests: getSupportAbTests(state.common.abParticipations, state.common.optimizeExperiments),
    promoCode: getQueryParameter('promoCode'),
  };
}

function onPaymentAuthorised(paymentAuthorisation: PaymentAuthorisation, dispatch: Dispatch<Action>, state: State) {
  const data = buildRegularPaymentRequest(state, paymentAuthorisation);

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
  const { currencyId, countryId } = state.common.internationalisation;
  const { isTestUser } = state.page.checkout;

  const { price } = dpFinalPrice(
    state.page.checkout.productPrices,
    state.page.checkout.billingPeriod,
    countryId,
  );

  const onAuthorised = (pa: PaymentAuthorisation) => onPaymentAuthorised(pa, dispatch, state);

  loadStripe()
    .then(() => setupStripeCheckout(onAuthorised, 'REGULAR', currencyId, isTestUser))
    .then(stripe => openDialogBox(stripe, price, state.page.checkout.email));
}

function showPaymentMethod(
  dispatch: Dispatch<Action | Action>,
  state: State,
): void {
  const { paymentMethod } = state.page.checkout;

  switch (paymentMethod) {
    case Stripe:
      showStripe(dispatch, state);
      break;
    case DirectDebit:
      dispatch(openDirectDebitPopUp());
      break;
    case PayPal:
      // PayPal is more complicated and is handled differently, see PayPalExpressButton component
      break;
    case null:
    case undefined:
      console.log('Undefined payment method');
      break;
    default:
      console.log(`Unknown payment method ${paymentMethod}`);
  }
}

export { showPaymentMethod, onPaymentAuthorised };
