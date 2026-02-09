import type { SingleCheckoutVariant } from 'helpers/globalsAndSwitches/singleCheckoutSettings';
import { getSettings } from '../globalsAndSwitches/globals';
import type { PageParticipationsConfig } from './models';
import { SINGLE_CHECKOUT_PARTICIPATIONS_KEY } from './sessionStorage';

const fallBackSingleCheckoutSelection: Record<string, SingleCheckoutVariant> = {
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
 * Configuration for single checkout page A/B tests
 * Use with getPageParticipations to get the variant and participations
 */
export const singleCheckoutTestConfig: Omit<
	PageParticipationsConfig<SingleCheckoutVariant>,
	'tests'
> = {
	pageRegex: '^/.*/one-time-checkout(/.*)?$',
	forceParamName: 'force-single-checkout',
	sessionStorageKey: SINGLE_CHECKOUT_PARTICIPATIONS_KEY,
	fallbackVariant: (countryGroupId) =>
		fallBackSingleCheckoutSelection[countryGroupId] as SingleCheckoutVariant,
	fallbackParticipationKey: 'FALLBACK_SINGLE_CHECKOUT',
	getVariantName: (variant) => variant.name,
};

/**
 * Helper to get single checkout test config with tests from settings
 */
export function getSingleCheckoutTestConfig(): PageParticipationsConfig<SingleCheckoutVariant> {
	return {
		...singleCheckoutTestConfig,
		tests: getSettings().singleCheckoutTests ?? [],
	};
}
