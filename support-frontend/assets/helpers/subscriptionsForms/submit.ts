// ----- Imports ----- //
import type { Dispatch } from "redux";
import "redux";
import type { PaymentResult, RegularPaymentRequest, SubscriptionProductFields } from "helpers/forms/paymentIntegrations/readerRevenueApis";
import type { PaymentAuthorisation } from "helpers/forms/paymentIntegrations/readerRevenueApis";
import { postRegularPaymentRequest, regularPaymentFieldsFromAuthorisation } from "helpers/forms/paymentIntegrations/readerRevenueApis";
import type { Action } from "helpers/subscriptionsForms/formActions";
import { setFormSubmitted, setStage, setSubmissionError } from "helpers/subscriptionsForms/formActions";
import type { AnyCheckoutState, CheckoutState, WithDeliveryCheckoutState } from "helpers/subscriptionsForms/subscriptionCheckoutReducer";
import { getBillingAddressFields, getDeliveryAddressFields } from "helpers/subscriptionsForms/subscriptionCheckoutReducer";
import { finalPrice, getCurrency, getProductPrice } from "helpers/productPrice/productPrices";
import { getOphanIds, getSupportAbTests } from "helpers/tracking/acquisitions";
import { routes } from "helpers/urls/routes";
import type { IsoCurrency } from "helpers/internationalisation/currency";
import type { Option } from "helpers/types/option";
import type { PaymentMethod } from "helpers/forms/paymentMethods";
import { DirectDebit, PayPal, Stripe } from "helpers/forms/paymentMethods";
import { validateCheckoutForm, validateWithDeliveryForm } from "helpers/subscriptionsForms/formValidation";
import type { SubscriptionProduct } from "helpers/productPrice/subscriptions";
import { DigitalPack, GuardianWeekly, Paper, isPhysicalProduct } from "helpers/productPrice/subscriptions";
import { Quarterly } from "helpers/productPrice/billingPeriods";
import { trackCheckoutSubmitAttempt } from "../tracking/behaviour";
import type { IsoCountry } from "../internationalisation/country";
import type { Promotion } from "helpers/productPrice/promotions";
import { getAppliedPromo } from "helpers/productPrice/promotions";
import type { DirectDebitState } from "components/directDebit/directDebitReducer";
import { Direct, Gift } from "helpers/productPrice/readerType";
import type { ProductOptions } from "helpers/productPrice/productOptions";
import { NoProductOptions } from "helpers/productPrice/productOptions";

// ----- Functions ----- //
function getAddresses(state: AnyCheckoutState) {
  if (isPhysicalProduct(state.page.checkout.product)) {
    const deliveryAddressFields = getDeliveryAddressFields(((state as any) as WithDeliveryCheckoutState));
    return {
      deliveryAddress: deliveryAddressFields,
      billingAddress: state.page.checkout.billingAddressIsSame ? deliveryAddressFields : getBillingAddressFields(state)
    };
  }

  return {
    billingAddress: getBillingAddressFields(state),
    deliveryAddress: null
  };
}

const getProduct = (state: AnyCheckoutState, currencyId?: Option<IsoCurrency>): SubscriptionProductFields => {
  const {
    billingPeriod,
    fulfilmentOption,
    productOption,
    orderIsAGift,
    product
  } = state.page.checkout;
  const readerType = orderIsAGift ? Gift : Direct;

  if (product === DigitalPack) {
    return {
      productType: DigitalPack,
      currency: currencyId || state.common.internationalisation.currencyId,
      billingPeriod,
      readerType
    };
  } else if (product === GuardianWeekly) {
    return {
      productType: GuardianWeekly,
      currency: currencyId || state.common.internationalisation.currencyId,
      billingPeriod,
      fulfilmentOptions: fulfilmentOption
    };
  }

  /* Paper or PaperAndDigital */
  return {
    productType: Paper,
    currency: currencyId || state.common.internationalisation.currencyId,
    billingPeriod,
    fulfilmentOptions: fulfilmentOption,
    productOptions: productOption
  };
};

const getPromoCode = (promotions: Promotion[] | null | undefined) => {
  const promotion = getAppliedPromo(promotions);
  return promotion ? promotion.promoCode : null;
};

function buildRegularPaymentRequest(state: AnyCheckoutState, paymentAuthorisation: PaymentAuthorisation, currencyId?: Option<IsoCurrency>): RegularPaymentRequest {
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
    giftMessage,
    giftDeliveryDate,
    billingPeriod,
    fulfilmentOption,
    productOption,
    productPrices,
    deliveryInstructions,
    debugInfo
  } = state.page.checkout;
  const addresses = getAddresses(state);
  const price = getProductPrice(productPrices, addresses.billingAddress.country, billingPeriod, fulfilmentOption, productOption);
  const product = getProduct(state, currencyId);
  const paymentFields = regularPaymentFieldsFromAuthorisation(paymentAuthorisation);
  const promoCode = getPromoCode(price.promotions);
  const giftRecipient = !!firstNameGiftRecipient && !!lastNameGiftRecipient ? {
    giftRecipient: {
      title: titleGiftRecipient,
      firstName: firstNameGiftRecipient,
      lastName: lastNameGiftRecipient,
      email: emailGiftRecipient,
      message: giftMessage,
      deliveryDate: giftDeliveryDate
    }
  } : {};
  return {
    title,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    ...addresses,
    email: email.trim(),
    ...giftRecipient,
    telephoneNumber: telephone,
    product,
    firstDeliveryDate: state.page.checkout.startDate,
    paymentFields,
    ophanIds: getOphanIds(),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    supportAbTests: getSupportAbTests(state.common.abParticipations),
    promoCode,
    deliveryInstructions,
    debugInfo
  };
}

