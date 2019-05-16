// @flow

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { combineReducers } from 'redux';
import { createCheckoutReducer } from 'helpers/subscriptionsForms/formReducer';
import type { SubscriptionProduct } from 'helpers/subscriptions';
import { createUserReducer } from 'helpers/user/userReducer';
import { fromCountry, GBPCountries } from 'helpers/internationalisation/countryGroup';
import { directDebitReducer as directDebit } from 'components/directDebit/directDebitReducer';
import type { State as AddressState } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { addressReducerFor } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import csrf from 'helpers/csrf/csrfReducer';
import type { State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';
import { marketingConsentReducerFor } from 'components/marketingConsent/marketingConsentReducer';
import type { ReduxState } from 'helpers/page/page';
import type { Option } from 'helpers/types/option';
import type { FormState } from 'helpers/subscriptionsForms/formFields';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';

type CommonState = ReduxState<{|
  checkout: FormState,
  csrf: CsrfState,
  marketingConsent: MarketingConsentState,
|}>;

export type DigitalCheckoutState = {
  ...CommonState,
  billingAddress: AddressState,
}

export type WithDeliveryCheckoutState = {|
  ...CommonState,
  billingAddress: AddressState,
  deliveryAddress: Option<AddressState>,
|}

function createReducer(
  initialCountry: IsoCountry,
  product: SubscriptionProduct,
  initialBillingPeriod: BillingPeriod,
  startDate: Option<string>,
  productOption: Option<ProductOptions>,
  fulfilmentOption: Option<FulfilmentOptions>,
  addressReducers,
) {
  return combineReducers({
    checkout: createCheckoutReducer(
      initialCountry,
      product,
      initialBillingPeriod, startDate, productOption, fulfilmentOption,
    ),
    user: createUserReducer(fromCountry(initialCountry) || GBPCountries),
    directDebit,
    ...addressReducers,
    csrf,
    marketingConsent: marketingConsentReducerFor('MARKETING_CONSENT'),
  });
}


function createDigitalCheckoutReducer(
  initialCountry: IsoCountry,
  product: SubscriptionProduct,
  initialBillingPeriod: BillingPeriod,
  startDate: Option<string>,
  productOption: Option<ProductOptions>,
  fulfilmentOption: Option<FulfilmentOptions>,
) {
  const address = {
    billingAddress: addressReducerFor('billing', initialCountry),
  };
  return createReducer(
    initialCountry,
    product,
    initialBillingPeriod,
    startDate,
    productOption,
    fulfilmentOption,
    address,
  );
}

function createWithDeliveryCheckoutReducer(
  initialCountry: IsoCountry,
  product: SubscriptionProduct,
  initialBillingPeriod: BillingPeriod,
  startDate: Option<string>,
  productOption: Option<ProductOptions>,
  fulfilmentOption: Option<FulfilmentOptions>,
) {
  const addresses = {
    billingAddress: addressReducerFor('billing', initialCountry),
    deliveryAddress: addressReducerFor('delivery', initialCountry),
  };
  return createReducer(
    initialCountry,
    product,
    initialBillingPeriod,
    startDate,
    productOption,
    fulfilmentOption,
    addresses,
  );
}


export { createDigitalCheckoutReducer, createWithDeliveryCheckoutReducer };
