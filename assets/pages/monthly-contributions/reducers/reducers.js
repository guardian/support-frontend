// @flow

// ----- Imports ----- //

import validateContribution from '../helpers/validation';
import type { Action } from '../actions/monthlyContributionsActions';


// ----- Reducers ----- //

export default function reducer(state: number = 5, action: Action): number {

  switch (action.type) {

    case 'SET_CONTRIB_AMOUNT':
      return validateContribution(action.amount);

    default:
      return state;

  }

}
