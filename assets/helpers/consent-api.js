// @flow

// ----- Imports ----- //
import { routes } from 'helpers/routes';
import { setConsentApiError } from '../pages/contributions-thankyou/contributionsThankYouActions';
import type { Csrf as CsrfState } from './csrf/csrfReducer';

// ----- Functions ----- //

const marketingConfirmUrl = (marketingPreferencesOptIn: boolean) => {
  const params = new URLSearchParams();
  const optInParam = marketingPreferencesOptIn === true ? 'yes' : 'no';
  params.append('optIn', optInParam);
  return `${routes.contributionsMarketingConfirm}?${params.toString()}`;
};

const requestData = (email: string, csrf: CsrfState) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Csrf-Token': csrf.token || '' },
  credentials: 'same-origin',
  body: JSON.stringify({ email }),
});

// Fire and forget, as we don't want to interupt the flow
function sendMarketingPreferencesToIdentity(
  optIn: boolean,
  email: string,
  dispatch: Function,
  csrf: CsrfState,
) {
  if (optIn) {
    fetch(`${routes.contributionsSendMarketing}`, requestData(email, csrf))
      .then((response) => {
        if (response.status === 200) {
          window.location = marketingConfirmUrl(optIn);
        } else {
          dispatch(setConsentApiError(true));
        }
      })
      .catch(() => {
        dispatch(setConsentApiError(true));
      });
  } else {
    window.location = marketingConfirmUrl(optIn);
  }
}

// ----- Exports ----- //

export { sendMarketingPreferencesToIdentity };
