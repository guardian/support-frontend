// @flow

// ----- Imports ----- //

import * as ophan from 'ophan';
import type { OphanComponentEvent, OphanComponent, OphanAction } from 'helpers/tracking/ophanComponentEventTypes';

// ----- Functions ----- //

const trackComponentEventInOphan = (componentEvent: OphanComponentEvent): void => {
  ophan.record({
    componentEvent,
  });
};

const component = (campaignCode: string): OphanComponent => ({
  componentType: 'ACQUISITIONS_THANK_YOU_EPIC',
  id: 'oneoff-thankyou-page-recurring-upsell',
  products: ['RECURRING_CONTRIBUTION'],
  campaignCode,
  labels: [],
});

const trackComponentEvents = (action: OphanAction, campaignCode: string) => {
  const componentEvent = {
    component: component(campaignCode),
    action,
  };
  trackComponentEventInOphan(componentEvent);
};


export {
  trackComponentEvents,
};

