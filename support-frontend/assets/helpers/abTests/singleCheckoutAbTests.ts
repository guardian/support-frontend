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

const fallBackSingleCheckoutSelection: SingleCheckoutVariant = {
	name: 'CONTROL',
	heading: 'Support just once',
	subheading: 'Support us with the amount of your choice.',
	amounts: {
		amounts: [5, 10, 20],
		defaultAmount: 10,
		hideChooseYourAmount: false,
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
		const variant = getSingleCheckoutVariant(urlParticipations, tests);
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
		const variant = getSingleCheckoutVariant(sessionParticipations, tests);
		return {
			participations: sessionParticipations,
			variant,
		};
	} else {
		// No participation in session storage, assign user to a test + variant
		console.log(tests);
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
				? { FALLBACK_SINGLE_CHECKOUT: fallBackSingleCheckoutSelection.name }
				: ({} as Participations),
			variant: fallBackSingleCheckoutSelection,
		};
	}
}

// Use the AB test participations to find the specific variant configuration
function getSingleCheckoutVariant(
	participations: Participations,
	singleCheckoutTests: SingleCheckoutTest[] = [],
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
	return fallBackSingleCheckoutSelection;
}
