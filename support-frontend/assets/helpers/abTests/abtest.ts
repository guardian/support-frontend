// ----- Imports ----- //

import seedrandom from 'seedrandom';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import * as cookie from 'helpers/storage/cookie';
import { gaEvent } from 'helpers/tracking/googleTagManager';
import { getQueryParameter } from 'helpers/urls/url';
import { tests } from './abtestDefinitions';

// ----- Types ----- //

const breakpoints = {
	mobile: 320,
	mobileMedium: 375,
	mobileLandscape: 480,
	phablet: 660,
	tablet: 740,
	desktop: 980,
	leftCol: 1140,
	wide: 1300,
};

type Breakpoint = keyof typeof breakpoints;

type BreakpointRange = {
	minWidth?: Breakpoint;
	maxWidth?: Breakpoint;
};

export type Participations = Record<string, string>;

type Audience = {
	offset: number;
	size: number;
	breakpoint?: BreakpointRange;
};

export type Audiences = {
	[key in IsoCountry | CountryGroupId | 'ALL']?: Audience;
};

type AcquisitionABTest = {
	name: string;
	variant: string;
};

export type Variant = {
	id: string;
};

export type Test = {
	variants: Variant[];
	audiences: Audiences;
	isActive: boolean;
	canRun?: () => boolean;
	// Indicates whether the A/B test is controlled by the referrer (acquisition channel)
	// e.g. Test of a banner design change on dotcom
	// If true the A/B test participation info should be passed through in the acquisition data
	// query parameter.
	// In particular this allows 3rd party tests to be identified and tracked in support-frontend (and optimize)
	// without too much "magic" involving the shared mvtId.
	referrerControlled: boolean;
	seed: number;
	// An optional regex that will be tested against the path of the current page
	// before activating this test eg. '/(uk|us|au|ca|nz)/subscribe$'
	targetPage?: string | RegExp;
	optimizeId?: string; // The id of the Optimize experiment which this test maps to
};

export type Tests = Record<string, Test>;

// ----- Init ----- //

export function init(
	country: IsoCountry,
	countryGroupId: CountryGroupId,
	settings: Settings,
	abTests: Tests = tests,
	mvt: number = getMvtId(),
	acquisitionDataTests: AcquisitionABTest[] = getTestFromAcquisitionData() ??
		[],
): Participations {
	const participations = getParticipations(
		abTests,
		mvt,
		country,
		countryGroupId,
		acquisitionDataTests,
	);
	const urlParticipations = getParticipationsFromUrl();
	const serverSideParticipations = getServerSideParticipations();
	const amountsTestParticipations = getAmountsTestParticipations(
		countryGroupId,
		settings,
	);

	return {
		...participations,
		...serverSideParticipations,
		...amountsTestParticipations,
		...urlParticipations,
	};
}

// ----- Helpers ----- //

const MVT_COOKIE = 'GU_mvt_id';
const MVT_MAX = 1_000_000;

// Attempts to retrieve the MVT id from a cookie, or sets it.
function getMvtId(): number {
	const mvtIdCookieValue = cookie.get(MVT_COOKIE);
	let mvtId = Number(mvtIdCookieValue);

	if (
		Number.isNaN(mvtId) ||
		mvtId >= MVT_MAX ||
		mvtId < 0 ||
		mvtIdCookieValue === null
	) {
		mvtId = Math.floor(Math.random() * MVT_MAX);
		cookie.set(MVT_COOKIE, String(mvtId));
	}

	return mvtId;
}

