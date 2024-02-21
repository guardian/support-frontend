import type { Participations } from 'helpers/abTests/abtest';

export const inThreeTierVariants = (
	abParticipations: Participations,
): boolean => {
	return (
		abParticipations.threeTierCheckout === 'variant' ||
		abParticipations.threeTierCheckoutV2 === 'variant'
	);
};

export const inThreeTierV2VariantB = (
	abParticipations: Participations,
): boolean => {
	return abParticipations.threeTierCheckoutV2 === 'variant';
};
