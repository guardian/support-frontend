// @flow

// ----- Imports ----- //

import type { Contrib, Amount } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Types ----- //

export type Action =
  | { type: 'CHANGE_CONTRIB_TYPE', contribType: Contrib, countryGroupId: CountryGroupId }
  | { type: 'CHANGE_CONTRIB_AMOUNT', amount: Amount, countryGroupId: CountryGroupId }
  | { type: 'CHANGE_CONTRIB_AMOUNT_ANNUAL', amount: Amount, countryGroupId: CountryGroupId }
  | { type: 'CHANGE_CONTRIB_AMOUNT_MONTHLY', amount: Amount, countryGroupId: CountryGroupId }
  | { type: 'CHANGE_CONTRIB_AMOUNT_ONEOFF', amount: Amount, countryGroupId: CountryGroupId }
  | { type: 'PAYPAL_ERROR', message: string }
  | { type: 'SET_CONTEXT', context: boolean };


// ----- Actions ----- //

export function changeContribType(contribType: Contrib, countryGroupId: CountryGroupId): Action {
  return { type: 'CHANGE_CONTRIB_TYPE', contribType, countryGroupId };
}

export function changeContribAmount(amount: Amount, countryGroupId: CountryGroupId): Action {
  return { type: 'CHANGE_CONTRIB_AMOUNT', amount, countryGroupId };
}

export function changeContribAmountAnnual(amount: Amount, countryGroupId: CountryGroupId): Action {
  return { type: 'CHANGE_CONTRIB_AMOUNT_ANNUAL', amount, countryGroupId };
}

export function changeContribAmountMonthly(amount: Amount, countryGroupId: CountryGroupId): Action {
  return { type: 'CHANGE_CONTRIB_AMOUNT_MONTHLY', amount, countryGroupId };
}

export function changeContribAmountOneOff(amount: Amount, countryGroupId: CountryGroupId): Action {
  return { type: 'CHANGE_CONTRIB_AMOUNT_ONEOFF', amount, countryGroupId };
}

export function payPalError(message: string): Action {
  return { type: 'PAYPAL_ERROR', message };
}

export function setContext(context: boolean) {
  return { type: 'SET_CONTEXT', context };
}
