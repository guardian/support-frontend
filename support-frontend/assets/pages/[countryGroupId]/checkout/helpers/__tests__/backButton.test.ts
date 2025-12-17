import { buildBackButtonPath } from '../backButton';

describe('buildBackButtonPath', () => {
	it('returns the overridden path when a valid override is provided', () => {
		const result = buildBackButtonPath('/contribute', 'subscriptionsLanding');

		expect(result).toBe('/subscribe');
	});

	it('returns the default path when no override is provided', () => {
		const result = buildBackButtonPath('/contribute', null);

		expect(result).toBe('/contribute');
	});

	it('returns the default path when an invalid override is provided', () => {
		const result = buildBackButtonPath('/contribute', 'invalidOverride');

		expect(result).toBe('/contribute');
	});
});