function getParticipations(
	abTests: Tests,
	mvtId: number,
	country: IsoCountry,
	countryGroupId: CountryGroupId,
	acquisitionDataTests?: AcquisitionABTest[],
): Participations {
	const participations: Participations = {};

	Object.entries(abTests).forEach(([testId, test]) => {
		if (!test.isActive) {
			return;
		}

		if (test.canRun && !test.canRun()) {
			return;
		}

		if (!targetPageMatches(window.location.pathname, test.targetPage)) {
			return;
		}

		const participation = getUserParticipation(
			test,
			testId,
			mvtId,
			country,
			countryGroupId,
			acquisitionDataTests,
		);

		if (participation.type === 'NO_PARTICIPATION') {
			return;
		}

		const variantAssignment = assignUserToVariant(mvtId, test, participation);

		if (variantAssignment.type === 'NOT_ASSIGNED') {
			return;
		}

		participations[testId] = test.variants[variantAssignment.variantIndex].id;

		if (test.optimizeId) {
			trackOptimizeExperiment(
				test.optimizeId,
				test.variants,
				variantAssignment.variantIndex,
			);
		}
	});
	return participations;
}

function getParticipationsFromUrl(): Participations | null | undefined {
	const hashUrl = new URL(document.URL).hash;

	if (hashUrl.startsWith('#ab-')) {
		const [testId, variant] = decodeURI(hashUrl.substr(4)).split('=');
		return { [testId]: variant };
	}

	return null;
}

function getServerSideParticipations(): Participations | null | undefined {
	if (window.guardian.serversideTests) {
		return window.guardian.serversideTests;
	}

	return null;
}

function getAmountsTestParticipations(
	countryGroupId: CountryGroupId,
	settings: Settings,
): Participations | null | undefined {
	if (
		!targetPageMatches(
			window.location.pathname,
			'/??/contribute|contribute-in-epic|thankyou(/.*)?$',
		)
	) {
		return null;
	}

	const { test } = settings.amounts[countryGroupId];

	if (!test || !test.isLive) {
		return null;
	}

	const variants = ['CONTROL', ...test.variants.map((variant) => variant.name)];
	const assignmentIndex = randomNumber(getMvtId(), test.seed) % variants.length;
	return {
		[test.name]: variants[assignmentIndex],
	};
}

function getTestFromAcquisitionData(): AcquisitionABTest[] | undefined {
	const acquisitionDataParam = getQueryParameter('acquisitionData');

	if (!acquisitionDataParam) {
		return undefined;
	}

	try {
		const acquisitionData = JSON.parse(acquisitionDataParam) as {
			abTests?: AcquisitionABTest[];
			abTest?: AcquisitionABTest;
		};

		return acquisitionData.abTest
			? [acquisitionData.abTest]
			: acquisitionData.abTests;
	} catch {
		console.error('Cannot parse acquisition data from query string');
		return undefined;
	}
}

function userInBreakpoint(audience: Audience): boolean {
	if (!audience.breakpoint) {
		return true;
	}

	const { minWidth, maxWidth } = audience.breakpoint;

	if (!(minWidth || maxWidth)) {
		return true;
	}

	const minWidthMediaQuery = minWidth
		? `(min-width:${breakpoints[minWidth]}px)`
		: null;
	const maxWidthMediaQuery = maxWidth
		? `(max-width:${breakpoints[maxWidth]}px)`
		: null;
	const mediaQuery =
		minWidthMediaQuery && maxWidthMediaQuery
			? `${minWidthMediaQuery} and ${maxWidthMediaQuery}`
			: minWidthMediaQuery ?? maxWidthMediaQuery;

	if (typeof mediaQuery === 'string') {
		return window.matchMedia(mediaQuery).matches;
	}

	return false;
}

type NoParticipation = { type: 'NO_PARTICIPATION' };

type ActiveParticipation =
	| { type: 'ACTIVE_PARTICIPATION' }
	| {
			type: 'REFERRER_CONTROLLED_ACTIVE_PARTICIPATION';
			acquisitionDataTest: AcquisitionABTest;
	  };

type UserParticipation = NoParticipation | ActiveParticipation;

