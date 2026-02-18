import { useEffect, useState } from 'react';
import useAnalyticsProfile from '../customHooks/useAnalyticsProfile';
import type { LandingPageTest } from '../globalsAndSwitches/landingPageSettings';
import {
	getMparticleAudienceCheckCache,
	setMparticleAudienceCheckCache,
} from './sessionStorage';

interface AudienceCheckResult {
	// null = still loading, undefined = no match found, LandingPageTest = matched test
	matchedTest: LandingPageTest | undefined | null;
}

/**
 * Hook that checks a list of audience-targeted landing page tests
 * and returns the first one where the user is in the mParticle audience.
 *
 * Uses the analytics profile (single API call returning all audience memberships)
 * and session storage to cache results across page loads.
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

	const { audienceMemberships, dataLoaded } = useAnalyticsProfile();

	const testNamesKey = testsWithAudience.map((t) => t.name).join(',');

	useEffect(() => {
		if (testsWithAudience.length === 0) {
			setMatchedTest(undefined);
			return;
		}

		const testNames = testsWithAudience.map((t) => t.name);

		// Check session storage cache first
		const cached = getMparticleAudienceCheckCache();

		if (cached) {
			const testNamesSet = new Set(testNames);
			const cachedTestNamesSet = new Set(cached.testsChecked);
			const isSameTests =
				testNamesSet.size === cachedTestNamesSet.size &&
				[...testNamesSet].every((name) => cachedTestNamesSet.has(name));

			if (isSameTests) {
				if (cached.matchedTestName === null) {
					setMatchedTest(undefined);
				} else {
					const cachedTest = testsWithAudience.find(
						(t) => t.name === cached.matchedTestName,
					);
					setMatchedTest(cachedTest ?? undefined);
				}
				return;
			}
		}

		// Wait for the analytics profile to finish loading
		if (!dataLoaded) {
			return;
		}

		// Synchronously check audience membership against the fetched profile
		const matched = testsWithAudience.find(
			(test) =>
				test.mParticleAudience !== undefined &&
				audienceMemberships.includes(test.mParticleAudience),
		);

		setMparticleAudienceCheckCache({
			matchedTestName: matched?.name ?? null,
			testsChecked: testNames,
		});
		setMatchedTest(matched ?? undefined);
	}, [testNamesKey, dataLoaded, audienceMemberships]);

	return { matchedTest };
}
