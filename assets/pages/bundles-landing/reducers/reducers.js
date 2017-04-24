// ----- Imports ----- //

import { combineReducers } from 'redux';

import validateContribution from '../helpers/validation';


// ----- Setup ----- //

const initialContribState = {
  type: 'RECURRING',
  error: '',
  amount: {
    recurring: {
      amount: '5',
      userDefined: false,
    },
    oneOff: {
      amount: '25',
      userDefined: false,
    },
  },
};


// ----- Reducers ----- //

function paperBundle(state = 'PAPER+DIGITAL', action) {

  switch (action.type) {
    case 'CHANGE_PAPER_BUNDLE':
      return action.payload;
    default:
      return state;
  }

}

function contribution(state = initialContribState, action) {

  switch (action.type) {

    case 'CHANGE_CONTRIB_TYPE': {

      const contribType = action.payload === 'ONE_OFF' ? 'oneOff' : 'recurring';
      const amount = state.amount[contribType].amount;

      return Object.assign({}, state, {
        type: action.payload,
        error: validateContribution(amount, action.payload),
      });

    }

    case 'CHANGE_CONTRIB_AMOUNT':

      return Object.assign({}, state, {
        amount: { recurring: action.payload, oneOff: action.payload },
        error: validateContribution(action.payload.amount, state.type),
      });

    case 'CHANGE_CONTRIB_AMOUNT_RECURRING':

      return Object.assign({}, state, {
        amount: { recurring: action.payload, oneOff: state.amount.oneOff },
        error: validateContribution(action.payload.amount, state.type),
      });

    case 'CHANGE_CONTRIB_AMOUNT_ONEOFF':

      return Object.assign({}, state, {
        amount: { recurring: state.amount.recurring, oneOff: action.payload },
        error: validateContribution(action.payload.amount, state.type),
      });

    default:
      return state;

  }

}


// ----- Exports ----- //

export default combineReducers({
  paperBundle,
  contribution,
});
