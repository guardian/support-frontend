// @flow

// ----- Imports ----- //

import { reducer, actions, type Stage } from '../digitalSubscriptionCheckoutReducer';


// ----- Tests ----- //

describe('Digital Subscription Checkout Reducer', () => {

  it('should handle SET_STAGE to "thankyou"', () => {

    const stage: Stage = 'thankyou';
    const action = actions.setStage(stage);

    const newState = reducer(undefined, action);

    expect(newState.stage).toEqual(stage);

  });

  it('should handle SET_STAGE to "checkout"', () => {

    const stage: Stage = 'checkout';
    const action = actions.setStage(stage);

    const newState = reducer(undefined, action);

    expect(newState.stage).toEqual(stage);

  });

});
