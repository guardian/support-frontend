// @flow

// ----- Imports ----- //

import type { ErrorReason } from 'helpers/errorReasons';
import createReducer from '../oneOffContributionsReducer';


// ----- Tests ----- //

describe('One-off Reducer', () => {

  const reducer = createReducer(20, 'GBPCountries');

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle CHECKOUT_ERROR', () => {

    const insufficientFunds: ErrorReason = 'insufficient_funds';
    const action = {
      type: 'CHECKOUT_ERROR',
      errorReason: insufficientFunds,
    };

    const newState = reducer(undefined, action);

    expect(newState.oneoffContrib.errorReason).toEqual(insufficientFunds);
  });

  it('should handle SET_PAYPAL_BUTTON', () => {

    const value = 'ExpressCheckout';
    const action = {
      type: 'SET_PAYPAL_BUTTON',
      value,
    };

    const newState = reducer(undefined, action);

    expect(newState.oneoffContrib.errorReason).toMatchSnapshot();
  });

});
