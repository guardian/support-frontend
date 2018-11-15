// @flow

// ----- Imports ----- //

import { type PaperBillingPeriod } from 'helpers/subscriptions';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { productPagePeriodFormActionsFor } from 'components/productPage/productPagePeriodForm/productPagePeriodFormActions';

// ----- Action Creators ----- //

const { setPeriod } = productPagePeriodFormActionsFor<PaperBillingPeriod>('Paper', 'Paper');

function redirectToWeeklyPage() {
  const location = null;

  if (location) {
    sendTrackingEventsOnClick('main_cta_click', 'Paper', null)();
    window.location.href = location;
  }
}


// ----- Exports ----- //

export { setPeriod, redirectToWeeklyPage };
