import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type {
	SingleCheckoutTest,
	SingleCheckoutVariant,
} from 'helpers/globalsAndSwitches/singleCheckoutSettings';
import { getSettings } from '../globalsAndSwitches/globals';
import { CountryGroup } from '../internationalisation/classes/countryGroup';
import {
	countryGroupMatches,
	getParticipationFromQueryString,
	randomNumber,
} from './helpers';
import type { Participations } from './models';
import { getMvtId } from './mvt';
import {
	getSessionParticipations,
	setSessionParticipations,
	SINGLE_CHECKOUT_PARTICIPATIONS_KEY,
} from './sessionStorage';

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

const landingPageRegex = '^/.*/contribute(/.*)?$';
function isLandingPage(path: string) {
	return !!path && !!path.match(landingPageRegex);
}

interface SingleCheckoutParticipationsResult {
	variant: SingleCheckoutVariant;
	participations: Participations;
}
export function getSingleCheckoutParticipations(
	countryGroupId: CountryGroupId = CountryGroup.detect(),
	path: string = window.location.pathname,
	tests: SingleCheckoutTest[] = getSettings().singleCheckoutTests ?? [],
	mvtId: number = getMvtId(),
	queryString: string = window.location.search,
): SingleCheckoutParticipationsResult {
	// Is the participation forced in the url querystring?
	const urlParticipations = getParticipationFromQueryString(
		queryString,
		'force-single-checkout',
	);
	if (urlParticipations) {
		const variant = getSingleCheckoutVariant(
			urlParticipations,
			tests,
			countryGroupId,
		);
		return {
			participations: urlParticipations,
			variant,
		};
	}

	// Is there already a participation in session storage?
	const sessionParticipations = getSessionParticipations(
		SINGLE_CHECKOUT_PARTICIPATIONS_KEY,
	);
	if (
		sessionParticipations &&
		Object.entries(sessionParticipations).length > 0
	) {
		const variant = getSingleCheckoutVariant(
			sessionParticipations,
			tests,
			countryGroupId,
		);
		return {
			participations: sessionParticipations,
			variant,
		};
	} else {
		// No participation in session storage, assign user to a test + variant
		const test = tests
			.filter((test) => test.status == 'Live')
			.find((test) => {
				return countryGroupMatches(
					test.regionTargeting?.targetedCountryGroups,
					countryGroupId,
				);
			});

		// Only track participation if user is on the landing page
		const trackParticipation = isLandingPage(path);

		if (test) {
			const idx = randomNumber(mvtId, test.name) % test.variants.length;
			const variant = test.variants[idx];

			if (variant) {
				const participations = {
					[test.name]: variant.name,
				};
				// Record the participation in session storage so that we can track it from the checkout
				setSessionParticipations(
					participations,
					SINGLE_CHECKOUT_PARTICIPATIONS_KEY,
				);

				return {
					participations: trackParticipation ? participations : {},
					variant,
				};
			}
		}
		// No test found, use the fallback
		return {
			participations: trackParticipation
				? {
						FALLBACK_SINGLE_CHECKOUT:
							fallBackSingleCheckoutSelection[countryGroupId]?.name,
				  }
				: ({} as Participations),
			variant: fallBackSingleCheckoutSelection[
				countryGroupId
			] as SingleCheckoutVariant,
		};
	}
}

// Use the AB test participations to find the specific variant configuration
function getSingleCheckoutVariant(
	participations: Participations,
	singleCheckoutTests: SingleCheckoutTest[] = [],
	countryGroupId: CountryGroupId,
): SingleCheckoutVariant {
	for (const test of singleCheckoutTests) {
		// Is the user in this test?
		const variantName = participations[test.name];
		if (variantName) {
			const variant = test.variants.find(
				(variant) => variant.name === variantName,
			);
			if (variant) {
				return variant;
			}
		}
	}
	return fallBackSingleCheckoutSelection[
		countryGroupId
	] as SingleCheckoutVariant;
}
