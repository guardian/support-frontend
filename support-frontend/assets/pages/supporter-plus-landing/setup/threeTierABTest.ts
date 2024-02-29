import type { Participations } from 'helpers/abTests/abtest';

export const inThreeTierV3 = (abParticipations: Participations): boolean => {
	return (
		inThreeTierV3VariantFixed(abParticipations) ||
		inThreeTierV3VariantVariable(abParticipations)
	);
};

const inThreeTierV3VariantFixed = (
	abParticipations: Participations,
): boolean => {
	return abParticipations.threeTierCheckoutV3 === 'variantFixed';
};

export const inThreeTierV3VariantVariable = (
	abParticipations: Participations,
): boolean => {
	return abParticipations.threeTierCheckoutV3 === 'variantVariable';
};
