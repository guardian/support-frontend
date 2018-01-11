import { routes } from 'helpers/routes';


// @flow

// ----- Types ----- //

export type Action =
  | { type: 'MARKETING_PREFERENCES_SELECTED' };


// ----- Actions ----- //
function setMarketingPreferencesSelected(): Action {
  return { type: 'MARKETING_PREFERENCES_SELECTED' };
}

function sendMarketingPreferencesToIdentity(optIn: boolean, email: string): Function {
  return (dispatch) => {
    if (optIn) {
      // fire and forget
      return fetch(`${routes.recurringContributionsSendMarketing}?email=${email}`);
    }
};
}

// ----- Exports ----- //

export {
  setMarketingPreferencesSelected,
  sendMarketingPreferencesToIdentity,
};
