// @flow

// ----- Reducer ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';
import { getUser } from 'helpers/user/user';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { isTestUser } from 'helpers/user/user';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import { removeError } from 'helpers/subscriptionsForms/validation';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { NoProductOptions, paperProductsWithDigital,
  paperProductsWithoutDigital } from 'helpers/productPrice/productOptions';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import {
  getWeeklyFulfilmentOption,
  NoFulfilmentOptions,
} from 'helpers/productPrice/fulfilmentOptions';
import type { FormState } from 'helpers/subscriptionsForms/formFields';
import type { Option } from 'helpers/types/option';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';

function createFormReducer(
  initialCountry: IsoCountry,
  product: SubscriptionProduct,
  initialBillingPeriod: BillingPeriod,
  startDate: Option<string>,
  productOption: Option<ProductOptions>,
  fulfilmentOption: Option<FulfilmentOptions>,
) {
  const user = getUser(); // TODO: Is this unnecessary? It could use the user reducer
  const { productPrices, orderIsAGift } = window.guardian;

  const initialState = {
    stage: 'checkout',
    product,
    title: null,
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    startDate,
    telephone: null,
    billingAddressIsSame: true,
    billingPeriod: initialBillingPeriod,
    titleGiftRecipient: null,
    firstNameGiftRecipient: null,
    lastNameGiftRecipient: null,
    emailGiftRecipient: null,
    paymentMethod: null,
    formErrors: [],
    submissionError: null,
    formSubmitted: false,
    isTestUser: isTestUser(),
    productPrices,
    productOption: productOption || NoProductOptions,
    fulfilmentOption: fulfilmentOption || NoFulfilmentOptions,
    payPalHasLoaded: false,
    orderIsAGift,
    stripePaymentMethod: null,
    deliveryInstructions: null,
    debugInfo: '',
    giftMessage: null,
    giftDeliveryDate: null,
  };

  const getFulfilmentOption = (action, currentOption) =>
    // For GuardianWeekly subs, when the country changes we need to update the fulfilment option
    // because it may mean a switch between domestic and rest of the world
    (product === GuardianWeekly && action.scope === 'delivery' ? getWeeklyFulfilmentOption(action.country) : currentOption);

  return (originalState: FormState = initialState, action: Action): FormState => {

    const state = { ...originalState, debugInfo: `${originalState.debugInfo} ${JSON.stringify(action)}\n` };

    switch (action.type) {

      case 'SET_STAGE':
        return { ...state, stage: action.stage };

      case 'SET_TITLE':
        return { ...state, title: action.title };

      case 'SET_FIRST_NAME':
        return { ...state, firstName: action.firstName, formErrors: removeError('firstName', state.formErrors) };

      case 'SET_LAST_NAME':
        return { ...state, lastName: action.lastName, formErrors: removeError('lastName', state.formErrors) };

      case 'SET_TELEPHONE':
        return { ...state, telephone: action.telephone };

      case 'SET_TITLE_GIFT':
        return { ...state, titleGiftRecipient: action.titleGiftRecipient };

      case 'SET_FIRST_NAME_GIFT':
        return { ...state, firstNameGiftRecipient: action.firstNameGiftRecipient, formErrors: removeError('firstNameGiftRecipient', state.formErrors) };

      case 'SET_LAST_NAME_GIFT':
        return { ...state, lastNameGiftRecipient: action.lastNameGiftRecipient, formErrors: removeError('lastNameGiftRecipient', state.formErrors) };

      case 'SET_EMAIL_GIFT':
        return { ...state, emailGiftRecipient: action.emailGiftRecipient, formErrors: removeError('emailGiftRecipient', state.formErrors) };

      case 'SET_START_DATE':
        return { ...state, startDate: action.startDate };

      case 'SET_BILLING_PERIOD':
        return { ...state, billingPeriod: action.billingPeriod };

      case 'SET_COUNTRY_CHANGED':
        return {
          ...state,
          paymentMethod: null,
          fulfilmentOption: getFulfilmentOption(action, state.fulfilmentOption),
        };

      case 'SET_PAYMENT_METHOD':
        return {
          ...state,
          paymentMethod: action.paymentMethod,
          formErrors: removeError('paymentMethod', state.formErrors),
        };

      case 'SET_FORM_ERRORS':
        return { ...state, formErrors: action.errors };

      case 'SET_SUBMISSION_ERROR':
        return { ...state, submissionError: action.error, formSubmitted: false };

      case 'SET_FORM_SUBMITTED':
        return { ...state, formSubmitted: action.formSubmitted };

      case 'SET_BILLING_ADDRESS_IS_SAME':
        return {
          ...state,
          billingAddressIsSame: action.isSame,
          formErrors: removeError('billingAddressIsSame', state.formErrors),
        };

      case 'SET_PAYPAL_HAS_LOADED':
        return { ...state, payPalHasLoaded: true };

      case 'SET_ORDER_IS_GIFT':
        return { ...state, orderIsAGift: action.orderIsAGift };

      case 'SET_STRIPE_PAYMENT_METHOD':
        return { ...state, stripePaymentMethod: action.stripePaymentMethod };

      case 'SET_DELIVERY_INSTRUCTIONS':
        return { ...state, deliveryInstructions: action.instructions };

      case 'SET_GIFT_MESSAGE':
        return { ...state, giftMessage: action.message };

      case 'SET_GIFT_DELIVERY_DATE':
        return { ...state, giftDeliveryDate: action.giftDeliveryDate, formErrors: removeError('giftDeliveryDate', state.formErrors) };

      case 'SET_ADD_DIGITAL_SUBSCRIPTION':
        return {
          ...state,
          productOption: action.addDigital ?
            paperProductsWithDigital[state.productOption] : paperProductsWithoutDigital[state.productOption],
        };

      default:
        return state;
    }
  };
}

export { createFormReducer };
