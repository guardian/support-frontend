import * as storage from '../storage/storage';
import type { Participations } from './models';

const PARTICIPATIONS_KEY = 'abParticipations';
const LANDING_PAGE_PARTICIPATIONS_KEY = 'landingPageParticipations';
type Key = typeof PARTICIPATIONS_KEY | typeof LANDING_PAGE_PARTICIPATIONS_KEY;

function getSessionParticipations(key: Key): Participations | undefined {
	const participations = storage.getSession(key);
	if (participations) {
		try {
			return JSON.parse(participations) as Participations;
		} catch (error) {
			console.error(`Failed to parse ${key} from session storage`, error);
			return undefined;
		}
	}
	return undefined;
}

function setSessionParticipations(participations: Participations, key: Key) {
	storage.setSession(key, JSON.stringify(participations));
}

export {
	getSessionParticipations,
	setSessionParticipations,
	PARTICIPATIONS_KEY,
	LANDING_PAGE_PARTICIPATIONS_KEY,
};
