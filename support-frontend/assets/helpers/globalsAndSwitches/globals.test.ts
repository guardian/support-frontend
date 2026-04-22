import { storage } from '@guardian/libs';
import type { AmountsTest, AmountsTests } from 'helpers/contributions';
import {
	emptyConfiguredRegionAmounts,
	emptySwitches,
	getGlobal,
	isSwitchOn,
} from './globals';

const getSpecifiedRegionAmountsFromGlobal = (
	target: string,
	path: string,
): AmountsTest | Record<string, never> => {
	const allAmountsTests: AmountsTests | null = getGlobal(path);
	if (!allAmountsTests) {
		return {};
	}
	const testArray = allAmountsTests.filter(
		(t) =>
			t.targeting.targetingType === 'Region' && t.targeting.region === target,
	);
	if (!testArray.length || !testArray[0]) {
		return {};
	}
	return testArray[0];
};

describe('getGlobal', () => {
	beforeEach(() => {
		// @ts-expect-error -- incomplete type
		window.guardian = {
			settings: {
				switches: emptySwitches,
				amounts: [
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__GBPCountries',
						targeting: {
							targetingType: 'Region',
							region: 'GBPCountries',
						},
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__UnitedStates',
						targeting: {
							targetingType: 'Region',
							region: 'UnitedStates',
						},
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__Canada',
						targeting: {
							targetingType: 'Region',
							region: 'Canada',
						},
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__NZDCountries',
						targeting: {
							targetingType: 'Region',
							region: 'NZDCountries',
						},
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__EURCountries',
						targeting: {
							targetingType: 'Region',
							region: 'EURCountries',
						},
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__International',
						targeting: {
							targetingType: 'Region',
							region: 'International',
						},
					},
					{
						...emptyConfiguredRegionAmounts,
						testName: 'EMPTY_TEST__AUDCountries',
						targeting: {
							targetingType: 'Region',
							region: 'AUDCountries',
						},
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
				productsWithThankYouOnboarding: [],
			},
		};
	});

	it('uses the passed path to traverse the window.guardian settings object', () => {
		expect(
			getSpecifiedRegionAmountsFromGlobal('GBPCountries', 'settings.amounts'),
		).toEqual({
			...emptyConfiguredRegionAmounts,
			testName: 'EMPTY_TEST__GBPCountries',
			targeting: {
				targetingType: 'Region',
				region: 'GBPCountries',
			},
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
			targeting: {
				targetingType: 'Region',
				region: 'GBPCountries',
			},
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

describe('isSwitchOn', () => {
	beforeEach(() => {
		storage.session.clear();
		window.guardian = {
			// @ts-expect-error -- incomplete type
			settings: {
				switches: {
					...emptySwitches,
					featureSwitches: {
						myFeature: 'On',
						myDisabledFeature: 'Off',
					},
				},
			},
		};
	});

	it('falls back to the global setting and returns true if no override is present in session storage', () => {
		expect(isSwitchOn('featureSwitches.myFeature')).toBe(true);
	});

	it('returns true when the session storage override is "On"', () => {
		storage.session.set('myFeature', 'On');
		expect(isSwitchOn('featureSwitches.myFeature')).toBe(true);
	});

	it('returns false when the session storage override is "Off" for myFeature', () => {
		storage.session.set('myFeature', 'Off');
		expect(isSwitchOn('featureSwitches.myFeature')).toBe(false);
	});

	it('falls back to the global setting and returns false if no override is present in session storage', () => {
		expect(isSwitchOn('featureSwitches.myDisabledFeature')).toBe(false);
	});

	it('returns true when the session storage override is "On" for myDisabledFeature', () => {
		storage.session.set('myDisabledFeature', 'On');
		expect(isSwitchOn('featureSwitches.myDisabledFeature')).toBe(true);
	});

	it('returns false when neither session storage nor globals have a value for the switch', () => {
		expect(isSwitchOn('featureSwitches.nonExistentFeature')).toBe(false);
	});
});
