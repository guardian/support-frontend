// @flow

// ----- Imports ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Types ----- //

export type Action =
  | { type: 'SET_COUNTRY', country: IsoCountry }
  | { type: 'SET_COUNTRY_GROUP', countryGroup: CountryGroupId };

// ----- Action Creators ----- //

function setCountry(country: IsoCountry): Action {
  return { type: 'SET_COUNTRY', country };
}

function setCountryGroup(countryGroup: CountryGroupId): Action {
  return { type: 'SET_COUNTRY_GROUP', countryGroup };
}

// ----- Exports ----- //

export {
  setCountry,
  setCountryGroup,
};
