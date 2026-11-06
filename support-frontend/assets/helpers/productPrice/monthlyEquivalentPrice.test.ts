import { BillingPeriod } from '@modules/product/billingPeriod';
import { monthlyEquivalentPrice } from './monthlyEquivalentPrice';

describe('getMonthlyEquivalentPrice', () => {
	it('converts 180 annual to 15 monthly', () => {
		expect(monthlyEquivalentPrice(180, BillingPeriod.Annual)).toBe(15);
	});
	it('converts 57 quarterly to 19 monthly', () => {
		expect(monthlyEquivalentPrice(57, BillingPeriod.Quarterly)).toBe(19);
	});
	it('round-up 100 annual from 8.333 to 8.34 monthly', () => {
		expect(monthlyEquivalentPrice(100, BillingPeriod.Annual)).toBe(8.34);
	});
	it('round-up 101 annual from 8.416 to 8.42 monthly', () => {
		expect(monthlyEquivalentPrice(101, BillingPeriod.Annual)).toBe(8.42);
	});
	it('round-up 8.64 annual from 0.720000001 to 0.73 monthly', () => {
		expect(monthlyEquivalentPrice(8.64, BillingPeriod.Annual)).toBe(0.73);
	});
});
