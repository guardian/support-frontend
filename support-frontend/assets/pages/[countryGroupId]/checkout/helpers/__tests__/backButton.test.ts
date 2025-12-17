import { BillingPeriod } from '@modules/product/billingPeriod';
import type { ProductDescription } from 'helpers/productCatalog';
import { buildBackButtonPath } from '../backButton';

describe('buildBackButtonPath', () => {
	const productDescription: ProductDescription = {
		label: 'All-access digital',
		benefits: [],
		landingPagePath: '/contribute',
		ratePlans: {
			Monthly: {
				billingPeriod: BillingPeriod.Monthly,
			},
		},
	};

	it('returns the overridden path when a valid override is provided', () => {
		const result = buildBackButtonPath(
			productDescription,
			'subscriptionsLanding',
		);

		expect(result).toBe('/subscribe');
	});

	it("returns the product description's landing page path when no override is provided", () => {
		const result = buildBackButtonPath(productDescription, null);

		expect(result).toBe('/contribute');
	});

	it("returns the product description's landing page path when an invalid override is provided", () => {
		const result = buildBackButtonPath(productDescription, 'invalidOverride');

		expect(result).toBe('/contribute');
	});
});
