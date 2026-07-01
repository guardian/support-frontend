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

interface Scheduler {
	start?: string; // ISO date "YYYY-MM-DD", inclusive
	end?: string; // ISO date "YYYY-MM-DD", inclusive
}

export interface OneTimeCheckoutTest {
	name: string;
	status: 'Live' | 'Draft';
	regionTargeting?: RegionTargeting;
	variants: OneTimeCheckoutVariant[];
	scheduler?: Scheduler;
}
