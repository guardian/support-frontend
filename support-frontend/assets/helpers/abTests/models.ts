import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { Key } from './sessionStorage';

export const breakpoints = {
	mobile: 320,
	mobileMedium: 375,
	mobileLandscape: 480,
	phablet: 660,
	tablet: 740,
	desktop: 980,
	leftCol: 1140,
	wide: 1300,
};

type Breakpoint = keyof typeof breakpoints;

type BreakpointRange = {
	minWidth?: Breakpoint;
	maxWidth?: Breakpoint;
};

type Audience = {
	offset: number;
	size: number;
	breakpoint?: BreakpointRange;
};

type AudienceType = IsoCountry | CountryGroupId | 'ALL' | 'CONTRIBUTIONS_ONLY';

type Audiences = Partial<Record<AudienceType, Audience>>;

type AcquisitionABTest = {
	name: string;
	variant: string;
	testType?: string;
};

type Variant = {
	id: string;
};

type Test = {
	variants: Variant[];
	audiences: Audiences;
	isActive: boolean;
	canRun?: () => boolean;
	// Indicates whether the A/B test is controlled by the referrer (acquisition channel)
	// e.g. Test of a banner design change on dotcom
	// If true the A/B test participation info should be passed through in the acquisition data
	// query parameter.
	// In particular this allows 3rd party tests to be identified and tracked in support-frontend
	// without too much "magic" involving the shared mvtId.
	referrerControlled: boolean;
	// If another test participation is referrerControlled, exclude this test
	excludeIfInReferrerControlledTest?: boolean;
	seed: number;
	// An optional regex that will be tested against the path of the current page
	// before activating this test eg. '/(uk|us|au|ca|nz)/subscribe$'
	targetPage?: string | RegExp;
	// Persist this test participation across more pages using this regex
	persistPage?: string | RegExp;
	omitCountries?: IsoCountry[];
	// Some users will see a version of the checkout that only offers
	// the option to make contributions. We won't want to include these
	// users in some AB tests
	excludeContributionsOnlyCountries: boolean;
};

type Tests = Record<string, Test>;

type Participations = Record<string, string | undefined>;

interface PageTest<Variant> {
	name: string;
	status: 'Live' | 'Draft';
	priority?: number;
	regionTargeting?: {
		targetedCountryGroups?: CountryGroupId[];
	};
	variants: Variant[];
}
interface PageParticipationsConfig<Variant> {
	tests: Array<PageTest<Variant>>;
	pageRegex: string;
	forceParamName: string;
	sessionStorageKey: Key;
	fallbackVariant: (countryGroupId: CountryGroupId) => Variant;
	fallbackParticipationKey: string;
	getVariantName: (variant: Variant) => string;
}

export type {
	AcquisitionABTest,
	Audience,
	Participations,
	Test,
	Tests,
	Variant,
	PageParticipationsConfig,
	PageTest,
};
