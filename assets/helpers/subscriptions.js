// @flow

// ----- Imports ----- //

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Config ----- //

const digitalSubPrices: {
  [CountryGroupId]: number,
} = {
  GBPCountries: 11.99,
  UnitedStates: 19.99,
  AUDCountries: 21.50,
  International: 19.99,
};


// ----- Exports ----- //

export { digitalSubPrices };
