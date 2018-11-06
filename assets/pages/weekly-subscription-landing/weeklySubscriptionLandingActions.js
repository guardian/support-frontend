// @flow

// ----- Imports ----- //

import { type WeeklyBillingPeriod } from 'helpers/subscriptions';


// ----- Types ----- //

export type Action = { type: 'SET_PERIOD', period: WeeklyBillingPeriod };


// ----- Action Creators ----- //

function setPeriod(period: WeeklyBillingPeriod): Action {
  return { type: 'SET_PERIOD', period };
}


// ----- Exports ----- //

export { setPeriod };
