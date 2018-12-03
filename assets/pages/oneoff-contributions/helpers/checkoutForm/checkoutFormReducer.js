// @flow

// ----- Imports ----- //
import { type Action } from './checkoutFormActions';

// ----- Types ----- //


export type OneOffContributionsCheckoutFormState = {
  checkoutFormHasBeenSubmitted: boolean,
};

// ----- Setup ----- //

const initialState: OneOffContributionsCheckoutFormState = {
  checkoutFormHasBeenSubmitted: false,
};


// ----- Reducer ----- //

function checkoutFormReducer(
  state: OneOffContributionsCheckoutFormState = initialState,
  action: Action,
): OneOffContributionsCheckoutFormState {

  switch (action.type) {

    case 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED':
      return { ...state, checkoutFormHasBeenSubmitted: true };

    default:
      return state;
  }

}

export { checkoutFormReducer };
