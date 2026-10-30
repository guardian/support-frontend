import fetchMock from 'fetch-mock';
import { IdealPostcodeService } from './idealPostcodeService';

const BASE_URL = 'https://api.ideal-postcodes.co.uk/v1/postcodes/';

afterEach(() => {
	fetchMock.removeRoutes();
	fetchMock.clearHistory();
});

describe('IdealPostcodeService', () => {
	describe('find', () => {
		it('returns a mapped address for a given postcode', async () => {
			const postcode = 'N1 9GU';
			fetchMock.get(`${BASE_URL}${encodeURIComponent(postcode)}`, {
				result: [
					{
						line_1: 'The Guardian Media Group',
						line_2: 'Kings Place',
						line_3: '',
						post_town: 'London',
						county: '',
						postcode: 'N1 9GU',
					},
				],
			});

			const service = new IdealPostcodeService('test_api_key');
			const result = await service.find(postcode);

			expect(result).toEqual([
				{
					lineOne: 'The Guardian Media Group',
					lineTwo: 'Kings Place',
					city: 'London',
					state: '',
					postCode: 'N1 9GU',
					country: 'UK',
				},
			]);
		});

		it('returns an empty array of results if a 404 is received', async () => {
			const postcode = 'N1 8GU';
			fetchMock.get(`${BASE_URL}${encodeURIComponent(postcode)}`, 404);

			const service = new IdealPostcodeService('test_api_key');
			const result = await service.find(postcode);

			expect(result).toEqual([]);
		});
	});
});
