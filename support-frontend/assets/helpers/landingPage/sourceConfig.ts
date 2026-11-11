import { getBaseDomain } from 'helpers/urls/url';

/**
 * Lets another Guardian product or team (e.g. Puzzles) link to the landing page
 * with a pre-approved setup, via ?source=<key>. The URL only carries the key;
 * everything it switches on lives here, so no copy can be injected through it.
 *
 * To add a source, add an entry below.
 */
type SourceConfig = {
	// Label of the thank-you page CTA that sends the reader back (?returnUrl=)
	returnLabel?: string;
	// Hide parts of the landing page. These only ever remove content.
	hideContribution?: boolean;
	hideSupportOnce?: boolean;
	hideStudentOffer?: boolean;
	// Only landing page tests named `<prefix>_...` (case-insensitive) can be
	// selected for this source. Those tests are never selected for visitors
	// without this source. e.g. 'puzzles' accepts PUZZLES_HUB_LANDING.
	testPrefixes?: string[];
};

export const sourceConfigs = {
	puzzles: {
		returnLabel: 'Return to Puzzles & games',
		hideContribution: true,
		hideSupportOnce: true,
		hideStudentOffer: true,
		testPrefixes: ['puzzles'],
	},
} as const satisfies Record<string, SourceConfig>;

export type SourceKey = keyof typeof sourceConfigs;

// Keys are matched case-insensitively (e.g. `?source=Puzzles`).
export function toSourceKey(
	raw: string | null | undefined,
): SourceKey | undefined {
	const lowerRaw = raw?.trim().toLowerCase();
	return Object.keys(sourceConfigs).find((key) => key === lowerRaw) as
		| SourceKey
		| undefined;
}

export function getSourceConfig(source: SourceKey | undefined): SourceConfig {
	return source ? sourceConfigs[source] : {};
}

const matchesPrefix = (testName: string, prefix: string): boolean =>
	testName.toLowerCase().startsWith(`${prefix.toLowerCase()}_`);

const allTestPrefixes = (): string[] =>
	Object.values<SourceConfig>(sourceConfigs).flatMap(
		(config) => config.testPrefixes ?? [],
	);

/**
 * With a source that has test prefixes only the tests it accepts are eligible,
 * otherwise (no source, or a source without prefixes) every test except the ones
 * that belong to a source is.
 */
export function isTestEligibleForSource(
	testName: string,
	source: SourceKey | undefined,
): boolean {
	const sourcePrefixes = getSourceConfig(source).testPrefixes;
	if (sourcePrefixes?.length) {
		return sourcePrefixes.some((prefix) => matchesPrefix(testName, prefix));
	}
	return !allTestPrefixes().some((prefix) => matchesPrefix(testName, prefix));
}

/**
 * ?returnUrl=https://www.theguardian.com/crosswords/quick/17000 lets another
 * Guardian product (e.g. Puzzles) bring readers back once the purchase is
 * complete. Same parameter and rule as Identity's `returnUrl`: a full URL whose
 * host is the Guardian domain of this environment or a subdomain of it. The CTA
 * label comes from the source config, never from the URL.
 */
export function toSafeReturnUrl(
	raw: string | null | undefined,
): string | undefined {
	if (!raw) {
		return undefined;
	}
	try {
		const url = new URL(raw);
		const baseDomain = getBaseDomain();
		const isGuardianHost =
			url.hostname === baseDomain || url.hostname.endsWith(`.${baseDomain}`);
		// Return the parsed href, so what was checked is what the CTA links to.
		return url.protocol === 'https:' &&
			!url.username &&
			!url.password &&
			isGuardianHost
			? url.href
			: undefined;
	} catch {
		return undefined;
	}
}
