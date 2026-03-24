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

// NOTE: this should never happen - we should get a 404 page instead if there is no live test that matches the path. This mimics the UTS existing page.
// but since we can't remove the fallback at this point, it must be equivalent to the live UTS page.
const fallBackStudentLandingPageSelection: Record<
	string,
	StudentLandingPageVariant
> = {
	AUDCountries: {
		name: 'CONTROL',
		heading: 'Subscribe to fearless, independent and inspiring journalism',
		subheading:
			'For a limited time, students with a valid UTS email address can unlock the premium experience of Guardian journalism, including unmetered app access, <b>free for two years</b>.',
		institution: {
			name: 'University of Technology Sidney',
			acronym: 'UTS',
			logoUrl: 'https://uploads.guim.co.uk/2026/03/10/UTSLogo.svg',
		},
		image: {
			mobileUrl:
				'https://i.guim.co.uk/img/media/811f456e9786d119d766e55f2df821c056d415b0/0_0_2588_1276/master/2588.jpg',
			tabletUrl:
				'https://i.guim.co.uk/img/media/14e65d1ade49300434e31603dd5b43e25e98e6c2/0_0_1396_1632/master/1396.jpg',
			desktopUrl:
				'https://i.guim.co.uk/img/media/f58d5cf9b591f4ddb4ad7a4b9c7bd12ae80dd333/0_0_2295_1632/master/2295.jpg',
			altText: 'Mobile apps for The Guardian and Feast',
		},
		promoCode: ['UTS_STUDENT'],
	},
	NZDCountries: {
		name: 'CONTROL',
		heading: 'Subscribe to fearless, independent and inspiring journalism',
		subheading:
			'For a limited time, students with a valid UTS email address can unlock the premium experience of Guardian journalism, including unmetered app access, <b>free for two years</b>.',
		institution: {
			name: 'University of Technology Sidney',
			acronym: 'UTS',
			logoUrl: 'https://uploads.guim.co.uk/2026/03/10/UTSLogo.svg',
		},
		image: {
			mobileUrl:
				'https://i.guim.co.uk/img/media/811f456e9786d119d766e55f2df821c056d415b0/0_0_2588_1276/master/2588.jpg',
			tabletUrl:
				'https://i.guim.co.uk/img/media/14e65d1ade49300434e31603dd5b43e25e98e6c2/0_0_1396_1632/master/1396.jpg',
			desktopUrl:
				'https://i.guim.co.uk/img/media/f58d5cf9b591f4ddb4ad7a4b9c7bd12ae80dd333/0_0_2295_1632/master/2295.jpg',
			altText: 'Mobile apps for The Guardian and Feast',
		},
		promoCode: ['UTS_STUDENT'],
	},
};

/**
 * Configuration for student landing page A/B tests
 * Use with getPageParticipations to get the variant and participations
 */
const studentLandingPageTestConfig: Omit<
	PageParticipationsConfig<StudentLandingPageVariant>,
	'tests'
> = {
	pageRegex: '^/[a-z]{2}/student/[^/]+$',
	forceParamName: 'force-student-lp',
	sessionStorageKey: STUDENT_LANDING_PAGE_PARTICIPATIONS_KEY,
	fallbackVariant: (countryGroupId) =>
		fallBackStudentLandingPageSelection[
			countryGroupId
		] as StudentLandingPageVariant,
	fallbackParticipationKey: 'FALLBACK_STUDENT_LANDING_PAGE',
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
		const institutionMatches =
			test.variants[0]?.institution.acronym.trim() === urlInstitution;
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
