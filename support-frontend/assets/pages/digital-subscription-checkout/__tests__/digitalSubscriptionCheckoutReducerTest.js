// @flow

// ----- Imports ----- //

import { initReducer, type Stage } from '../digitalSubscriptionCheckoutReducer';
import { setStage, setFormErrors } from '../digitalSubscriptionCheckoutActions';

jest.mock('ophan', () => {});

// ----- Tests ----- //

describe('Digital Subscription Checkout Reducer', () => {

  global.guardian = { productPrices: null };

  it('should default to Direct Debit if the country is GB', () => {
    const reducer = initReducer('GB');
    expect(reducer(undefined, {}).checkout.paymentMethod).toEqual('DirectDebit');
  });

  it('should default to Stripe if the country is US', () => {
    const reducer = initReducer('US');
    expect(reducer(undefined, {}).checkout.paymentMethod).toEqual('Stripe');
  });

  it('should handle SET_STAGE to "thankyou"', () => {

    const stage: Stage = 'thankyou';
    const action = setStage(stage);

    const newState = initReducer('GB')(undefined, action);

    expect(newState.checkout.stage).toEqual(stage);

  });

  it('should handle SET_STAGE to "checkout"', () => {

    const stage: Stage = 'checkout';
    const action = setStage(stage);

    const newState = initReducer('GB')(undefined, action);

    expect(newState.checkout.stage).toEqual(stage);

  });

  it('should setErrors on the redux store', () => {

    const errors = [
      { field: 'addressLine1', message: 'Please enter a value' },
      { field: 'townCity', message: 'Please enter a value' },
      { field: 'postcode', message: 'Please enter a value' },
    ];

    const action = setFormErrors(errors);

    const newState = initReducer('GB')(undefined, action);

    expect(newState.checkout.formErrors).toEqual(errors);

  });

});
