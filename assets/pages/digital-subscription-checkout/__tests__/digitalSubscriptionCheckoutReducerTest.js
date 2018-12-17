// @flow

// ----- Imports ----- //

import { initReducer, setStage, type Stage } from '../digitalSubscriptionCheckoutReducer';
import { type User } from '../helpers/user';


// ----- Tests ----- //

describe('Digital Subscription Checkout Reducer', () => {

  it('should handle SET_STAGE to "thankyou"', () => {

    const stage: Stage = 'thankyou';
    const action = setStage(stage);
    const user: User = {
      email: null,
      firstName: null,
      lastName: null,
      country: null,
    };

    const newState = initReducer(user)(undefined, action);

    expect(newState.checkout.stage).toEqual(stage);

  });

  it('should handle SET_STAGE to "checkout"', () => {

    const stage: Stage = 'checkout';
    const action = setStage(stage);
    const user: User = {
      email: null,
      firstName: null,
      lastName: null,
      country: null,
    };

    const newState = initReducer(user)(undefined, action);

    expect(newState.checkout.stage).toEqual(stage);

  });

});
