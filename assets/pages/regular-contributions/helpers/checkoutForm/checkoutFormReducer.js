// @flow

// ----- Imports ----- //
import { type Action } from './checkoutFormActions';

// ----- Types ----- //

export type Stage = 'checkout' | 'payment'

export type RegularContributionsCheckoutFormState = {
  checkoutFormHasBeenSubmitted: boolean,
  stage: Stage,
};

// ----- Setup ----- //

const initialState: RegularContributionsCheckoutFormState = {
  checkoutFormHasBeenSubmitted: false,
  stage: 'checkout',
};


// ----- Reducer ----- //

function checkoutFormReducer(
  state: RegularContributionsCheckoutFormState = initialState,
  action: Action,
): RegularContributionsCheckoutFormState {

  switch (action.type) {
    case 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED':
      return { ...state, checkoutFormHasBeenSubmitted: true };

    case 'SET_STAGE':
      return { ...state, stage: action.stage };

    default:
      return state;
  }

}

export { checkoutFormReducer };
