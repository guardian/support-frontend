import type { Participations } from 'helpers/abTests/abtest';

export const inThreeTierV2Variant = (
	abParticipations: Participations,
): boolean => {
	return abParticipations.threeTierCheckoutV2 === 'variant';
};
