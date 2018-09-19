// @flow

// ----- Imports ----- //

import { type CountryGroupId, countryGroups } from 'helpers/internationalisation/countryGroup';


// ----- Setup ----- //

const source = 'support.theguardian.com';


// ----- Functions ----- //

function getAppReferrer(medium: string, cGId: CountryGroupId) {

  const countryId = countryGroups[cGId].supportInternationalisationId;

  return `utm_source=${source}&utm_medium=${medium}&utm_campaign=${countryId}`;

}


// ----- Exports ----- //

export { getAppReferrer };
