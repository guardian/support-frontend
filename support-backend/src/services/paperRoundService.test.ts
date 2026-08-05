import fetchMock from 'fetch-mock';
import { PaperRoundService } from './paperRoundService';

const BASE_URL = 'https://paperround.example.com';

afterEach(() => {
	fetchMock.removeRoutes();
	fetchMock.clearHistory();
});

describe('PaperRoundServic', () => {
	describe('coverage', () => {
		it('returns a parsed valid response', async () => {
			fetchMock.post(`${BASE_URL}/coverage`, {
				status_code: 200,
				data: {
					agents: [
						{
							agentid: 1,
							agentname: 'Example Delivery Agent',
							deliverymethod: '',
							nbrdeliverydays: 7,
							postcode: 'N1 9GU',
							refgroupid: 1,
							summary: '',
						},
					],
					message: '',
					status: 'CO',
				},
			});
			const service = new PaperRoundService(BASE_URL, 'test_api_key');

			const result = await service.coverage('N1 9GU');

			expect(result).toEqual({
				status_code: 200,
				data: {
					agents: [
						{
							agentid: 1,
							agentname: 'Example Delivery Agent',
							deliverymethod: '',
							nbrdeliverydays: 7,
							postcode: 'N1 9GU',
							refgroupid: 1,
							summary: '',
						},
					],
					message: '',
					status: 'CO',
				},
			});
		});

		it('throws an error if the response body does not parse', async () => {
			fetchMock.post(`${BASE_URL}/coverage`, {
				oops: 'broken',
			});
			const service = new PaperRoundService(BASE_URL, 'test_api_key');

			await expect(service.coverage('N1 9GU')).rejects.toThrow(
				/Invalid coverage response/,
			);
		});

		it('throws an error if the request returns a non OK HTTP status code', async () => {
			fetchMock.post(`${BASE_URL}/coverage`, 500);
			const service = new PaperRoundService(BASE_URL, 'test_api_key');

			await expect(service.coverage('N1 9GU')).rejects.toThrow(
				/Received error response from PaperRound/,
			);
		});
	});
});
