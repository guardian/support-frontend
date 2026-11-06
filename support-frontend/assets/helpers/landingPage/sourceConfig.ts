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
