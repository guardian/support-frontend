// @flow

// ----- Imports ----- //

import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';

import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import { paperSubsUrl } from 'helpers/urls/routes';
import { getQueryParameter } from 'helpers/urls/url';

// ----- Types ----- //
export type TabActions = { type: 'SET_TAB', tab: PaperFulfilmentOptions }


// ----- Action Creators ----- //

const setTab = (tab: PaperFulfilmentOptions): TabActions => {
  sendTrackingEventsOnClick({
    id: `Paper_${tab}-tab`, // eg. Paper_Collection-tab or Paper_HomeDelivery-tab
    product: 'Paper',
    componentType: 'ACQUISITIONS_BUTTON',
  })();
  window.history.replaceState({}, null, paperSubsUrl(tab === HomeDelivery, getQueryParameter('promoCode')));
  return { type: 'SET_TAB', tab };
};


// ----- Exports ----- //

export { setTab };
