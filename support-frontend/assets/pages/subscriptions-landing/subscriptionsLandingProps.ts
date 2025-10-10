// ----- Imports ----- //
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { Participations } from 'helpers/abTests/models';
import {
	getGlobal,
	getProductPrices,
} from 'helpers/globalsAndSwitches/globals';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
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
	productPrices: ProductPrices | null | undefined;
	pricingCopy: PricingCopy | null | undefined;
	referrerAcquisitions: ReferrerAcquisitionData;
};
const countryGroupId = CountryGroup.detect();

export const subscriptionsLandingProps = (
	participations: Participations,
): SubscriptionsLandingPropTypes => ({
	countryGroupId,
	participations,
	productPrices: getProductPrices(),
	pricingCopy: getGlobal('pricingCopy'),
	referrerAcquisitions: getReferrerAcquisitionData(),
});
