// @flow

import { type Store } from 'redux';
import { contributionSelectionActionsFor } from 'components/contributionSelection/contributionSelectionActions';
import type { AnnualContributionsTestVariant } from '../abtestDefinitions';

/* eslint-disable quote-props */
const numbersInWords = {
  '25': 'twenty five',
  '35': 'thirty five',
  '50': 'fifty',
  '75': 'seventy five',
  '100': 'one hundred',
  '125': 'one hundred and twenty five',
  '250': 'two hundred and fifty',
  '300': 'three hundred',
  '500': 'five hundred',
  '750': 'seven hundred and fifty',
};
/* eslint-enable  quote-props */

const Control = {
  defaults: {
    GBPCountries: '100',
    UnitedStates: '100',
    AUDCountries: '100',
    EURCountries: '100',
    International: '100',
    NZDCountries: '50',
    Canada: '100',
  },

  standard: [
    { value: '50', spoken: numbersInWords['50'], isDefault: false },
    { value: '100', spoken: numbersInWords['100'], isDefault: true },
    { value: '250', spoken: numbersInWords['250'], isDefault: false },
    { value: '500', spoken: numbersInWords['500'], isDefault: false },
  ],

  newZealand: [
    { value: '50', spoken: numbersInWords['50'], isDefault: true },
    { value: '100', spoken: numbersInWords['100'], isDefault: false },
    { value: '250', spoken: numbersInWords['250'], isDefault: false },
    { value: '500', spoken: numbersInWords['500'], isDefault: false },
  ],

  australia: [
    { value: '100', spoken: numbersInWords['100'], isDefault: true },
    { value: '250', spoken: numbersInWords['250'], isDefault: false },
    { value: '500', spoken: numbersInWords['500'], isDefault: false },
    { value: '750', spoken: numbersInWords['750'], isDefault: false },
  ],
};

const VariantA = {
  defaults: {
    GBPCountries: '100',
    UnitedStates: '75',
    AUDCountries: '300',
    EURCountries: '100',
    International: '50',
    NZDCountries: '100',
    Canada: '100',
  },

  standard: [
    { value: '75', spoken: numbersInWords['75'], isDefault: false },
    { value: '100', spoken: numbersInWords['100'], isDefault: true },
    { value: '250', spoken: numbersInWords['250'], isDefault: false },
    { value: '500', spoken: numbersInWords['500'], isDefault: false },
  ],

  us: [
    { value: '35', spoken: numbersInWords['35'], isDefault: false },
    { value: '75', spoken: numbersInWords['75'], isDefault: true },
    { value: '125', spoken: numbersInWords['125'], isDefault: false },
    { value: '250', spoken: numbersInWords['250'], isDefault: false },
  ],

  australia: [
    { value: '125', spoken: numbersInWords['125'], isDefault: false },
    { value: '300', spoken: numbersInWords['300'], isDefault: true },
    { value: '500', spoken: numbersInWords['500'], isDefault: false },
    { value: '750', spoken: numbersInWords['750'], isDefault: false },
  ],

  international: [
    { value: '25', spoken: numbersInWords['25'], isDefault: false },
    { value: '50', spoken: numbersInWords['50'], isDefault: true },
    { value: '100', spoken: numbersInWords['100'], isDefault: false },
    { value: '250', spoken: numbersInWords['250'], isDefault: false },
  ],

  newZealand: [
    { value: '100', spoken: numbersInWords['100'], isDefault: true },
    { value: '250', spoken: numbersInWords['250'], isDefault: false },
    { value: '500', spoken: numbersInWords['500'], isDefault: false },
    { value: '750', spoken: numbersInWords['750'], isDefault: false },
  ],
};

export const getAnnualAmounts = (annualTestVariant: AnnualContributionsTestVariant) => {
  if (annualTestVariant === 'annualAmountsA') {
    return {
      GBPCountries: VariantA.standard,
      UnitedStates: VariantA.us,
      AUDCountries: VariantA.australia,
      EURCountries: VariantA.standard,
      International: VariantA.international,
      NZDCountries: VariantA.newZealand,
      Canada: VariantA.standard,
    };
  }
  return {
    GBPCountries: Control.standard,
    UnitedStates: Control.standard,
    AUDCountries: Control.australia,
    EURCountries: Control.standard,
    International: Control.standard,
    NZDCountries: Control.newZealand,
    Canada: Control.standard,
  };
};

// For the old payment flow only
export function setInitialAmountsForAnnualVariants(store: Store<*, *, *>) {
  const annualTestVariant = store.getState().common.abParticipations.annualContributionsRoundThree;
  const { countryGroupId } = store.getState().common.internationalisation;
  const amount = annualTestVariant === 'control' ? Control.defaults[countryGroupId] : VariantA.defaults[countryGroupId];
  store.dispatch(contributionSelectionActionsFor('CONTRIBUTE_SECTION').setAmountForContributionType('ANNUAL', amount));
}
