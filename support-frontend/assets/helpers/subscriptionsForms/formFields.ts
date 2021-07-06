import { $Keys } from "utility-types";
import { Option } from "helpers/types/option";
import { Title } from "helpers/user/details";
import { PaymentMethod } from "helpers/forms/paymentMethods";
import { FormError } from "helpers/subscriptionsForms/validation";
import { ErrorReason } from "helpers/forms/errorReasons";
import { ProductPrices } from "helpers/productPrice/productPrices";
import { BillingPeriod } from "helpers/productPrice/billingPeriods";
import { FulfilmentOptions } from "helpers/productPrice/fulfilmentOptions";
import { ProductOptions } from "helpers/productPrice/productOptions";
import { AnyCheckoutState, CheckoutState } from "helpers/subscriptionsForms/subscriptionCheckoutReducer";
import { SubscriptionProduct } from "helpers/productPrice/subscriptions";
export type Stage = "checkout" | "thankyou" | "thankyou-pending";
export type FormFields = {
  title: Option<Title>;
  firstName: string;
  lastName: string;
  email: string;
  telephone: Option<string>;
  titleGiftRecipient: Option<Title>;
  firstNameGiftRecipient: Option<string>;
  lastNameGiftRecipient: Option<string>;
  emailGiftRecipient: Option<string>;
  billingPeriod: BillingPeriod;
  paymentMethod: Option<PaymentMethod>;
  startDate: Option<string>;
  billingAddressIsSame: boolean;
  fulfilmentOption: FulfilmentOptions;
  product: SubscriptionProduct;
  productOption: ProductOptions;
  orderIsAGift?: boolean;
  deliveryInstructions: Option<string>;
  giftMessage: Option<string>;
  giftDeliveryDate: Option<string>;
};
export type FormField = $Keys<FormFields> | "recaptcha";
export type FormState = FormFields & {
  stage: Stage;
  product: SubscriptionProduct;
  email: string;
  formErrors: FormError<FormField>[];
  submissionError: Option<ErrorReason>;
  formSubmitted: boolean;
  isTestUser: boolean;
  productPrices: ProductPrices;
  payPalHasLoaded: boolean;
  stripePaymentMethod: Option<string>;
  debugInfo: string;
};

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
    deliveryInstructions: state.page.checkout.deliveryInstructions,
    giftMessage: state.page.checkout.giftMessage,
    giftDeliveryDate: state.page.checkout.giftDeliveryDate
  };
}

function getEmail(state: CheckoutState): string {
  return state.page.checkout.email;
}

export { getFormFields, getEmail };