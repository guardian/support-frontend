// @flow

import {
  type PaymentAuthorisation,
  regularPaymentFieldsFromAuthorisation,
  type RegularPaymentRequest,
} from 'helpers/paymentIntegrations/readerRevenueApis';
import { getQueryParameter } from 'helpers/url';
import { getOphanIds, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { Monthly } from 'helpers/billingPeriods';
import { type FormFields, getFormFields } from 'components/subscriptionCheckouts/address/addressFieldsStore';

import {
  getBillingAddress,
  getDeliveryAddress,
  type State,
} from '../paperSubscriptionCheckoutReducer';

const getAddressFieldsState = (from: FormFields) => ({
  lineOne: from.lineOne,
  lineTwo: from.lineTwo,
  city: from.city,
  postCode: from.postCode,
});

function buildRegularPaymentRequest(state: State, paymentAuthorisation: PaymentAuthorisation): RegularPaymentRequest {
  const { currencyId, countryId } = state.common.internationalisation;
  const {
    firstName,
    lastName,
    email,
    telephone,
    billingAddressIsSame,
  } = state.page.checkout;

  const product = {
    currency: currencyId,
    billingPeriod: Monthly,
    fulfilmentOptions: state.page.checkout.fulfilmentOption,
    productOptions: state.page.checkout.productOption,
  };

  const paymentFields = regularPaymentFieldsFromAuthorisation(paymentAuthorisation);

  const deliveryAddress = {
    ...getAddressFieldsState(getFormFields(getDeliveryAddress(state))),
    state: null,
    country: countryId,
  };

  const billingAddress = billingAddressIsSame ? deliveryAddress : {
    ...getAddressFieldsState(getFormFields(getBillingAddress(state))),
    state: null,
    country: countryId,
  };

  return {
    firstName,
    lastName,
    billingAddress,
    deliveryAddress,
    email,
    telephoneNumber: telephone,
    product,
    firstDeliveryDate: state.page.checkout.startDate,
    paymentFields,
    ophanIds: getOphanIds(),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    supportAbTests: getSupportAbTests(state.common.abParticipations, state.common.optimizeExperiments),
    promoCode: getQueryParameter('promoCode'),
  };
}

export { buildRegularPaymentRequest };
