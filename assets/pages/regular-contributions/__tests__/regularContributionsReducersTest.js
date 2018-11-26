// @flow

// ----- Imports ----- //

import type { ErrorReason } from 'helpers/errorReasons';
import createReducer from '../regularContributionsReducer';


// ----- Tests ----- //

describe('Regular contributions Reducer', () => {

  const reducer = createReducer(20, 'DirectDebit', 'MONTHLY', 'GBPCountries');

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

    expect(newState.regularContrib.errorReason).toEqual(insufficientFunds);
    expect(newState.regularContrib.paymentStatus).toMatchSnapshot();
  });

  it('should handle SET_PAYPAL_BUTTON', () => {

    const value = 'ExpressCheckout';
    const action = {
      type: 'SET_PAYPAL_BUTTON',
      value,
    };

    const newState = reducer(undefined, action);

    expect(newState.regularContrib.errorReason).toMatchSnapshot();
  });

  it('should handle CREATING_CONTRIBUTOR', () => {

    const action = {
      type: 'CREATING_CONTRIBUTOR',
    };

    const newState = reducer(undefined, action);
    expect(newState.regularContrib.paymentStatus).toEqual('Pending');
  });

});
