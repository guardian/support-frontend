// @flow

// ----- Imports ----- //

import reducer from '../payPalExpressCheckoutReducer';


// ----- Tests ----- //

describe('PayPal Reducer Tests', () => {

  it('should return the initial state', () => {

    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle PAYPAL_EXPRESS_CHECKOUT_LOADED', () => {

    const action = {
      type: 'PAYPAL_EXPRESS_CHECKOUT_LOADED',
      loaded: true,
    };

    const newState = reducer(undefined, action);

    expect(newState.loaded).toEqual(true);
    expect(newState.billingPeriod).toMatchSnapshot();
    expect(newState.currency).toMatchSnapshot();
    expect(newState.amount).toMatchSnapshot();
  });

  it('should handle SET_PAYPAL_EXPRESS_AMOUNT', () => {

    const action = {
      type: 'SET_PAYPAL_EXPRESS_AMOUNT',
      amount: 33.34,
    };

    const newState = reducer(undefined, action);

    expect(newState.amount).toEqual(33.34);
    expect(newState.billingPeriod).toMatchSnapshot();
    expect(newState.currency).toMatchSnapshot();
    expect(newState.loaded).toMatchSnapshot();
  });

});
