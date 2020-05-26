// @flow

import { getOrigin } from 'helpers/url';
import { fetchJson } from 'helpers/fetch';
import type { Action } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';

function doValidation(redemptionCode: string, dispatch: Dispatch<Action>) {
  const validationUrl = `${getOrigin()}/subscribe/redeem/validate/${redemptionCode}`;
  fetchJson(validationUrl, {}).then((result) => {
    if (result.accountId) {
      dispatch({ type: 'SET_CORPORATE_CUSTOMER', corporateCustomer: result });
      dispatch({ type: 'SET_ERROR', error: null });
    } else {
      dispatch({ type: 'SET_ERROR', error: result });
    }
  }).catch((error) => {
    dispatch({ type: 'SET_ERROR', error: `An error occurred while validating this code: ${error}` });
  });
}

export { doValidation };
