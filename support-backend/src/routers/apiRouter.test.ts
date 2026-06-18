import express from 'express';
import request from 'supertest';
import { IdealPostcodeService } from '../services/idealPostcodeService';
import { buildApiRouter } from './apiRouter';

const service = new IdealPostcodeService('fake_api_key');
const app = express();
app.use(buildApiRouter(service));

afterEach(() => {
	jest.restoreAllMocks();
});

describe('GET /postcode-lookup/:postcode', () => {
	it('returns 200 and an array for a valid postcode', async () => {
		const findSpy = jest.spyOn(service, 'find').mockResolvedValueOnce([
			{
				lineOne: 'The Guardian Media Group',
				lineTwo: 'Kings Place',
				city: 'London',
				state: 'London',
				postCode: 'N1 9GU',
				country: 'UK',
			},
		]);

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

	it('returns 200 and an empty array when no results are found', async () => {
		const findSpy = jest.spyOn(service, 'find').mockResolvedValueOnce([]);

		const response = await request(app).get('/postcode-lookup/XXX');

		expect(response.status).toBe(200);
		expect(response.body).toEqual([]);
		expect(findSpy).toHaveBeenCalledWith('XXX');
	});

	it('returns 400 for a postcode longer than 10 characters', async () => {
		const findSpy = jest.spyOn(service, 'find');

		const response = await request(app).get('/postcode-lookup/TOOLONGPOSTCODE');

		expect(response.status).toBe(400);
		expect(findSpy).not.toHaveBeenCalled();
	});
});
