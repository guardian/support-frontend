// ----- Imports ----- //
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import type { Participations } from 'helpers/abTests/models';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { getReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { DetectSupportRegion } from '../../helpers/internationalisation/classes/detectSupportRegion';

export type PriceCopy = {
	price: number;
	discountCopy: string;
};
export type PricingCopy = Record<SubscriptionProduct, PriceCopy>;
export type SubscriptionsLandingProps = {
	supportRegionId: SupportRegionId;
	participations: Participations;
	pricingCopy: PricingCopy | null | undefined;
	referrerAcquisitions: ReferrerAcquisitionData;
};
const supportRegionId = DetectSupportRegion.detect();

export const subscriptionsLandingProps = (
	participations: Participations,
): SubscriptionsLandingProps => ({
	supportRegionId: supportRegionId,
	participations,
	pricingCopy: getGlobal('pricingCopy'),
	referrerAcquisitions: getReferrerAcquisitionData(),
});
