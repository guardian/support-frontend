// ----- Imports ----- //
import type { Participations } from 'helpers/abTests/models';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
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

export const subscriptionsLandingProps = (
	participations: Participations,
): SubscriptionsLandingPropTypes => ({
	countryGroupId,
	participations,
	pricingCopy: getGlobal('pricingCopy'),
	referrerAcquisitions: getReferrerAcquisitionData(),
});
