// @flow
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  startPayPalExpressCheckout,
  setPayPalExpressAmount,
  payPalExpressCheckoutLoaded,
  payPalExpressError,
  setupPayPalExpressCheckout,
} from '../payPalExpressCheckoutActions';


describe('PayPal Express Checkout\'s actions', () => {

  it('should create START_PAYPAL_EXPRESS_CHECKOUT action', () => {
    const expectedAction = {
      type: 'START_PAYPAL_EXPRESS_CHECKOUT',
    };
    expect(startPayPalExpressCheckout()).toEqual(expectedAction);
  });

  it('should create SET_PAYPAL_EXPRESS_AMOUNT action', () => {
    const amount: number = 6;
    const expectedAction = {
      type: 'SET_PAYPAL_EXPRESS_AMOUNT',
      amount,
    };
    expect(setPayPalExpressAmount(amount)).toEqual(expectedAction);
  });

  it('should create PAYPAL_EXPRESS_CHECKOUT_LOADED action', () => {
    const expectedAction = {
      type: 'PAYPAL_EXPRESS_CHECKOUT_LOADED',
    };
    expect(payPalExpressCheckoutLoaded()).toEqual(expectedAction);
  });

  it('should create PAYPAL_EXPRESS_ERROR action', () => {
    const message: string = 'This is an error';
    const expectedAction = {
      type: 'PAYPAL_EXPRESS_ERROR',
      message,
    };
    expect(payPalExpressError(message)).toEqual(expectedAction);
  });
});


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Async PayPal Express Checkout\'s actions', () => {
  global.guardian = { payPalEnvironment: 'test' };
  global.paypal = { Button: { render: () => {} } };

  it('creates PAYPAL_EXPRESS_CHECKOUT_LOADED when PayPal\'s button has been loaded', () => {
    const expectedActions = [
      { type: 'START_PAYPAL_EXPRESS_CHECKOUT' },
      { type: 'PAYPAL_EXPRESS_CHECKOUT_LOADED' },
    ];

    const store = mockStore({ payPalExpressCheckout: { loaded: false }, csrf: { token: 'example' } });

    return store.dispatch(setupPayPalExpressCheckout()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
