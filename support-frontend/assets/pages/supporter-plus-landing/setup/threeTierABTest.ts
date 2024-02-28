import type { Participations } from 'helpers/abTests/abtest';

export const inThreeTierV2Variant = (
	abParticipations: Participations,
): boolean => {
	return (
		inThreeTierV3Control(abParticipations) ||
		inThreeTierV3Variant(abParticipations)
	);
};

export const inThreeTierV3Control = (
	abParticipations: Participations,
): boolean => {
	return abParticipations.threeTierCheckoutV3 === 'control';
};

export const inThreeTierV3Variant = (
	abParticipations: Participations,
): boolean => {
	return abParticipations.threeTierCheckoutV3 === 'variant';
};
