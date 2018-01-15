// @flow

import { routes } from 'helpers/routes';

// ----- Types ----- //

export type Action =
  | { type: 'MARKETING_PREFERENCES_SELECTED' };


// ----- Actions ----- //
function setMarketingPreferencesSelected(): Action {
  return { type: 'MARKETING_PREFERENCES_SELECTED' };
}

// Fire and forget, as we don't want to interupt the flow
function sendMarketingPreferencesToIdentity(optIn: boolean, email: string): Function {
  return () => {
    if (optIn) {
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
