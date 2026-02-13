import type { CountryGroupId } from '@modules/internationalisation/countryGroup';

export type TickerName = 'US' | 'AU' | 'global';

interface TickerCopy {
	countLabel: string;
	goalCopy: string;
}

export interface TickerSettings {
	currencySymbol: string;
	copy: TickerCopy;
	name: TickerName;
}

interface CountdownTheme {
	backgroundColor: string;
	foregroundColor: string;
}
export interface CountdownSettings {
	overwriteHeadingLabel: string;
	countdownStartTimestamp: string;
	countdownDeadlineTimestamp: string;
	useLocalTime: boolean;
	theme: CountdownTheme;
}

type ParsedCountdownSettings = {
	countdownStartInMillis: number;
	countdownDeadlineInMillis: number;
};

export const parseCountdownSettings = (
	countdownSettings: CountdownSettings,
): ParsedCountdownSettings => {
	const { useLocalTime, countdownStartTimestamp, countdownDeadlineTimestamp } =
		countdownSettings;
	return {
		countdownStartInMillis: Date.parse(
			useLocalTime ? countdownStartTimestamp : `${countdownStartTimestamp}Z`,
		),
		countdownDeadlineInMillis: Date.parse(
			useLocalTime
				? countdownDeadlineTimestamp
				: `${countdownDeadlineTimestamp}Z`,
		),
	};
};

export interface ProductBenefit {
	copy: string;
	tooltip?: string;
	label?: {
		copy: string;
	};
}

// Pricing comes from the product catalog - not configurable here
export interface LandingPageProductDescription {
	title: string;
	titlePill?: string;
	label?: {
		copy: string;
	};
	benefits: ProductBenefit[];
	cta: {
		copy: string;
	};
}

export interface DefaultProductSelection {
	productType: 'Contribution' | 'SupporterPlus' | 'DigitalSubscription';
	billingPeriod: 'OneTime' | 'Monthly' | 'Annual';
}

interface LandingPageProducts {
	Contribution?: LandingPageProductDescription;
	SupporterPlus?: LandingPageProductDescription;
	DigitalSubscription?: LandingPageProductDescription;
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
	countdownSettings?: CountdownSettings;
	defaultProductSelection?: DefaultProductSelection;
}

interface RegionTargeting {
	targetedCountryGroups: CountryGroupId[];
}

export interface LandingPageTest {
	name: string;
	status: 'Live' | 'Draft';
	regionTargeting?: RegionTargeting;
	mParticleAudience?: number;
	variants: LandingPageVariant[];
}
