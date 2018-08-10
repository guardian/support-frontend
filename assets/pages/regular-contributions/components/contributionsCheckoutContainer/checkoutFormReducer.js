// @flow

// ----- Imports ----- //
import { type Action } from './checkoutFormActions';

// ----- Types ----- //


export type CheckoutFormAttribute = {
  shouldValidate: boolean,
}

export type RegularContributionsCheckoutFormState = {
  email: CheckoutFormAttribute,
  firstName: CheckoutFormAttribute,
  lastName: CheckoutFormAttribute,
};

// ----- Setup ----- //

const initialState: RegularContributionsCheckoutFormState = {
  email: { shouldValidate: false },
  firstName: { shouldValidate: false },
  lastName: { shouldValidate: false },
};


// ----- Reducer ----- //

function checkoutFormReducer(
  state: RegularContributionsCheckoutFormState = initialState,
  action: Action,
): RegularContributionsCheckoutFormState {

  switch (action.type) {
    case 'SET_FIRST_NAME_SHOULD_VALIDATE':
      return { ...state, firstName: { shouldValidate: true } };

    case 'SET_LAST_NAME_SHOULD_VALIDATE':
      return { ...state, lastName: { shouldValidate: true } };

    case 'SET_EMAIL_SHOULD_VALIDATE':
      return { ...state, email: { shouldValidate: true } };

    default:
      return state;
  }

}

export { checkoutFormReducer };
