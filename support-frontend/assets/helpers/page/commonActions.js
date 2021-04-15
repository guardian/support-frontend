// @flow

// ----- Imports ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ExistingPaymentMethod } from 'helpers/existingPaymentMethods/existingPaymentMethods';
import type { ContributionTypes } from 'helpers/contributions';

// ----- Types ----- //

export type SetCountryAction = { type: 'SET_COUNTRY_INTERNATIONALISATION', country: IsoCountry };

export type Action =
  | SetCountryAction
  | { type: 'SET_EXISTING_PAYMENT_METHODS', existingPaymentMethods: ExistingPaymentMethod[] }
  | { type: 'SET_CONTRIBUTION_TYPES', contributionTypes: ContributionTypes }
  | { type: 'SET_USE_LOCAL_CURRENCY', useLocalCurrency: boolean }
  | { type: 'SET_USE_LOCAL_AMOUNTS', useLocalAmounts: boolean };


// ----- Action Creators ----- //

function setCountry(country: IsoCountry): SetCountryAction {
  return { type: 'SET_COUNTRY_INTERNATIONALISATION', country };
}

function setUseLocalCurrency(useLocalCurrency: boolean): Action {
  return { type: 'SET_USE_LOCAL_CURRENCY', useLocalCurrency };
}

function setUseLocalAmounts(useLocalAmounts: boolean): Action {
  return { type: 'SET_USE_LOCAL_AMOUNTS', useLocalAmounts };
}

function setExistingPaymentMethods(existingPaymentMethods: ExistingPaymentMethod[]): Action {
  return { type: 'SET_EXISTING_PAYMENT_METHODS', existingPaymentMethods };
}

function setContributionTypes(contributionTypes: ContributionTypes) {
  return { type: 'SET_CONTRIBUTION_TYPES', contributionTypes };
}

// ----- Exports ----- //

export {
  setCountry,
  setExistingPaymentMethods,
  setContributionTypes,
  setUseLocalCurrency,
  setUseLocalAmounts,
};
