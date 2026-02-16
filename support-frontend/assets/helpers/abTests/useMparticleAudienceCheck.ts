import { useEffect, useState } from 'react';
import type { LandingPageTest } from '../globalsAndSwitches/landingPageSettings';
import { fetchIsUserInAudience } from '../mparticle';
import { getUser } from '../user/user';

interface AudienceCheckResult {
	// null = still loading, undefined = no match found, LandingPageTest = matched test
	matchedTest: LandingPageTest | undefined | null;
}

/**
 * Hook that checks a list of audience-targeted landing page tests
 * and returns the first one where the user is in the mParticle audience.
 *
 * - Returns { matchedTest: null } while checking
 * - Returns { matchedTest: LandingPageTest } if a match is found
 * - Returns { matchedTest: undefined } if no match or no tests to check
 */
export function useMparticleAudienceCheck(
	testsWithAudience: LandingPageTest[],
): AudienceCheckResult {
	const [matchedTest, setMatchedTest] = useState<
		LandingPageTest | undefined | null
	>(() => (testsWithAudience.length === 0 ? undefined : null));
	const { isSignedIn } = getUser();

	useEffect(() => {
		if (testsWithAudience.length === 0) {
			setMatchedTest(undefined);
			return;
		}

		let cancelled = false;

		const timeout = setTimeout(() => {
			if (!cancelled) {
				setMatchedTest(undefined);
			}
		}, 2000);

		async function checkAudiences() {
			for (const test of testsWithAudience) {
				if (cancelled) {
					return;
				}

				if (test.mParticleAudience === undefined) {
					continue;
				}

				const audienceId = test.mParticleAudience;

				try {
					const isInAudience: boolean = await fetchIsUserInAudience(
						isSignedIn,
						audienceId,
					);
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- isInAudience can be false at runtime
					if (isInAudience && !cancelled) {
						clearTimeout(timeout);
						setMatchedTest(test);
						return;
					}
				} catch (error) {
					console.error(
						`Error checking audience ${audienceId} for test ${test.name}:`,
						error,
					);
				}
			}
			// No match found
			if (!cancelled) {
				clearTimeout(timeout);
				setMatchedTest(undefined);
			}
		}

		void checkAudiences();

		return () => {
			cancelled = true;
			clearTimeout(timeout);
		};
	}, [isSignedIn, testsWithAudience.map((t) => t.name).join(',')]);

	return { matchedTest };
}
