// ----- Imports ----- //
import type { Participations } from 'helpers/abTests/abtest';
import { init as initAbTests } from 'helpers/abTests/abtest';
import { getGlobal, getSettings } from 'helpers/globalsAndSwitches/globals';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { getReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

export type PriceCopy = {
	price: number;
	discountCopy: string;
};
export type PricingCopy = Record<SubscriptionProduct, PriceCopy>;
export type SubscriptionsLandingPropTypes = {
	countryGroupId: CountryGroupId;
	participations: Participations;
	pricingCopy?: PricingCopy;
	referrerAcquisitions: ReferrerAcquisitionData;
};
const countryGroupId = detectCountryGroup();
export const subscriptionsLandingProps = (): SubscriptionsLandingPropTypes => ({
	countryGroupId,
	participations: initAbTests(detectCountry(), countryGroupId, getSettings()),
	pricingCopy: getGlobal('pricingCopy'),
	referrerAcquisitions: getReferrerAcquisitionData(),
});
