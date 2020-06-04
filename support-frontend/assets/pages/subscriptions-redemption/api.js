// @flow

import { fetchJson } from 'helpers/fetch';
import type { Action, CorporateCustomer } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';
import { type Dispatch } from 'redux';
import type { Option } from 'helpers/types/option';
import type { PaymentResult, RegularPaymentRequest } from 'helpers/paymentIntegrations/readerRevenueApis';
import { postRegularPaymentRequest } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { getOphanIds, getReferrerAcquisitionData, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { routes } from 'helpers/routes';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { Monthly } from 'helpers/billingPeriods';
import { Corporate } from 'helpers/productPrice/productOptions';
import type { User } from 'helpers/subscriptionsForms/user';
import type { Participations } from 'helpers/abTests/abtest';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { getOrigin } from 'helpers/url';

type ValidationResult = {
  valid: boolean,
  errorMessage: Option<string>,
}

function validate(userCode: string) {
  const validationUrl = `${getOrigin()}/subscribe/redeem/validate/${userCode}`;
  return fetchJson(validationUrl, {});
}

function doValidation(userCode: string, dispatch: Dispatch<Action>) {
  validate(userCode).then((result: ValidationResult) => {
    dispatch({ type: 'SET_ERROR', error: result.errorMessage });
  }).catch((error) => {
    dispatch({ type: 'SET_ERROR', error: `An error occurred while validating this code: ${error}` });
  });
}

function validateUserCode(userCode: string, dispatch: Dispatch<Action>) {
  dispatch({ type: 'SET_USER_CODE', userCode });
  doValidation(userCode, dispatch);
}

function submitCode(userCode: string, dispatch: Dispatch<Action>) {
  validate(userCode).then((result: ValidationResult) => {
    if (result.valid) {
      const submitUrl = `${getOrigin()}/subscribe/redeem/create/${userCode}`;
      window.location.assign(submitUrl);
    } else {
      dispatch({ type: 'SET_ERROR', error: result.errorMessage });
    }
  }).catch((error) => {
    dispatch({ type: 'SET_ERROR', error: `An error occurred while validating this code: ${error}` });
  });
}

function buildRegularPaymentRequest(
  corporateCustomer: CorporateCustomer,
  user: User,
  currencyId: IsoCurrency,
  countryId: IsoCountry,
  participations: Participations,
): RegularPaymentRequest {
  const {
    firstName,
    lastName,
    email,
  } = user;

  const product = {
    currency: currencyId,
    billingPeriod: Monthly,
    productOptions: Corporate,
  };

  return {
    title: null,
    firstName: firstName || '',
    lastName: lastName || '',
    billingAddress: {
      country: countryId,
      state: null,
      lineOne: null,
      lineTwo: null,
      postCode: null,
      city: null,
    },
    deliveryAddress: null,
    email: email || '',
    titleGiftRecipient: null,
    firstNameGiftRecipient: null,
    lastNameGiftRecipient: null,
    emailGiftRecipient: null,
    telephoneNumber: null,
    product,
    firstDeliveryDate: null,
    paymentFields: {
      redemptionCode: corporateCustomer.redemptionCode,
      corporateAccountId: corporateCustomer.accountId,
    },
    ophanIds: getOphanIds(),
    referrerAcquisitionData: getReferrerAcquisitionData(),
    supportAbTests: getSupportAbTests(participations),
  };
}

function createSubscription(
  corporateCustomer: CorporateCustomer,
  user: User,
  currencyId: IsoCurrency,
  countryId: IsoCountry,
  participations: Participations,
  csrf: Csrf,
) {
  const data = buildRegularPaymentRequest(corporateCustomer, user, currencyId, countryId, participations);

  const handleSubscribeResult = (result: PaymentResult) => {
    if (result.paymentStatus === 'success') {
      if (result.subscriptionCreationPending) {
        const thankyouUrl = `${getOrigin()}/subscribe/redeem/thankyou-pending`;
        window.location.replace(thankyouUrl);
      } else {
        const thankyouUrl = `${getOrigin()}/subscribe/redeem/thankyou`;
        window.location.replace(thankyouUrl);
      }
    } // else { dispatch(setSubmissionError(result.error)); } // TODO: deal with this
  };

  postRegularPaymentRequest(
    routes.subscriptionCreate,
    data,
    participations,
    csrf,
    () => {},
    () => {},
  ).then(handleSubscribeResult);
}

export { doValidation, validateUserCode, submitCode, createSubscription };
