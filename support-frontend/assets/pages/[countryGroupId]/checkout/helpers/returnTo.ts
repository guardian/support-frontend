/**
 * Lets another Guardian product (e.g. Puzzles) send readers to the landing page
 * and bring them back once the purchase is complete, via
 * ?returnPath=/crosswords/quick/17000&returnLabel=puzzles
 *
 * The URL never carries copy: returnLabel is a key into the dictionary below,
 * so the thank-you page can only show pre-approved phrases. To support another
 * label, add an entry here.
 */
export const returnLabels = {
	puzzles: 'Return to Puzzles & games',
} as const;

export type ReturnLabelKey = keyof typeof returnLabels;

export function toReturnLabelKey(
	raw: string | null | undefined,
): ReturnLabelKey | undefined {
	return raw && Object.prototype.hasOwnProperty.call(returnLabels, raw)
		? (raw as ReturnLabelKey)
		: undefined;
}

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
