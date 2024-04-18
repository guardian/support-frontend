// ----- Imports ----- //
import type { Participations } from 'helpers/abTests/abtest';
import { init as initAbTests } from 'helpers/abTests/abtest';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import { Country, CountryGroup } from 'helpers/internationalisation';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
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
	pricingCopy: PricingCopy | null | undefined;
	referrerAcquisitions: ReferrerAcquisitionData;
};
const countryGroupId = CountryGroup.detect();
const abtestInitalizerData = {
	countryId: Country.detect(),
	countryGroupId,
};
export const subscriptionsLandingProps = (): SubscriptionsLandingPropTypes => ({
	countryGroupId,
	participations: initAbTests(abtestInitalizerData),
	pricingCopy: getGlobal('pricingCopy'),
	referrerAcquisitions: getReferrerAcquisitionData(),
});
