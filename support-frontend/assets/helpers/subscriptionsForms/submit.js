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
  CheckoutState,
  WithDeliveryCheckoutState,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
  getBillingAddressFields,
  getDeliveryAddressFields,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { Promotion } from 'helpers/productPrice/productPrices';
import {
  finalPrice,
  getAppliedPromo,
  getProductPrice,
} from 'helpers/productPrice/productPrices';
import { getOphanIds, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { routes } from 'helpers/routes';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit, PayPal, Stripe } from 'helpers/paymentMethods';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import {
  validateCheckoutForm,
  validateWithDeliveryForm,
} from 'helpers/subscriptionsForms/formValidation';
import {
  isPhysicalProduct,
  type SubscriptionProduct,
} from 'helpers/subscriptions';
import {
  loadStripe,
  openDialogBox,
  setupStripeCheckout,
} from 'helpers/paymentIntegrations/stripeCheckout';
import { isPostDeployUser } from 'helpers/user/user';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { Quarterly, SixWeekly } from 'helpers/billingPeriods';
import { trackCheckoutSubmitAttempt } from '../tracking/behaviour';

// ----- Functions ----- //

function getAddresses(state: AnyCheckoutState) {
  if (isPhysicalProduct(state.page.checkout.product)) {
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

const getOptions = (
  fulfilmentOptions: FulfilmentOptions,
  productOptions: ProductOptions,
) =>
  ({
    ...(fulfilmentOptions !== NoFulfilmentOptions ? { fulfilmentOptions } : {}),
    ...(productOptions !== NoProductOptions ? { productOptions } : {}),
  });

const getPromoCode = (billingPeriod: BillingPeriod, promotions: ?Promotion[]) => {
  const promotion = getAppliedPromo(promotions);
  if (!promotion || (promotion.introductoryPrice && billingPeriod === Quarterly)) {
    return null;
  }

  return promotion.promoCode;
};

function buildRegularPaymentRequest(
  state: AnyCheckoutState,
  paymentAuthorisation: PaymentAuthorisation,
): RegularPaymentRequest {
  const { currencyId } = state.common.internationalisation;
  const {
    title,
    firstName,
    lastName,
    email,
    telephone,
    titleGiftRecipient,
    firstNameGiftRecipient,
    lastNameGiftRecipient,
    emailGiftRecipient,
    billingPeriod,
    fulfilmentOption,
    productOption,
    productPrices,
  } = state.page.checkout;

  const price = getProductPrice(
    productPrices,
    state.page.billingAddress.fields.country,
    billingPeriod,
    fulfilmentOption,
    productOption,
  );

  const product = {
    currency: currencyId,
    billingPeriod: billingPeriod === SixWeekly ? Quarterly : billingPeriod,
    ...getOptions(fulfilmentOption, productOption),
  };

  const paymentFields = regularPaymentFieldsFromAuthorisation(paymentAuthorisation);
  const promoCode = getPromoCode(billingPeriod, price.promotions);

  return {
    title,
    firstName,
    lastName,
    ...getAddresses(state),
    email,
    titleGiftRecipient,
    firstNameGiftRecipient,
    lastNameGiftRecipient,
    emailGiftRecipient,
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
    promoCode,
  };
}

function onPaymentAuthorised(
  paymentAuthorisation: PaymentAuthorisation,
  dispatch: Dispatch<Action>,
  state: AnyCheckoutState,
) {

  const data = buildRegularPaymentRequest(state, paymentAuthorisation);
  const { product, paymentMethod } = state.page.checkout;
  const { csrf } = state.page;
  const { abParticipations } = state.common;

  const handleSubscribeResult = (result: PaymentResult) => {
    if (result.paymentStatus === 'success') {
      if (result.subscriptionCreationPending) {
        dispatch(setStage('thankyou-pending', product, paymentMethod));
      } else {
        dispatch(setStage('thankyou', product, paymentMethod));
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
  onAuthorised: (pa: PaymentAuthorisation) => void,
  isTestUser: boolean,
  price: number,
  currency: IsoCurrency,
  email: string,
) {
  if (isPostDeployUser()) {
    onAuthorised({
      paymentMethod: Stripe,
      token: 'tok_visa',
      stripePaymentMethod: 'StripeCheckout',
    });
  } else {
    loadStripe()
      .then(() => setupStripeCheckout(onAuthorised, 'REGULAR', currency, isTestUser))
      .then(stripe => openDialogBox(stripe, price, email));
  }
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

function trackSubmitAttempt(paymentMethod: ?PaymentMethod, productType: SubscriptionProduct) {
  const componentId = `subs-checkout-submit-${productType}-${paymentMethod || ''}`;
  trackCheckoutSubmitAttempt(componentId, productType, paymentMethod, productType);
}

function submitForm(
  dispatch: Dispatch<Action>,
  state: AnyCheckoutState,
) {
  const {
    paymentMethod, email, product, isTestUser,
  } = state.page.checkout;

  trackSubmitAttempt(paymentMethod, product);

  let priceDetails = finalPrice(
    state.page.checkout.productPrices,
    state.page.billingAddress.fields.country,
    state.page.checkout.billingPeriod,
    state.page.checkout.fulfilmentOption,
    state.page.checkout.productOption,
  );

  // This is a small hack to make sure we show quarterly pricing until we have promos tooling
  if (state.page.checkout.billingPeriod === Quarterly && priceDetails.price === 6) {
    priceDetails = getProductPrice(
      state.page.checkout.productPrices,
      state.page.billingAddress.fields.country,
      state.page.checkout.billingPeriod,
      state.page.checkout.fulfilmentOption,
      state.page.checkout.productOption,
    );
  }

  const { price, currency } = priceDetails;

  const onAuthorised = (paymentAuthorisation: PaymentAuthorisation) =>
    onPaymentAuthorised(
      paymentAuthorisation,
      dispatch,
      state,
    );

  showPaymentMethod(
    dispatch, onAuthorised, isTestUser, price, currency,
    paymentMethod, email,
  );
}

function submitWithDeliveryForm(
  dispatch: Dispatch<Action>,
  state: WithDeliveryCheckoutState,
) {
  if (validateWithDeliveryForm(dispatch, state)) {
    submitForm(dispatch, state);
  }
}

function submitCheckoutForm(
  dispatch: Dispatch<Action>,
  state: CheckoutState,
) {
  if (validateCheckoutForm(dispatch, state)) {
    submitForm(dispatch, state);
  }
}

// ----- Export ----- //

export {
  onPaymentAuthorised,
  buildRegularPaymentRequest,
  showPaymentMethod,
  showStripe,
  submitCheckoutForm,
  submitWithDeliveryForm,
  trackSubmitAttempt,
};
