// ----- Imports ----- //
import {
	Annual,
	Monthly,
	Quarterly,
	SixWeekly,
} from 'helpers/productPrice/billingPeriods';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import {
	getAdverbialSubscriptionDescription,
	getAppliedPromoDescription,
	getPriceDescription,
	getSimplifiedPriceDescription,
} from 'helpers/productPrice/priceDescriptions';
import 'helpers/productPrice/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import 'helpers/productPrice/productPrices';

jest.mock('ophan', () => {});
const monthlyBillingPeriod: BillingPeriod = 'Monthly';
const productPrice: ProductPrice = {
	price: 11.99,
	currency: 'GBP',
	fixedTerm: false,
	promotions: [],
};
// ----- Tests ----- //
describe('getPriceDescription', () => {
	it('should return a price based on inputs', () => {
		const gwAnnual = {
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
				},
			],
		};
		expect(getPriceDescription(gwAnnual, Annual)).toEqual(
			"You'll pay £135 for 1 year, then £150 per year",
		);
		const gwQuarterly = {
			price: 37.5,
			currency: 'GBP',
			promotions: [],
		};
		expect(getPriceDescription(gwQuarterly, Quarterly)).toEqual(
			'£37.50 per quarter',
		);
		const gwMonthly = {
			price: 12.5,
			currency: 'GBP',
			promotions: [],
		};
		expect(getPriceDescription(gwMonthly, Monthly)).toEqual('£12.50 per month');
		const gwQuarterlyWithPromo = {
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
				},
			],
		};
		expect(getPriceDescription(gwQuarterlyWithPromo, Quarterly)).toEqual(
			"You'll pay £31.87 for 1 quarter, then £37.50 per quarter",
		);
		const gwSixWeekly = {
			price: 27.5,
			currency: 'USD',
			promotions: [
				{
					name: 'Six For Six',
					description: 'Introductory offer',
					promoCode: '6FOR6',
					introductoryPrice: {
						price: 6,
						periodLength: 6,
						periodType: 'issue',
					},
				},
			],
		};
		expect(getPriceDescription(gwSixWeekly, SixWeekly)).toEqual(
			'US$6 for the first 6 issues (then US$27.50 per month)',
		);
	});
});
describe('getAppliedPromoDescription', () => {
	const productPriceWithLandingPageDiscount: ProductPrice = {
		price: 11.99,
		currency: 'GBP',
		fixedTerm: false,
		promotions: [
			{
				name: 'Sept 2021 Discount',
				description: '50% off for 3 months',
				promoCode: 'DK0NT24WG',
				discountedPrice: 5.99,
				numberOfDiscountedPeriods: 3,
				discount: {
					amount: 50,
					durationMonths: 3,
				},
				landingPage: {
					title: 'Sept 2021 Discount',
					description: '50% off for 3 months',
					roundel: 'Save 50% for 3 months!',
				},
			},
		],
	};
	it('should return a landing page promotion roundel description', () => {
		expect(
			getAppliedPromoDescription(
				productPriceWithLandingPageDiscount,
			),
		).toBe('Save 50% for 3 months!');
	});
});
describe('getSimplifiedPriceDescription', () => {
	it('should return a price description', () => {
		expect(
			getSimplifiedPriceDescription(productPrice, monthlyBillingPeriod),
		).toEqual('per month');
	});
	const productPriceWithDiscountedPrice: ProductPrice = {
		price: 11.99,
		currency: 'GBP',
		fixedTerm: false,
		promotions: [
			{
				name: 'Sept 2021 Discount',
				description: '50% off for 3 months',
				promoCode: 'DK0NT24WG',
				discountedPrice: 5.99,
				numberOfDiscountedPeriods: 3,
				discount: {
					amount: 50,
					durationMonths: 3,
				},
			},
		],
	};
	it('should return a discounted price description', () => {
		expect(
			getSimplifiedPriceDescription(
				productPriceWithDiscountedPrice,
				monthlyBillingPeriod,
			),
		).toEqual('per month, then £11.99 per month');
	});
	const productPriceWithIntroductoryPrice: ProductPrice = {
		price: 11.99,
		currency: 'GBP',
		fixedTerm: false,
		promotions: [
			{
				name: 'Sept 2021 Discount',
				description: '50% off for 3 months',
				promoCode: 'DK0NT24WG',
				introductoryPrice: {
					price: 5.99,
					periodLength: 6,
					periodType: 'issue',
				},
				numberOfDiscountedPeriods: 3,
				discount: {
					amount: 50,
					durationMonths: 3,
				},
			},
		],
	};
	it('should return an introductory price description', () => {
		expect(
			getSimplifiedPriceDescription(
				productPriceWithIntroductoryPrice,
				monthlyBillingPeriod,
			),
		).toEqual('for 6 issues (then £11.99 per month)');
	});
});
describe('getAdverbialSubscriptionDescription', () => {
	it('should return an adverbial subscription description', () => {
		expect(
			getAdverbialSubscriptionDescription(productPrice, monthlyBillingPeriod),
		).toEqual('Subscribe monthly for £11.99');
	});
});
