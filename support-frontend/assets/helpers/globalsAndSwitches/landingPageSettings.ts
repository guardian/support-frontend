import type { CountryGroupId } from '../internationalisation/countryGroup';

interface LandingPageCopy {
	heading: string;
	subheading: string;
}

export interface LandingPageVariant {
	name: string;
	copy: LandingPageCopy;
}

interface LandingPageTestTargeting {
	countryGroups: CountryGroupId[];
}

export interface LandingPageTest {
	name: string;
	status: 'Live' | 'Draft';
	targeting: LandingPageTestTargeting;
	variants: LandingPageVariant[];
}