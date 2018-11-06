// @flow

// ----- Imports ----- //

import { type Subscription } from './weeklySubscriptionLandingReducer';


// ----- Types ----- //

export type Action = { type: 'SET_SUBSCRIPTION', subscription: Subscription };


// ----- Action Creators ----- //

function setSubscription(subscription: Subscription): Action {
  return { type: 'SET_SUBSCRIPTION', subscription };
}


// ----- Exports ----- //

export { setSubscription };
