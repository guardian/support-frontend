import express from 'express';
import request from 'supertest';
import { IdealPostcodeService } from '../services/idealPostcodeService';
import { PaperRoundService } from '../services/paperRoundService';
import { buildApiRouter } from './apiRouter';

const idealPostcodeService = new IdealPostcodeService('fake_api_key');
const paperRoundService = new PaperRoundService(
	'https://paperround.example.com',
	'fake_api_key',
);

const app = express();
app.use(buildApiRouter(idealPostcodeService, paperRoundService));

afterEach(() => {
	jest.restoreAllMocks();
});

describe('apiRouter', () => {
	it('correctly sets the Cache-Control header on /delivery-agents responses', async () => {
		jest.spyOn(paperRoundService, 'coverage').mockResolvedValueOnce({
			status_code: 200,
			data: { agents: [], message: '', status: 'NC' },
		});

		const response = await request(app).get('/delivery-agents/N1%209GU');

		expect(response.headers['cache-control']).toBe('no-cache, private');
	});

	it('correctly sets the Cache-Control header on /postcode-lookup responses', async () => {
		jest.spyOn(idealPostcodeService, 'find').mockResolvedValueOnce([]);

		const response = await request(app).get('/postcode-lookup/N1%209GU');

		expect(response.headers['cache-control']).toBe('no-cache, private');
	});
});
