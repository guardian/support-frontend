import * as storage from '../storage/storage';
import type { Participations } from './models';

// For participation in tests defined in abtestDefinitions.ts
const PARTICIPATIONS_KEY = 'abParticipations';
// For participation in landing page tests, which are passed through from the server
const LANDING_PAGE_PARTICIPATIONS_KEY = 'landingPageParticipations';
const CHECKOUT_NUDGE_PARTICIPATIONS_KEY = 'checkoutNudgeParticipations';
type Key =
	| typeof PARTICIPATIONS_KEY
	| typeof LANDING_PAGE_PARTICIPATIONS_KEY
	| typeof CHECKOUT_NUDGE_PARTICIPATIONS_KEY;

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

function clearParticipationsFromSession(): void {
	storage.setSession(PARTICIPATIONS_KEY, JSON.stringify({}));
	storage.setSession(LANDING_PAGE_PARTICIPATIONS_KEY, JSON.stringify({}));
}

export {
	clearParticipationsFromSession,
	getSessionParticipations,
	setSessionParticipations,
	PARTICIPATIONS_KEY,
	LANDING_PAGE_PARTICIPATIONS_KEY,
	CHECKOUT_NUDGE_PARTICIPATIONS_KEY,
};
