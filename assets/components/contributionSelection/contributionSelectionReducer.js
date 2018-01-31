// @flow

// ----- Imports ----- //

import { parse as parseContribution } from 'helpers/contributions';

import type {
  Contrib as ContributionType,
  ContribError as ContributionError,
} from 'helpers/contributions';


// ----- Types ----- //

type PredefinedAmounts = {
  oneOff: number,
  monthly: number,
  annual: number,
};

export type State = {
  contributionType: ContributionType,
  predefinedAmounts: PredefinedAmounts,
  customAmount: ?string,
  error: ?ContributionError,
};


// ----- Setup ----- //

const initialState: State = {
  contributionType: 'MONTHLY',
  predefinedAmounts: {
    oneOff: 50,
    monthly: 5,
    annual: 75,
  },
  customAmount: null,
  error: null,
};


// ----- Functions ----- //

// Changes the amount of the currently selected type of contribution.
function updatePredefinedAmount(state: State, newAmount: number): PredefinedAmounts {

  switch (state.contributionType) {
    case 'ONE_OFF':
      return { ...state.predefinedAmounts, oneOffAmount: newAmount };
    case 'MONTHLY':
      return { ...state.predefinedAmounts, monthlyAmount: newAmount };
    case 'ANNUAL':
      return { ...state.predefinedAmounts, annualAmount: newAmount };
    default:
      return state.predefinedAmounts;
  }

}

// Checks if the custom amount is acceptable, returns a specific error if not.
function parseCustomAmount(state, customAmount) {

  const { error, amount } = parseContribution(customAmount, state.contributionType);

  if (error) {
    return { error };
  }

  return { amount };

}


// ----- Selectors ----- //

// Retrieves the amount for the currently chosen contribution type.
function getAmount(state: State): number {

  switch (state.contributionType) {
    case 'ONE_OFF':
      return state.predefinedAmounts.oneOff;
    case 'MONTHLY':
      return state.predefinedAmounts.monthly;
    default:
    case 'ANNUAL':
      return state.predefinedAmounts.annual;
  }

}

// Checks if a custom amount is defined.
function isCustomAmount(state: State): boolean {
  return state.customAmount !== null;
}


// ----- Reducer ----- //

function contributionSelectionReducerFor(prefix: string): Function {

  function contributionSelectionReducer(state: State = initialState, action) {

    switch (action.type) {
      case `${prefix}_SET_CONTRIBUTION_TYPE`:
        return { ...state, contributionType: action.payload };
      case `${prefix}_SET_AMOUNT`:
        return {
          ...state,
          ...updatePredefinedAmount(state, action.payload),
          customAmount: null,
        };
      case `${prefix}_SET_CUSTOM_AMOUNT`:
        return { ...state, ...parseCustomAmount(state, action.payload) };
      default:
        return state;
    }

  }

  return contributionSelectionReducer;

}


// ----- Exports ----- //

export {
  contributionSelectionReducerFor,
  getAmount,
  isCustomAmount,
};
