import type { Participations } from 'helpers/abTests/models';
import type { SelectedAmountsVariant } from 'helpers/contributions';
import { isContributionsOnlyCountry } from 'helpers/contributions';

export const threeTierCheckoutEnabled = (
	abParticipations: Participations,
	amountsVariant: SelectedAmountsVariant,
): boolean => {
	const isPaperCheckout = window.location.pathname.startsWith(
		'/subscribe/paper/checkout',
	);

	const isWeeklyCheckout = window.location.pathname.startsWith(
		'/subscribe/weekly/checkout',
	);

	if (isPaperCheckout || isWeeklyCheckout) {
		return false;
	}

	const displayPatronsCheckout = !!abParticipations.patronsOneOffOnly;

	return !(
		displayPatronsCheckout || isContributionsOnlyCountry(amountsVariant)
	);
};
