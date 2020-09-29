// @flow

import { fetchJson } from 'helpers/fetch';
import type { Action } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';
import { type Dispatch } from 'redux';
import type { Option } from 'helpers/types/option';
import type { PaymentResult, RegularPaymentRequest } from 'helpers/paymentIntegrations/readerRevenueApis';
import { postRegularPaymentRequest } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { getOphanIds, getReferrerAcquisitionData, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { routes } from 'helpers/routes';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { Monthly } from 'helpers/billingPeriods';
import { Corporate } from 'helpers/productPrice/readerType';
import type { User } from 'helpers/subscriptionsForms/user';
import type { Participations } from 'helpers/abTests/abtest';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { getOrigin } from 'helpers/url';
import { appropriateErrorMessage } from 'helpers/errorReasons';
import { getGlobal } from '../../helpers/globals';

type ValidationResult = {
  valid: boolean,
  errorMessage: Option<string>,
}

function validate(userCode: string) {
  if (userCode === '') {
    return Promise.resolve({ valid: false, errorMessage: 'Please enter your code' });
  }
  const isTestUser: boolean = !!getGlobal<string>('isTestUser');
  const validationUrl = `${getOrigin()}/subscribe/redeem/validate/${userCode}${isTestUser ? '?isTestUser=true' : ''}`;
  return fetchJson(validationUrl, {});
}

function dispatchError(dispatch: Dispatch<Action>, error: Option<string>) {
  dispatch({ type: 'SET_ERROR', error });
}

function doValidation(userCode: string, dispatch: Dispatch<Action>) {
  validate(userCode).then((result: ValidationResult) => {
    dispatchError(dispatch, result.errorMessage);
  }).catch((error) => {
    dispatchError(dispatch, `An error occurred while validating this code: ${error}`);
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
      dispatchError(dispatch, result.errorMessage);
    }
  }).catch((error) => {
    dispatchError(dispatch, `An error occurred while validating this code: ${error}`);
  });
}

function buildRegularPaymentRequest(
  userCode: string,
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
    readerType: Corporate,
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
    telephoneNumber: null,
    product,
    firstDeliveryDate: null,
    paymentFields: {
      redemptionCode: userCode,
    },
    ophanIds: getOphanIds(),
    referrerAcquisitionData: getReferrerAcquisitionData(),
    supportAbTests: getSupportAbTests(participations),
  };
}

function createSubscription(
  userCode: string,
  user: User,
  currencyId: IsoCurrency,
  countryId: IsoCountry,
  participations: Participations,
  csrf: Csrf,
  dispatch: Dispatch<Action>,
) {
  const data = buildRegularPaymentRequest(userCode, user, currencyId, countryId, participations);

  const handleSubscribeResult = (result: PaymentResult) => {
    if (result.paymentStatus === 'success') {
      if (result.subscriptionCreationPending) {
        const thankyouUrl = `${getOrigin()}/subscribe/redeem/thankyou-pending`;
        window.location.replace(thankyouUrl);
      } else {
        const thankyouUrl = `${getOrigin()}/subscribe/redeem/thankyou`;
        window.location.replace(thankyouUrl);
      }
    } else {
      dispatchError(dispatch, appropriateErrorMessage(result.error));
      dispatch({ type: 'SET_STAGE', stage: 'form' });
    }
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

export { validateUserCode, submitCode, createSubscription };
