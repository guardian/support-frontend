// @flow

import { type ComponentAbTest, type SubscriptionProduct } from 'helpers/subscriptions';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { appStoreCtaClick } from 'helpers/tracking/googleTagManager';

export default function trackAppStoreLink(
  id: string,
  product: SubscriptionProduct,
  abTest: ComponentAbTest | null,
): () => void {
  return () => {
    try {
      sendTrackingEventsOnClick(id, product, abTest)();
      appStoreCtaClick();
    } catch (e) {
      console.log('Error sending tracking event');
    }
  };
}
