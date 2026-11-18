import { stringifyWithCmpConsentRedacted } from '../util/logging';

test('redacts CMP consent snapshots from serialized worker logs', () => {
	const serialized = stringifyWithCmpConsentRedacted({
		requestId: 'request-id',
		cmpConsentSnapshot: {
			framework: 'tcfv2',
			tcfv2: { tcString: 'raw-consent-string' },
		},
	});

	expect(serialized).toContain('request-id');
	expect(serialized).toContain('[redacted]');
	expect(serialized).not.toContain('raw-consent-string');
});
