import type { IsoCountry } from "helpers/internationalisation/country";
import type { BillingPeriod } from "helpers/productPrice/billingPeriods";
import { combineReducers } from "redux";
import { createFormReducer } from "helpers/subscriptionsForms/formReducer";
import type { SubscriptionProduct } from "helpers/productPrice/subscriptions";
import { createUserReducer } from "helpers/user/userReducer";
import { directDebitReducer as directDebit } from "components/directDebit/directDebitReducer";
import type { FormFields as AddressFormFields, State as AddressState } from "components/subscriptionCheckouts/address/addressFieldsStore";
import { addressReducerFor } from "components/subscriptionCheckouts/address/addressFieldsStore";
import type { Csrf as CsrfState } from "helpers/csrf/csrfReducer";
import csrf from "helpers/csrf/csrfReducer";
import type { State as MarketingConsentState } from "components/marketingConsent/marketingConsentReducer";
import { marketingConsentReducerFor } from "components/marketingConsent/marketingConsentReducer";
import type { ReduxState } from "helpers/page/page";
import type { Option } from "helpers/types/option";
import type { FormState } from "helpers/subscriptionsForms/formFields";
import type { ProductOptions } from "helpers/productPrice/productOptions";
import type { FulfilmentOptions } from "helpers/productPrice/fulfilmentOptions";
import type { DirectDebitState } from "components/directDebit/directDebitReducer";
export type CheckoutState = ReduxState<{
  checkout: FormState;
  csrf: CsrfState;
  marketingConsent: MarketingConsentState;
  billingAddress: AddressState;
  hasDeliveryAddress: false;
  directDebit: DirectDebitState;
}>;
export type WithDeliveryCheckoutState = ReduxState<{
  checkout: FormState;
  csrf: CsrfState;
  marketingConsent: MarketingConsentState;
  billingAddress: AddressState;
  deliveryAddress: AddressState;
  hasDeliveryAddress: true;
  fulfilmentOption: Option<FulfilmentOptions>;
  directDebit: DirectDebitState;
}>;
export type AnyCheckoutState = CheckoutState | WithDeliveryCheckoutState;

function createReducer(initialCountry: IsoCountry, product: SubscriptionProduct, initialBillingPeriod: BillingPeriod, startDate: Option<string>, productOption: Option<ProductOptions>, fulfilmentOption: Option<FulfilmentOptions>, addressReducers) {
  return combineReducers({
    checkout: createFormReducer(initialCountry, product, initialBillingPeriod, startDate, productOption, fulfilmentOption),
    user: createUserReducer(),
    directDebit,
    ...addressReducers,
    csrf,
    marketingConsent: marketingConsentReducerFor('MARKETING_CONSENT')
  });
}

function createCheckoutReducer(initialCountry: IsoCountry, product: SubscriptionProduct, initialBillingPeriod: BillingPeriod, startDate: Option<string>, productOption: Option<ProductOptions>, fulfilmentOption: Option<FulfilmentOptions>) {
  const address = {
    billingAddress: addressReducerFor('billing', initialCountry)
  };
  return createReducer(initialCountry, product, initialBillingPeriod, startDate, productOption, fulfilmentOption, address);
}

function createWithDeliveryCheckoutReducer(initialCountry: IsoCountry, product: SubscriptionProduct, initialBillingPeriod: BillingPeriod, startDate: Option<string>, productOption: Option<ProductOptions>, fulfilmentOption: Option<FulfilmentOptions>) {
  const addresses = {
    billingAddress: addressReducerFor('billing', initialCountry),
    deliveryAddress: addressReducerFor('delivery', initialCountry)
  };
  return createReducer(initialCountry, product, initialBillingPeriod, startDate, productOption, fulfilmentOption, addresses);
}

const addressFieldsFromAddress = (address: AddressState) => {
  const {
    formErrors,
    ...formFields
  } = address.fields;
  return formFields;
};

const getBillingAddress = (state: AnyCheckoutState): AddressState => state.page.billingAddress;

const getBillingAddressFields = (state: AnyCheckoutState): AddressFormFields => addressFieldsFromAddress(getBillingAddress(state));

const getDeliveryAddress = (state: WithDeliveryCheckoutState): AddressState => state.page.deliveryAddress;

const getDeliveryAddressFields = (state: WithDeliveryCheckoutState): AddressFormFields => addressFieldsFromAddress(getDeliveryAddress(state));

const getFulfilmentOption = (state: WithDeliveryCheckoutState): Option<FulfilmentOptions> => state.page.checkout.fulfilmentOption;

export { createCheckoutReducer, createWithDeliveryCheckoutReducer, getBillingAddress, getBillingAddressFields, getDeliveryAddress, getDeliveryAddressFields, getFulfilmentOption };