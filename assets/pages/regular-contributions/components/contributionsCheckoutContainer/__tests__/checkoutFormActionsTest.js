// @flow
import {
  setEmailShouldValidate,
  setFirstNameShouldValidate,
  setLastNameShouldValidate,
} from '../checkoutFormActions';


describe('Checkout form', () => {

  it('should create an action to set the shouldValidate on the checkout form email field', () => {
    const expectedAction = { type: 'SET_EMAIL_SHOULD_VALIDATE' };
    expect(setEmailShouldValidate()).toEqual(expectedAction);
  });

  it('should create an action to set the shouldValidate on the checkout form first name field', () => {
    const expectedAction = { type: 'SET_FIRST_NAME_SHOULD_VALIDATE' };
    expect(setFirstNameShouldValidate()).toEqual(expectedAction);
  });

  it('should create an action to set the shouldValidate on the checkout form first name field', () => {
    const expectedAction = { type: 'SET_LAST_NAME_SHOULD_VALIDATE' };
    expect(setLastNameShouldValidate()).toEqual(expectedAction);
  });

});
