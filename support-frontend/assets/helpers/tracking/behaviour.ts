import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { gaEvent } from 'helpers/tracking/googleTagManager';
import { trackComponentEvents } from 'helpers/tracking/ophan';

export type ProductCheckout = 'Contribution' | SubscriptionProduct;

const trackCheckoutSubmitAttempt = (
	componentId: string,
	eventDetails: string,
	paymentMethod: PaymentMethod | null | undefined,
	productCheckout: ProductCheckout,
): void => {
	gaEvent(
		{
			category: 'click',
			action: eventDetails,
			label: componentId,
		},
		{
			paymentMethod,
			productCheckout,
		},
	);

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
	gaEvent(
		{
			category: 'Thank you page load',
			action: productCheckout,
			label: paymentMethod,
		},
		{
			paymentMethod,
			productCheckout,
		},
	);

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
	trackThankYouPageLoaded,
	trackComponentClick,
	trackCheckoutSubmitAttempt,
	trackComponentLoad,
};
