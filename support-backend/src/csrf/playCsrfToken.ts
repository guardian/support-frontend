import { createHmac, timingSafeEqual } from 'crypto';

/**
 * SPIKE (issue #8246, Phase 0 item 2): a TypeScript reimplementation of Play's
 * signed CSRF token verification.
 *
 * Throughout this migration the HTML is still rendered by Scala Play, so the
 * CSRF token in the page and the `GU_support_csrf` cookie are Play-issued,
 * Play-signed tokens. This validates them using the shared `play.http.secret.key`.
 *
 * The shared secret is a TEMPORARY coupling: once the HTML endpoints migrate and
 * the TS app becomes the token issuer, the shared secret can be retired and this
 * module should grow the ability to *issue* tokens, not just validate them.
 *
 * Faithful to Play 3.0.10 `DefaultCSRFTokenSigner` / `DefaultCookieSigner`:
 *   signedToken = HMAC_SHA1(secret, "nonce-rawToken") + "-" + nonce + "-" + rawToken
 * where the HMAC is lower-case hex over the UTF-8 bytes of "nonce-rawToken".
 *
 * Note the values in the header and the cookie are DIFFERENT strings for the
 * SAME raw token (Play re-signs with a fresh nonce each time, a BREACH
 * mitigation). The raw token is carried in plaintext within each signed string,
 * so we verify each signature (recomputing the HMAC — it cannot be reversed),
 * read off the raw token from each, and compare those RAW tokens — never compare
 * the signed strings directly.
 */

function sign(message: string, secret: string): string {
	return createHmac('sha1', secret).update(message, 'utf8').digest('hex');
}

function constantTimeEquals(a: string, b: string): boolean {
	const aBuffer = Buffer.from(a, 'utf8');
	const bBuffer = Buffer.from(b, 'utf8');
	if (aBuffer.length !== bBuffer.length) {
		return false;
	}
	return timingSafeEqual(aBuffer, bBuffer);
}

/**
 * Verify a signed token and return its raw value, or `null` if the signature
 * doesn't match. Mirrors Play's `extractSignedToken`, including its
 * `split("-", 3)` semantics where the raw token keeps any trailing dashes.
 */
export function extractSignedToken(
	signedToken: string,
	secret: string,
): string | null {
	const firstDash = signedToken.indexOf('-');
	const secondDash = signedToken.indexOf('-', firstDash + 1);
	if (firstDash === -1 || secondDash === -1) {
		return null;
	}

	const signature = signedToken.slice(0, firstDash);
	const nonce = signedToken.slice(firstDash + 1, secondDash);
	const rawToken = signedToken.slice(secondDash + 1);

	if (!constantTimeEquals(signature, sign(`${nonce}-${rawToken}`, secret))) {
		return null;
	}
	return rawToken;
}

/**
 * Return true if both signed tokens verify and share the same raw token.
 * Mirrors Play's `compareSignedTokens` (used to compare the `Csrf-Token` header
 * against the `GU_support_csrf` cookie).
 */
export function compareSignedTokens(
	tokenA: string,
	tokenB: string,
	secret: string,
): boolean {
	const rawA = extractSignedToken(tokenA, secret);
	const rawB = extractSignedToken(tokenB, secret);
	if (rawA === null || rawB === null) {
		return false;
	}
	return constantTimeEquals(rawA, rawB);
}
