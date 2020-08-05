// @flow

// ----- Imports ----- //

import {
  detect as detectCountry,
  type IsoCountry,
} from 'helpers/internationalisation/country';
import { isSwitchOn } from 'helpers/globals';

// ----- Functions ----- //

export const ccpaEnabled = (): boolean => {
  const useCCPA = isSwitchOn('ccpaEnabled');
  const countryId: IsoCountry = detectCountry();

  return useCCPA && countryId === 'US';
};
