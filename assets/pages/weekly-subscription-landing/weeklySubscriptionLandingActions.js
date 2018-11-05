// @flow

// ----- Imports ----- //

import { type Subscription } from './weeklySubscriptionLandingReducer';


// ----- Types ----- //

export type Action = { type: 'SET_SUBSCRIPTION', subscription: Subscription };


// ----- Action Creators ----- //

function setStage(subscription: Subscription): Action {
  return { type: 'SET_SUBSCRIPTION', subscription };
}


// ----- Exports ----- //

export { setStage };
