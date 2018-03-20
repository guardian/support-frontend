// @flow

// // ----- Imports ----- //

import { reducer } from 'reducers/contributions-landing/contributionsLandingReducer';


// ----- Initial State ----- //

const initialStateOverrides = {
  oneOffAmount: '50',
  monthlyAmount: '10',
  annualAmount: '75', // <-- this needs to DIE!
};


// ----- Reducer ----- //

export default reducer(initialStateOverrides);
