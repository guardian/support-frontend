// @flow

// ----- Imports ----- //

import { initReducer, type Stage } from '../digitalSubscriptionCheckoutReducer';
import { setFormErrors, setStage } from 'helpers/subscriptionsForms/checkoutActions';

jest.mock('ophan', () => {});
jest.mock('helpers/fontLoader', () => () => ({}));
// ----- Tests ----- //

describe('Digital Subscription Checkout Reducer', () => {

  global.guardian = { productPrices: null };


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
