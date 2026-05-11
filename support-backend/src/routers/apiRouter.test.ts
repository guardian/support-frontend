import express from 'express';
import request from 'supertest';
import { apiRouter } from './apiRouter';

const app = express();
app.use(apiRouter);

describe('GET /postcode-lookup/:postcode', () => {
	it('returns 200 and an array for a valid postcode', async () => {
		const response = await request(app).get('/postcode-lookup/N1%209GU');

		expect(response.status).toBe(200);
		expect(response.body).toEqual([]);
	});

	it('returns 400 for a postcode longer than 10 characters', async () => {
		const response = await request(app).get('/postcode-lookup/TOOLONGPOSTCODE');

		expect(response.status).toBe(400);
	});
});
