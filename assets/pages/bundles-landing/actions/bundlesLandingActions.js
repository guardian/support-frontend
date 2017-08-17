// @flow

// ----- Imports ----- //

import type { Contrib, Amount } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';

// ----- Types ----- //

export type Action =
  | { type: 'CHANGE_COUNTRY', isoCountry: IsoCountry }
  | { type: 'CHANGE_CONTRIB_TYPE', contribType: Contrib }
  | { type: 'CHANGE_CONTRIB_AMOUNT', amount: Amount }
  | { type: 'CHANGE_CONTRIB_AMOUNT_RECURRING', amount: Amount }
  | { type: 'CHANGE_CONTRIB_AMOUNT_ONEOFF', amount: Amount }
  ;

// ----- Actions ----- //
export function changeCountry(isoCountry: IsoCountry): Action {
  return { type: 'CHANGE_COUNTRY', isoCountry };
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
