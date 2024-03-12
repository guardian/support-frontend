import type { Participations } from 'helpers/abTests/abtest';
import { countriesAffectedByVATStatus } from 'helpers/internationalisation/country';
import type { IsoCountry } from 'helpers/internationalisation/country';

export const threeTierCheckoutEnabled = (
	abParticipations: Participations,
	countryId: IsoCountry,
): boolean => {
	const isWeeklyCheckout =
		window.location.pathname === '/subscribe/weekly/checkout';

	if (isWeeklyCheckout) {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get('threeTierCreateSupporterPlusSubscription') === 'true';
	}

	const displayPatronsCheckout = !!abParticipations.patronsOneOffOnly;
	const displaySupportPlusOnlyCheckout = !!abParticipations.supporterPlusOnly;

	return !(
		displayPatronsCheckout ||
		displaySupportPlusOnlyCheckout ||
		countriesAffectedByVATStatus.includes(countryId)
	);
};
