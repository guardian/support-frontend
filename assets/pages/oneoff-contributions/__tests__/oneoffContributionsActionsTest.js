// @flow
import { checkoutError } from '../oneoffContributionsActions';


describe('One-off actions', () => {

  it('should create an action to flag a checkout error', () => {
    const message:string = 'This is an error.';
    const expectedAction = {
      type: 'CHECKOUT_ERROR',
      message,
    };
    expect(checkoutError(message)).toEqual(expectedAction);
  });

});
