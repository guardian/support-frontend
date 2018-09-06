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

export type Stage = 'checkout' | 'payment'

export type RegularContributionsCheckoutFormState = {
  email: CheckoutFormAttribute,
  firstName: CheckoutFormAttribute,
  lastName: CheckoutFormAttribute,
  stage: Stage,
};

// ----- Setup ----- //

const initialState: RegularContributionsCheckoutFormState = {
  email: {
    shouldValidate: false,
    required: true,
    pattern: emailRegexPattern,
  },
  firstName: {
    shouldValidate: false,
    required: true,
    pattern: /.*/,
  },
  lastName: {
    shouldValidate: false,
    required: true,
    pattern: /.*/,
  },
  stage: 'checkout',
};


// ----- Reducer ----- //

function checkoutFormReducer(
  state: RegularContributionsCheckoutFormState = initialState,
  action: Action,
): RegularContributionsCheckoutFormState {

  switch (action.type) {
    case 'SET_FIRST_NAME_SHOULD_VALIDATE':
      return { ...state, firstName: { ...state.firstName, shouldValidate: true } };

    case 'SET_LAST_NAME_SHOULD_VALIDATE':
      return { ...state, lastName: { ...state.lastName, shouldValidate: true } };

    case 'SET_EMAIL_SHOULD_VALIDATE':
      return { ...state, email: { ...state.email, shouldValidate: true } };

    case 'SET_STAGE':
      return { ...state, stage: action.stage };

    default:
      return state;
  }

}

export { checkoutFormReducer };
