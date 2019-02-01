// @flow

// ----- Imports ----- //
import { type Dispatch } from 'redux';

import { type DigitalBillingPeriod } from 'helpers/billingPeriods';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { ProductPagePlanFormActionsFor } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import { getDigitalCheckout } from 'helpers/externalLinks';
import { type State } from './digitalSubscriptionLandingReducer';


// ----- Action Creators ----- //

const { setPlan } = ProductPagePlanFormActionsFor<DigitalBillingPeriod>('DigitalPack', 'DigitalPack');

function redirectToDigitalPage() {
  return (dispatch: Dispatch<any>, getState: () => State) => {

    const state = getState();

    const { countryGroupId } = state.common.internationalisation;
    const { referrerAcquisitionData, abParticipations, optimizeExperiments } = state.common;
    const { plan } = state.page.plan;

    if (plan) {
      const location = getDigitalCheckout(
        referrerAcquisitionData,
        countryGroupId,
        null,
        abParticipations,
        optimizeExperiments,
        plan,
      );

      sendTrackingEventsOnClick(`main_cta_click_${plan}`, 'DigitalPack', null)();
      window.location.href = location;
    }
  };
}


// ----- Exports ----- //

export { setPlan, redirectToDigitalPage };
