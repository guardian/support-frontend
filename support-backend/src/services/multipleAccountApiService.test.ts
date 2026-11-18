import fetchMock from 'fetch-mock';
import { MultipleAccountApiService } from './multipleAccountApiService';

const BASE_URL = 'https://multiple-account.example.com';

afterEach(() => {
	fetchMock.removeRoutes();
	fetchMock.clearHistory();
});

describe('MultipleAccountApiService', () => {
	describe('getInvitation', () => {
		it('sends the api key and returns the upstream status and body', async () => {
			fetchMock.get(`${BASE_URL}/invitation/abc123`, {
				status: 200,
				body: { invitationCode: 'abc123' },
			});

			const service = new MultipleAccountApiService(BASE_URL, 'test_api_key');
			const result = await service.getInvitation('abc123');

			expect(result).toEqual({
				status: 200,
				body: JSON.stringify({ invitationCode: 'abc123' }),
			});
			expect(fetchMock.callHistory.lastCall()?.options.headers).toMatchObject({
				'x-api-key': 'test_api_key',
			});
		});

		it('returns non-2xx responses rather than throwing', async () => {
			fetchMock.get(`${BASE_URL}/invitation/abc123`, {
				status: 404,
				body: { message: 'not found' },
			});

			const service = new MultipleAccountApiService(BASE_URL, 'test_api_key');
			const result = await service.getInvitation('abc123');

			expect(result.status).toBe(404);
		});

		it('encodes the invitation code as a path segment', async () => {
			fetchMock.get(`${BASE_URL}/invitation/a%2Fb%20c`, 200);

			const service = new MultipleAccountApiService(BASE_URL, 'test_api_key');
			const result = await service.getInvitation('a/b c');

			expect(result.status).toBe(200);
		});
	});
});
