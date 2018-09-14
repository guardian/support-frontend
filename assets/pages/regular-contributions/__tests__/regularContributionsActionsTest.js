// @flow
import type { CheckoutFailureReason } from 'helpers/checkoutErrors';
import {
  checkoutError,
  setPayPalHasLoaded,
  creatingContributor,
} from '../regularContributionsActions';


describe('Regular contributions actions', () => {

  it('should create an action to flag a checkout error', () => {
    const insufficientFunds: CheckoutFailureReason = 'insufficient_funds';
    const expectedAction = {
      type: 'CHECKOUT_ERROR',
      checkoutFailureReason: insufficientFunds,
    };
    expect(checkoutError(insufficientFunds)).toEqual(expectedAction);
  });

  it('should create an action to set a value when PayPal has loaded', () => {
    const expectedAction = {
      type: 'SET_PAYPAL_HAS_LOADED',
    };
    expect(setPayPalHasLoaded()).toEqual(expectedAction);
  });

  it('should create an action to set payment status as pending.', () => {
    const expectedAction = {
      type: 'CREATING_CONTRIBUTOR',
    };
    expect(creatingContributor()).toEqual(expectedAction);
  });

});
