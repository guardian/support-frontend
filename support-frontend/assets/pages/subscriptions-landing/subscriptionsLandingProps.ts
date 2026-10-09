// ----- Imports ----- //
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type { Participations } from 'helpers/abTests/models';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { getReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

export type SubscriptionsLandingProps = {
	countryGroupId: CountryGroupId;
	participations: Participations;
	promotions: PromoWithCatalogInformation[];
	referrerAcquisitions: ReferrerAcquisitionData;
};
const countryGroupId = CountryGroup.detect();

export const subscriptionsLandingProps = (
	participations: Participations,
): SubscriptionsLandingProps => ({
	countryGroupId,
	participations,
	promotions: window.guardian.promotions ?? [],
	referrerAcquisitions: getReferrerAcquisitionData(),
});
