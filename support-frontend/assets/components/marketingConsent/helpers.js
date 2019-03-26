// @flow

// ----- Imports ----- //
import { routes } from 'helpers/routes';
import { logException } from 'helpers/logger';
import { marketingConsentActionsFor } from './marketingConsentActions';

// ----- Functions ----- //

const requestData = (email: string) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'same-origin',
  body: JSON.stringify({ email }),
});

// Fire and forget, as we don't want to interrupt the flow
function sendMarketingPreferencesToIdentity(
  optIn: boolean,
  email: string,
  dispatch: Function,
  scope: string,
): void {
  const { setConfirmMarketingConsent, setAPIError, setRequestPending } = marketingConsentActionsFor(scope);

  if (!optIn) {
    dispatch(setConfirmMarketingConsent(false));
    return;
  }

  dispatch(setRequestPending(true));
  fetch(`${routes.contributionsSendMarketing}`, requestData(email))
    .then((response) => {

      dispatch(setRequestPending(false));
      if (response.status === 200) {
        dispatch(setConfirmMarketingConsent(optIn));
      } else {
        logException('Marketing preference API returned an error');
        dispatch(setAPIError(true));
      }
    })
    .catch(() => {
      dispatch(setRequestPending(false));
      logException('Error while trying to interact with the marketing preference API');
      dispatch(setAPIError(true));
    });
}

// ----- Exports ----- //

export { sendMarketingPreferencesToIdentity };
