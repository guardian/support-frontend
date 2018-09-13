// @flow

// ----- Imports ----- //

import type { CheckoutFailureReason } from 'helpers/checkoutErrors';
import createReducer from '../oneOffContributionsReducer';


// ----- Tests ----- //

describe('One-off Reducer', () => {

  const reducer = createReducer(20, 'GBPCountries');

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle CHECKOUT_ERROR', () => {

    const insufficientFunds: CheckoutFailureReason = 'insufficient_funds';
    const action = {
      type: 'CHECKOUT_ERROR',
      checkoutFailureReason: insufficientFunds,
    };

    const newState = reducer(undefined, action);

    expect(newState.oneoffContrib.checkoutFailureReason).toEqual(insufficientFunds);
  });

  it('should handle SET_PAYPAL_BUTTON', () => {

    const value = 'ExpressCheckout';
    const action = {
      type: 'SET_PAYPAL_BUTTON',
      value,
    };

    const newState = reducer(undefined, action);

    expect(newState.oneoffContrib.checkoutFailureReason).toMatchSnapshot();
  });

});
