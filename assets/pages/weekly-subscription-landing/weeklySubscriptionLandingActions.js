// @flow

// ----- Imports ----- //

import { type WeeklyBillingPeriod } from 'helpers/subscriptions';
import { getWeeklyCheckout } from 'helpers/externalLinks';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { productPagePeriodFormActionsFor } from 'components/productPage/productPagePeriodForm/productPagePeriodFormActions';

import { type State } from './weeklySubscriptionLandingReducer';

// ----- Action Creators ----- //

const { setPeriod } = productPagePeriodFormActionsFor<WeeklyBillingPeriod>('GuardianWeekly', 'GuardianWeekly');

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
      sendTrackingEventsOnClick('main_cta_click', 'GuardianWeekly', null)();
      window.location.href = location;
    }
  };
}


// ----- Exports ----- //

export { setPeriod, redirectToWeeklyPage };
