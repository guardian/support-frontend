// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import validateContribution from '../helpers/validation';
import type { Action } from '../actions/bundlesLandingActions';


// ----- Types ----- //

export type Contrib = 'RECURRING' | 'ONE_OFF';

export type ContribError =
  | 'tooLittleRecurring'
  | 'tooLittleOneOff'
  | 'tooMuch'
  | 'noEntry'
  ;

export type Amount = {
  value: string,
  userDefined: boolean,
};

export type Amounts = {
  recurring: Amount,
  oneOff: Amount,
};

export type PaperBundle = 'PAPER+DIGITAL' | 'PAPER';

export type ContribState = {
  type: Contrib,
  error: ?ContribError,
  amount: Amounts,
};


// ----- Setup ----- //

const initialContrib: ContribState = {
  type: 'RECURRING',
  error: null,
  amount: {
    recurring: {
      value: '5',
      userDefined: false,
    },
    oneOff: {
      value: '25',
      userDefined: false,
    },
  },
};

// ----- Functions ----//
function getQueryParameter(paramName: string, defaultValue: string): string {
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName) || defaultValue;
}

// ----- Reducers ----- //

function paperBundle(
  state: PaperBundle = 'PAPER+DIGITAL',
  action: Action): PaperBundle {

  switch (action.type) {
    case 'CHANGE_PAPER_BUNDLE':
      return action.bundle;
    default:
      return state;
  }

}

function contribution(
  state: ContribState = initialContrib,
  action: Action): ContribState {

  switch (action.type) {

    case 'CHANGE_CONTRIB_TYPE': {

      let amount;

      if (action.contribType === 'ONE_OFF') {
        amount = state.amount.oneOff;
      } else {
        amount = state.amount.recurring;
      }

      return Object.assign({}, state, {
        type: action.contribType,
        error: validateContribution(amount, action.contribType),
      });

    }

    case 'CHANGE_CONTRIB_AMOUNT':

      return Object.assign({}, state, {
        amount: { recurring: action.amount, oneOff: action.amount },
        error: validateContribution(action.amount, state.type),
      });

    case 'CHANGE_CONTRIB_AMOUNT_RECURRING':

      return Object.assign({}, state, {
        amount: { recurring: action.amount, oneOff: state.amount.oneOff },
        error: validateContribution(action.amount, state.type),
      });

    case 'CHANGE_CONTRIB_AMOUNT_ONEOFF':

      return Object.assign({}, state, {
        amount: { recurring: state.amount.recurring, oneOff: action.amount },
        error: validateContribution(action.amount, state.type),
      });

    default:
      return state;

  }

}

function intCmp(state: string = getQueryParameter('INTCMP', 'gdnwb_copts_bundles_landing_default')): string {
  // Since nothing change the intcmp, this reducer does not handle any action.
  return state;
}

// ----- Exports ----- //

export default combineReducers({
  paperBundle,
  contribution,
  intCmp,
});
