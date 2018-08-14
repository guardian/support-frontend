// @flow

// ----- Imports ----- //

import { type Stage } from './digitalSubscriptionCheckoutReducer';


// ----- Types ----- //

export type Action = { type: 'SET_STAGE', stage: Stage };


// ----- Action Creators ----- //

function setStage(stage: Stage): Action {
  return { type: 'SET_STAGE', stage };
}


// ----- Exports ----- //

export { setStage };
