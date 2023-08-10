import type { AmountsTest, AmountsTests } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { emptyConfiguredRegionAmounts, getGlobal } from './globals';

const getSpecifiedRegionAmountsFromGlobal = (
	target: string,
	path: string,
): AmountsTest | Record<string, never> => {
	const allAmountsTests: AmountsTests | null = getGlobal(path);
	if (!allAmountsTests) {
		return {};
	}
	const testArray = allAmountsTests.filter((t) => t.region === target);
	if (!testArray.length) {
		return {};
	}
	return testArray[0];
};

describe('getGlobal', () => {
	beforeEach(() => {
		// @ts-expect-error -- incomplete type
		window.guardian = {
			settings: {
				switches: {
					experiments: {},
				},
				amounts: [
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__GBPCountries',
						region: 'GBPCountries' as CountryGroupId,
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__UnitedStates',
						region: 'UnitedStates' as CountryGroupId,
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__Canada',
						region: 'Canada' as CountryGroupId,
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__NZDCountries',
						region: 'NZDCountries' as CountryGroupId,
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__EURCountries',
						region: 'EURCountries' as CountryGroupId,
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__International',
						region: 'International' as CountryGroupId,
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__AUDCountries',
						region: 'AUDCountries' as CountryGroupId,
					},
				],
				contributionTypes: {
					GBPCountries: [],
					UnitedStates: [],
					EURCountries: [],
					AUDCountries: [],
					International: [],
					NZDCountries: [],
					Canada: [],
				},
				metricUrl: '',
			},
		};
	});

	it('uses the passed path to traverse the window.guardian settings object', () => {
		expect(
			getSpecifiedRegionAmountsFromGlobal('GBPCountries', 'settings.amounts'),
		).toEqual({
			...emptyConfiguredRegionAmounts,
			testName: 'EMPTY_TEST__GBPCountries',
			region: 'GBPCountries',
		});
	});

	it('uses the passed path to traverse the window.guardian settings object even if given a fully qualified path', () => {
		expect(
			getSpecifiedRegionAmountsFromGlobal(
				'GBPCountries',
				'window.guardian.settings.amounts',
			),
		).toEqual({
			...emptyConfiguredRegionAmounts,
			testName: 'EMPTY_TEST__GBPCountries',
			region: 'GBPCountries',
		});
	});

	it('returns any item reached in traversal that is not an object', () => {
		expect(getGlobal('settings.contributionTypes.Canada.something')).toEqual(
			[],
		);
	});

	it('returns null if nothing is found at a particular path', () => {
		expect(
			getGlobal('settings.switches.experiments.myLovelyExperiment'),
		).toBeNull();
	});
});
