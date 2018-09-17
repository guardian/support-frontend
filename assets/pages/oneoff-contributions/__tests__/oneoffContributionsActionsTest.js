// @flow
import type { CheckoutFailureReason } from 'helpers/checkoutErrors';
import { checkoutError } from '../oneoffContributionsActions';


describe('One-off actions', () => {

  it('should create an action to flag a checkout error', () => {
    const insufficientFunds: CheckoutFailureReason = 'insufficient_funds';
    const expectedAction = {
      type: 'CHECKOUT_ERROR',
      checkoutFailureReason: insufficientFunds,
    };
    expect(checkoutError(insufficientFunds)).toEqual(expectedAction);
  });

});
