import { annualToMonthly, quarterlyToMonthly } from './monthlyEquivalentPrice';

describe('getMonthlyEquivalentPrice', () => {
	it('converts 180 annual to 10 monthly', () => {
		expect(annualToMonthly(180)).toBe(15);
	});
	it('round-up 100 annual from 8.333 to 8.34 monthly', () => {
		expect(annualToMonthly(100)).toBe(8.34);
	});
	it('round-up 101 annual from 8.416 to 8.42 monthly', () => {
		expect(annualToMonthly(101)).toBe(8.42);
	});
	it('converts 57 quarterly to 19 monthly', () => {
		expect(quarterlyToMonthly(57)).toBe(19);
	});
	it('round-up 100 quarterly from 33.333 to 33.34 monthly', () => {
		expect(quarterlyToMonthly(100)).toBe(33.34);
	});
	it('round-up 101 quarterly from 33.667 to 33.67 monthly', () => {
		expect(quarterlyToMonthly(101)).toBe(33.67);
	});
});
