import { getUser } from 'helpers/user/user';
import { fetchJson } from './async/fetch';
import { hasTargetingConsent } from './page/analyticsAndConsent';

type AudienceData = {
	audienceMemberships: number[];
	userAttributes: Record<string, unknown>;
};

const emptyAudienceData: AudienceData = {
	audienceMemberships: [],
	userAttributes: {},
};

let cachedAudienceData: Promise<AudienceData> | null = null;

/**
 * Fetches mParticle audience memberships and user attributes for the user.
 * Make a request to mparticle only if the user:
 * - is signed in
 * - has targeting consent
 */
const fetchAudienceData = async (): Promise<AudienceData> => {
	if (!getUser().isSignedIn) {
		return emptyAudienceData;
	}

	const hasConsent = await hasTargetingConsent();
	if (!hasConsent) {
		return emptyAudienceData;
	}

	if (cachedAudienceData) {
		return cachedAudienceData;
	}

	const timeoutPromise = new Promise<never>((_, reject) => {
		window.setTimeout(() => reject(new Error('Request timed out')), 2000);
	});

	cachedAudienceData = Promise.race([
		fetchJson<AudienceData>('/audience-data', {
			mode: 'cors',
			credentials: 'include',
		}),
		timeoutPromise,
	])
		.catch((error) => {
			console.error(
				`Error fetching audience data from mparticle: ${String(error)}`,
			);
			return emptyAudienceData;
		})
		.finally(() => {
			cachedAudienceData = null;
		});

	return cachedAudienceData;
};

export { fetchAudienceData };
