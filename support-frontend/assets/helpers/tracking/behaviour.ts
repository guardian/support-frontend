import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { trackComponentEvents } from 'helpers/tracking/ophan';

export type ProductCheckout =
	| 'Contribution'
	| 'SupporterPlus'
	| SubscriptionProduct;

const trackCheckoutSubmitAttempt = (
	componentId: string,
	eventDetails: string,
): void => {
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

const trackComponentClick = (componentId: string): void => {
	trackComponentEvents({
		component: {
			componentType: 'ACQUISITIONS_OTHER',
			id: componentId,
		},
		action: 'CLICK',
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

const trackComponentInsert = (componentId: string): void => {
	trackComponentEvents({
		component: {
			componentType: 'ACQUISITIONS_OTHER',
			id: componentId,
		},
		action: 'INSERT',
	});
};

export {
	trackThankYouPageLoaded,
	trackComponentClick,
	trackCheckoutSubmitAttempt,
	trackComponentLoad,
	trackComponentInsert,
};
