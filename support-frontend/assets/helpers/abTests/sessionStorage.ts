import * as storage from '../storage/storage';
import type { Participations } from './models';

function getParticipationsFromSession(
	key: string = 'abParticipations',
): Participations | undefined {
	const participations = storage.getSession(key);
	if (participations) {
		try {
			return JSON.parse(participations) as Participations;
		} catch (error) {
			console.error(
				'Failed to parse abParticipations from session storage',
				error,
			);
			return undefined;
		}
	}
	return undefined;
}

const landingPageParticipationsKey = 'landingPageParticipations';
function getLandingPageParticipationsFromSession(): Participations | undefined {
	return getParticipationsFromSession(landingPageParticipationsKey);
}

function setLandingPageParticipations(participations: Participations) {
	storage.setSession(
		landingPageParticipationsKey,
		JSON.stringify(participations),
	);
}

export {
	getParticipationsFromSession,
	getLandingPageParticipationsFromSession,
	setLandingPageParticipations,
};
