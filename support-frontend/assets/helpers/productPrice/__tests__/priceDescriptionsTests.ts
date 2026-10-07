// ----- Imports ----- //
import { BillingPeriod } from '@modules/product/billingPeriod';
import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';
import type { ProductPrice } from 'helpers/productPrice/productPrices';

jest.mock('@guardian/ophan-tracker-js', () => () => ({}));

// ----- Tests ----- //
describe('getPriceDescription', () => {
	it('should return a price based on inputs', () => {
		const gwAnnual: ProductPrice = {
			price: 150,
			currency: 'GBP',
			promotions: [
				{
					name: '10% Off Annual Guardian Weekly Subs',
					description: 'Subscribe for 12 months and save 10%',
					promoCode: '10ANNUAL',
					discountedPrice: 135,
					numberOfDiscountedPeriods: 1,
					discount: {
						amount: 10,
						durationMonths: 12,
					},
					isIntroductoryPricing: false,
				},
			],
			fixedTerm: false,
		};
		expect(getPriceDescription(gwAnnual, BillingPeriod.Annual)).toEqual(
			"You'll pay £135 for 1 year, then £150 per year",
		);

		const gwQuarterly: ProductPrice = {
			price: 37.5,
			currency: 'GBP',
			promotions: [],
			fixedTerm: false,
		};

		expect(getPriceDescription(gwQuarterly, BillingPeriod.Quarterly)).toEqual(
			'£37.50 per quarter',
		);

		const gwMonthly: ProductPrice = {
			price: 12.5,
			currency: 'GBP',
			promotions: [],
			fixedTerm: false,
		};

		expect(getPriceDescription(gwMonthly, BillingPeriod.Monthly)).toEqual(
			'£12.50 per month',
		);

		const gwQuarterlyWithPromo: ProductPrice = {
			price: 37.5,
			currency: 'GBP',
			promotions: [
				{
					name: '15% discount - WJWGEX9A8',
					description: '15% discount - WJWGEX9A8',
					promoCode: 'WJWGEX9A8',
					discountedPrice: 31.87,
					numberOfDiscountedPeriods: 1,
					discount: {
						amount: 15,
						durationMonths: 3,
					},
					isIntroductoryPricing: false,
				},
			],
			fixedTerm: false,
		};

		expect(
			getPriceDescription(gwQuarterlyWithPromo, BillingPeriod.Quarterly),
		).toEqual("You'll pay £31.87 for 1 quarter, then £37.50 per quarter");
	});
});
