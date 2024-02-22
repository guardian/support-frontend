import type { Participations } from 'helpers/abTests/abtest';

export const inThreeTierVariants = (
	abParticipations: Participations,
): boolean => {
	return (
		abParticipations.threeTierCheckout === 'variant' ||
		abParticipations.threeTierCheckoutV2 === 'variantA' ||
		abParticipations.threeTierCheckoutV2 === 'variantB'
	);
};

export const inThreeTierV2VariantB = (
	abParticipations: Participations,
): boolean => {
	return abParticipations.threeTierCheckoutV2 === 'variantB';
};
