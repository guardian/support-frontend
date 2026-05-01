import { storage } from '@guardian/libs';
import { emptySwitches, getGlobal, isSwitchOn } from './globals';

describe('getGlobal', () => {
	beforeEach(() => {
		// @ts-expect-error -- incomplete type
		window.guardian = {
			settings: {
				switches: emptySwitches,
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
					subscriptionsSwitches: {
						useDotcomContactPage: 'On',
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

	it('ignores session storage overrides for non-featureSwitches groups', () => {
		sessionStorage.setItem('useDotcomContactPage', 'Off');
		expect(isSwitchOn('subscriptionsSwitches.useDotcomContactPage')).toBe(true);
	});

	it('returns false when neither session storage nor globals have a value for the switch', () => {
		expect(isSwitchOn('featureSwitches.nonExistentFeature')).toBe(false);
	});
});
