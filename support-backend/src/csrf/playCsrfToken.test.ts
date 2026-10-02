import { createHmac } from 'crypto';
import { compareSignedTokens, extractSignedToken } from './playCsrfToken';

const SECRET = 'test-application-secret';

/**
 * Local reimplementation of Play's `signToken`, used to generate valid tokens
 * for these tests without needing a running Play instance. Each call uses a
 * fresh nonce, exactly like Play, so two signings of the same raw token produce
 * different strings.
 */
function signToken(
	rawToken: string,
	secret: string,
	nonce: string = Date.now().toString(),
): string {
	const signature = createHmac('sha1', secret)
		.update(`${nonce}-${rawToken}`, 'utf8')
		.digest('hex');
	return `${signature}-${nonce}-${rawToken}`;
}

describe('extractSignedToken', () => {
	it('returns the raw token for a validly signed token', () => {
		const signed = signToken('abc123', SECRET);
		expect(extractSignedToken(signed, SECRET)).toBe('abc123');
	});

	it('returns null when the signature has been tampered with', () => {
		const signed = signToken('abc123', SECRET);
		const tampered = `ffffeeee${signed.slice(8)}`;
		expect(extractSignedToken(tampered, SECRET)).toBeNull();
	});

	it('returns null when verified with the wrong secret', () => {
		const signed = signToken('abc123', SECRET);
		expect(extractSignedToken(signed, 'a-different-secret')).toBeNull();
	});

	it('returns null for a malformed token with no nonce/signature structure', () => {
		expect(extractSignedToken('not-a-real-token', SECRET)).toBeNull();
		expect(extractSignedToken('nodashes', SECRET)).toBeNull();
	});
});

describe('compareSignedTokens', () => {
	it('accepts two independently-signed copies of the same raw token', () => {
		// Different nonces => different strings, same raw token (the header vs
		// cookie case).
		const headerToken = signToken('shared-raw-token', SECRET, '1000');
		const cookieToken = signToken('shared-raw-token', SECRET, '2000');
		expect(headerToken).not.toBe(cookieToken);
		expect(compareSignedTokens(headerToken, cookieToken, SECRET)).toBe(true);
	});

	it('rejects tokens whose raw values differ', () => {
		const headerToken = signToken('raw-token-a', SECRET);
		const cookieToken = signToken('raw-token-b', SECRET);
		expect(compareSignedTokens(headerToken, cookieToken, SECRET)).toBe(false);
	});

	it('rejects when one side is not validly signed', () => {
		const headerToken = signToken('shared-raw-token', SECRET);
		const cookieToken = 'garbage-token-value';
		expect(compareSignedTokens(headerToken, cookieToken, SECRET)).toBe(false);
	});

	it('rejects when the secret is wrong', () => {
		const headerToken = signToken('shared-raw-token', SECRET, '1000');
		const cookieToken = signToken('shared-raw-token', SECRET, '2000');
		expect(compareSignedTokens(headerToken, cookieToken, 'wrong-secret')).toBe(
			false,
		);
	});
});
