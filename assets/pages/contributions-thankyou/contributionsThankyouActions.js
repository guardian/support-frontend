import { routes } from 'helpers/routes';


// @flow

// ----- Types ----- //

export type Action =
  | { type: 'MARKETING_PREFERENCES_SELECTED' };


// ----- Actions ----- //
function setMarketingPreferencesSelected(): Action {
  return { type: 'MARKETING_PREFERENCES_SELECTED' };
}

// Fire and forget
function sendMarketingPreferencesToIdentity(optIn: boolean, email: string): Function {
  return () => {
    if (optIn) {
      // fire and forget
      return fetch(`${routes.recurringContributionsSendMarketing}?email=${email}`);
    }
    return null;
  };
}

// ----- Exports ----- //

export {
  setMarketingPreferencesSelected,
  sendMarketingPreferencesToIdentity,
};
