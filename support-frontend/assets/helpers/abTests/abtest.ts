import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import seedrandom from 'seedrandom';
import { isVatComplianceCountry } from 'helpers/contributions';
import * as cookie from 'helpers/storage/cookie';
import { getQueryParameter } from 'helpers/urls/url';
import { tests } from './abtestDefinitions';
import type {
	AcquisitionABTest,
	Audience,
	Participations,
	Test,
	Tests,
} from './models';
import { breakpoints } from './models';
import { getMvtId, MVT_MAX } from './mvt';
import {
	getSessionParticipations,
	PARTICIPATIONS_KEY,
	setSessionParticipations,
} from './sessionStorage';

export const testIsActive = (
	value: [string, string | undefined],
): value is [string, string] => value[1] !== undefined;

// ----- Init ----- //

type ABtestInitalizerData = {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	abTests?: Tests;
	mvt?: number;
	acquisitionDataTests?: AcquisitionABTest[];
	pathWithQueryString?: string;
};

function init({
	countryId,
	countryGroupId,
	abTests = tests,
	mvt = getMvtId(),
	acquisitionDataTests = getTestFromAcquisitionData() ?? [],
	pathWithQueryString = window.location.pathname + window.location.search,
}: ABtestInitalizerData): Participations {
	const inContributionsOnlyCountry = isVatComplianceCountry(countryId);
	const sessionParticipations = getSessionParticipations(PARTICIPATIONS_KEY);
	const participations = getParticipations(
		abTests,
		mvt,
		countryId,
		countryGroupId,
		inContributionsOnlyCountry,
		pathWithQueryString,
		acquisitionDataTests,
		sessionParticipations,
	);

	const urlParticipations = getParticipationsFromUrl();
	const serverSideParticipations = getServerSideParticipations();
	return {
		...participations,
		...serverSideParticipations,
		...urlParticipations,
	};
}

// ----- Helpers ----- //

function getParticipations(
	abTests: Tests,
	mvtId: number,
	country: IsoCountry,
	countryGroupId: CountryGroupId,
	inContributionsOnlyCountry: boolean,
	pathWithQueryString: string,
	acquisitionDataTests?: AcquisitionABTest[],
	sessionParticipations: Participations = {},
): Participations {
	const participations: Participations = {};

	Object.entries(abTests).forEach(([testId, test]) => {
		if (!test.isActive) {
			return;
		}

		if (test.canRun && !test.canRun()) {
			return;
		}

		if (test.omitCountries?.includes(country)) {
			return;
		}

		// Is the user already in this test in the current browser session?
		if (
			test.persistPage &&
			!!sessionParticipations[testId] &&
			targetPageMatches(pathWithQueryString, test.persistPage)
		) {
			participations[testId] = sessionParticipations[testId];
			return;
		}

		if (!targetPageMatches(pathWithQueryString, test.targetPage)) {
			return;
		}

		const includeOnlyContributionsOnlyCountries =
			!!test.audiences.CONTRIBUTIONS_ONLY;

		/**
		 * Exclude users in VAT compliance countries
		 * from an ab test if the ab test definition has excludeContributionsOnlyCountries as true
		 * AND includeOnlyContributionsOnlyCountries is not true
		 */
		if (
			inContributionsOnlyCountry &&
			test.excludeContributionsOnlyCountries &&
			!includeOnlyContributionsOnlyCountries
		) {
			return;
		}

		/**
		 * Exclude users outside VAT compliance countries
		 * if the  the ab test definition has includeOnlyContributionsOnlyCountries as true
		 */
		if (!inContributionsOnlyCountry && includeOnlyContributionsOnlyCountries) {
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

		const testVariantId = test.variants[variantAssignment.variantIndex]?.id;

		if (testVariantId) {
			participations[testId] = testVariantId;
		}
	});

	// If referrerControlled is set for any test, exclude tests that have excludeIfInReferrerControlledTest set
	const inReferrerControlledTest = Object.keys(participations).some(
		(testId) => abTests[testId]?.referrerControlled,
	);
	if (inReferrerControlledTest) {
		Object.keys(participations).forEach((testId) => {
			if (abTests[testId]?.excludeIfInReferrerControlledTest) {
				delete participations[testId];
			}
		});
	}

	// Store participations which use the persistPage prop in sessionStorage
	Object.keys(participations).forEach((testId) => {
		if (abTests[testId]?.persistPage) {
			sessionParticipations[testId] = participations[testId];
		}
	});
	setSessionParticipations(sessionParticipations, PARTICIPATIONS_KEY);

	return participations;
}

function getParticipationsFromUrl(): Participations | undefined {
	const hashUrl = new URL(document.URL).hash;

	if (hashUrl.startsWith('#ab-')) {
		const [testId, variant] = decodeURI(hashUrl.substr(4)).split('=');
		if (testId && variant) {
			return { [testId]: variant };
		}
	}

	return;
}

function getServerSideParticipations(): Participations | null | undefined {
	if (window.guardian.serversideTests) {
		return window.guardian.serversideTests;
	}
	return null;
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

	if (!(minWidth ?? maxWidth)) {
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
		audiences[country] ??
		audiences[countryGroupId] ??
		audiences.ALL ??
		audiences.CONTRIBUTIONS_ONLY;

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

function targetPageMatches(
	locationPath: string,
	targetPage: (string | null | undefined) | RegExp,
): boolean {
	if (!targetPage) {
		return true;
	}

	return locationPath.match(targetPage) != null;
}

export { init };

// Exported for testing only
export const _ = {
	targetPageMatches,
};