function getUserParticipation(
	test: Test,
	testId: string,
	mvtId: number,
	country: IsoCountry,
	countryGroupId: CountryGroupId,
	acquisitionDataTests: AcquisitionABTest[] | undefined,
): UserParticipation {
	const { audiences, referrerControlled } = test;

	if (cookie.get('_post_deploy_user')) {
		return NO_PARTICIPATION;
	}

	const audience =
		audiences[country] ?? audiences[countryGroupId] ?? audiences.ALL;

	if (!audience) {
		return NO_PARTICIPATION;
	}

	if (referrerControlled) {
		// For referrer controlled tests we have to search through the tests in the acquisition
		// data to find a match. We use the `startsWith` method to support test campaigns all
		// with a common prefix.
		const acquisitionDataTest = acquisitionDataTests?.find(
			(acquisitionDataTest) => acquisitionDataTest.name.startsWith(testId),
		);

		if (!acquisitionDataTest) {
			return NO_PARTICIPATION;
		}

		return referrerControlledActiveParticipation(acquisitionDataTest);
	}

	const testMin: number = MVT_MAX * audience.offset;
	const testMax: number = testMin + MVT_MAX * audience.size;
	return mvtId >= testMin && mvtId < testMax && userInBreakpoint(audience)
		? PARTICIPATING
		: NO_PARTICIPATION;
}

const NO_PARTICIPATION: UserParticipation = { type: 'NO_PARTICIPATION' };

const PARTICIPATING: UserParticipation = { type: 'ACTIVE_PARTICIPATION' };

const referrerControlledActiveParticipation = (
	acquisitionDataTest: AcquisitionABTest,
): UserParticipation => ({
	type: 'REFERRER_CONTROLLED_ACTIVE_PARTICIPATION',
	acquisitionDataTest,
});

function randomNumber(mvtId: number, seed: number): number {
	const rng = seedrandom(`${mvtId + seed}`);
	return Math.abs(rng.int32());
}

const trackOptimizeExperiment = (
	optimizeId: string,
	variants: Variant[],
	variantIndex: number,
) => {
	gaEvent(
		{
			category: 'ab-test-tracking',
			action: optimizeId,
			label: variants[variantIndex].id,
		},
		{
			// these map to dataLayer variables in GTM
			experimentId: optimizeId,
			experimentVariant: variantIndex,
		},
	);
};

type VariantAssignment =
	| { type: 'NOT_ASSIGNED' }
	| { type: 'ASSIGNED'; variantIndex: number };

function assignUserToVariant(
	mvtId: number,
	test: Test,
	participation: ActiveParticipation,
): VariantAssignment {
	// For non-referrrer controlled tests we assign the user randomly
	if (participation.type === 'ACTIVE_PARTICIPATION') {
		return assigned(randomNumber(mvtId, test.seed) % test.variants.length);
	}

	// For referrrer controlled tests the assignment comes from the acquisition data.
	// If the variant in the acquisition data doesn't match up with any defined in
	// the test, we log an error and don't assign the user to the test.
	const acquisitionVariant = participation.acquisitionDataTest.variant;

	const index = test.variants.findIndex(
		(variant) => variant.id === acquisitionVariant,
	);

	if (index === -1) {
		console.error('Variant not found for A/B test in acquistion data');

		return NOT_ASSIGNED;
	}

	return assigned(index);
}

const NOT_ASSIGNED: VariantAssignment = { type: 'NOT_ASSIGNED' };

function assigned(variantIndex: number): VariantAssignment {
	return { type: 'ASSIGNED', variantIndex };
}

export function targetPageMatches(
	locationPath: string,
	targetPage: (string | null | undefined) | RegExp,
): boolean {
	if (!targetPage) {
		return true;
	}

	return locationPath.match(targetPage) != null;
}

export const getVariantsAsString = (participation: Participations): string => {
	const variants: string[] = [];
	Object.keys(participation).forEach((testId) => {
		variants.push(`${testId}=${participation[testId]}`);
	});
	return variants.join('; ');
};
