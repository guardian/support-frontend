// @flow
import { setEmailShouldValidate, setFullNameShouldValidate } from '../checkoutFormActions';


describe('Checkout form', () => {

  it('should create an action to set the shouldValidate to true on the checkout form email field', () => {
    const expectedAction = { type: 'SET_EMAIL_SHOULD_VALIDATE', shouldValidate: true };
    expect(setEmailShouldValidate(true)).toEqual(expectedAction);
  });

  it('should create an action to set the shouldValidate to true on the checkout form full name field', () => {
    const expectedAction = { type: 'SET_FULL_NAME_SHOULD_VALIDATE', shouldValidate: true };
    expect(setFullNameShouldValidate(true)).toEqual(expectedAction);
  });

});
