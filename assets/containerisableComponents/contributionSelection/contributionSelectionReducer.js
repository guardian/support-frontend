// @flow

// ----- Imports ----- //

import { circlesParse as parseContribution } from 'helpers/contributions';

import type {
  Contrib as ContributionType,
  ContribError as ContributionError,
  ParsedAmount,
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

// Re-parses the custom amount when the contribution type is changed.
function checkCustomAmount(
  isCustomAmount: boolean,
  customAmount: ?number,
  contributionType: ContributionType,
): ?ParsedAmount {

  if (isCustomAmount && customAmount) {
    return parseContribution(customAmount.toString(), contributionType);
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

function contributionSelectionReducerFor(scope: string, stateOverrides?: Object = {}): Function {

  const updatedInitialState = { ...initialState, ...stateOverrides };

  function contributionSelectionReducer(state: State = updatedInitialState, action: Action): State {

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
          ...parseContribution(action.amount, state.contributionType),
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
