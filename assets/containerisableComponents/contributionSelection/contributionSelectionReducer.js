// @flow

// ----- Imports ----- //

import { parse as parseContribution } from 'helpers/contributions';

import type {
  Contrib as ContributionType,
  ContribError as ContributionError,
} from 'helpers/contributions';

import type { Action } from './contributionSelectionActions';


// ----- Types ----- //

export type State = {
  contributionType: ContributionType,
  oneOffAmount: string,
  monthlyAmount: string,
  annualAmount: string,
  isCustomAmount: boolean,
  customAmount: ?number,
  error: ?ContributionError,
};

type ParsedCustomAmount = {|
  error: ContributionError,
  customAmount: null,
|} | {|
  error: null,
  customAmount: number,
|};


// ----- Setup ----- //

const initialState: State = {
  contributionType: 'MONTHLY',
  oneOffAmount: '50',
  monthlyAmount: '5',
  annualAmount: '75',
  customAmount: null,
  isCustomAmount: false,
  error: null,
};


// ----- Functions ----- //

// Changes the amount of the currently selected type of contribution.
function updatePredefinedAmount(state: State, newAmount: string): State {

  const resetCustom = { isCustomAmount: false, error: null };

  switch (state.contributionType) {
    case 'ONE_OFF':
      return { ...state, ...resetCustom, oneOffAmount: newAmount };
    case 'MONTHLY':
      return { ...state, ...resetCustom, monthlyAmount: newAmount };
    case 'ANNUAL':
      return { ...state, ...resetCustom, annualAmount: newAmount };
    default:
      return state;
  }

}

// Checks if the custom amount is acceptable, returns a specific error if not.
function parseCustomAmount(
  contributionType: ContributionType,
  customAmount: string,
): ParsedCustomAmount {

  const { error, amount } = parseContribution(customAmount, contributionType);

  if (error) {
    return { error, customAmount: null };
  }

  return { error: null, customAmount: amount };

}

// Re-parses the custom amount when the contribution type is changed.
function checkCustomAmount(
  isCustomAmount: boolean,
  customAmount: ?number,
  contributionType: ContributionType,
): ?ParsedCustomAmount {

  if (isCustomAmount && customAmount) {
    return parseCustomAmount(contributionType, customAmount.toString());
  }

  return null;

}


// ----- Selectors ----- //

// Retrieves the amount for the currently chosen contribution type.
function getAmount(state: State): string {

  if (state.isCustomAmount && state.customAmount) {
    return state.customAmount.toString();
  }

  switch (state.contributionType) {
    case 'ONE_OFF':
      return state.oneOffAmount;
    case 'MONTHLY':
      return state.monthlyAmount;
    default:
    case 'ANNUAL':
      return state.annualAmount;
  }

}


// ----- Reducer ----- //

function contributionSelectionReducerFor(scope: string): Function {

  function contributionSelectionReducer(state: State = initialState, action: Action): State {

    if (action.scope !== scope) {
      return state;
    }

    switch (action.type) {
      case 'SET_CONTRIBUTION_TYPE':

        return {
          ...state,
          contributionType: action.contributionType,
          ...checkCustomAmount(state.isCustomAmount, state.customAmount, action.contributionType),
        };

      case 'SET_AMOUNT':
        return updatePredefinedAmount(state, action.amount);
      case 'SET_CUSTOM_AMOUNT':

        return {
          ...state,
          isCustomAmount: true,
          ...parseCustomAmount(state.contributionType, action.amount),
        };

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
};
