import { fetchJson } from "helpers/async/fetch";
import type { Action } from "pages/subscriptions-redemption/subscriptionsRedemptionReducer";
import type { Dispatch } from "redux";
import "redux";
import type { Option } from "helpers/types/option";
import type { PaymentResult, RegularPaymentRequest } from "helpers/forms/paymentIntegrations/readerRevenueApis";
import { postRegularPaymentRequest } from "helpers/forms/paymentIntegrations/readerRevenueApis";
import type { IsoCurrency } from "helpers/internationalisation/currency";
import { getOphanIds, getReferrerAcquisitionData, getSupportAbTests } from "helpers/tracking/acquisitions";
import { routes } from "helpers/urls/routes";
import type { IsoCountry } from "helpers/internationalisation/country";
import { Monthly } from "helpers/productPrice/billingPeriods";
import type { User } from "helpers/user/user";
import type { Participations } from "helpers/abTests/abtest";
import type { Csrf } from "helpers/csrf/csrfReducer";
import { getOrigin } from "helpers/urls/url";
import { appropriateErrorMessage } from "helpers/forms/errorReasons";
import { getGlobal } from "helpers/globalsAndSwitches/globals";
import type { ReaderType } from "helpers/productPrice/readerType";
import { DigitalPack } from "helpers/productPrice/subscriptions";
type ValidationResult = {
  valid: boolean;
  readerType: Option<ReaderType>;
  errorMessage: Option<string>;
};

function validate(userCode: string) {
  if (userCode === '') {
    return Promise.resolve({
      valid: false,
      readerType: null,
      errorMessage: 'Please enter your code'
    });
  }

  const isTestUser: boolean = !!getGlobal<string>('isTestUser');
  const validationUrl = `${getOrigin()}/subscribe/redeem/validate/${userCode}${isTestUser ? '?isTestUser=true' : ''}`;
  return fetchJson(validationUrl, {});
}

function dispatchError(dispatch: Dispatch<Action>, error: Option<string>) {
  dispatch({
    type: 'SET_ERROR',
    error
  });
}

function dispatchReaderType(dispatch: Dispatch<Action>, readerType: Option<ReaderType>) {
  dispatch({
    type: 'SET_READER_TYPE',
    readerType
  });
}

function validateWithServer(userCode: string, dispatch: Dispatch<Action>) {
  validate(userCode).then((result: ValidationResult) => {
    dispatchError(dispatch, result.errorMessage);
    dispatchReaderType(dispatch, result.readerType);
  }).catch(error => {
    dispatchError(dispatch, `An error occurred while validating this code: ${error}`);
  });
}

function validateUserCode(userCode: string, dispatch: Dispatch<Action>) {
  dispatch({
    type: 'SET_USER_CODE',
    userCode
  });
  const codeLength = getGlobal('codeLength') || 13;

  if (userCode.length === codeLength) {
    validateWithServer(userCode, dispatch);
  } else {
    dispatchError(dispatch, 'Please check the code and try again');
  }
}

function submitCode(userCode: string, dispatch: Dispatch<Action>) {
  validate(userCode).then((result: ValidationResult) => {
    if (result.valid) {
      const submitUrl = `${getOrigin()}/subscribe/redeem/create/${userCode}`;
      window.location.assign(submitUrl);
    } else {
      dispatchError(dispatch, result.errorMessage);
    }
  }).catch(error => {
    dispatchError(dispatch, `An error occurred while validating this code: ${error}`);
  });
}

function buildRegularPaymentRequest(userCode: string, readerType: ReaderType, user: User, currencyId: IsoCurrency, countryId: IsoCountry, participations: Participations): RegularPaymentRequest {
  const {
    firstName,
    lastName,
    email
  } = user;
  const product = {
    productType: DigitalPack,
    currency: currencyId,
    billingPeriod: Monthly,
    readerType
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
      city: null
    },
    deliveryAddress: null,
    email: email || '',
    telephoneNumber: null,
    product,
    firstDeliveryDate: null,
    paymentFields: {
      redemptionCode: userCode
    },
    ophanIds: getOphanIds(),
    referrerAcquisitionData: getReferrerAcquisitionData(),
    supportAbTests: getSupportAbTests(participations),
    debugInfo: 'no form/redux for redemption page'
  };
}

function createSubscription(userCode: string, readerType: Option<ReaderType>, user: User, currencyId: IsoCurrency, countryId: IsoCountry, participations: Participations, csrf: Csrf, dispatch: Dispatch<Action>) {
  if (readerType == null) {
    dispatchError(dispatch, 'An error occurred while redeeming this code, please try again later');
    return;
  }

  const data = buildRegularPaymentRequest(userCode, readerType, user, currencyId, countryId, participations);

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
      dispatch({
        type: 'SET_STAGE',
        stage: 'form'
      });
    }
  };

  postRegularPaymentRequest(routes.subscriptionCreate, data, participations, csrf).then(handleSubscribeResult);
}

export { validateUserCode, submitCode, createSubscription };