import { type ConsentState, onConsent } from '@guardian/libs';
import { fetchJson } from './async/fetch';

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
	variant?: string,
): Promise<boolean> => {
	if (!isSignedIn) {
		return false;
	}
	if (!(variant === 'control' || variant === 'variant')) {
		return false;
	}

	const hasConsent = await hasTargetingConsent();
	if (!hasConsent) {
		return false;
	}

	try {
		const response = await fetchJson<{
			isPastSingleContributor: boolean;
		}>('/analytics-user-profile', {
			mode: 'cors',
			credentials: 'include',
		});

		return response.isPastSingleContributor;
	} catch (error) {
		console.log(
			`Error fetching audience data from mparticle: ${String(error)}`,
		);
		return false;
	}
};

export { fetchIsPastSingleContributor };
