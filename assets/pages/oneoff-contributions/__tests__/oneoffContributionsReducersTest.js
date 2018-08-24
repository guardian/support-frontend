// @flow

// ----- Imports ----- //

import createReducer from '../oneOffContributionsReducer';


// ----- Tests ----- //

describe('One-off Reducer', () => {

  const reducer = createReducer(20);

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

    expect(newState.oneoffContrib.error).toEqual(message);
  });

  it('should handle SET_PAYPAL_BUTTON', () => {

    const value = 'ExpressCheckout';
    const action = {
      type: 'SET_PAYPAL_BUTTON',
      value,
    };

    const newState = reducer(undefined, action);

    expect(newState.oneoffContrib.error).toMatchSnapshot();
  });

});
