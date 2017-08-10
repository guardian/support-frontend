// @flow

// ----- Imports ----- //

import reducer from '../payPalExpressCheckoutReducer';


// ----- Tests ----- //

describe('PayPal Reducer Tests', () => {

  it('should return the initial state', () => {

    expect(reducer(13, 'GBP')(undefined, {})).toMatchSnapshot();
  });

  it('should handle PAYPAL_EXPRESS_CHECKOUT_LOADED', () => {

    const action = {
      type: 'PAYPAL_EXPRESS_CHECKOUT_LOADED',
      loaded: true,
    };

    const newState = reducer(13, 'GBP')(undefined, action);

    expect(newState.loaded).toEqual(true);
    expect(newState.billingPeriod).toMatchSnapshot();
    expect(newState.currency).toMatchSnapshot();
    expect(newState.amount).toMatchSnapshot();
  });

});
