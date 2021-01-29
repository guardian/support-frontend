// @flow

// ----- Imports ----- //

import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import { paperSubsUrl } from 'helpers/routes';

// ----- Types ----- //
export type TabActions = { type: 'SET_TAB', tab: PaperFulfilmentOptions }


// ----- Action Creators ----- //

const setTab = (tab: PaperFulfilmentOptions): TabActions => {
  sendTrackingEventsOnClick({
    id: `paper_subscription_landing_page-switch_tab-${tab}`,
    product: 'Paper',
    componentType: 'ACQUISITIONS_BUTTON',
  })();
  window.history.replaceState({}, null, paperSubsUrl(tab === HomeDelivery));
  return { type: 'SET_TAB', tab };
};


// ----- Exports ----- //

export { setTab };
