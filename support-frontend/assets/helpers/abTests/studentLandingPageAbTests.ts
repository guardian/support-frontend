import type {
	StudentLandingPageTest,
	StudentLandingPageVariant,
} from 'helpers/globalsAndSwitches/studentLandingPageSettings';
import { getSettings } from '../globalsAndSwitches/globals';
import type { PageParticipationsConfig } from './models';
import { STUDENT_LANDING_PAGE_PARTICIPATIONS_KEY } from './sessionStorage';

const fallBackStudentLandingPageSelection: Record<
	string,
	StudentLandingPageVariant
> = {
	AUDCountries: {
		name: 'CONTROL',
		heading: 'Subscribe to fearless and independent journalism ...backup', // TODO:
		subheading:
			'For a limited time, students with a valid UTS email address can unlock the premium experience of Guardian journalism, including unmetered app access, ...backup.', // TODO:
		institution: {
			name: 'University of Technology Sidney',
			acronym: 'UTS',
			logoUrl: '', // TODO:
		},
		image: {
			mobileUrl: '', // TODO: this doesn't work as expected so may need to be adapted
			tabletUrl: '', // TODO:
			desktopUrl: '', // TODO:
			altText: '', // TODO:
		},
		promoCode: ['UTS_STUDENT'],
	},
	NZDCountries: {
		name: 'CONTROL',
		heading: 'Subscribe to fearless and independent journalism ...backup', // TODO:
		subheading:
			'For a limited time, students with a valid UTS email address can unlock the premium experience of Guardian journalism, including unmetered app access, ...backup.', // TODO:
		institution: {
			name: 'University of Technology Sidney',
			acronym: 'UTS',
			logoUrl: '', // TODO:
		},
		image: {
			mobileUrl: '', // TODO: this doesn't work as expected so may need to be adapted
			tabletUrl: '', // TODO:
			desktopUrl: '', // TODO:
			altText: '', // TODO:
		},
		promoCode: ['NZ_STUDENT'],
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

	const urlCountryGroupId = path.split('/')[1]?.trim(); // fingers-crossed the URL doesn't change!
	const urlInstitution = path.split('/')[3]?.trim();

	return tests.filter((element: StudentLandingPageTest) => {
		const region = element.regionId.substring(0, 2).toLowerCase().trim();
		const institution = element.variants[0]?.institution.acronym.trim();
		return region === urlCountryGroupId && institution === urlInstitution;
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
