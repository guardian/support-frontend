// @flow

// ----- Imports ----- //

import type { Contrib, Amount } from 'helpers/contributions';
import type IsoCountry from 'helpers/internationalisation/country';
import detect from 'helpers/internationalisation/country';

// ----- Types ----- //

export type Action =
  | { type: 'SET_COUNTRY', isoCountry: IsoCountry }
  | { type: 'CHANGE_CONTRIB_TYPE', contribType: Contrib }
  | { type: 'CHANGE_CONTRIB_AMOUNT', amount: Amount }
  | { type: 'CHANGE_CONTRIB_AMOUNT_RECURRING', amount: Amount }
  | { type: 'CHANGE_CONTRIB_AMOUNT_ONEOFF', amount: Amount }
  ;

// ----- Actions ----- //

export function setCountryFromDetect(): Action {
  const isoCountry: IsoCountry = detect();
  return { type: 'SET_COUNTRY', isoCountry };
}

export function changeContribType(contribType: Contrib): Action {
  return { type: 'CHANGE_CONTRIB_TYPE', contribType };
}

export function changeContribAmount(amount: Amount): Action {
  return { type: 'CHANGE_CONTRIB_AMOUNT', amount };
}

export function changeContribAmountRecurring(amount: Amount): Action {
  return { type: 'CHANGE_CONTRIB_AMOUNT_RECURRING', amount };
}

export function changeContribAmountOneOff(amount: Amount): Action {
  return { type: 'CHANGE_CONTRIB_AMOUNT_ONEOFF', amount };
}
