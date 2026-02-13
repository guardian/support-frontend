import { type ConsentState, onConsent } from '@guardian/libs';
import { fetchJson } from './async/fetch';

const PAST_CONTRIBUTOR_MPARTICLE_AUDIENCE_ID = 22994;

const hasTargetingConsent = (): Promise<boolean> =>
	onConsent()
		.then(({ canTarget }: ConsentState) => canTarget)
		.catch(() => false);

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

/**
 * Generic function to check if a user is in any mParticle audience.
 * Returns true if the user is in the specified audience, false otherwise.
 * Make a request to mparticle only if the user:
 * - is signed in
 * - has targeting consent
 */
const fetchIsUserInAudience = async (
	isSignedIn: boolean,
	audienceId: number,
): Promise<boolean> => {
	if (!isSignedIn) {
		return false;
	}

	const hasConsent = await hasTargetingConsent();
	if (!hasConsent) {
		return false;
	}

	try {
		const response = await fetchJson<{
			isAudienceMember: boolean;
		}>(`/audience/${audienceId}/member`, {
			mode: 'cors',
			credentials: 'include',
		});

		return response.isAudienceMember;
	} catch (error) {
		console.error(
			`Error fetching audience data from mparticle for audience ${audienceId}: ${String(
				error,
			)}`,
		);
		return false;
	}
};

export { fetchIsPastSingleContributor, fetchIsUserInAudience };
