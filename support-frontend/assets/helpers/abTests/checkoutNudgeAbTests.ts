import type { CountryGroupId } from '@guardian/support-service-lambdas/modules/internationalisation/src/countryGroup';
import type {
	CheckoutNudgeTest,
	CheckoutNudgeVariant,
} from '../globalsAndSwitches/checkoutNudgeSettings';
import { isSwitchOn } from '../globalsAndSwitches/globals';
import { CountryGroup } from '../internationalisation/classes/countryGroup';
import {
	countryGroupMatches,
	getParticipationFromQueryString,
	randomNumber,
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
				nudge: {
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
				},
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
				nudge: {
					nudgeToProduct: {
						product: 'Contribution',
						ratePlan: 'Monthly',
					},
					nudgeCopy: {
						heading: 'Make a bigger impact',
						body: 'The reliability of recurring support powers our journalism in perpetuity. Could you make a small monthly contribution instead? Cancel anytime.',
					},
					thankyouCopy: {
						heading: 'Thank you for choosing to support us monthly',
						body: 'You are helping to support the future of independent journalism.',
					},
				},
			},
		],
	},
	{
		name: '2025-11-13_nudgeToSupporterPlus',
		status: 'Live',
		regionTargeting: {
			targetedCountryGroups: [],
		},
		nudgeFromProduct: {
			product: 'Contribution',
		},
		variants: [
			{
				// No nudge
				name: 'control',
			},
			{
				name: 'v1',
				nudge: {
					nudgeToProduct: {
						product: 'SupporterPlus',
					},
					nudgeCopy: {
						heading: 'Make the biggest impact',
						body: 'Support independent journalism with an All-access digital subscription and get great benefits.',
					},
					thankyouCopy: {
						heading: 'Thank you for choosing to upgrade',
						body: 'Alongside your extra benefits you are also helping ensure the future of the Guardian.',
					},
				},
			},
			{
				name: 'v2',
				nudge: {
					nudgeToProduct: {
						product: 'SupporterPlus',
					},
					nudgeCopy: {
						heading: 'Make the biggest impact',
					},
					thankyouCopy: {
						heading: 'Thank you for choosing to upgrade',
						body: 'Alongside your extra benefits you are also helping ensure the future of the Guardian.',
					},
					benefits: {
						label: 'Your all-access benefits:',
					},
				},
			},
		],
	},
];

const productMatches = (
	test: CheckoutNudgeTest,
	path: string,
	queryString: string,
): boolean => {
	if (test.nudgeFromProduct.product === 'OneTimeContribution') {
		return path.endsWith('/one-time-checkout');
	} else {
		const params = new URLSearchParams(queryString);
		const product = params.get('product');
		const ratePlan = params.get('ratePlan');

		return (
			product === test.nudgeFromProduct.product &&
			(test.nudgeFromProduct.ratePlan === undefined ||
				ratePlan === test.nudgeFromProduct.ratePlan)
		);
	}
};

export interface CheckoutNudgeSettings {
	variant: CheckoutNudgeVariant;
	fromProduct: CheckoutNudgeTest['nudgeFromProduct'];
	participations: Participations;
}
export function getCheckoutNudgeParticipations(
	countryGroupId: CountryGroupId = CountryGroup.detect(),
	path: string = window.location.pathname,
	tests: CheckoutNudgeTest[] = checkoutNudgeAbTests,
	mvtId: number = getMvtId(),
	queryString: string = window.location.search,
): CheckoutNudgeSettings | undefined {
	// Are nudges disabled?
	if (queryString.includes('disable-nudge')) {
		return undefined;
	}
	if (!isSwitchOn('featureSwitches.enableCheckoutNudge')) {
		return undefined;
	}

	// Is the participation forced in the url querystring?
	const urlParticipations = getParticipationFromQueryString(
		queryString,
		'force-checkout-nudge',
	);
	if (urlParticipations) {
		const variantData = getCheckoutTestVariant(urlParticipations, tests);
		if (variantData) {
			return {
				participations: urlParticipations,
				fromProduct: variantData.test.nudgeFromProduct,
				variant: variantData.variant,
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
		const variantData = getCheckoutTestVariant(sessionParticipations, tests);
		if (variantData) {
			return {
				participations: sessionParticipations,
				fromProduct: variantData.test.nudgeFromProduct,
				variant: variantData.variant,
			};
		}
	} else {
		// No participation in session storage, assign user to a test + variant
		const test = tests
			.filter((test) => test.status === 'Live')
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
					fromProduct: test.nudgeFromProduct,
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
): { variant: CheckoutNudgeVariant; test: CheckoutNudgeTest } | undefined {
	for (const test of checkoutNudgeTests) {
		// Is the user in this test?
		const variantName = participations[test.name];
		if (variantName) {
			const variant = test.variants.find(
				(variant) => variant.name === variantName,
			);
			if (variant) {
				return {
					test,
					variant,
				};
			}
		}
	}
	return undefined;
}
