// @flow

// ----- Imports ----- //
import { routes } from 'helpers/routes';
import { logException } from 'helpers/logger';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

import { marketingConsentActionsFor } from './marketingConsentActions';

// ----- Functions ----- //

const requestData = (email: string, csrf: CsrfState) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Csrf-Token': csrf.token || '' },
  credentials: 'same-origin',
  body: JSON.stringify({ email }),
});

// Fire and forget, as we don't want to interrupt the flow
function sendMarketingPreferencesToIdentity(
  optIn: boolean,
  email: string,
  dispatch: Function,
  csrf: CsrfState,
  scope: string,
): void {

  const setConsentApiError = marketingConsentActionsFor(scope).setAPIError;
  const { setConfirmMarketingConsent } = marketingConsentActionsFor(scope);

  if (!optIn) {
    dispatch(setConfirmMarketingConsent(false));
    return;
  }

  fetch(`${routes.contributionsSendMarketing}`, requestData(email, csrf))
    .then((response) => {
      if (response.status === 200) {
        dispatch(setConfirmMarketingConsent(optIn));
      } else {
        logException('Marketing preference API returned an error');
        dispatch(setConsentApiError(true));
      }
    })
    .catch(() => {
      logException('Error while trying to interact with the marketing preference API');
      dispatch(setConsentApiError(true));
    });
}

// ----- Exports ----- //

export { sendMarketingPreferencesToIdentity };
