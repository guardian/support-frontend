import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { trackComponentEvents } from './trackingOphan';

const trackThankYouPageLoaded = (
	productCheckout: SubscriptionProduct,
	paymentMethod: PaymentMethod | null | undefined,
): void => {
	if (typeof trackComponentEvents === 'function') {
		trackComponentEvents({
			component: {
				componentType: 'ACQUISITIONS_OTHER',
				id: 'thank-you-page',
				labels: ['checkout-submit'],
			},
			action: 'VIEW',
			value: `thank-you-page-loaded-${productCheckout}-${paymentMethod ?? ''}`,
		});
	}
};

const trackComponentClick = (componentId: string, value?: string): void => {
	trackComponentEvents({
		component: {
			componentType: 'ACQUISITIONS_OTHER',
			id: componentId,
		},
		action: 'CLICK',
		value,
	});
};

const trackComponentLoad = (componentId: string): void => {
	trackComponentEvents({
		component: {
			componentType: 'ACQUISITIONS_OTHER',
			id: componentId,
		},
		action: 'VIEW',
	});
};

export { trackComponentClick, trackComponentLoad };
