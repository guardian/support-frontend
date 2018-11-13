// @flow

// ----- Imports ----- //

import { initReducer, setStage, type Action, type Stage } from '../digitalSubscriptionCheckoutReducer';


// ----- Tests ----- //

describe('Digital Subscription Checkout Reducer', () => {

  it('should handle SET_STAGE to "thankyou"', () => {

    const stage: Stage = 'thankyou';
    const action: Action = setStage(stage);
    const newState = initReducer('GBPCountries')(undefined, action);

    expect(newState.checkout.stage).toEqual(stage);

  });

  it('should handle SET_STAGE to "checkout"', () => {

    const stage: Stage = 'checkout';
    const action: Action = setStage(stage);
    const newState = initReducer('GBPCountries')(undefined, action);

    expect(newState.checkout.stage).toEqual(stage);

  });

});
