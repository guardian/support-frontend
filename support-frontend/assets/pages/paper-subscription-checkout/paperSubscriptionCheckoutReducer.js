// @flow

// ----- Imports ----- //

import { combineReducers, type Dispatch } from 'redux';
import csrf from 'helpers/csrf/csrfReducer';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { fromCountry, GBPCountries } from 'helpers/internationalisation/countryGroup';
import { formError, type FormError, nonEmptyString, notNull, validate } from 'helpers/subscriptionsForms/validation';
import { directDebitReducer as directDebit } from 'components/directDebit/directDebitReducer';
import { marketingConsentReducerFor } from 'components/marketingConsent/marketingConsentReducer';
import { createUserReducer } from 'helpers/user/userReducer';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { Collection, HomeDelivery, type PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { ActivePaperProductTypes, Everyday, type PaperProductOptions } from 'helpers/productPrice/productOptions';
import { buildRegularPaymentRequest, onPaymentAuthorised, showPaymentMethod } from './helpers/paymentProviders';
import {
  addressReducerFor,
  type FormField as AddressFormField,
  getFormErrors as getAddressFormErrors,
  setFormErrorsFor as setAddressFormErrorsFor,
} from 'components/subscriptionCheckouts/address/addressFieldsStore';

import { finalPrice as paperFinalPrice } from 'helpers/productPrice/paperProductPrices';
import { Paper, paperHasDeliveryEnabled } from 'helpers/subscriptions';

import { getDeliveryDays, getVoucherDays } from './helpers/deliveryDays';
import { formatMachineDate } from 'helpers/dateConversions';
import type { FormField, FormFields, State } from 'helpers/subscriptionsForms/formFields';
import {
  getBillingAddress,
  getBillingAddressFields,
  getDeliveryAddress,
  getDeliveryAddressFields,
  getFormFields,
} from 'helpers/subscriptionsForms/formFields';
import { type Action, setFormErrors } from 'helpers/subscriptionsForms/checkoutActions';
import { createCheckoutReducer } from 'helpers/subscriptionsForms/checkoutReducer';
import { Monthly } from 'helpers/billingPeriods';

// ----- Functions ----- //

function getErrors(fields: FormFields): FormError<FormField>[] {
  return validate([
    {
      rule: nonEmptyString(fields.firstName),
      error: formError('firstName', 'Please enter a first name.'),
    },
    {
      rule: nonEmptyString(fields.lastName),
      error: formError('lastName', 'Please enter a last name.'),
    },
    {
      rule: notNull(fields.startDate),
      error: formError('startDate', 'Please select a start date'),
    },
    {
      rule: notNull(fields.billingAddressIsSame),
      error: formError(
        'billingAddressIsSame',
        'Please indicate whether the billing address is the same as the delivery address',
      ),
    },
    {
      rule: notNull(fields.paymentMethod),
      error: formError('paymentMethod', 'Please select a payment method.'),
    },
  ]);
}

function submitForm(dispatch: Dispatch<Action>, state: State) {

  type Error<T> = {
    errors: FormError<T>[],
    dispatcher: any => Action,
  }

  const formFields: FormFields = getFormFields(state);

  const allErrors: (Error<AddressFormField> | Error<FormField>)[] = [
    ({
      errors: getErrors(formFields),
      dispatcher: setFormErrors,
    }: Error<FormField>),
    ({
      errors: getAddressFormErrors(getDeliveryAddressFields(state)),
      dispatcher: setAddressFormErrorsFor('delivery'),
    }: Error<AddressFormField>),
  ].filter(({ errors }) => errors.length > 0);

  if (!formFields.billingAddressIsSame) {
    allErrors.push(({
      errors: getAddressFormErrors(getBillingAddressFields(state)),
      dispatcher: setAddressFormErrorsFor('billing'),
    }: Error<AddressFormField>));
  }

  if (allErrors.length > 0) {
    allErrors.forEach(({ errors, dispatcher }) => {
      dispatch(dispatcher(errors));
    });
  } else {
    const testUser = state.page.checkout.isTestUser;

    const { price, currency } = paperFinalPrice(
      state.page.checkout.productPrices,
      state.page.checkout.fulfilmentOption,
      state.page.checkout.productOption,
    );

    const onAuthorised = (pa: PaymentAuthorisation) =>
      onPaymentAuthorised(
        dispatch,
        buildRegularPaymentRequest(state, pa),
        state.page.csrf,
        state.common.abParticipations,
      );

    const { paymentMethod, email } = state.page.checkout;

    showPaymentMethod(dispatch, onAuthorised, testUser, price, currency, paymentMethod, email);
  }
}

// ----- Reducer ----- //
type Options = {|
  fulfilmentOption: PaperFulfilmentOptions,
  productOption: PaperProductOptions,
|};

function getDays(fulfilmentOption: FulfilmentOptions, productOption: ProductOptions) {
  return (fulfilmentOption === HomeDelivery ? getDeliveryDays(Date.now(), productOption)
    : getVoucherDays(Date.now(), productOption));
}

const getInitialOptions = (productInUrl: ?string, fulfillmentInUrl: ?string): Options => ({
  productOption:
    ActivePaperProductTypes.includes(productInUrl)
      // $FlowIgnore - flow doesn't recognise that we've checked the value of productInUrl
      ? (productInUrl: PaperProductOptions)
      : Everyday,
  fulfilmentOption:
  paperHasDeliveryEnabled() && (fulfillmentInUrl === 'Collection' || fulfillmentInUrl === 'HomeDelivery')
    ? (fulfillmentInUrl: PaperFulfilmentOptions)
    : Collection,
});

function initReducer(initialCountry: IsoCountry, productInUrl: ?string, fulfillmentInUrl: ?string) {
  const options = getInitialOptions(productInUrl, fulfillmentInUrl);
  const days: Date[] = getDays(options.fulfilmentOption, options.productOption);
  const startDate = formatMachineDate(days[0]) || null;

  return combineReducers({
    checkout: createCheckoutReducer(
      initialCountry,
      Paper,
      Monthly,
      startDate,
      options.productOption,
      options.fulfilmentOption,
    ),
    user: createUserReducer(fromCountry(initialCountry) || GBPCountries),
    directDebit,
    billingAddress: addressReducerFor('billing', initialCountry),
    deliveryAddress: addressReducerFor('delivery', initialCountry),
    csrf,
    marketingConsent: marketingConsentReducerFor('MARKETING_CONSENT'),
  });
}

// ----- Export ----- //

export {
  initReducer,
  getFormFields,
  getDeliveryAddress,
  getBillingAddress,
  getDays,
  submitForm,
};
