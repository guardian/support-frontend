import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
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
	targetedCountryGroups: SupportRegionId[];
}

export interface OneTimeCheckoutTest {
	name: string;
	status: 'Live' | 'Draft';
	regionTargeting?: RegionTargeting;
	variants: OneTimeCheckoutVariant[];
}
