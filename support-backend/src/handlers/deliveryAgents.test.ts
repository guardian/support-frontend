import express from 'express';
import request from 'supertest';
import { PaperRoundService } from '../services/paperRoundService';
import { buildDeliveryAgentsHandler } from './deliveryAgents';

const service = new PaperRoundService(
	'https://paperround.example.com',
	'fake_api_key',
);
const app = express();
app.get('/delivery-agents/:postcode', buildDeliveryAgentsHandler(service));

afterEach(() => {
	jest.restoreAllMocks();
});

describe('GET /postcode-lookup/:postcode', () => {
	it('returns the expected response for a postcode with coverage', async () => {
		const coverageSpy = jest.spyOn(service, 'coverage').mockResolvedValueOnce({
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

		const response = await request(app).get('/delivery-agents/N1%209GU');

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			type: 'Covered',
			agents: [
				{
					agentId: 1,
					agentName: 'Example Delivery Agent',
					deliveryMethod: '',
					nbrDeliveryDays: 7,
					postcode: 'N1 9GU',
					refGroupId: 1,
					summary: '',
				},
			],
		});
		expect(coverageSpy).toHaveBeenCalledWith('N1 9GU');
	});

	it('returns the expected response for a postcode with no coverage', async () => {
		const coverageSpy = jest.spyOn(service, 'coverage').mockResolvedValueOnce({
			status_code: 200,
			data: {
				agents: [],
				message: '',
				status: 'NC',
			},
		});

		const response = await request(app).get('/delivery-agents/N1%209GU');

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			type: 'NotCovered',
		});
		expect(coverageSpy).toHaveBeenCalledWith('N1 9GU');
	});

	it('returns the expected response for an unknown postcode', async () => {
		const coverageSpy = jest.spyOn(service, 'coverage').mockResolvedValueOnce({
			status_code: 200,
			data: {
				agents: [],
				message: '',
				status: 'MP',
			},
		});

		const response = await request(app).get('/delivery-agents/N1111');

		expect(response.status).toBe(404);
		expect(response.body).toEqual({
			type: 'UnknownPostcode',
		});
		expect(coverageSpy).toHaveBeenCalledWith('N1111');
	});

	it('returns the expected response for a bad postcode', async () => {
		const coverageSpy = jest.spyOn(service, 'coverage').mockResolvedValueOnce({
			status_code: 200,
			data: {
				agents: [],
				message: '',
				status: 'IP',
			},
		});

		const response = await request(app).get('/delivery-agents/12345');

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			type: 'ProblemWithInput',
		});
		expect(coverageSpy).toHaveBeenCalledWith('12345');
	});

	it('returns the expected response for an error from PaperRound', async () => {
		const coverageSpy = jest.spyOn(service, 'coverage').mockResolvedValueOnce({
			status_code: 200,
			data: {
				agents: [],
				message: '',
				status: 'IE',
			},
		});

		const response = await request(app).get('/delivery-agents/12345');

		expect(response.status).toBe(500);
		expect(response.text).toBe('');
		expect(coverageSpy).toHaveBeenCalledWith('12345');
	});
});
