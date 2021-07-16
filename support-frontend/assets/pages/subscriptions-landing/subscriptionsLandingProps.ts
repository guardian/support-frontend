// ----- Imports ----- //
import { getSettings, getGlobal } from 'helpers/globalsAndSwitches/globals';
import { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
	detect as detectCountryGroup,
	CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import {
	getReferrerAcquisitionData,
	ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import { init as initAbTests, Participations } from 'helpers/abTests/abtest';

export type PriceCopy = {
	price: number;
	discountCopy: string;
};
export type PricingCopy = Record<SubscriptionProduct, PriceCopy>;
export type SubscriptionsLandingPropTypes = {
	countryGroupId: CountryGroupId;
	participations: Participations;
	pricingCopy: PricingCopy | null | undefined;
	referrerAcquisitions: ReferrerAcquisitionData;
};
const countryGroupId = detectCountryGroup();
export const subscriptionsLandingProps = (): SubscriptionsLandingPropTypes => ({
	countryGroupId,
	participations: initAbTests(detectCountry(), countryGroupId, getSettings()),
	pricingCopy: getGlobal('pricingCopy'),
	referrerAcquisitions: getReferrerAcquisitionData(),
});
