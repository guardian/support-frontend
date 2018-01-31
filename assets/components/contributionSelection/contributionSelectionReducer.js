// @flow

// ----- Imports ----- //

import type {
  Contrib as ContributionType,
  ContribError as ContributionError,
} from 'helpers/contributions';


// ----- Types ----- //

export type State = {
  contributionType: ContributionType,
  oneOffAmount: number,
  monthlyAmount: number,
  annualAmount: number,
  customAmount: ?number,
  error: ?ContributionError,
};


// ----- Setup ----- //

const initialState: State = {
  contributionType: 'MONTHLY',
  oneOffAmount: 50,
  monthlyAmount: 5,
  annualAmount: 75,
  customAmount: null,
  error: null,
};


// ----- Functions ----- //

// Changes the amount of the currently selected type of contribution.
function updateAmount(state, newAmount) {

  switch (state.contributionType) {
    case 'ONE_OFF':
      return { oneOffAmount: newAmount };
    case 'MONTHLY':
      return { monthlyAmount: newAmount };
    case 'ANNUAL':
      return { annualAmount: newAmount };
    default:
      return {};
  }

}


// ----- Selectors ----- //

// Retrieves the amount for the currently chosen contribution type.
function getAmount(state: State): number {

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

function contributionSelectionReducerFor(prefix: string): Function {

  function contributionSelectionReducer(state: State = initialState, action) {

    switch (action.type) {
      case `${prefix}_SET_CONTRIBUTION_TYPE`:
        return { ...state, contributionType: action.payload };
      case `${prefix}_SET_AMOUNT`:
        return { ...state, ...updateAmount(state, action.payload), customAmount: null };
      case `${prefix}_SET_CUSTOM_AMOUNT`:
        return { ...state, customAmount: action.payload };
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
