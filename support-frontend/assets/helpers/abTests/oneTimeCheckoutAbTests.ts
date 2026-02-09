import type { OneTimeCheckoutVariant } from 'helpers/globalsAndSwitches/oneTimeCheckoutSettings';
import { getSettings } from '../globalsAndSwitches/globals';
import type { PageParticipationsConfig } from './models';
import { ONE_TIME_CHECKOUT_PARTICIPATIONS_KEY } from './sessionStorage';

const fallBackOneTimeCheckoutSelection: Record<string, OneTimeCheckoutVariant> =
	{
		GBPCountries: {
			name: 'CONTROL',
			heading: 'Support just once',
			subheading: 'Support us with the amount of your choice.',
			amounts: {
				amounts: [30, 60, 120, 240],
				defaultAmount: 60,
				hideChooseYourAmount: false,
			},
		},
		UnitedStates: {
			name: 'CONTROL',
			heading: 'Support just once',
			subheading: 'Support us with the amount of your choice.',
			amounts: {
				amounts: [25, 50, 100, 250],
				defaultAmount: 50,
				hideChooseYourAmount: false,
			},
		},
		EURCountries: {
			name: 'CONTROL',
			heading: 'Support just once',
			subheading: 'Support us with the amount of your choice.',
			amounts: {
				amounts: [25, 50, 100, 250],
				defaultAmount: 50,
				hideChooseYourAmount: false,
			},
		},
		International: {
			name: 'CONTROL',
			heading: 'Support just once',
			subheading: 'Support us with the amount of your choice.',
			amounts: {
				amounts: [25, 50, 100, 250],
				defaultAmount: 50,
				hideChooseYourAmount: false,
			},
		},
		Canada: {
			name: 'CONTROL',
			heading: 'Support just once',
			subheading: 'Support us with the amount of your choice.',
			amounts: {
				amounts: [25, 50, 100, 250],
				defaultAmount: 50,
				hideChooseYourAmount: false,
			},
		},
		AUDCountries: {
			name: 'CONTROL',
			heading: 'Support just once',
			subheading: 'Support us with the amount of your choice.',
			amounts: {
				amounts: [60, 100, 250, 500],
				defaultAmount: 100,
				hideChooseYourAmount: false,
			},
		},
		NZDCountries: {
			name: 'CONTROL',
			heading: 'Support just once',
			subheading: 'Support us with the amount of your choice.',
			amounts: {
				amounts: [50, 100, 250, 500],
				defaultAmount: 100,
				hideChooseYourAmount: false,
			},
		},
	};

/**
 * Configuration for one-time checkout page A/B tests
 * Use with getPageParticipations to get the variant and participations
 */
export const oneTimeCheckoutTestConfig: Omit<
	PageParticipationsConfig<OneTimeCheckoutVariant>,
	'tests'
> = {
	pageRegex: '^/.*/one-time-checkout(/.*)?$',
	forceParamName: 'force-one-time-checkout',
	sessionStorageKey: ONE_TIME_CHECKOUT_PARTICIPATIONS_KEY,
	fallbackVariant: (countryGroupId) =>
		fallBackOneTimeCheckoutSelection[countryGroupId] as OneTimeCheckoutVariant,
	fallbackParticipationKey: 'FALLBACK_ONE_TIME_CHECKOUT',
	getVariantName: (variant) => variant.name,
};

/**
 * Helper to get one-time checkout test config with tests from settings
 */
export function getOneTimeCheckoutTestConfig(): PageParticipationsConfig<OneTimeCheckoutVariant> {
	return {
		...oneTimeCheckoutTestConfig,
		tests: getSettings().oneTimeCheckoutTests ?? [],
	};
}
