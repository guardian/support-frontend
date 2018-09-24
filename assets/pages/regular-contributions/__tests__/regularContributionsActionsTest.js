// @flow
import type { CheckoutFailureReason } from 'helpers/checkoutErrors';
import {
  checkoutError,
  setPayPalHasLoaded,
  creatingContributor,
  setGuestAccountCreationToken,
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

  it('should store the guest account creation token', () => {
    const token = '12345';
    const expectedAction = {
      type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN',
      guestAccountCreationToken: token,
    };
    expect(setGuestAccountCreationToken(token)).toEqual(expectedAction);
  });

});
