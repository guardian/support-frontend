// @flow
import type { ErrorReason } from 'helpers/errorReasons';
import { checkoutError } from '../oneoffContributionsActions';


describe('One-off actions', () => {

  it('should create an action to flag a checkout error', () => {
    const insufficientFunds: ErrorReason = 'insufficient_funds';
    const expectedAction = {
      type: 'CHECKOUT_ERROR',
      errorReason: insufficientFunds,
    };
    expect(checkoutError(insufficientFunds)).toEqual(expectedAction);
  });

});
