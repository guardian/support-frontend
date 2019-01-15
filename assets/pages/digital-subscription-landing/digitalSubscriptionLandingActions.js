// @flow

// ----- Imports ----- //

import { type DigitalBillingPeriod } from 'helpers/billingPeriods';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { ProductPagePlanFormActionsFor } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';


// ----- Action Creators ----- //

const { setPlan } = ProductPagePlanFormActionsFor<DigitalBillingPeriod>('GuardianWeekly', 'GuardianWeekly');

function redirectToDigitalPage() {
  return () => {
    const location = null;

    if (location) {
      sendTrackingEventsOnClick('main_cta_click', 'DigitalPack', null)();
      window.location.href = location;
    }
  };
}


// ----- Exports ----- //

export { setPlan, redirectToDigitalPage };
