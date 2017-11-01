// @flow
import {
  checkoutError,
  setPayPalButton,
  creatingContributor,
} from '../regularContributionsActions';


describe('Regular contributions actions', () => {

  it('should create an action to flag a checkout error', () => {
    const message:string = 'This is an error.';
    const expectedAction = {
      type: 'CHECKOUT_ERROR',
      message,
    };
    expect(checkoutError(message)).toEqual(expectedAction);
  });

  it('should create an action to set the value of the PayPal button.', () => {
    const value = 'NotSet';
    const expectedAction = {
      type: 'SET_PAYPAL_BUTTON',
      value,
    };
    expect(setPayPalButton(value)).toEqual(expectedAction);
  });

  it('should create an action to set payment status as pending.', () => {
    const expectedAction = {
      type: 'CREATING_CONTRIBUTOR',
    };

    expect(creatingContributor()).toEqual(expectedAction);
  });

});
