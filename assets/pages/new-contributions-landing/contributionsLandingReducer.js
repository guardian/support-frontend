// @flow

// ----- Imports ----- //

import { type PaymentMethod } from 'helpers/checkouts';
import { amounts, type Contrib } from 'helpers/contributions';
import { type CommonState } from 'helpers/page/page';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import { type Action } from './contributionsLandingActions';

// ----- Types ----- //

type PageState = {
  contributionType: Contrib,
  paymentMethod: PaymentMethod,
  amount?: Amount,
  otherAmount?: number,
};

export type State = {
  common: CommonState,
  page: PageState,
};

// ----- Initial state ----- //

// ----- Functions ----- //

function initReducer(countryGroupId: CountryGroupId) {
  
  const initialState: PageState = {
    contributionType: 'ONE_OFF',
    paymentMethod: 'PayPal',
    amount: amounts('notintest')['ONE_OFF'][countryGroupId][0],
  };

  return function reducer(state: PageState = initialState, action: Action): PageState {
    switch (action.type) {
      case 'UPDATE_CONTRIBUTION_TYPE':
        return { 
          ...state, 
          contributionType: action.contributionType, 
          amount: amounts('notintest')[action.contributionType][countryGroupId][0], 
          otherAmount: null 
        };

      case 'UPDATE_PAYMENT_METHOD':
        return { ...state, paymentMethod: action.paymentMethod };

      case 'SELECT_AMOUNT':
        return { ...state, amount: action.amount, otherAmount: null };

      case 'SELECT_OTHER_AMOUNT':
        return { ...state, amount: null, otherAmount: 1 };

      default:
        return state;
    }
  }
}


// ----- Reducer ----- //

export { initReducer };
