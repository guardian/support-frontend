import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { appStoreCtaClick } from 'helpers/tracking/googleTagManager';

export default function trackAppStoreLink(
	id: string,
	product: SubscriptionProduct,
): () => void {
	return () => {
		try {
			sendTrackingEventsOnClick({
				id,
				product,
				componentType: 'ACQUISITIONS_BUTTON',
			})();
			appStoreCtaClick();
		} catch (e) {
			console.log('Error sending tracking event');
		}
	};
}
