import { _ } from './isSupporterPlus';

describe('isInHideBenefitsTest', () => {
	const { isInHideBenefitsTest } = _;
	it('returns true if user in hide benefits test and in V1 variant', () => {
		const abParticipations = {
			FOO: 'BAR',
			'2023-08-08_BENEFITS_GONE__UK': 'V1',
			BAR: 'FOO',
		};

		expect(isInHideBenefitsTest(abParticipations)).toBe(true);
	});

	it('returns false if user not in hide benefits test', () => {
		const abParticipations = {
			FOO: 'BAR',
			BAR: 'FOO',
		};

		expect(isInHideBenefitsTest(abParticipations)).toBe(false);
	});

	it('returns false if user in hide benefits test but not in V1/V3 variant', () => {
		const abParticipations = {
			FOO: 'BAR',
			'2023-08-08_BENEFITS_GONE__UK': 'V2',
			BAR: 'FOO',
		};

		expect(isInHideBenefitsTest(abParticipations)).toBe(false);
	});

	it('returns false if users is not in any ab test', () => {
		const abParticipations = {};

		expect(isInHideBenefitsTest(abParticipations)).toBe(false);
	});
});
