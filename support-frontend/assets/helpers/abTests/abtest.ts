// ----- Imports ----- //
import seedrandom from 'seedrandom';
import type { $Keys } from 'utility-types';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import 'helpers/globalsAndSwitches/settings';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import 'helpers/internationalisation/countryGroup';
import * as cookie from 'helpers/storage/cookie';
import { gaEvent } from 'helpers/tracking/googleTagManager';
import { getQueryParameter } from 'helpers/urls/url';
import { tests } from './abtestDefinitions';

// ----- Types ----- //
export type TestId = $Keys<typeof tests>;

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

type Breakpoint = $Keys<typeof breakpoints>;

type BreakpointRange = {
	minWidth?: Breakpoint;
	maxWidth?: Breakpoint;
};

export type Participations = Record<TestId, string>;

type Audience = {
	offset: number;
	size: number;
	breakpoint?: BreakpointRange;
};

type Audiences = { [key in IsoCountry | CountryGroupId | 'ALL']?: Audience };

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

// ----- Setup ----- //
const MVT_COOKIE = 'GU_mvt_id';
const MVT_MAX = 1000000;

// ----- Functions ----- //
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

function getIsRemoteFromAcquisitionData(): boolean {
	const queryString = getQueryParameter('acquisitionData');

	if (!queryString) {
		return false;
	}

	try {
		const data = JSON.parse(queryString) as { isRemote?: boolean };
		return !!data.isRemote;
	} catch {
		console.error('Cannot parse acquisition data from query string');
		return false;
	}
}

function getTestFromAcquisitionData(): AcquisitionABTest | null | undefined {
	const acquisitionDataParam = getQueryParameter('acquisitionData');

	if (!acquisitionDataParam) {
		return null;
	}

	try {
		const acquisitionData = JSON.parse(acquisitionDataParam) as {
			abTest?: AcquisitionABTest;
		};

		if (acquisitionData.abTest?.variant) {
			return acquisitionData.abTest;
		}

		return null;
	} catch {
		console.error('Cannot parse acquisition data from query string');
		return null;
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

function userInTest(
	test: Test,
	testId: string,
	mvtId: number,
	country: IsoCountry,
	countryGroupId: CountryGroupId,
	acquisitionDataTest: AcquisitionABTest | null | undefined,
) {
	const { audiences, referrerControlled } = test;

	if (cookie.get('_post_deploy_user')) {
		return false;
	}

	const audience =
		audiences[country] ?? audiences[countryGroupId] ?? audiences.ALL;

	if (!audience) {
		return false;
	}

	if (referrerControlled) {
		return acquisitionDataTest && acquisitionDataTest.name === testId;
	}

	const testMin: number = MVT_MAX * audience.offset;
	const testMax: number = testMin + MVT_MAX * audience.size;
	return mvtId >= testMin && mvtId < testMax && userInBreakpoint(audience);
}

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

function assignUserToVariant(
	mvtId: number,
	test: Test,
	acquisitionDataTest: AcquisitionABTest | null | undefined,
): number {
	const { referrerControlled, seed } = test;

	if (referrerControlled && acquisitionDataTest != null) {
		const acquisitionVariant = acquisitionDataTest.variant;
		const index = test.variants.findIndex(
			(variant) => variant.id === acquisitionVariant,
		);
		const variantFound = index > -1;

		if (!variantFound) {
			console.error('Variant not found for A/B test in acquistion data');
		}

		return index;
	} else if (referrerControlled && acquisitionDataTest === null) {
		console.error('A/B test expects acquistion data but none was provided');
	}

	return randomNumber(mvtId, seed) % test.variants.length;
}

function targetPageMatches(
	locationPath: string,
	targetPage: (string | null | undefined) | RegExp,
): boolean {
	if (!targetPage) {
		return true;
	}

	return locationPath.match(targetPage) != null;
}

function getParticipations(
	abTests: Tests,
	mvtId: number,
	country: IsoCountry,
	countryGroupId: CountryGroupId,
): Participations {
	const participations: Participations = {};
	const acquisitionDataTest: AcquisitionABTest | null | undefined =
		getTestFromAcquisitionData();
	const isRemote = getIsRemoteFromAcquisitionData();

	// This is a temporary addition to help us compare remote and locally rendered
	// epics on Frontend (as part of testing out the new Contributions Service).
	// It will be removed once the new service is shown to be working correctly.
	if (isRemote) {
		participations.RemoteEpicVariants = 'remote';
	}

	Object.keys(abTests).forEach((testId) => {
		const test = abTests[testId];
		const notintest = 'notintest';

		if (!test.isActive) {
			return;
		}

		if (test.canRun && !test.canRun()) {
			return;
		}

		if (!targetPageMatches(window.location.pathname, test.targetPage)) {
			return;
		}

		if (
			userInTest(
				test,
				testId,
				mvtId,
				country,
				countryGroupId,
				acquisitionDataTest,
			)
		) {
			const variantIndex = assignUserToVariant(
				mvtId,
				test,
				acquisitionDataTest,
			);
			participations[testId] = test.variants[variantIndex].id;

			if (test.optimizeId) {
				trackOptimizeExperiment(test.optimizeId, test.variants, variantIndex);
			}
		} else {
			participations[testId] = notintest;
		}
	});
	return participations;
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

const init = (
	country: IsoCountry,
	countryGroupId: CountryGroupId,
	settings: Settings,
	abTests: Tests = tests,
): Participations => {
	const mvt: number = getMvtId();
	const participations: Participations = getParticipations(
		abTests,
		mvt,
		country,
		countryGroupId,
	);
	const urlParticipations: Participations | null | undefined =
		getParticipationsFromUrl();
	const serverSideParticipations: Participations | null | undefined =
		getServerSideParticipations();
	const amountsTestParticipations: Participations | null | undefined =
		getAmountsTestParticipations(countryGroupId, settings);
	return {
		...participations,
		...serverSideParticipations,
		...amountsTestParticipations,
		...urlParticipations,
	};
};

const getVariantsAsString = (participation: Participations): string => {
	const variants: string[] = [];
	Object.keys(participation).forEach((testId) => {
		variants.push(`${testId}=${participation[testId]}`);
	});
	return variants.join('; ');
};

// ----- Exports ----- //
export { init, getVariantsAsString, targetPageMatches };
