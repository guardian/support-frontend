/* eslint-env browser -- allow usage of window/document globals in Storybook */

function ensureProductCatalog() {
    if (typeof window === 'undefined') {
        return;
	}

	window.guardian = window.guardian || {};
    
	window.guardian.productCatalog = {
        DigitalSubscription: {
            ratePlans: {
                Annual: {
                    billingPeriod: 'Annual',
					pricing: {
                        GBP: 180,
					},
				},
				Monthly: {
                    billingPeriod: 'Month',
                    
					pricing: {
                        GBP: 18,
					},
				},
			},
		},
	};
}

export function withProductCatalog(storyFn) {
    ensureProductCatalog();
	return storyFn();
}
