// @flow
import {
  checkoutError,
  setPayPalButton,
} from '../oneoffContributionsActions';


describe('actions', () => {

  it('should create an action to flag a checkout error', () => {
    const message:string = 'This is an error.';
    const expectedAction = {
      type: 'CHECKOUT_ERROR',
      message,
    };
    expect(checkoutError(message)).toEqual(expectedAction);
  });

  it('should create an action to set the value of the PayPal button.', () => {
    const value = 32.50;
    const expectedAction = {
      type: 'SET_PAYPAL_BUTTON',
      value,
    };
    expect(setPayPalButton(value)).toEqual(expectedAction);
  });
});
