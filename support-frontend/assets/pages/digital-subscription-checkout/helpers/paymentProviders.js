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
  type RegularPaymentRequest,
  postRegularPaymentRequest, regularPaymentFieldsFromAuthorisation,
} from 'helpers/paymentIntegrations/readerRevenueApis';
import { routes } from 'helpers/routes';
import { getOphanIds, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { type Dispatch } from 'redux';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import { getQueryParameter } from 'helpers/url';
import { finalPrice as dpFinalPrice } from 'helpers/productPrice/digitalProductPrices';
import { type State, setSubmissionError, setFormSubmitted, type Action, setStage } from '../digitalSubscriptionCheckoutReducer';

function buildRegularPaymentRequest(state: State, paymentAuthorisation: PaymentAuthorisation): RegularPaymentRequest {
  const { currencyId, countryId } = state.common.internationalisation;
  const {
    firstName,
    lastName,
    addressLine1,
    addressLine2,
    townCity,
    postcode,
    email,
    stateProvince,
    billingPeriod,
    telephone,
  } = state.page.checkout;

  const product = {
    currency: currencyId,
    billingPeriod,
  };

  const paymentFields = regularPaymentFieldsFromAuthorisation(paymentAuthorisation);

  return {
    firstName,
    lastName,
    billingAddress: {
      lineOne: addressLine1,
      lineTwo: addressLine2,
      city: townCity,
      state: stateProvince,
      postCode: postcode,
      country: countryId,
    },
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
