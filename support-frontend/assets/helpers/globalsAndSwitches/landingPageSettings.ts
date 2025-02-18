import type { CountryGroupId } from '../internationalisation/countryGroup';

interface LandingPageCopy {
	heading: string;
	subheading: string;
}

export interface LandingPageVariant {
	name: string;
	copy: LandingPageCopy;
}

interface RegionTargeting {
	targetedCountryGroups: CountryGroupId[];
}

export interface LandingPageTest {
	name: string;
	status: 'Live' | 'Draft';
	regionTargeting?: RegionTargeting;
	variants: LandingPageVariant[];
}
