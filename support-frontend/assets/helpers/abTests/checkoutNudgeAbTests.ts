import type { CountryGroupId } from '@guardian/support-service-lambdas/modules/internationalisation/src/countryGroup';
import seedrandom from 'seedrandom';
import type {
	CheckoutNudgeTest,
	CheckoutNudgeVariant,
} from '../globalsAndSwitches/checkoutNudgeSettings';
import { CountryGroup } from '../internationalisation/classes/countryGroup';
import {
	countryGroupMatches,
	getParticipationFromQueryString,
} from './helpers';
import type { Participations } from './models';
import { getMvtId } from './mvt';
import {
	CHECKOUT_NUDGE_PARTICIPATIONS_KEY,
	getSessionParticipations,
	setSessionParticipations,
} from './sessionStorage';

const checkoutNudgeAbTests: CheckoutNudgeTest[] = [
	{
		name: 'nudgeToLowRegularRollout__US',
		status: 'Live',
		regionTargeting: {
			targetedCountryGroups: ['UnitedStates'],
		},
		nudgeFromProduct: {
			product: 'OneTimeContribution',
			ratePlan: 'OneTime',
		},
		variants: [
			{
				name: 'control',
				nudgeToProduct: {
					product: 'Contribution',
					ratePlan: 'Monthly',
				},
				nudgeCopy: {
					heading: 'Can I make a bigger impact?',
					body: 'Yes! We’re grateful for any amount you can spare, but supporting us on a monthly basis helps to power Guardian journalism in perpetuity. Cancel anytime.',
				},
				thankyouCopy: {
					heading: 'Thank you for choosing to support us monthly',
					body: 'Your support makes a huge difference in keeping our journalism free from outside influence.',
				},
				showBenefits: false,
			},
		],
	},
	{
		name: 'nudgeToLowRegularRollout__NON_US',
		status: 'Live',
		regionTargeting: {
			targetedCountryGroups: [
				'GBPCountries',
				'AUDCountries',
				'Canada',
				'EURCountries',
				'NZDCountries',
				'International',
			],
		},
		nudgeFromProduct: {
			product: 'OneTimeContribution',
			ratePlan: 'OneTime',
		},
		variants: [
			{
				name: 'control',
				nudgeToProduct: {
					product: 'Contribution',
					ratePlan: 'Monthly',
				},
				nudgeCopy: {
					heading: 'Can I make a bigger impact?',
					body: 'Yes! We’re grateful for any amount you can spare, but supporting us on a monthly basis helps to power Guardian journalism in perpetuity. Cancel anytime.',
				},
				thankyouCopy: {
					heading: 'Thank you for choosing to support us monthly',
					body: 'Your support makes a huge difference in keeping our journalism free from outside influence.',
				},
				showBenefits: false,
			},
		],
	},
];

function randomNumber(mvtId: number, seed: string): number {
	const rng = seedrandom(mvtId + seed);
	return Math.abs(rng.int32());
}

const productMatches = (
	test: CheckoutNudgeTest,
	path: string,
	queryString: string,
): boolean => {
	console.log('checking productMatches');
	if (test.nudgeFromProduct.product === 'OneTimeContribution') {
		console.log('endsWith', path.endsWith('/one-time-checkout'));
		return path.endsWith('/one-time-checkout');
	} else {
		const params = new URLSearchParams(queryString);
		const product = params.get('product');
		const ratePlan = params.get('ratePlan');

		return (
			product === test.nudgeFromProduct.product &&
			ratePlan === test.nudgeFromProduct.ratePlan
		);
	}
};

interface CheckoutNudgeParticipationsResult {
	variant: CheckoutNudgeVariant;
	participations: Participations;
}
export function getCheckoutNudgeParticipations(
	countryGroupId: CountryGroupId = CountryGroup.detect(),
	path: string = window.location.pathname,
	tests: CheckoutNudgeTest[] = checkoutNudgeAbTests,
	mvtId: number = getMvtId(),
	queryString: string = window.location.search,
): CheckoutNudgeParticipationsResult | undefined {
	// Is the participation forced in the url querystring?
	const urlParticipations = getParticipationFromQueryString(
		queryString,
		'force-checkout-nudge',
	);
	if (urlParticipations) {
		const variant = getCheckoutTestVariant(urlParticipations, tests);
		if (variant) {
			return {
				participations: urlParticipations,
				variant,
			};
		}
	}

	// Is there already a participation in session storage?
	const sessionParticipations = getSessionParticipations(
		CHECKOUT_NUDGE_PARTICIPATIONS_KEY,
	);
	if (
		sessionParticipations &&
		Object.entries(sessionParticipations).length > 0
	) {
		const variant = getCheckoutTestVariant(sessionParticipations, tests);
		if (variant) {
			return {
				participations: sessionParticipations,
				variant,
			};
		}
	} else {
		// No participation in session storage, assign user to a test + variant
		const test = tests
			.filter((test) => test.status == 'Live')
			.find((test) => {
				return (
					countryGroupMatches(
						test.regionTargeting?.targetedCountryGroups,
						countryGroupId,
					) && productMatches(test, path, queryString)
				);
			});

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
					CHECKOUT_NUDGE_PARTICIPATIONS_KEY,
				);

				return {
					participations,
					variant,
				};
			}
		}
	}
	// No test found
	return undefined;
}

// Use the AB test participations to find the specific variant configuration for this page
function getCheckoutTestVariant(
	participations: Participations,
	checkoutNudgeTests: CheckoutNudgeTest[] = [],
): CheckoutNudgeVariant | undefined {
	for (const test of checkoutNudgeTests) {
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
	return undefined;
}
