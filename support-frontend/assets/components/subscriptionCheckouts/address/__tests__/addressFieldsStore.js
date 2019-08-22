// @flow

// ----- Imports ----- //

import { isPostcodeOptional, isStateNullable, setFormErrorsFor } from 'components/subscriptionCheckouts/address/addressFieldsStore';

jest.mock('ophan', () => () => ({}));
jest.mock('helpers/fontLoader', () => () => ({}));

// ----- Tests ----- //

describe('address form fields functionality', () => {
  it('can check if a postcode is optional', () => {
    let postcodeIsOptional = isPostcodeOptional('GB');
    expect(postcodeIsOptional).toBe(false);
    postcodeIsOptional = isPostcodeOptional('HK');
    expect(postcodeIsOptional).toBe(true);
  });
  it('can check if a state is nullable', () => {
    let stateIsNullable = isStateNullable('GB');
    expect(stateIsNullable).toBe(true);
    stateIsNullable = isStateNullable('AU');
    expect(stateIsNullable).toBe(false);
  });
  it('can set errors for billing and delivery addresses', () => {
    const billingCallback = setFormErrorsFor('billing');
    expect(typeof billingCallback).toBe('function');
    const billingErrors = billingCallback([{
      field: 'city',
      message: 'Please enter a city',
    }]);
    expect(billingErrors).toEqual({
      scope: 'billing',
      type: 'SET_ADDRESS_FORM_ERRORS',
      errors: [{
        field: 'city',
        message: 'Please enter a city',
      }],
    });
  });

});
