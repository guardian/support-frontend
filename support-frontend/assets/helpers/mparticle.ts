import { getUser } from 'helpers/user/user';
import { fetchJson } from './async/fetch';
import { hasTargetingConsent } from './page/analyticsAndConsent';

const PAST_CONTRIBUTOR_MPARTICLE_AUDIENCE_ID = 22994;

/**
 * Returns true if user is in mparticle "past contributors" audience.
 * Make a request to mparticle only if the user:
 * - is signed in
 * - has targeting consent
 * - is in the mparticle AB test
 */
const fetchIsPastSingleContributor = async (
	isSignedIn: boolean,
	isVariantToFetch?: boolean,
): Promise<boolean> => {
	if (!isSignedIn) {
		return false;
	}
	if (!isVariantToFetch) {
		return false;
	}
	const hasConsent = await hasTargetingConsent();
	if (!hasConsent) {
		return false;
	}

	try {
		const response = await fetchJson<{
			isAudienceMember: boolean;
		}>(`/audience/${PAST_CONTRIBUTOR_MPARTICLE_AUDIENCE_ID}/member`, {
			mode: 'cors',
			credentials: 'include',
		});

		return response.isAudienceMember;
	} catch (error) {
		console.error(
			`Error fetching audience data from mparticle: ${String(error)}`,
		);
		return false;
	}
};

let cachedAudienceMemberships: Promise<number[]> | null = null;

/**
 * Fetches the mParticle audience memberships for the user.
 * Make a request to mparticle only if the user:
 * - is signed in
 * - has targeting consent
 */
const fetchAudienceMemberships = async (): Promise<number[]> => {
	if (!getUser().isSignedIn) {
		console.log('fetchAudienceMemberships: not signed in');
		return [];
	}

	const hasConsent = await hasTargetingConsent();
	if (!hasConsent) {
		console.log('fetchAudienceMemberships: not consented');
		return [];
	}

	if (cachedAudienceMemberships) {
		return cachedAudienceMemberships;
	}

	const timeoutPromise = new Promise<never>((_, reject) => {
		window.setTimeout(() => reject(new Error('Request timed out')), 2000);
	});

	console.log('fetchAudienceMemberships: fetching...');
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

export { fetchIsPastSingleContributor, fetchAudienceMemberships };
