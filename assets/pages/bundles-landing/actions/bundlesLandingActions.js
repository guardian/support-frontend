// @flow

// ----- Imports ----- //

import type { Contrib, Amount } from 'helpers/contributions';


// ----- Types ----- //

export type Action =
  | { type: 'CHANGE_CONTRIB_TYPE', contribType: Contrib }
  | { type: 'CHANGE_CONTRIB_AMOUNT', amount: Amount }
  | { type: 'CHANGE_CONTRIB_AMOUNT_ANNUAL', amount: Amount }
  | { type: 'CHANGE_CONTRIB_AMOUNT_MONTHLY', amount: Amount }
  | { type: 'CHANGE_CONTRIB_AMOUNT_ONEOFF', amount: Amount }
  ;


// ----- Actions ----- //

export function changeContribType(contribType: Contrib): Action {
  return { type: 'CHANGE_CONTRIB_TYPE', contribType };
}

export function changeContribAmount(amount: Amount): Action {
  return { type: 'CHANGE_CONTRIB_AMOUNT', amount };
}

export function changeContribAmountAnnual(amount: Amount): Action {
  return { type: 'CHANGE_CONTRIB_AMOUNT_ANNUAL', amount };
}

export function changeContribAmountMonthly(amount: Amount): Action {
  return { type: 'CHANGE_CONTRIB_AMOUNT_MONTHLY', amount };
}

export function changeContribAmountOneOff(amount: Amount): Action {
  return { type: 'CHANGE_CONTRIB_AMOUNT_ONEOFF', amount };
}
