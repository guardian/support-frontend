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

const component: OphanComponent = {
  componentType: 'ACQUISITIONS_THANK_YOU_EPIC',
  id: 'oneoff-thankyou-page-recurring-upsell',
  products: ['RECURRING_CONTRIBUTION'],
  campaignCode: 'oneoff-thankyou-page-recurring-upsell',
  labels: [],
};

const trackComponentEvents = (action: OphanAction) => {
  const componentEvent = {
    component,
    action,
  };
  trackComponentEventInOphan(componentEvent);
};


export {
  trackComponentEvents,
};

