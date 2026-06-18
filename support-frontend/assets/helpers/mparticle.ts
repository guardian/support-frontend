import { getUser } from 'helpers/user/user';
import { fetchJson } from './async/fetch';
import { hasTargetingConsent } from './page/analyticsAndConsent';

let cachedAudienceMemberships: Promise<number[]> | null = null;

/**
 * Fetches the mParticle audience memberships for the user.
 * Make a request to mparticle only if the user:
 * - is signed in
 * - has targeting consent
 */
const fetchAudienceMemberships = async (): Promise<number[]> => {
	if (!getUser().isSignedIn) {
		return [];
	}

	const hasConsent = await hasTargetingConsent();
	if (!hasConsent) {
		return [];
	}

	if (cachedAudienceMemberships) {
		return cachedAudienceMemberships;
	}

	const timeoutPromise = new Promise<never>((_, reject) => {
		window.setTimeout(() => reject(new Error('Request timed out')), 2000);
	});

	cachedAudienceMemberships = Promise.race([
		fetchJson<{ audienceMemberships: number[] }>('/audience-memberships', {
			mode: 'cors',
			credentials: 'include',
		}),
		timeoutPromise,
	])
		.then((response) => {
			return response.audienceMemberships;
		})
		.catch((error) => {
			console.error(
				`Error fetching audience memberships from mparticle: ${String(error)}`,
			);
			return [];
		})
		.finally(() => {
			cachedAudienceMemberships = null;
		});

	return cachedAudienceMemberships;
};

export { fetchAudienceMemberships };
