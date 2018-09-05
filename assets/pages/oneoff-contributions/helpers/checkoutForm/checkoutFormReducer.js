// @flow

// ----- Imports ----- //
import { emailRegexPattern } from 'helpers/checkoutForm/checkoutForm';
import { type Action } from './checkoutFormActions';

// ----- Types ----- //


export type CheckoutFormAttribute = {
  shouldValidate: boolean,
  required: boolean,
  pattern: RegExp,
}

export type OneOffContributionsCheckoutFormState = {
  email: CheckoutFormAttribute,
  fullName: CheckoutFormAttribute,
};

// ----- Setup ----- //

const initialState: OneOffContributionsCheckoutFormState = {
  email: {
    shouldValidate: false,
    required: true,
    pattern: emailRegexPattern,
  },
  fullName: {
    shouldValidate: false,
    required: true,
    pattern: /.*/,
  },
};


// ----- Reducer ----- //

function checkoutFormReducer(
  state: OneOffContributionsCheckoutFormState = initialState,
  action: Action,
): OneOffContributionsCheckoutFormState {

  switch (action.type) {
    case 'SET_EMAIL_SHOULD_VALIDATE':
      return { ...state, email: { ...state.email, shouldValidate: true } };

    case 'SET_FULL_NAME_SHOULD_VALIDATE':
      return { ...state, fullName: { ...state.fullName, shouldValidate: true } };

    default:
      return state;
  }

}

export { checkoutFormReducer };
