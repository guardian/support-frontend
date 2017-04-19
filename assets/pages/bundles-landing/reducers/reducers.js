// ----- Imports ----- //

import { combineReducers } from 'redux';


// ----- Setup ----- //

const initialContribAmount = {
  recurring: {
    amount: '5',
    userDefined: false,
  },
  oneOff: {
    amount: '25',
    userDefined: false,
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

function contribType(state = 'RECURRING', action) {

  switch (action.type) {
    case 'CHANGE_CONTRIB_TYPE':
      return action.payload;
    default:
      return state;
  }

}

function contribAmount(state = initialContribAmount, action) {

  switch (action.type) {
    case 'CHANGE_CONTRIB_AMOUNT_RECURRING':
      return Object.assign({}, state, { recurring: action.payload });
    case 'CHANGE_CONTRIB_AMOUNT_ONEOFF':
      return Object.assign({}, state, { oneOff: action.payload });
    default:
      return state;
  }

}


// ----- Exports ----- //

export default combineReducers({
  paperBundle,
  contribType,
  contribAmount,
});
