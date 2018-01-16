// @flow

import { routes } from 'helpers/routes';

// ----- Actions ----- //
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
  sendMarketingPreferencesToIdentity,
};
