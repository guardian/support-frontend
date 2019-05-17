// @flow

// ----- Imports ----- //

import { type Dispatch } from 'redux';
import type {
  PaymentResult,
  RegularPaymentRequest,
} from 'helpers/paymentIntegrations/readerRevenueApis';
import {
  type PaymentAuthorisation,
  postRegularPaymentRequest,
  regularPaymentFieldsFromAuthorisation,
} from 'helpers/paymentIntegrations/readerRevenueApis';

import {
  type Action,
  setFormSubmitted,
  setStage,
  setSubmissionError,
} from 'helpers/subscriptionsForms/formActions';
import type {
  AnyCheckoutState,
  WithDeliveryCheckoutState,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
  getBillingAddressFields,
  getDeliveryAddressFields,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { finalPrice } from 'helpers/productPrice/productPrices';
import { Monthly } from 'helpers/billingPeriods';
import { getOphanIds, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { getQueryParameter } from 'helpers/url';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { Participations } from 'helpers/abTests/abtest';
import { routes } from 'helpers/routes';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit, Stripe } from 'helpers/paymentMethods';
import { showStripe } from 'helpers/paymentProviders';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';

// ----- Functions ----- //

function onPaymentAuthorised(
  dispatch: Dispatch<Action>,
  data: RegularPaymentRequest,
  csrf: Csrf,
  abParticipations: Participations,
) {
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

function getAddresses(state: AnyCheckoutState) {
  if (state.page.hasDeliveryAddress) {
    const deliveryAddressFields =
      getDeliveryAddressFields(((state: any): WithDeliveryCheckoutState));
    return {
      deliveryAddress: deliveryAddressFields,
      billingAddress: state.page.checkout.billingAddressIsSame ?
        deliveryAddressFields :
        getBillingAddressFields(state),
    };
  }
  return {
    billingAddress: getBillingAddressFields(state),
    deliveryAddress: null,
  };
}

function buildRegularPaymentRequest(
  state: AnyCheckoutState,
  paymentAuthorisation: PaymentAuthorisation,
): RegularPaymentRequest {
  const { currencyId } = state.common.internationalisation;
  const {
    firstName,
    lastName,
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
    ...getAddresses(state),
    email,
    telephoneNumber: telephone,
    product,
    firstDeliveryDate: state.page.checkout.startDate,
    paymentFields,
    ophanIds: getOphanIds(),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    supportAbTests: getSupportAbTests(
      state.common.abParticipations,
      state.common.optimizeExperiments,
    ),
    promoCode: getQueryParameter('promoCode'),
  };
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
      showStripe(onAuthorised, isTestUser, price, currency, email);
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

function submitForm(
  dispatch: Dispatch<Action>,
  state: WithDeliveryCheckoutState,
  validationFunction: (Dispatch<Action>, AnyCheckoutState) => boolean,
) {
  if (validationFunction(dispatch, state)) {
    const testUser = state.page.checkout.isTestUser;

    const { price, currency } = finalPrice(
      state.page.checkout.productPrices,
      state.page.billingAddress.fields.country,
      state.page.checkout.fulfilmentOption,
      state.page.checkout.productOption,
    );

    const onAuthorised = (paymentAuthorisation: PaymentAuthorisation) =>
      onPaymentAuthorised(
        dispatch,
        buildRegularPaymentRequest(state, paymentAuthorisation),
        state.page.csrf,
        state.common.abParticipations,
      );

    const { paymentMethod, email } = state.page.checkout;
    showPaymentMethod(
      dispatch, onAuthorised, testUser, price, currency,
      paymentMethod, email,
    );
  }
}

// ----- Export ----- //

export {
  submitForm,
};
