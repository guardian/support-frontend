// @flow

import {
  loadStripe,
  openDialogBox,
  setupStripeCheckout,
} from 'helpers/paymentIntegrations/stripeCheckout';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import {
  type PaymentResult,
  type RegularPaymentRequest,
  postRegularPaymentRequest, regularPaymentFieldsFromAuthorisation,
} from 'helpers/paymentIntegrations/readerRevenueApis';
import { type Dispatch } from 'redux';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import { finalPrice as paperFinalPrice } from 'helpers/productPrice/paperProductPrices';
import { routes } from 'helpers/routes';
import { getQueryParameter } from 'helpers/url';
import { getOphanIds, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { Monthly } from 'helpers/billingPeriods';

import { type State, setSubmissionError, setFormSubmitted, type Action, setStage } from '../paperSubscriptionCheckoutReducer';

function buildRegularPaymentRequest(state: State, paymentAuthorisation: PaymentAuthorisation): RegularPaymentRequest {
  const { currencyId, countryId } = state.common.internationalisation;
  const {
    firstName,
    lastName,
    billingAddressLine1,
    billingAddressLine2,
    billingTownCity,
    billingPostcode,
    email,
    telephone,
  } = state.page.checkout;

  const product = {
    currency: currencyId,
    billingPeriod: Monthly,
    fulfilmentOptions: state.page.checkout.fulfilmentOption,
    productOptions: state.page.checkout.productOption,
  };

  const paymentFields = regularPaymentFieldsFromAuthorisation(paymentAuthorisation);

  return {
    firstName,
    lastName,
    billingAddress: {
      lineOne: billingAddressLine1,
      lineTwo: billingAddressLine2,
      city: billingTownCity,
      state: null,
      postCode: billingPostcode,
      country: countryId,
    },
    deliveryAddress: {
      lineOne: billingAddressLine1,
      lineTwo: billingAddressLine2,
      city: billingTownCity,
      state: null,
      postCode: billingPostcode,
      country: countryId,
    },
    email,
    telephoneNumber: telephone,
    product,
    firstDeliveryDate: state.page.checkout.startDate,
    paymentFields,
    ophanIds: getOphanIds(),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    supportAbTests: getSupportAbTests(state.common.abParticipations, state.common.optimizeExperiments),
    promoCode: getQueryParameter('promoCode'),
  };
}

function onPaymentAuthorised(paymentAuthorisation: PaymentAuthorisation, dispatch: Dispatch<Action>, state: State) {
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

  const data = buildRegularPaymentRequest(state, paymentAuthorisation);

  postRegularPaymentRequest(
    routes.digitalSubscriptionCreate,
    data,
    state.common.abParticipations,
    state.page.csrf,
    () => {},
    () => {},
  ).then(handleSubscribeResult);
  // Promise.resolve({ paymentStatus: 'success' }).then(handleSubscribeResult);
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

  const onAuthorised = (pa: PaymentAuthorisation) => onPaymentAuthorised(pa, dispatch, state);

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
