import type { SelectedAmountsVariant } from 'helpers/contributions';
import { isContributionsOnlyCountry } from 'helpers/contributions';
import type { Participations } from '../../../helpers/abTests/models';

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

	const isWeeklyCheckout = window.location.pathname.startsWith(
		'/subscribe/weekly/checkout',
	);

	if (isPaperCheckout || isDigitalEditionCheckout || isWeeklyCheckout) {
		return false;
	}

	const displayPatronsCheckout = !!abParticipations.patronsOneOffOnly;

	return !(
		displayPatronsCheckout || isContributionsOnlyCountry(amountsVariant)
	);
};
