import type { Participations } from 'helpers/abTests/abtest';
// import { countriesAffectedByVATStatus } from 'helpers/internationalisation/country';

export const showThreeTierCheckout = (
	abParticipations: Participations,
): boolean => {
	const displayPatronsCheckout = !!abParticipations.patronsOneOffOnly;
	const displaySupportPlusOnlyCheckout = !!abParticipations.supporterPlusOnly;

	return !displayPatronsCheckout || !displaySupportPlusOnlyCheckout;
};

export const showThreeTierVariablePrice = (): boolean => {
	return false;
};
