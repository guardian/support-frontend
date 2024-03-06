import type { Participations } from 'helpers/abTests/abtest';

export const showThreeTierCheckout = (
	abParticipations: Participations,
): boolean => {
	return (
		showThreeTierFixedPrice(abParticipations) ||
		showThreeTierVariablePrice(abParticipations)
	);
};

const showThreeTierFixedPrice = (abParticipations: Participations): boolean => {
	return abParticipations.threeTierCheckoutV3 === 'variantFixed';
};

export const showThreeTierVariablePrice = (
	abParticipations: Participations,
): boolean => {
	return abParticipations.threeTierCheckoutV3 === 'variantVariable';
};
