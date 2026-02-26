import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { AmountValuesObject } from 'helpers/contributions';
import type { TickerSettings } from './landingPageSettings';

export interface OneTimeCheckoutVariant {
	name: string;
	heading: string;
	subheading: string;
	amounts: AmountValuesObject;
	tickerSettings?: TickerSettings;
}

interface RegionTargeting {
	targetedCountryGroups: CountryGroupId[];
}

export interface OneTimeCheckoutTest {
	name: string;
	status: 'Live' | 'Draft';
	regionTargeting?: RegionTargeting;
	mParticleAudience?: number;
	variants: OneTimeCheckoutVariant[];
}