function onPaymentAuthorised(paymentAuthorisation: PaymentAuthorisation, dispatch: Dispatch<Action>, state: AnyCheckoutState, currencyId?: Option<IsoCurrency>) {
  const data = buildRegularPaymentRequest(state, paymentAuthorisation, currencyId);
  const {
    product,
    paymentMethod
  } = state.page.checkout;
  const {
    csrf
  } = state.page;
  const {
    abParticipations
  } = state.common;

  const handleSubscribeResult = (result: PaymentResult) => {
    if (result.paymentStatus === 'success') {
      if (result.subscriptionCreationPending) {
        dispatch(setStage('thankyou-pending', product, paymentMethod));
      } else {
        dispatch(setStage('thankyou', product, paymentMethod));
      }
    } else {
      dispatch(setSubmissionError(result.error));
    }
  };

  dispatch(setFormSubmitted(true));
  postRegularPaymentRequest(routes.subscriptionCreate, data, abParticipations, csrf).then(handleSubscribeResult);
}

function checkStripeUserType(onAuthorised: (pa: PaymentAuthorisation) => void, isTestUser: boolean, price: number, currency: IsoCurrency, stripePaymentMethodId: Option<string>) {
  if (stripePaymentMethodId != null) {
    onAuthorised({
      paymentMethod: Stripe,
      stripePaymentMethod: 'StripeElements',
      paymentMethodId: stripePaymentMethodId
    });
  } else {
    throw new Error('Attempting to process Stripe Payment, however Stripe Payment Method ID is missing.');
  }
}

const directDebitAuthorised = (onAuthorised: (pa: PaymentAuthorisation) => void, ddState: DirectDebitState) => {
  onAuthorised({
    paymentMethod: DirectDebit,
    accountHolderName: ddState.accountHolderName,
    sortCode: ddState.sortCodeString,
    accountNumber: ddState.accountNumber
  });
};

function showPaymentMethod(dispatch: Dispatch<Action>, onAuthorised: (pa: PaymentAuthorisation) => void, isTestUser: boolean, price: number, currency: IsoCurrency, country: IsoCountry, paymentMethod: Option<PaymentMethod>, stripePaymentMethod: Option<string>, state: AnyCheckoutState): void {
  switch (paymentMethod) {
    case Stripe:
      checkStripeUserType(onAuthorised, isTestUser, price, currency, stripePaymentMethod);
      break;

    case DirectDebit:
      directDebitAuthorised(onAuthorised, state.page.directDebit);
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

function trackSubmitAttempt(paymentMethod: PaymentMethod | null | undefined, productType: SubscriptionProduct, productOption: ProductOptions) {
  const componentId = productOption === NoProductOptions ? `subs-checkout-submit-${productType}-${paymentMethod || ''}` : `subs-checkout-submit-${productType}-${productOption}-${paymentMethod || ''}`;
  trackCheckoutSubmitAttempt(componentId, productType, paymentMethod, productType);
}

function getPricingCountry(product, addresses) {
  if (product === GuardianWeekly && addresses.deliveryAddress) {
    return addresses.deliveryAddress.country;
  }

  return addresses.billingAddress.country;
}

function submitForm(dispatch: Dispatch<Action>, state: AnyCheckoutState) {
  const {
    paymentMethod,
    product,
    productOption,
    isTestUser
  } = state.page.checkout;
  const addresses = getAddresses(state);
  const pricingCountry = getPricingCountry(product, addresses);
  trackSubmitAttempt(paymentMethod, product, productOption);
  let priceDetails = finalPrice(state.page.checkout.productPrices, pricingCountry, state.page.checkout.billingPeriod, state.page.checkout.fulfilmentOption, state.page.checkout.productOption);

  // This is a small hack to make sure we show quarterly pricing until we have promos tooling
  if (state.page.checkout.billingPeriod === Quarterly && priceDetails.price === 6) {
    priceDetails = getProductPrice(state.page.checkout.productPrices, pricingCountry, state.page.checkout.billingPeriod, state.page.checkout.fulfilmentOption, state.page.checkout.productOption);
  }

  const {
    price,
    currency
  } = priceDetails;
  const currencyId = getCurrency(pricingCountry);
  const stripePaymentMethod = paymentMethod === Stripe ? state.page.checkout.stripePaymentMethod : null;

  const onAuthorised = (paymentAuthorisation: PaymentAuthorisation) => onPaymentAuthorised(paymentAuthorisation, dispatch, state, currencyId);

  showPaymentMethod(dispatch, onAuthorised, isTestUser, price, currency, pricingCountry, paymentMethod, stripePaymentMethod, state);
}

function submitWithDeliveryForm(dispatch: Dispatch<Action>, state: WithDeliveryCheckoutState) {
  if (validateWithDeliveryForm(dispatch, state)) {
    submitForm(dispatch, state);
  }
}

function submitCheckoutForm(dispatch: Dispatch<Action>, state: CheckoutState) {
  if (validateCheckoutForm(dispatch, state)) {
    submitForm(dispatch, state);
  }
}

// ----- Export ----- //
export { onPaymentAuthorised, buildRegularPaymentRequest, showPaymentMethod, submitCheckoutForm, submitWithDeliveryForm, trackSubmitAttempt };