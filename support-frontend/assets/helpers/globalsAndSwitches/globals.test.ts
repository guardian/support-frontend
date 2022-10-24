import { emptyConfiguredRegionAmounts, getGlobal } from './globals';

describe('getGlobal', () => {
	beforeEach(() => {
		// @ts-expect-error -- incomplete type
		window.guardian = {
			settings: {
				switches: {
					experiments: {},
				},
				amounts: {
					GBPCountries: emptyConfiguredRegionAmounts,
					UnitedStates: emptyConfiguredRegionAmounts,
					EURCountries: emptyConfiguredRegionAmounts,
					AUDCountries: emptyConfiguredRegionAmounts,
					International: emptyConfiguredRegionAmounts,
					NZDCountries: emptyConfiguredRegionAmounts,
					Canada: emptyConfiguredRegionAmounts,
				},
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
