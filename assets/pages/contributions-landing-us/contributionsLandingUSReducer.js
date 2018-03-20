// @flow

// // ----- Imports ----- //

import { reducer } from 'reducers/contributions-landing/contributionsLandingReducer';


// ----- Initial State ----- //

const initialStateOverrides = {
  oneOffAmount: '50',
  monthlyAmount: '15',
  annualAmount: '75',
};


// ----- Reducer ----- //

export default reducer(initialStateOverrides);
