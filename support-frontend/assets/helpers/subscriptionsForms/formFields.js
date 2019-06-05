// @flow

import type { Option } from 'helpers/types/option';
import type { Title } from 'helpers/user/details';
import type { PaymentMethod } from 'helpers/paymentMethods';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { ErrorReason } from 'helpers/errorReasons';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { AnyCheckoutState, CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { SubscriptionProduct } from 'helpers/subscriptions';

export type Stage = 'checkout' | 'thankyou' | 'thankyou-pending';

export type FormFields = {|
  title: Option<Title>,
  firstName: string,
  lastName: string,
  email: string,
  telephone: Option<string>,
  titleGiftRecipient: Option<Title>,
  firstNameGiftRecipient: string,
  lastNameGiftRecipient: string,
  emailGiftRecipient: string,
  billingPeriod: BillingPeriod,
  paymentMethod: Option<PaymentMethod>,
  startDate: Option<string>,
  billingAddressIsSame: Option<boolean>,
  fulfilmentOption: FulfilmentOptions,
  product: SubscriptionProduct,
  productOption: ProductOptions,
  orderIsAGift: Option<boolean>,
|};

export type FormField = $Keys<FormFields>;

export type FormState = {|
  stage: Stage,
  product: SubscriptionProduct,
  ...FormFields,
  email: string,
  formErrors: FormError<FormField>[],
  submissionError: Option<ErrorReason>,
  formSubmitted: boolean,
  isTestUser: boolean,
  productPrices: ProductPrices,
  payPalHasLoaded: boolean,
|};

function getFormFields(state: AnyCheckoutState): FormFields {
  return {
    title: state.page.checkout.title,
    firstName: state.page.checkout.firstName,
    lastName: state.page.checkout.lastName,
    email: state.page.checkout.email,
    telephone: state.page.checkout.telephone,
    titleGiftRecipient: state.page.checkout.titleGiftRecipient,
    firstNameGiftRecipient: state.page.checkout.firstNameGiftRecipient,
    lastNameGiftRecipient: state.page.checkout.lastNameGiftRecipient,
    emailGiftRecipient: state.page.checkout.emailGiftRecipient,
    startDate: state.page.checkout.startDate,
    billingPeriod: state.page.checkout.billingPeriod,
    paymentMethod: state.page.checkout.paymentMethod,
    fulfilmentOption: state.page.checkout.fulfilmentOption,
    productOption: state.page.checkout.productOption,
    product: state.page.checkout.product,
    billingAddressIsSame: state.page.checkout.billingAddressIsSame,
    orderIsAGift: state.page.checkout.orderIsAGift,
  };
}

function getEmail(state: CheckoutState): string {
  return state.page.checkout.email;
}

export {
  getFormFields,
  getEmail,
};
