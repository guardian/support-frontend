import type { StudentLandingPageVariant } from 'helpers/globalsAndSwitches/studentLandingPageSettings';
import { getSettings } from '../globalsAndSwitches/globals';
import type { PageParticipationsConfig } from './models';
import { STUDENT_LANDING_PAGE_PARTICIPATIONS_KEY } from './sessionStorage';

const fallBackStudentLandingPageSelection: Record<
	string,
	StudentLandingPageVariant
> = {
	AUDCountries: {
		name: 'CONTROL',
		heading: 'Subscribe to fearless and independent journalism - backup', // TODO:
		subheading: 'Support us with the amount of your choice.', // TODO:
		institution: {
			name: 'University of Technology Sidney',
			acronym: 'UTS',
			logoUrl: '', // TODO:
		},
		image: {
			mobileUrl: '', // TODO:
			tabletUrl: '', // TODO:
			desktopUrl: '', // TODO:
			altText: '', // TODO:
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
	pageRegex: '^/.*/student(/.*)?$', // TODO: fix - will this pick up student beans too?
	forceParamName: 'force-student-landing-page', // TODO: appropriate?
	sessionStorageKey: STUDENT_LANDING_PAGE_PARTICIPATIONS_KEY,
	fallbackVariant: (countryGroupId) =>
		fallBackStudentLandingPageSelection[
			countryGroupId
		] as StudentLandingPageVariant,
	fallbackParticipationKey: 'FALLBACK_STUDENT_LANDING_PAGE', // TODO: is this correct for picking up benefits to pass through to checkout?
	getVariantName: (variant) => variant.name,
};

/**
 * Helper to get student landing page test config with tests from settings
 */
export function getStudentLandingPageTestConfig(): PageParticipationsConfig<StudentLandingPageVariant> {
	return {
		...studentLandingPageTestConfig,
		tests: getSettings().studentLandingPageTests ?? [],
	};
}
