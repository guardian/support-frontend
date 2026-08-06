import * as storage from 'helpers/storage/storage';
import useEmailMarketingSession from './useEmailMarketingUtmSession';

describe('useEmailMarketingSession', () => {
	it('returns false when no acquisition data is in session storage', () => {
		expect(useEmailMarketingSession()).toEqual({
			isMarketingEmailSession: false,
		});
	});

	it.each([
		{ name: 'utm_source', value: 'EMAIL' },
		{ name: 'utm_medium', value: 'email_editorial' },
		{ name: 'utm_medium', value: 'email_marketing' },
	])(
		'returns true when query parameters include a supported email utm marker: %p',
		(queryParameter) => {
			jest
				.spyOn(storage, 'getSession')
				.mockReturnValue({ queryParameters: [queryParameter] });

			expect(useEmailMarketingSession()).toEqual({
				isMarketingEmailSession: true,
			});
		},
	);

	it('returns false when query parameters do not include an email utm marker', () => {
		jest.spyOn(storage, 'getSession').mockReturnValue({
			queryParameters: [{ name: 'utm_source', value: 'SOCIAL' }],
		});

		expect(useEmailMarketingSession()).toEqual({
			isMarketingEmailSession: false,
		});
	});

	it('returns false when acquisition data has no query parameters', () => {
		jest.spyOn(storage, 'getSession').mockReturnValue({ source: 'EMAIL' });

		expect(useEmailMarketingSession()).toEqual({
			isMarketingEmailSession: false,
		});
	});
});
