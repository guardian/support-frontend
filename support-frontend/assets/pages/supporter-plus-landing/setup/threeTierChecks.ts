import type { Participations } from 'helpers/abTests/abtest';
import type { SelectedAmountsVariant } from 'helpers/contributions';
import { isContributionsOnlyCountry } from 'helpers/contributions';

export const threeTierCheckoutEnabled = (
	abParticipations: Participations,
	amountsVariant: SelectedAmountsVariant,
): boolean => {
	const isPaperCheckout = window.location.pathname.startsWith(
		'/subscribe/paper/checkout',
	);
	/**
	 * Unlike Paper and Guardian Weekly the
	 * Digital Edition path includes region eg: uk/subscribe/digitaledition
	 * so we just check for presence of /subscribe/digitaledition substring in
	 * window.location.path here instead of using startsWith.
	 */
	const isDigitalEditionCheckout = window.location.pathname.includes(
		'/subscribe/digitaledition',
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
		isContributionsOnlyCountry(amountsVariant)
	);
};
