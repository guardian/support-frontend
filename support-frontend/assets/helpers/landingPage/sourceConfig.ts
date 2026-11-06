/**
 * Lets another Guardian product or team (e.g. Puzzles) link to the landing page
 * with a pre-approved setup, via ?source=<key>. The URL only carries the key;
 * everything it switches on lives here, so no copy can be injected through it.
 *
 * To add a source, add an entry below.
 */
type SourceConfig = {
	// Label of the thank-you page CTA that sends the reader back (?returnTo=)
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
 * ?returnTo=/crosswords/quick/17000 lets another Guardian product (e.g. Puzzles)
 * bring readers back once the purchase is complete. The CTA label comes from
 * the source config, never from the URL.
 */
// Used to resolve the path against a throwaway origin, so any value that would
// leave it (e.g. `//evil.com`, `/\evil.com`, `https://evil.com`) is rejected.
const placeholderOrigin = 'https://return-path.invalid';

/**
 * Only same-site relative paths are accepted, to avoid an open redirect from
 * the thank-you page. Returns undefined for anything else.
 */
export function toSafeReturnPath(
	raw: string | null | undefined,
): string | undefined {
	if (!raw?.startsWith('/') || raw.startsWith('//')) {
		return undefined;
	}
	// eslint-disable-next-line no-control-regex -- control characters are stripped by the URL parser, which can turn `/\t/evil.com` into `//evil.com`
	if (/[\u0000-\u001f\u007f\\]/.test(raw)) {
		return undefined;
	}
	try {
		return new URL(raw, placeholderOrigin).origin === placeholderOrigin
			? raw
			: undefined;
	} catch {
		return undefined;
	}
}
