// ----- Imports ----- //
import { Annual, Monthly } from 'helpers/productPrice/billingPeriods';
import {
	getBillingDescription,
	hasDiscountOrPromotion,
} from 'helpers/productPrice/priceDescriptionsDigital';
import type { ProductPrice } from '../productPrices';

jest.mock('ophan', () => () => ({}));

const productPriceMonthlyWithDiscount: ProductPrice = {
	price: 11.99,
	currency: 'GBP',
	fixedTerm: false,
	promotions: [
		{
			name: 'Sept 2019 Discount',
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

const productPriceMonthly: ProductPrice = {
	price: 11.99,
	currency: 'GBP',
	fixedTerm: false,
	promotions: [],
};

const productPriceAnnualWithDiscount: ProductPrice = {
	price: 199,
	currency: 'USD',
	fixedTerm: false,
	promotions: [
		{
			name: 'Introductory Promotion Global',
			description: '16% off for the first year',
			promoCode: 'ANNUAL-INTRO-GLOBAL',
			discountedPrice: 99,
			numberOfDiscountedPeriods: 1,
			discount: {
				amount: 16.81,
				durationMonths: 12,
			},
		},
	],
};

const productPriceAnnual: ProductPrice = {
	price: 199,
	currency: 'USD',
	fixedTerm: false,
	promotions: [],
};

// ----- Tests ----- //
describe('getBillingDescription', () => {
	it('should return a description of the price', () => {
		expect(
			getBillingDescription(productPriceMonthlyWithDiscount, Monthly),
		).toBe("You'll pay £5.99/month for 3 months, then £11.99 per month");

		expect(getBillingDescription(productPriceMonthly, Monthly)).toBe(
			'A recurring charge of £11.99 every month',
		);

		expect(getBillingDescription(productPriceAnnualWithDiscount, Annual)).toBe(
			"You'll pay US$99 for 1 year, then US$199 per year",
		);

		expect(getBillingDescription(productPriceAnnual, Annual)).toBe(
			'A recurring charge of US$199 a year',
		);
	});
});

describe('hasDiscountOrPromotion', () => {
	it('should return a boolean depending on whether there are or are not promotions', () => {
		expect(hasDiscountOrPromotion(productPriceMonthlyWithDiscount)).toBe(true);
		expect(hasDiscountOrPromotion(productPriceMonthly)).toBe(false);
		expect(hasDiscountOrPromotion(productPriceAnnualWithDiscount)).toBe(true);
		expect(hasDiscountOrPromotion(productPriceAnnual)).toBe(false);
	});
});
