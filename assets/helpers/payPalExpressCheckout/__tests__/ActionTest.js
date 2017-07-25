// @flow
import {
  startPayPalExpressCheckout,
  setPayPalExpressAmount,
  payPalExpressCheckoutLoaded,
  payPalExpressError,
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
