// @flow

// ----- Imports ----- //

import {
  detect as detectCountry,
  type IsoCountry,
} from 'helpers/internationalisation/country';
// import { isTestSwitchedOn } from 'helpers/globals';

// ----- Functions ----- //

export const ccpaEnabled = (): boolean => {
  // const useCCPA = isTestSwitchedOn('ccpaEnabled');
  const useCCPA = true;
  const countryId: IsoCountry = detectCountry();

  return useCCPA && countryId === 'US';
};
