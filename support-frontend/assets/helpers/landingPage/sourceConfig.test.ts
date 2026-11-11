import {
	getSourceConfig,
	isTestEligibleForSource,
	sourceConfigs,
	toSafeReturnUrl,
	toSourceKey,
} from './sourceConfig';

describe('sourceConfigs', () => {
	it('uses lowercase keys, so ?source= can be matched case-insensitively', () => {
		Object.keys(sourceConfigs).forEach((key) => {
			expect(key).toBe(key.toLowerCase());
		});
	});

	it('has no test prefixes that overlap, which would make a test belong to two sources', () => {
		const prefixes = Object.values<{ testPrefixes?: string[] }>(sourceConfigs)
			.flatMap((config) => config.testPrefixes ?? [])
			.map((prefix) => `${prefix.toLowerCase()}_`);
		prefixes.forEach((prefix, index) => {
			prefixes.forEach((other, otherIndex) => {
				if (index !== otherIndex) {
					expect(other.startsWith(prefix)).toBe(false);
				}
			});
		});
	});
});

describe('toSourceKey', () => {
	it.each(['puzzles', 'Puzzles', ' PUZZLES '])('resolves %j', (raw) => {
		expect(toSourceKey(raw)).toBe('puzzles');
	});

	it.each([undefined, null, '', 'puzzle', 'toString', '__proto__'])(
		'ignores %j',
		(raw) => {
			expect(toSourceKey(raw)).toBeUndefined();
		},
	);
});

describe('getSourceConfig', () => {
	it('returns the config of a source', () => {
		expect(getSourceConfig('puzzles')).toMatchObject({
			returnLabel: 'Return to Puzzles & games',
			hideContribution: true,
			hideSupportOnce: true,
			hideStudentOffer: true,
		});
	});

	it('returns an empty config without a source', () => {
		expect(getSourceConfig(undefined)).toEqual({});
	});
});

describe('isTestEligibleForSource', () => {
	it.each(['PUZZLES_HUB_LANDING', 'puzzles_hub', 'Puzzles_x'])(
		'accepts %s for the puzzles source, case-insensitively',
		(name) => {
			expect(isTestEligibleForSource(name, 'puzzles')).toBe(true);
		},
	);

	it.each(['LANDING_TEST', 'PUZZLESX_TEST', 'PUZZLES', 'MY_PUZZLES_TEST'])(
		'rejects %s for the puzzles source',
		(name) => {
			expect(isTestEligibleForSource(name, 'puzzles')).toBe(false);
		},
	);

	it('keeps puzzles tests out of visitors without a source', () => {
		expect(isTestEligibleForSource('PUZZLES_HUB_LANDING', undefined)).toBe(
			false,
		);
		expect(isTestEligibleForSource('puzzles_hub', undefined)).toBe(false);
	});

	it('leaves the other tests eligible without a source', () => {
		expect(isTestEligibleForSource('LANDING_TEST', undefined)).toBe(true);
		expect(isTestEligibleForSource('PUZZLESX_TEST', undefined)).toBe(true);
	});
});

describe('toSafeReturnUrl', () => {
	// jsdom runs on localhost, so the base domain is theguardian.com
	it.each([
		'https://theguardian.com/crosswords/quick/17000',
		'https://www.theguardian.com/games/wordiply',
		'https://www.theguardian.com/crosswords/quick/17000?foo=bar#top',
		'https://manage.theguardian.com/',
	])('accepts %s', (url) => {
		expect(toSafeReturnUrl(url)).toBe(url);
	});

	it.each([
		undefined,
		null,
		'',
		'/crosswords/quick/17000',
		'crosswords/quick/17000',
		'//evil.com',
		'https://evil.com',
		'https://theguardian.com.evil.com',
		'https://eviltheguardian.com',
		'https://evil.com@theguardian.com',
		'https://theguardian.com@evil.com',
		'https://user:pass@www.theguardian.com/',
		'https:\\\\evil.com',
		'http://www.theguardian.com/crosswords',
		'javascript:alert(1)',
		'https://www.theguardian.com\t.evil.com',
		'https://evil.com/?u=https://www.theguardian.com',
	])('rejects %j', (url) => {
		expect(toSafeReturnUrl(url)).toBeUndefined();
	});
});
