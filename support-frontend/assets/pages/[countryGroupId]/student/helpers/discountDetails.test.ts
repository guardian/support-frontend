import { BillingPeriod } from '@modules/product/billingPeriod';
import { getDiscountDuration, getDiscountSummary } from './discountDetails';

describe('Discount Details', () => {
	describe('getDiscountSummary', () => {
		it('handles 1-month discount for monthly billing', () => {
			const result = getDiscountSummary({
				priceWithCurrency: '£10',
				discountPriceWithCurrency: '£6',
				durationInMonths: 1,
				billingPeriod: BillingPeriod.Monthly,
				promoCount: 1,
			});
			expect(result).toBe('£6/month for the first month, then £10/month*');
		});

		it('handles 6-month discount for monthly billing', () => {
			const result = getDiscountSummary({
				priceWithCurrency: '£10',
				discountPriceWithCurrency: '£6.50',
				durationInMonths: 6,
				billingPeriod: BillingPeriod.Monthly,
				promoCount: 2,
			});
			expect(result).toBe('£6.50/month for 6 months, then £10/month**');
		});

		it('handles 1-year discount for annual billing', () => {
			const result = getDiscountSummary({
				priceWithCurrency: '£275',
				discountPriceWithCurrency: '£173',
				durationInMonths: 12,
				billingPeriod: BillingPeriod.Annual,
				promoCount: 1,
			});
			expect(result).toBe('£173/year for the first year, then £275/year*');
		});

		it('handles multiple years of discount for annual billing', () => {
			const result = getDiscountSummary({
				priceWithCurrency: '£300',
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
});
