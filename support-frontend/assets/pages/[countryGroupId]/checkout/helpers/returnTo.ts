/**
 * ?returnTo=/crosswords/quick/17000 lets another Guardian product (e.g. Puzzles)
 * bring readers back once the purchase is complete. The CTA label comes from
 * the source config (?source=), never from the URL.
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
