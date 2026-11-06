import { toSafeReturnPath } from '../returnTo';

describe('toSafeReturnPath', () => {
	it.each([
		'/crosswords/quick/17000',
		'/games/wordiply',
		'/crosswords/quick/17000?foo=bar#top',
	])('accepts the same-site path %s', (path) => {
		expect(toSafeReturnPath(path)).toBe(path);
	});

	it.each([
		undefined,
		null,
		'',
		'crosswords/quick/17000',
		'//evil.com',
		'/\\evil.com',
		'\\\\evil.com',
		'https://evil.com',
		'http://evil.com/crosswords',
		'javascript:alert(1)',
		'/\t/evil.com',
		'/\n/evil.com',
		'/ok\r\nSet-Cookie: a=b',
	])('rejects %j', (path) => {
		expect(toSafeReturnPath(path)).toBeUndefined();
	});
});
