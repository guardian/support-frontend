// @flow

// ----- Imports ----- //

import {
  detect as detectCountry,
  type IsoCountry,
} from 'helpers/internationalisation/country';

// ----- Functions ----- //

export const ccpaEnabled = (): boolean => {
  const useCCPA = true; // set false to switch CCPA off
  const countryId: IsoCountry = detectCountry();

  return useCCPA && countryId === 'US';
};
