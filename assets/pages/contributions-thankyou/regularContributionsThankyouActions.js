import { routes } from 'helpers/routes';


// @flow

// ----- Types ----- //

export type Action =
  | { type: 'SEND_MARKETING_PREFERENCES', optInt: boolean}
  | { type: 'MARKETING_PREFERENCES_SELECTED' };


// ----- Actions ----- //
function setMarketingPreferencesSelected(): Action {
  return { type: 'MARKETING_PREFERENCES_SELECTED' };
}

function sendMarketingPreferencesToIdentity(optIn: boolean): Function {
  return (dispatch) => {
    return fetch(routes.recurringContributionsSendMarketing).then(response => {
      console.log(response)
    });

};
}

// ----- Exports ----- //

export {
  setMarketingPreferencesSelected,
  sendMarketingPreferencesToIdentity,
};
