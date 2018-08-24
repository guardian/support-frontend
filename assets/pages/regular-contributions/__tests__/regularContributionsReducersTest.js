// @flow

// ----- Imports ----- //

import createReducer from '../regularContributionsReducer';


// ----- Tests ----- //

describe('Regular contributions Reducer', () => {

  const reducer = createReducer(20, 'DirectDebit', 'MONTHLY');

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle CHECKOUT_ERROR', () => {

    const message = 'Test error';
    const action = {
      type: 'CHECKOUT_ERROR',
      message,
    };

    const newState = reducer(undefined, action);

    expect(newState.regularContrib.error).toEqual(message);
    expect(newState.regularContrib.paymentStatus).toMatchSnapshot();
  });

  it('should handle SET_PAYPAL_BUTTON', () => {

    const value = 'ExpressCheckout';
    const action = {
      type: 'SET_PAYPAL_BUTTON',
      value,
    };

    const newState = reducer(undefined, action);

    expect(newState.regularContrib.error).toMatchSnapshot();
  });

  it('should handle CREATING_CONTRIBUTOR', () => {

    const action = {
      type: 'CREATING_CONTRIBUTOR',
    };

    const newState = reducer(undefined, action);
    expect(newState.regularContrib.paymentStatus).toEqual('Pending');
  });

});
