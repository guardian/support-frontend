// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/page';

import { type Action } from './digitalSubscriptionCheckoutActions';


// ----- Types ----- //

export type Stage = 'checkout' | 'thankyou';

type PageState = {
  stage: Stage;
};

export type State = {
  common: CommonState,
  page: PageState,
};


// ----- Reducer ----- //

const initialState = {
  stage: 'checkout',
};

function reducer(state: PageState = initialState, action: Action): PageState {

  switch (action.type) {

    case 'SET_STAGE':
      return { ...state, stage: action.stage };

    default:
      return state;

  }

}


// ----- Export ----- //

export default reducer;
