import type { CountryGroupId } from '../internationalisation/countryGroup';

enum TickerName {
	US = 'US',
	AU = 'AU',
	GLOBAL = 'global',
}

interface TickerCopy {
	countLabel: string;
}

export interface TickerSettings {
	currencySymbol: string;
	copy: TickerCopy;
	name: TickerName;
}

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

interface LandingPageProducts {
	Contribution: LandingPageProductDescription;
	SupporterPlus: LandingPageProductDescription;
	TierThree: LandingPageProductDescription;
}

interface LandingPageCopy {
	heading: string;
	subheading: string;
}

export interface LandingPageVariant {
	name: string;
	copy: LandingPageCopy;
	products: LandingPageProducts;
	tickerSettings?: TickerSettings;
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
