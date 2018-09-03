// @flow

// ----- Imports ----- //

import { type PaymentMethod } from 'helpers/checkouts';
import { type Contrib } from 'helpers/contributions';
import { type CommonState } from 'helpers/page/page';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import { type Action } from './contributionsLandingActions';

// ----- Types ----- //

type PageState = {
  contributionType: Contrib,
  paymentMethod: PaymentMethod,
  amount?: string,
};

export type State = {
  common: CommonState,
  page: PageState,
};

// ----- Initial state ----- //

const initialState: PageState = {
  contributionType: 'ONE_OFF',
  paymentMethod: 'PayPal',
};

// ----- Functions ----- //

function reducer(state: PageState = initialState, action: Action): PageState {
  switch (action.type) {
    case 'UPDATE_CONTRIBUTION_TYPE':
      return { ...state, contributionType: action.contributionType, amount: null };

    case 'UPDATE_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.paymentMethod };

    case 'SELECT_AMOUNT':
      return { ...state, amount: action.amount };

    default:
      return state;
  }
}


// ----- Reducer ----- //

export { reducer };
