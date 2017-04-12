// ----- Imports ----- //

import { combineReducers } from 'redux';


// ----- Reducers ----- //

function paperBundle(state = 'PAPER+DIGITAL', action) {

  switch (action.type) {
    case 'CHANGE_PAPER_BUNDLE':
      return action.payload;
    default:
      return state;
  }

}

function contribPeriod(state = 'MONTHLY', action) {

  switch (action.type) {
    case 'CHANGE_CONTRIB_PERIOD':
      return action.payload;
    default:
      return state;
  }

}


// ----- Exports ----- //

export default combineReducers({
  paperBundle,
  contribPeriod,
});
