import { storage } from '@guardian/libs';
import useEmailMarketingSession from './useEmailMarketingUtmSession';

jest.mock('@guardian/libs', () => ({
	storage: {
		session: {
			get: jest.fn(),
		},
	},
}));

const mockedGetSession = storage.session.get as jest.MockedFunction<
	typeof storage.session.get
>;

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
			mockedGetSession.mockReturnValue({ queryParameters: [queryParameter] });

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
});
