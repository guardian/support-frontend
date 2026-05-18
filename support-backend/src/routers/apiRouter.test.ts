import express from 'express';
import request from 'supertest';
import { IdealPostcodeService } from '../services/idealPostcodeService';
import { buildApiRouter } from './apiRouter';

class FakeIdealPostcodeService extends IdealPostcodeService {
	find() {
		return Promise.resolve([
			{
				lineOne: 'The Guardian Media Group',
				lineTwo: 'Kings Place',
				city: 'London',
				state: 'London',
				postCode: 'N1 9GU',
				country: 'UK',
			},
		]);
	}
}
const app = express();
const fakeIdealPostcodeService = new FakeIdealPostcodeService('fake_api_key');
app.use(buildApiRouter(fakeIdealPostcodeService));

afterEach(() => {
	jest.restoreAllMocks();
});

describe('GET /postcode-lookup/:postcode', () => {
	it('returns 200 and an array for a valid postcode', async () => {
		const findSpy = jest.spyOn(fakeIdealPostcodeService, 'find');

		const response = await request(app).get('/postcode-lookup/N1%209GU');

		expect(response.status).toBe(200);
		expect(response.body).toEqual([
			{
				lineOne: 'The Guardian Media Group',
				lineTwo: 'Kings Place',
				city: 'London',
				state: 'London',
				postCode: 'N1 9GU',
				country: 'UK',
			},
		]);
		expect(findSpy).toHaveBeenCalledWith('N1 9GU');
	});

	it('returns 400 for a postcode longer than 10 characters', async () => {
		const findSpy = jest.spyOn(fakeIdealPostcodeService, 'find');

		const response = await request(app).get('/postcode-lookup/TOOLONGPOSTCODE');

		expect(response.status).toBe(400);
		expect(findSpy).not.toHaveBeenCalled();
	});
});
