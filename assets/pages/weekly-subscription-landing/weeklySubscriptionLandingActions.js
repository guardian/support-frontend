// @flow

// ----- Imports ----- //

import { type WeeklyBillingPeriod } from 'helpers/subscriptions';
import { getWeeklyCheckout } from 'helpers/externalLinks';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { type State } from './weeklySubscriptionLandingReducer';


// ----- Types ----- //

export type Action = { type: 'SET_PERIOD', period: WeeklyBillingPeriod };


// ----- Action Creators ----- //

function setPeriod(period: WeeklyBillingPeriod): (dispatch: Function) => Action {
  return (dispatch) => {
    sendTrackingEventsOnClick(`toggle_period_${period}`, 'GuardianWeekly', null)();
    return dispatch({ type: 'SET_PERIOD', period });
  };
}

function redirectToWeeklyPage() {
  return (dispatch: Function, getState: () => State) => {
    const state = getState();
    const { countryGroupId } = state.common.internationalisation;
    const { referrerAcquisitionData, abParticipations, optimizeExperiments } = state.common;
    const location = state.page.period ? getWeeklyCheckout(
      referrerAcquisitionData,
      state.page.period,
      countryGroupId,
      abParticipations,
      optimizeExperiments,
    ) : null;

    if (location) {
      window.location.href = location;
    }
  };
}


// ----- Exports ----- //

export { setPeriod, redirectToWeeklyPage };
