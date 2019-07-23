// @flow
import { trackComponentEvents } from 'helpers/tracking/ophan';
import { gaEvent } from 'helpers/tracking/googleTagManager';
import type { PaymentMethod } from 'helpers/paymentMethods';

const trackPaymentMethodSelected = (paymentMethod: PaymentMethod): void => {
  gaEvent({
    category: 'click',
    action: 'payment-method-selected',
    label: paymentMethod,
  }, { paymentMethod });

  trackComponentEvents({
    component: {
      componentType: 'ACQUISITIONS_OTHER',
      id: 'subscriptions-payment-method-selector',
    },
    action: 'CLICK',
    value: paymentMethod,
  });
};

const trackCheckoutSubmitAttempt = (componentId: string, eventDetails: string): void => {
  gaEvent({
    category: 'click',
    action: eventDetails,
    label: componentId,
  });

  trackComponentEvents({
    component: {
      componentType: 'ACQUISITIONS_BUTTON',
      id: componentId,
      labels: ['checkout-submit'],
    },
    action: 'CLICK',
    value: eventDetails,
  });
};

const trackComponentClick = (componentId: string): void => {
  gaEvent({
    category: 'click',
    action: componentId,
    label: componentId,
  });

  trackComponentEvents({
    component: {
      componentType: 'ACQUISITIONS_OTHER',
      id: componentId,
    },
    action: 'CLICK',
  });

};

const trackComponentLoad = (componentId: string): void => {
  gaEvent({
    category: 'component_load',
    action: componentId,
    label: componentId,
  });

  trackComponentEvents({
    component: {
      componentType: 'ACQUISITIONS_OTHER',
      id: componentId,
    },
    action: 'VIEW',
  });

};

export {
  trackPaymentMethodSelected,
  trackComponentClick,
  trackCheckoutSubmitAttempt,
  trackComponentLoad,
};
