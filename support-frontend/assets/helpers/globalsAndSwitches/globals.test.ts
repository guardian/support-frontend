import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { emptyConfiguredRegionAmounts, getGlobal } from './globals';

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
						target: 'GBPCountries' as CountryGroupId,
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__UnitedStates',
						target: 'UnitedStates' as CountryGroupId,
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__Canada',
						target: 'Canada' as CountryGroupId,
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__NZDCountries',
						target: 'NZDCountries' as CountryGroupId,
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__EURCountries',
						target: 'EURCountries' as CountryGroupId,
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__International',
						target: 'International' as CountryGroupId,
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__AUDCountries',
						target: 'AUDCountries' as CountryGroupId,
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
		expect(getGlobal('settings.amounts.GBPCountries')).toEqual(
			emptyConfiguredRegionAmounts,
		);
	});

	it('uses the passed path to traverse the window.guardian settings object even if given a fully qualified path', () => {
		expect(getGlobal('window.guardian.settings.amounts.GBPCountries')).toEqual(
			emptyConfiguredRegionAmounts,
		);
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
