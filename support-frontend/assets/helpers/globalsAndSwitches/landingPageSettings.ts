import type { CountryGroupId } from '../internationalisation/countryGroup';

interface ProductBenefit {
	copy: string;
	tooltip?: string;
	label?: {
		copy: string;
	};
}

// Pricing comes from the product catalog - not configurable here
export interface LandingPageProductDescription {
	title: string;
	label?: {
		copy: string;
	};
	benefits: ProductBenefit[];
	cta: {
		copy: string;
	};
}

export interface Products {
	recurringContribution: LandingPageProductDescription;
	supporterPlus: LandingPageProductDescription;
	tierThree: LandingPageProductDescription;
}

interface LandingPageCopy {
	heading: string;
	subheading: string;
}

export interface LandingPageVariant {
	name: string;
	copy: LandingPageCopy;
	products: Products;
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
