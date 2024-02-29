import type { Participations } from 'helpers/abTests/abtest';

export const inThreeTierV3 = (abParticipations: Participations): boolean => {
	return (
		inThreeTierV3Fixed(abParticipations) ||
		inThreeTierV3Variable(abParticipations)
	);
};

const inThreeTierV3Fixed = (abParticipations: Participations): boolean => {
	return abParticipations.threeTierCheckoutV3 === 'variantFixed';
};

export const inThreeTierV3Variable = (
	abParticipations: Participations,
): boolean => {
	return abParticipations.threeTierCheckoutV3 === 'variantVariable';
};
