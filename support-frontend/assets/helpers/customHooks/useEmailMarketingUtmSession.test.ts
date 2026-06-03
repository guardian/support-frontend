import { getSession } from 'helpers/storage/storage';
import useEmailMarketingSession from './useEmailMarketingUtmSession';

jest.mock('helpers/storage/storage', () => ({
	getSession: jest.fn(),
}));

const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;

describe('useEmailMarketingSession', () => {
	beforeEach(() => {
		mockedGetSession.mockReset();
	});

	it('returns false when no acquisition data is in session storage', () => {
		mockedGetSession.mockReturnValue(null);

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
			mockedGetSession.mockReturnValue(
				JSON.stringify({ queryParameters: [queryParameter] }),
			);

			expect(useEmailMarketingSession()).toEqual({
				isMarketingEmailSession: true,
			});
		},
	);

	it('returns false when query parameters do not include an email utm marker', () => {
		mockedGetSession.mockReturnValue(
			JSON.stringify({
				queryParameters: [{ name: 'utm_source', value: 'SOCIAL' }],
			}),
		);

		expect(useEmailMarketingSession()).toEqual({
			isMarketingEmailSession: false,
		});
	});

	it('returns false when acquisition data has no query parameters', () => {
		mockedGetSession.mockReturnValue(JSON.stringify({ source: 'EMAIL' }));

		expect(useEmailMarketingSession()).toEqual({
			isMarketingEmailSession: false,
		});
	});

	it('returns false and logs an error when acquisition data is invalid json', () => {
		const consoleErrorSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => undefined);
		mockedGetSession.mockReturnValue('not-json');

		expect(useEmailMarketingSession()).toEqual({
			isMarketingEmailSession: false,
		});
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Failed to parse acquisitionData from session storage',
			expect.any(SyntaxError),
		);

		consoleErrorSpy.mockRestore();
	});
});
