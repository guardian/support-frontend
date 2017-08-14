// @flow

// ----- Imports ----- //

import createReducer from '../payPalExpressCheckoutReducer';


// ----- Tests ----- //

describe('PayPal Reducer Tests', () => {

  it('should return the initial state', () => {
    const reducer = createReducer(13, 'GBP');
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle PAYPAL_EXPRESS_CHECKOUT_LOADED', () => {

    const action = {
      type: 'PAYPAL_EXPRESS_CHECKOUT_LOADED',
      loaded: true,
    };

    const reducer = createReducer(13, 'GBP');
    const newState = reducer(undefined, action);

    expect(newState.loaded).toEqual(true);
    expect(newState.billingPeriod).toMatchSnapshot();
    expect(newState.currency).toMatchSnapshot();
    expect(newState.amount).toMatchSnapshot();
  });

});
