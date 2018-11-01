// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/page';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { createUserReducer, type User as UserState } from 'helpers/user/userReducer';
import { type Action } from './digitalSubscriptionCheckoutActions';
import { marketingConsentReducerFor, type State as MarketingConsentState } from "components/marketingConsent/marketingConsentReducer";


// ----- Types ----- //

export type Stage = 'checkout' | 'thankyou';


type CheckoutState = {
  stage: Stage,
}

type PageState = {
  checkout: CheckoutState,
  user: UserState,
  marketingConsent: MarketingConsentState,
};

export type State = {
  common: CommonState,
  page: PageState,
};


// ----- Reducer ----- //

const initialState = {
  stage: 'checkout',
};

function reducer(state: CheckoutState = initialState, action: Action): CheckoutState {

  switch (action.type) {

    case 'SET_STAGE':
      return { ...state, stage: action.stage };

    default:
      return state;

  }

}

function initReducer(countryGroupId: CountryGroupId) {
  const checkoutState = reducer;
  const userState = createUserReducer(countryGroupId);
  const marketingState = marketingConsentReducerFor('DIGITAL_SUBSCRIPTION_CHECKOUT');
  return combineReducers({
    checkout: checkoutState,
    user: userState,
    marketingConsent: marketingState,
  });
}

// ----- Export ----- //

export default initReducer;
