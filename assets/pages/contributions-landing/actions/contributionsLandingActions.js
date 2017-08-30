// @flow

// ----- Imports ----- //

import type { Contrib, Amount } from 'helpers/contributions';


// ----- Types ----- //

export type Action =
  | { type: 'CHANGE_CONTRIB_TYPE', contribType: Contrib }
  | { type: 'CHANGE_CONTRIB_AMOUNT', amount: Amount }
  | { type: 'CHANGE_CONTRIB_AMOUNT_RECURRING', amount: Amount }
  | { type: 'CHANGE_CONTRIB_AMOUNT_ONEOFF', amount: Amount }
  | { type: 'PAYPAL_ERROR', message: string }
  ;


// ----- Actions ----- //

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

export function payPalError(message: string): Action {
  return { type: 'PAYPAL_ERROR', message };
}
