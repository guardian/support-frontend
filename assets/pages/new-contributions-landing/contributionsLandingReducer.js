// @flow

// ----- Imports ----- //

import { type PaymentMethod } from 'helpers/checkouts';
import { amounts, type Amount, type Contrib } from 'helpers/contributions';
import { type CommonState } from 'helpers/page/page';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import { type Action } from './contributionsLandingActions';

// ----- Types ----- //

type PageState = {
  contributionType: Contrib,
  paymentMethod: PaymentMethod,
  amount: Amount | null,
  showOtherAmount: boolean,
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
    paymentMethod: 'Stripe',
    amount: amounts('notintest').ONE_OFF[countryGroupId][0],
    showOtherAmount: false,
  };

  return function reducer(state: PageState = initialState, action: Action): PageState {
    switch (action.type) {
      case 'UPDATE_CONTRIBUTION_TYPE':
        return {
          ...state,
          contributionType: action.contributionType,
          amount: amounts('notintest')[action.contributionType][countryGroupId][0],
          showOtherAmount: false,
        };

      case 'UPDATE_PAYMENT_METHOD':
        return { ...state, paymentMethod: action.paymentMethod };

      case 'SELECT_AMOUNT':
        return { ...state, amount: action.amount, showOtherAmount: false };

      case 'SELECT_OTHER_AMOUNT':
        return { ...state, amount: null, showOtherAmount: true };

      default:
        return state;
    }
  };
}


// ----- Reducer ----- //

export { initReducer };
