import { SupportRegionId } from '@guardian/support-service-lambdas/modules/internationalisation/src/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import {
	getDiscountDuration,
	getDiscountSummary,
	getStudentDiscount,
} from './discountDetails';

jest.mock('helpers/productPrice/promotions');

jest.mock('helpers/productPrice/productPrices', () => ({
	allProductPrices: {
		SupporterPlus: {},
	},
}));

jest.mock('helpers/productCatalog', () => ({
	productCatalog: {
		SupporterPlus: {
			ratePlans: {
				Monthly: { pricing: { USD: 10, AUD: '10' } },
				Annual: { pricing: { USD: 150, AUD: '120' } },
				OneYearStudent: { pricing: { USD: 10 } },
			},
		},
	},
}));

describe('Discount Details', () => {
	describe('getDiscountSummary', () => {
		it('handles 1-month discount for monthly billing', () => {
			const result = getDiscountSummary({
				fullPriceWithCurrency: '£10',
				discountPriceWithCurrency: '£6',
				durationInMonths: 1,
				billingPeriod: BillingPeriod.Monthly,
				promoCount: 1,
			});
			expect(result).toBe('£6/month for the first month, then £10/month*');
		});

		it('handles 6-month discount for monthly billing', () => {
			const result = getDiscountSummary({
				fullPriceWithCurrency: '£10',
				discountPriceWithCurrency: '£6.50',
				durationInMonths: 6,
				billingPeriod: BillingPeriod.Monthly,
				promoCount: 2,
			});
			expect(result).toBe('£6.50/month for 6 months, then £10/month**');
		});

		it('handles 1-year discount for annual billing', () => {
			const result = getDiscountSummary({
				fullPriceWithCurrency: '£275',
				discountPriceWithCurrency: '£173',
				durationInMonths: 12,
				billingPeriod: BillingPeriod.Annual,
				promoCount: 1,
			});
			expect(result).toBe('£173/year for the first year, then £275/year*');
		});

		it('handles multiple years of discount for annual billing', () => {
			const result = getDiscountSummary({
				fullPriceWithCurrency: '£300',
				discountPriceWithCurrency: '£200',
				durationInMonths: 24,
				billingPeriod: BillingPeriod.Annual,
				promoCount: 0,
			});
			expect(result).toBe('£200/year for two years, then £300/year');
		});
	});

	describe('getDiscountDuration', () => {
		it('returns "the first month" for 1 month', () => {
			const result = getDiscountDuration({
				durationInMonths: 1,
			});
			expect(result).toBe('the first month');
		});

		it('returns "6 months" for 6 months', () => {
			const result = getDiscountDuration({
				durationInMonths: 6,
			});
			expect(result).toBe('6 months');
		});

		it('returns "the first year" for 12 months', () => {
			const result = getDiscountDuration({
				durationInMonths: 12,
			});
			expect(result).toBe('the first year');
		});

		it('returns "2 years" for 24 months', () => {
			const result = getDiscountDuration({
				durationInMonths: 24,
			});
			expect(result).toBe('two years');
		});

		it('returns 18 months if not yearly based', () => {
			const result = getDiscountDuration({
				durationInMonths: 18,
			});
			expect(result).toBe('18 months');
		});
	});

	describe('getStudentDiscount', () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		it('returns discount data from ratePlan comparison no promotion exists', () => {
			const result = getStudentDiscount(
				SupportRegionId.US,
				'OneYearStudent',
				'SupporterPlus',
			);
			expect(result).toEqual({
				amount: 10,
				discountPriceWithCurrency: '$10',
				fullPriceWithCurrency: '$150',
				periodNoun: 'year',
			});
		});

		it('returns discount data when promotion exists with discounted price', () => {
			const promotion = {
				name: 'AU_STUDENT_100',
				description: '100% discount for Australian students',
				promoCode: 'UTS_STUDENT',
				discount: { amount: 100, durationMonths: 24 },
				discountedPrice: 0,
				numberOfDiscountedPeriods: 24,
			};

			const result = getStudentDiscount(
				SupportRegionId.AU,
				'Monthly',
				'SupporterPlus',
				promotion,
			);
			expect(result).toEqual({
				amount: 0,
				periodNoun: 'month',
				discountPriceWithCurrency: '$0',
				fullPriceWithCurrency: '$10',
				promoDuration: 'two years',
				promoCode: 'UTS_STUDENT',
				discountSummary: '$0/month for two years, then $10/month',
			});
		});
	});
});
