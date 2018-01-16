// @flow

import { routes } from 'helpers/routes';

// ----- Types ----- //
// ----- Actions ----- //
function setMarketingPreferencesSelected(optIn: boolean) {
  const params = new URLSearchParams();
  const optInParam = optIn ? 'yes' : 'no';
  params.append('optIn', optInParam);
  window.location = `${routes.contributionsMarketingConfirm}?${params.toString()}`;
}

// Fire and forget, as we don't want to interupt the flow
function sendMarketingPreferencesToIdentity(optIn: boolean, email?: string): Function {
  return () => {
    if (optIn && email) {
      return fetch(`${routes.contributionsSendMarketing}?email=${email}`);
    }
    return null;
  };
}

// ----- Exports ----- //

export {
  setMarketingPreferencesSelected,
  sendMarketingPreferencesToIdentity,
};
