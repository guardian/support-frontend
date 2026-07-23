import fetchMock from '@fetch-mock/jest';
import { verifyInvitation } from 'helpers/onboardingInvitee/invitation';

beforeAll(() => {
	fetchMock.mockGlobal();
});

afterAll(() => {
	fetchMock.unmockGlobal();
});

beforeEach(() => {
	fetchMock.removeRoutes();
});

const invitationId = 'twT95D1SFKBd';
const endpoint = `/api/invitation/${invitationId}`;

const oneDayInMillis = 24 * 60 * 60 * 1000;

function invitationResponse(expiryDate: number) {
	return {
		invitation: {
			subscriptionName: 'A-S00974337',
			invitationCode: invitationId,
			primaryIdentityId: '112809589',
			secondaryUserEmail: 'invitee@example.com',
			secondaryIdentityId: '21841960',
			invitedDate: '2026-07-22',
			expiryDate,
		},
	};
}

describe('verifyInvitation', () => {
	it('returns a valid result with the invitee email for an unexpired invitation', async () => {
		fetchMock.get(endpoint, {
			body: invitationResponse(Date.now() + oneDayInMillis),
			headers: { 'Content-Type': 'application/json' },
		});

		const result = await verifyInvitation(invitationId);

		expect(result).toEqual({
			status: 'valid',
			invitation: {
				invitationId,
				email: 'invitee@example.com',
			},
		});
	});

	it('returns expired when the expiryDate is in the past', async () => {
		fetchMock.get(endpoint, {
			body: invitationResponse(Date.now() - oneDayInMillis),
			headers: { 'Content-Type': 'application/json' },
		});

		const result = await verifyInvitation(invitationId);

		expect(result).toEqual({ status: 'expired' });
	});

	it('returns invalid when the invitation does not exist (404)', async () => {
		fetchMock.get(endpoint, { status: 404 });

		const result = await verifyInvitation(invitationId);

		expect(result).toEqual({ status: 'invalid' });
	});

	it('returns invalid when the invitation has been cancelled (400)', async () => {
		fetchMock.get(endpoint, {
			status: 400,
			body: {
				message: 'The invitation has been cancelled by the secondary user',
			},
			headers: { 'Content-Type': 'application/json' },
		});

		const result = await verifyInvitation(invitationId);

		expect(result).toEqual({ status: 'invalid' });
	});

	it('returns invalid when the request fails', async () => {
		fetchMock.get(endpoint, { throws: new Error('network failure') });

		const result = await verifyInvitation(invitationId);

		expect(result).toEqual({ status: 'invalid' });
	});
});
