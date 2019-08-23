// @flow

// ----- Imports ----- //

import {
  isPostcodeOptional,
  isStateNullable,
  setFormErrorsFor,
  applyAddressRules,
  addressActionCreatorsFor,
  addressReducerFor,
} from 'components/subscriptionCheckouts/address/addressFieldsStore';

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

  it('can apply a series of address rules to form fields', () => {
    const addresRulesAppliedBilling = applyAddressRules({
      city: null,
      country: 'IN',
      lineOne: null,
      lineTwo: null,
      postCode: null,
      state: null,
    }, 'billing');
    expect(typeof addresRulesAppliedBilling).toBe('object');
    expect(addresRulesAppliedBilling).toEqual([
      { field: 'lineOne', message: 'Please enter a billing address.' },
      { field: 'city', message: 'Please enter a billing city.' },
    ]);
  });

  it('can aggregate a series of actions', () => {
    const actionsForDeliveryAddresses = addressActionCreatorsFor('delivery');
    expect(actionsForDeliveryAddresses).toHaveProperty('setCountry');
    expect(actionsForDeliveryAddresses).toHaveProperty('setAddressLineOne');
    expect(actionsForDeliveryAddresses).toHaveProperty('setTownCity');
    expect(actionsForDeliveryAddresses).toHaveProperty('setPostcode');
    expect(typeof actionsForDeliveryAddresses.setState).toBe('function');
    expect(typeof actionsForDeliveryAddresses.setAddressLineTwo).toBe('function');
  });

  it('can manufacture new state', () => {
    const deliveryAddressFormReducer = addressReducerFor('delivery', 'GB');

    const newState = deliveryAddressFormReducer({
      fields: {
        country: 'GB', city: null, lineOne: null, lineTwo: null, postCode: null, state: null, formErrors: [],
      },
    }, {
      type: 'SET_ADDRESS_LINE_1',
      lineOne: '10 Frog St',
      scope: 'delivery',
    });
    expect(typeof deliveryAddressFormReducer).toBe('function');
    expect(typeof newState).toBe('object');
    expect(newState).toEqual({
      fields: {
        city: null, country: 'GB', formErrors: [], lineOne: '10 Frog St', lineTwo: null, postCode: null, state: null,
      },
      postcode: {
        error: null, isLoading: false, postcode: null, results: [],
      },
    });
  });

});
