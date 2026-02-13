import { useEffect, useState } from 'react';
import { fetchIsUserInAudience } from '../mparticle';
import { getUser } from '../user/user';

/**
 * Hook to check if a user should see content based on mParticle audience.
 *
 * This hook follows the pattern used in threeTierLanding.tsx:
 * - Shows loading state while checking audience
 * - Falls back to not showing the test if check fails or times out
 * - Returns null while loading, boolean when complete
 */
export function useMparticleAudienceCheck(audienceId?: number): boolean | null {
	const [shouldShowTest, setShouldShowTest] = useState<boolean | null>(null);
	const { isSignedIn } = getUser();

	useEffect(() => {
		console.log('useMparticleAudienceCheck useEffect called with:', {
			audienceId,
			isSignedIn,
		});

		// If no audience ID, show to everyone
		if (!audienceId) {
			console.log('No audienceId provided, showing to everyone');
			setShouldShowTest(true);
			return;
		}

		console.log('Checking audience membership for ID:', audienceId);

		// Set a timeout to prevent indefinite loading
		const timeout = setTimeout(() => {
			console.log('Audience check timed out after 2 seconds');
			setShouldShowTest(false);
		}, 2000);

		// Check if user is in the audience
		fetchIsUserInAudience(isSignedIn, audienceId)
			.then((isInAudience) => {
				console.log('Audience check result:', isInAudience);
				setShouldShowTest(isInAudience);
			})
			.catch((error) => {
				// On error, default to not showing the test
				console.error('Error checking mParticle audience:', error);
				setShouldShowTest(false);
			})
			.finally(() => {
				clearTimeout(timeout);
			});

		return () => {
			console.log('Cleaning up audience check');
			clearTimeout(timeout);
		};
	}, [isSignedIn, audienceId]);

	return shouldShowTest;
}
