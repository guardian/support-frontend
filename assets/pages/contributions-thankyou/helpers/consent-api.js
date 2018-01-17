// @flow

// ----- Imports ----- //
import { routes } from 'helpers/routes';
import { setConsentApiError } from '../contributionsThankYouActions';

// ----- Functions ----- //

const marketingConfirmUrl = (marketingPreferencesOptIn: boolean) => {
  const params = new URLSearchParams();
  const optInParam = marketingPreferencesOptIn === true ? 'yes' : 'no';
  params.append('optIn', optInParam);
  return `${routes.contributionsMarketingConfirm}?${params.toString()}`;
};

// Fire and forget, as we don't want to interupt the flow
function sendMarketingPreferencesToIdentity(optIn: boolean, email: string, dispatch: Function) {
  if (optIn) {
    fetch(`${routes.contributionsSendMarketing}?email=${email}`)
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

export {
  sendMarketingPreferencesToIdentity,
};
