import express from 'express';
import request from 'supertest';
import { MultipleAccountApiService } from '../services/multipleAccountApiService';
import {
	buildGetInvitationHandler,
	resultFromGetInvitation,
} from './getInvitation';

const invitationBody = (expiryDate: number) =>
	JSON.stringify({
		subscriptionName: 'A-S00974337',
		invitationCode: 'twT95D1SFKBd',
		primaryIdentityId: '112809589',
		secondaryUserEmail: 'invitee@example.com',
		secondaryIdentityId: '21841960',
		invitedDate: '2026-07-22',
		expiryDate,
	});

describe('resultFromGetInvitation', () => {
	it('returns the upstream status when it is not 200', () => {
		const result = resultFromGetInvitation(
			{ status: 404, body: '{"message":"not found"}' },
			0,
		);
		expect(result).toEqual({
			status: 404,
			type: 'json',
			body: '{"message":"not found"}',
		});
	});

	it('returns 200 when the invitation has not expired', () => {
		const body = invitationBody(2000);
		const result = resultFromGetInvitation({ status: 200, body }, 1500);
		expect(result).toEqual({ status: 200, type: 'json', body });
	});

	it('returns 410 with reason expired when the invitation has expired', () => {
		const result = resultFromGetInvitation(
			{ status: 200, body: invitationBody(1000) },
			2000,
		);
		expect(result).toEqual({
			status: 410,
			type: 'json',
			body: { reason: 'expired' },
		});
	});

	it('returns 410 with reason expired when expiryDate equals now', () => {
		const result = resultFromGetInvitation(
			{ status: 200, body: invitationBody(1000) },
			1000,
		);
		expect(result).toEqual({
			status: 410,
			type: 'json',
			body: { reason: 'expired' },
		});
	});

	it('returns 410 with reason alreadyAccepted when upstream reports the invitation is gone', () => {
		const result = resultFromGetInvitation(
			{ status: 410, body: '"Invitation has already been accepted"' },
			0,
		);
		expect(result).toEqual({
			status: 410,
			type: 'json',
			body: { reason: 'alreadyAccepted' },
		});
	});

	it('returns 500 when a 200 response is missing expiryDate', () => {
		const result = resultFromGetInvitation(
			{ status: 200, body: '{"invitationCode":"abc"}' },
			0,
		);
		expect(result.status).toBe(500);
	});

	it('returns 500 when a 200 response is not valid JSON', () => {
		const result = resultFromGetInvitation(
			{ status: 200, body: 'not json' },
			0,
		);
		expect(result.status).toBe(500);
	});
});

describe('GET /invitation/:invitationCode', () => {
	const service = new MultipleAccountApiService(
		'https://multiple-account.example.com',
		'fake_api_key',
	);
	const app = express();
	app.get('/invitation/:invitationCode', buildGetInvitationHandler(service));

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('returns the upstream invitation as JSON when it has not expired', async () => {
		const body = invitationBody(Date.now() + 60_000);
		const getInvitationSpy = jest
			.spyOn(service, 'getInvitation')
			.mockResolvedValueOnce({ status: 200, body });

		const response = await request(app).get('/invitation/twT95D1SFKBd');

		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toMatch(/application\/json/);
		expect(response.body).toEqual(JSON.parse(body));
		expect(getInvitationSpy).toHaveBeenCalledWith('twT95D1SFKBd');
	});

	it('returns 410 with reason expired when the invitation has expired', async () => {
		jest
			.spyOn(service, 'getInvitation')
			.mockResolvedValueOnce({ status: 200, body: invitationBody(0) });

		const response = await request(app).get('/invitation/twT95D1SFKBd');

		expect(response.status).toBe(410);
		expect(response.body).toEqual({ reason: 'expired' });
	});

	it('returns 410 with reason alreadyAccepted when upstream returns 410', async () => {
		jest
			.spyOn(service, 'getInvitation')
			.mockResolvedValueOnce({ status: 410, body: '"Already accepted"' });

		const response = await request(app).get('/invitation/twT95D1SFKBd');

		expect(response.status).toBe(410);
		expect(response.body).toEqual({ reason: 'alreadyAccepted' });
	});

	it('passes through other upstream error statuses', async () => {
		jest
			.spyOn(service, 'getInvitation')
			.mockResolvedValueOnce({ status: 400, body: '{"message":"cancelled"}' });

		const response = await request(app).get('/invitation/twT95D1SFKBd');

		expect(response.status).toBe(400);
		expect(response.body).toEqual({ message: 'cancelled' });
	});

	it('returns 500 when the multiple-account API call fails', async () => {
		jest
			.spyOn(service, 'getInvitation')
			.mockRejectedValueOnce(new Error('network error'));
		jest.spyOn(console, 'error').mockImplementation(() => undefined);

		const response = await request(app).get('/invitation/twT95D1SFKBd');

		expect(response.status).toBe(500);
	});

	it('does not attempt to double decode the path parameter', async () => {
		const getInvitationSpy = jest
			.spyOn(service, 'getInvitation')
			.mockResolvedValueOnce({ status: 404, body: '{}' });

		await request(app).get('/invitation/%25');

		expect(getInvitationSpy).toHaveBeenCalledWith('%');
	});
});
