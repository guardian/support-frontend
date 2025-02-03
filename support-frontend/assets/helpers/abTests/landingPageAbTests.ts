import seedrandom from 'seedrandom';
import type {
	LandingPageTest,
	LandingPageVariant,
} from '../globalsAndSwitches/landingPageSettings';
import type { CountryGroupId } from '../internationalisation/countryGroup';
import type { Participations } from './models';
import { getLandingPageParticipationsFromSession } from './sessionStorage';

export type LandingPageSelection = LandingPageVariant & { testName: string };

const fallBackLandingPageSelection: LandingPageSelection = {
	testName: 'FALLBACK_LANDING_PAGE',
	name: 'CONTROL',
	copy: {
		heading: 'Support fearless, independent journalism',
		subheading:
			"We're not owned by a billionaire or shareholders - our readers support us. Choose to join with one of the options below. Cancel anytime.",
	},
};

function randomNumber(mvtId: number, seed: string): number {
	const rng = seedrandom(mvtId + seed);
	return Math.abs(rng.int32());
}

const landingPageRegex = '^/(uk|us|ca|eu|nz|int)/contribute(/.*)?$';
function isLandingPage(path: string) {
	return !!path && path.match(landingPageRegex);
}

export function getLandingPageParticipations(
	countryGroupId: CountryGroupId,
	path: string,
	tests: LandingPageTest[] = [],
	mvtId: number,
): Participations | undefined {
	if (isLandingPage(path)) {
		// This is a landing page, assign user to a test + variant
		const test = tests
			.filter((test) => test.status == 'Live')
			.find((test) => {
				const { countryGroups } = test.targeting;
				return countryGroups.includes(countryGroupId);
			});

		if (test) {
			const idx = randomNumber(mvtId, test.name) % test.variants.length;
			const variant = test.variants[idx];

			if (variant) {
				return {
					[test.name]: variant.name,
				};
			}
		}
	} else {
		// This is not a landing page, but check if the session has a landing page test participation
		return getLandingPageParticipationsFromSession();
	}
}

// Use the AB test participations to find the specific variant configuration for this page
export function getLandingPageVariant(
	participations: Participations,
	tests: LandingPageTest[],
): LandingPageVariant & { testName: string } {
	for (const test of tests) {
		const variantName = participations[test.name];
		if (variantName) {
			const variant = test.variants.find(
				(variant) => variant.name === variantName,
			);
			if (variant) {
				return {
					testName: test.name,
					...variant,
				};
			}
		}
	}
	return fallBackLandingPageSelection;
}
