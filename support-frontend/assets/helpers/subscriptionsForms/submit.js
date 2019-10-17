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
import {
  finalPrice,
  getCurrency,
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
import { isPostDeployUser } from 'helpers/user/user';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { Quarterly, SixWeekly } from 'helpers/billingPeriods';
import { trackCheckoutSubmitAttempt } from '../tracking/behaviour';
import type { IsoCountry } from '../internationalisation/country';
import { getAppliedPromo } from 'helpers/productPrice/promotions';
import type { Promotion } from 'helpers/productPrice/promotions';

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
  currencyId?: Option<IsoCurrency>,
): RegularPaymentRequest {
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
    deliveryInstructions,
    debugInfo,
  } = state.page.checkout;

  const addresses = getAddresses(state);

  const price = getProductPrice(
    productPrices,
    addresses.billingAddress.country,
    billingPeriod,
    fulfilmentOption,
    productOption,
  );

  const product = {
    currency: currencyId || state.common.internationalisation.currencyId,
    billingPeriod: billingPeriod === SixWeekly ? Quarterly : billingPeriod,
    ...getOptions(fulfilmentOption, productOption),
  };

  const paymentFields = regularPaymentFieldsFromAuthorisation(paymentAuthorisation);
  const promoCode = getPromoCode(billingPeriod, price.promotions);

  return {
    title,
    firstName,
    lastName,
    ...addresses,
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
    supportAbTests: getSupportAbTests(state.common.abParticipations),
    promoCode,
    deliveryInstructions,
    debugInfo,
  };
}

function onPaymentAuthorised(
  paymentAuthorisation: PaymentAuthorisation,
  dispatch: Dispatch<Action>,
  state: AnyCheckoutState,
  currencyId?: Option<IsoCurrency>,
) {
  const data = buildRegularPaymentRequest(state, paymentAuthorisation, currencyId);
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

function checkStripeUserType(
  onAuthorised: (pa: PaymentAuthorisation) => void,
  isTestUser: boolean,
  price: number,
  currency: IsoCurrency,
  stripeToken: Option<string>,
) {
  if (isPostDeployUser()) {
    onAuthorised({
      paymentMethod: Stripe,
      token: 'tok_visa',
      stripePaymentMethod: 'StripeCheckout',
    });
  } else {
    onAuthorised({
      paymentMethod: Stripe,
      token: stripeToken || '',
      stripePaymentMethod: 'StripeElements',
    });
  }
}

function showPaymentMethod(
  dispatch: Dispatch<Action>,
  onAuthorised: (pa: PaymentAuthorisation) => void,
  isTestUser: boolean,
  price: number,
  currency: IsoCurrency,
  country: IsoCountry,
  paymentMethod: Option<PaymentMethod>,
  stripeToken: Option<string>,
): void {
  switch (paymentMethod) {
    case Stripe:
      checkStripeUserType(onAuthorised, isTestUser, price, currency, stripeToken);
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
  const addresses = getAddresses(state);
  const billingCountry = addresses.billingAddress.country;

  const {
    paymentMethod, product, isTestUser,
  } = state.page.checkout;

  trackSubmitAttempt(paymentMethod, product);

  let priceDetails = finalPrice(
    state.page.checkout.productPrices,
    billingCountry,
    state.page.checkout.billingPeriod,
    state.page.checkout.fulfilmentOption,
    state.page.checkout.productOption,
  );

  // This is a small hack to make sure we show quarterly pricing until we have promos tooling
  if (state.page.checkout.billingPeriod === Quarterly && priceDetails.price === 6) {
    priceDetails = getProductPrice(
      state.page.checkout.productPrices,
      billingCountry,
      state.page.checkout.billingPeriod,
      state.page.checkout.fulfilmentOption,
      state.page.checkout.productOption,
    );
  }

  const { price, currency } = priceDetails;
  const currencyId = getCurrency(billingCountry);
  const stripeToken = paymentMethod === Stripe ? state.page.checkout.stripeToken : null;

  const onAuthorised = (paymentAuthorisation: PaymentAuthorisation) =>
    onPaymentAuthorised(
      paymentAuthorisation,
      dispatch,
      state,
      currencyId,
    );

  showPaymentMethod(
    dispatch, onAuthorised, isTestUser, price, currency, billingCountry,
    paymentMethod, stripeToken,
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
  submitCheckoutForm,
  submitWithDeliveryForm,
  trackSubmitAttempt,
};
