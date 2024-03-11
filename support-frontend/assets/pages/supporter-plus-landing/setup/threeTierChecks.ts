import type { Participations } from 'helpers/abTests/abtest';
import { countriesAffectedByVATStatus } from 'helpers/internationalisation/country';
import type { IsoCountry } from 'helpers/internationalisation/country';

export const threeTierCheckoutEnabled = (
	abParticipations: Participations,
	countryId: IsoCountry,
): boolean => {
	const displayPatronsCheckout = !!abParticipations.patronsOneOffOnly;
	const displaySupportPlusOnlyCheckout = !!abParticipations.supporterPlusOnly;

	return !(
		displayPatronsCheckout ||
		displaySupportPlusOnlyCheckout ||
		countriesAffectedByVATStatus.includes(countryId)
	);
};
