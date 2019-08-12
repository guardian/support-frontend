// @flow
import { trackComponentEvents } from 'helpers/tracking/ophan';
import { gaEvent } from 'helpers/tracking/googleTagManager';
import type { PaymentMethod } from 'helpers/paymentMethods';
import type { SubscriptionProduct } from 'helpers/subscriptions';

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

export type ProductCheckout = 'Contribution' | SubscriptionProduct;

const trackCheckoutSubmitAttempt = (
  componentId: string,
  eventDetails: string,
  paymentMethod: ?PaymentMethod,
  productCheckout: ProductCheckout,
): void => {
  gaEvent({
    category: 'click',
    action: eventDetails,
    label: componentId,
  }, { paymentMethod, productCheckout });

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

const trackThankYouPageLoaded = (
  productCheckout: SubscriptionProduct,
  paymentMethod: ?PaymentMethod,
) => {
  gaEvent({
    category: 'Thank you page load',
    action: productCheckout,
    label: paymentMethod,
  }, { paymentMethod, productCheckout });

  if (trackComponentEvents) {
    trackComponentEvents({
      component: {
        componentType: 'ACQUISITIONS_OTHER',
        id: 'thank-you-page',
        labels: ['checkout-submit'],
      },
      action: 'VIEW',
      value: `thank-you-page-loaded-${productCheckout}-${paymentMethod || ''}`,
    });
  }
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
  trackThankYouPageLoaded,
  trackComponentClick,
  trackCheckoutSubmitAttempt,
  trackComponentLoad,
};
