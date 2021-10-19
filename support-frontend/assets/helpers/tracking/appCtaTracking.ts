import type {
	ComponentAbTest,
	SubscriptionProduct,
} from 'helpers/productPrice/subscriptions';
import 'helpers/productPrice/subscriptions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { appStoreCtaClick } from 'helpers/tracking/googleTagManager';
export default function trackAppStoreLink(
	id: string,
	product: SubscriptionProduct,
	abTest: ComponentAbTest | null,
): () => void {
	return () => {
		try {
			sendTrackingEventsOnClick({
				id,
				product,
				...(abTest && {
					abTest,
				}),
				componentType: 'ACQUISITIONS_BUTTON',
			})();
			appStoreCtaClick();
		} catch (e) {
			console.log('Error sending tracking event');
		}
	};
}
