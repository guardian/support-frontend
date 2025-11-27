import type { CountryGroupId } from '@guardian/support-service-lambdas/modules/internationalisation/src/countryGroup';
import type {
	CheckoutNudgeTest,
	CheckoutNudgeVariant,
} from '../globalsAndSwitches/checkoutNudgeSettings';
import { getSettings, isSwitchOn } from '../globalsAndSwitches/globals';
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
	tests: CheckoutNudgeTest[] = getSettings().checkoutNudgeTests ?? [],
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
	}
	// No participation in session storage, assign user to a test + variant
	const test = tests.find((test) => {
		return (
			countryGroupMatches(
				test.regionTargeting?.targetedCountryGroups,
				countryGroupId,
			) && productMatches(test, path, queryString)
		);
	});

	if (!test) {
		return undefined;
	}

	const idx = randomNumber(mvtId, test.name) % test.variants.length;
	const variant = test.variants[idx];

	if (!variant) {
		return undefined;
	}

	const participations = {
		[test.name]: variant.name,
	};
	// Record the participation in session storage so that we can track it from the checkout
	setSessionParticipations(participations, CHECKOUT_NUDGE_PARTICIPATIONS_KEY);

	return {
		participations,
		fromProduct: test.nudgeFromProduct,
		variant,
	};
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
