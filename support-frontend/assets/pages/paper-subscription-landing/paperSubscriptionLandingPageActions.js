// @flow

// ----- Imports ----- //

import { sendClickedEvent } from 'helpers/tracking/clickTracking';

import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import { paperSubsUrl } from 'helpers/routes';

// ----- Types ----- //
export type TabActions = { type: 'SET_TAB', tab: PaperFulfilmentOptions }


// ----- Action Creators ----- //

const setTab = (tab: PaperFulfilmentOptions): TabActions => {
  sendClickedEvent(`paper_subscription_landing_page-switch_tab-${tab}`)();
  window.history.replaceState({}, null, paperSubsUrl(tab === HomeDelivery));
  return { type: 'SET_TAB', tab };
};


// ----- Exports ----- //

export { setTab };
