import { BillingPeriod } from '@modules/product/billingPeriod';
import {
	getDiscountedPrice,
	getNumberOfDiscountedPeriods,
} from './discountedPrice';

// These cases mirror those in the Scala PriceSummaryServiceSpec
describe('getDiscountedPrice', () => {
	const threeMonths25Percent = { amount: 25, durationMonths: 3 };

	it.each([
		// Paper
		[threeMonths25Percent, 47.62, 35.71, BillingPeriod.Monthly],
		[threeMonths25Percent, 51.96, 38.97, BillingPeriod.Monthly],
		[threeMonths25Percent, 41.12, 30.84, BillingPeriod.Monthly],
		[threeMonths25Percent, 20.76, 15.57, BillingPeriod.Monthly],
		[threeMonths25Percent, 10.79, 8.09, BillingPeriod.Monthly],
		// Digital Pack
		[threeMonths25Percent, 11.99, 8.99, BillingPeriod.Monthly],
		[threeMonths25Percent, 119.9, 112.41, BillingPeriod.Annual],
		[{ amount: 25, durationMonths: 5 }, 35.95, 28.46, BillingPeriod.Quarterly],
		[{ amount: 36.975, durationMonths: 12 }, 119, 75, BillingPeriod.Annual],
		// Guardian Weekly domestic
		[{ amount: 25, durationMonths: 2 }, 37.5, 31.25, BillingPeriod.Quarterly],
	] as const)(
		'applies %o to %d to give %d (%s)',
		(discount, original, expected, billingPeriod) => {
			expect(getDiscountedPrice(original, discount, billingPeriod)).toBe(
				expected,
			);
		},
	);

	it('applies the full discount when it covers whole billing periods', () => {
		expect(
			getDiscountedPrice(
				40,
				{ amount: 25, durationMonths: 6 },
				BillingPeriod.Quarterly,
			),
		).toBe(30);
	});

	it('scales the discount down when it covers only part of a billing period', () => {
		// 25% for 3 of 12 months = 6.25% off the annual price
		expect(
			getDiscountedPrice(
				100,
				{ amount: 25, durationMonths: 3 },
				BillingPeriod.Annual,
			),
		).toBe(93.75);
	});

	it('spreads the discount over every billing period it partly covers', () => {
		// 25% for 5 months of quarterly billing = 25 * (5/3) / 2 periods = 20.833% off each of 2 quarters
		expect(
			getDiscountedPrice(
				100,
				{ amount: 25, durationMonths: 5 },
				BillingPeriod.Quarterly,
			),
		).toBe(79.17);
	});

	it('rounds exact halves down', () => {
		// 47.62 * 0.75 = 35.715
		expect(
			getDiscountedPrice(47.62, threeMonths25Percent, BillingPeriod.Monthly),
		).toBe(35.71);
	});

	it('rounds exact halves down even when floating point arithmetic would give slightly more than a half', () => {
		// 8.46 * 0.75 = 6.345, but 6.345000000000001 in floating point
		expect(
			getDiscountedPrice(8.46, threeMonths25Percent, BillingPeriod.Monthly),
		).toBe(6.34);
	});

	it('rounds values above a half up', () => {
		// 119.9 * 0.9375 = 112.40625
		expect(
			getDiscountedPrice(119.9, threeMonths25Percent, BillingPeriod.Annual),
		).toBe(112.41);
	});
});

describe('getNumberOfDiscountedPeriods', () => {
	it.each([
		[1, BillingPeriod.Monthly, 1],
		[1, BillingPeriod.Quarterly, 1],
		[1, BillingPeriod.Annual, 1],
		[3, BillingPeriod.Monthly, 3],
		[3, BillingPeriod.Quarterly, 1],
		[3, BillingPeriod.Annual, 1],
		[4, BillingPeriod.Monthly, 4],
		[4, BillingPeriod.Quarterly, 2],
		[4, BillingPeriod.Annual, 1],
		[12, BillingPeriod.Monthly, 12],
		[12, BillingPeriod.Quarterly, 4],
		[12, BillingPeriod.Annual, 1],
		[13, BillingPeriod.Monthly, 13],
		[13, BillingPeriod.Quarterly, 5],
		[13, BillingPeriod.Annual, 2],
	] as const)(
		'a %d month discount covers %s billing periods: %d',
		(durationMonths, billingPeriod, expected) => {
			expect(getNumberOfDiscountedPeriods(durationMonths, billingPeriod)).toBe(
				expected,
			);
		},
	);
});
