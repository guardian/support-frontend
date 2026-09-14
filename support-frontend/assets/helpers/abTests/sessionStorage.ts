import { z } from 'zod';
import { getSession, setSession } from 'helpers/storage/storage';
import type { Participations } from './models';

const participationsSchema: z.ZodType<Participations> = z.record(
	z.string(),
	z.string().optional(),
);

// For participation in tests defined in abtestDefinitions.ts
const PARTICIPATIONS_KEY = 'abParticipations';
// For participation in landing page tests, which are passed through from the server
const LANDING_PAGE_PARTICIPATIONS_KEY = 'landingPageParticipations';
const CHECKOUT_NUDGE_PARTICIPATIONS_KEY = 'checkoutNudgeParticipations';
const ONE_TIME_CHECKOUT_PARTICIPATIONS_KEY = 'oneTimeCheckoutParticipations';
const STUDENT_LANDING_PAGE_PARTICIPATIONS_KEY =
	'studentLandingPageParticipations';

export type Key =
	| typeof PARTICIPATIONS_KEY
	| typeof LANDING_PAGE_PARTICIPATIONS_KEY
	| typeof CHECKOUT_NUDGE_PARTICIPATIONS_KEY
	| typeof ONE_TIME_CHECKOUT_PARTICIPATIONS_KEY
	| typeof STUDENT_LANDING_PAGE_PARTICIPATIONS_KEY;

function getSessionParticipations(key: Key): Participations | null {
	try {
		return getSession(key, participationsSchema);
	} catch (error) {
		console.error(`Failed to fetch ${key} from session storage`, error);
		return null;
	}
}

function setSessionParticipations(participations: Participations, key: Key) {
	setSession(key, participations);
}

function clearParticipationsFromSession(): void {
	setSession(PARTICIPATIONS_KEY, {});
	setSession(LANDING_PAGE_PARTICIPATIONS_KEY, {});
	setSession(ONE_TIME_CHECKOUT_PARTICIPATIONS_KEY, {});
	setSession(STUDENT_LANDING_PAGE_PARTICIPATIONS_KEY, {});
}

export {
	clearParticipationsFromSession,
	getSessionParticipations,
	setSessionParticipations,
	PARTICIPATIONS_KEY,
	LANDING_PAGE_PARTICIPATIONS_KEY,
	CHECKOUT_NUDGE_PARTICIPATIONS_KEY,
	ONE_TIME_CHECKOUT_PARTICIPATIONS_KEY,
	STUDENT_LANDING_PAGE_PARTICIPATIONS_KEY,
};
