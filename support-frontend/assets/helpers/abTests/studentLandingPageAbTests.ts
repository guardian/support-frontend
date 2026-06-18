import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import {
	countryGroupBySupportRegionId,
	countryGroups,
} from '@modules/internationalisation/countryGroup';
import type {
	StudentLandingPageTest,
	StudentLandingPageVariant,
} from 'helpers/globalsAndSwitches/studentLandingPageSettings';
import { getSettings } from '../globalsAndSwitches/globals';
import type { PageParticipationsConfig } from './models';
import { STUDENT_LANDING_PAGE_PARTICIPATIONS_KEY } from './sessionStorage';

/**
 * Configuration for student landing page A/B tests.
 * No fallback is provided — if there is no matching live test,
 * the variant will be undefined (the caller must handle this).
 */
const studentLandingPageTestConfig: Omit<
	PageParticipationsConfig<StudentLandingPageVariant>,
	'tests'
> = {
	pageRegex: '^/[a-z]{2}/student/[^/]+$',
	forceParamName: 'force-student-lp',
	sessionStorageKey: STUDENT_LANDING_PAGE_PARTICIPATIONS_KEY,
	getVariantName: (variant) => variant.name,
};

const filterTestsByURL = (
	tests: StudentLandingPageTest[],
): StudentLandingPageTest[] => {
	if (tests.length === 0) {
		return tests;
	}
	const path: string = window.location.pathname;

	const supportRegionId = path.split('/')[1]?.trim() as SupportRegionId; // fingers-crossed the URL doesn't change!
	const urlCountryGroup = countryGroupBySupportRegionId(supportRegionId);
	const urlInstitution = path.split('/')[3]?.trim();

	return tests.filter((test: StudentLandingPageTest) => {
		const regionMatches =
			countryGroups[test.countryGroupId].supportRegionId ===
			urlCountryGroup.supportRegionId;
		const institutionMatches = test.name.trim() === urlInstitution;
		return regionMatches && institutionMatches;
	});
};

/**
 * Helper to get student landing page test config with tests from settings
 */
export function getStudentLandingPageTestConfig(): PageParticipationsConfig<StudentLandingPageVariant> {
	const filtered = filterTestsByURL(
		getSettings().studentLandingPageTests ?? [],
	);
	return {
		...studentLandingPageTestConfig,
		tests: filtered,
	};
}
