import { annualToMonthly, quarterlyToMonthly } from './monthlyEquivalentPrice';

describe('getMonthlyEquivalent', () => {
	it('converts £180 annual to £10 monthly', () => {
		expect(annualToMonthly(180)).toBe(15);
	});
	it('converts £57 quarterly to £19 monthly', () => {
		expect(quarterlyToMonthly(57)).toBe(19);
	});
});
