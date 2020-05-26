// @flow

import { getOrigin } from 'helpers/url';
import { fetchJson } from 'helpers/fetch';
import type { Action } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';
import { type Dispatch } from 'redux';
import type { Option } from 'helpers/types/option';

type ValidationResult = {
  valid: boolean,
  errorMessage: Option<string>,
}

function validate(redemptionCode: string) {
  const validationUrl = `${getOrigin()}/subscribe/redeem/validate/${redemptionCode}`;
  return fetchJson(validationUrl, {}); // TODO: CSRF?
}

function doValidation(redemptionCode: string, dispatch: Dispatch<Action>) {
  validate(redemptionCode).then((result: ValidationResult) => {
    dispatch({ type: 'SET_ERROR', error: result.errorMessage });
  }).catch((error) => {
    dispatch({ type: 'SET_ERROR', error: `An error occurred while validating this code: ${error}` });
  });
}

function validateUserCode(userCode: string, dispatch: Dispatch<Action>) {
  dispatch({ type: 'SET_USER_CODE', userCode });
  doValidation(userCode, dispatch);
}

export { doValidation, validateUserCode };
