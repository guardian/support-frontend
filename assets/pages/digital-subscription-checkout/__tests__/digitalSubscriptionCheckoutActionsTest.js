// @flow

// ----- Imports ----- //

import { type Stage } from '../digitalSubscriptionCheckoutReducer';
import { setStage } from '../digitalSubscriptionCheckoutActions';


// ----- Tests ----- //

describe('Digital Subscription Checkout Actions', () => {

  it('should create an action to set a checkout stage', () => {

    const stage: Stage = 'thankyou';

    const expectedAction = {
      type: 'SET_STAGE',
      stage,
    };

    expect(setStage(stage)).toEqual(expectedAction);

  });

});
