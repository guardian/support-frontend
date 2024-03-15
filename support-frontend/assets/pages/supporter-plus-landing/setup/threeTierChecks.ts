import type { Participations } from 'helpers/abTests/abtest';
import { countriesAffectedByVATStatus } from 'helpers/internationalisation/country';
import type { IsoCountry } from 'helpers/internationalisation/country';

export const threeTierCheckoutEnabled = (
	abParticipations: Participations,
	countryId: IsoCountry,
): boolean => {
	const isPaperCheckout = window.location.pathname.startsWith(
		'/subscribe/paper/checkout',
	);
	const isDigitalEditionCheckout = window.location.pathname.startsWith(
		'/subscribe/digitaledition/checkout',
	);

	if (isPaperCheckout || isDigitalEditionCheckout) {
		return false;
	}

	const isWeeklyCheckout = window.location.pathname.startsWith(
		'/subscribe/weekly/checkout',
	);

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
