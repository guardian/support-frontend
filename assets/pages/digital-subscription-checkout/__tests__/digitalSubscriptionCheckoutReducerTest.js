// @flow

// ----- Imports ----- //

import { initReducer, setStage, type Stage } from '../digitalSubscriptionCheckoutReducer';


// ----- Tests ----- //

describe('Digital Subscription Checkout Reducer', () => {

  it('should handle SET_STAGE to "thankyou"', () => {

    const stage: Stage = 'thankyou';
    const action = setStage(stage);

    const newState = initReducer()(undefined, action);

    expect(newState.form.stage).toEqual(stage);

  });

  it('should handle SET_STAGE to "checkout"', () => {

    const stage: Stage = 'checkout';
    const action = setStage(stage);

    const newState = initReducer()(undefined, action);

    expect(newState.form.stage).toEqual(stage);

  });

});
