import fetchMock from '@fetch-mock/jest';
import {
	acceptInvitation,
	declineInvitation,
	isInvitationUnavailable,
	verifyInvitation,
} from 'helpers/onboardingInvitee/invitation';

beforeAll(() => {
	fetchMock.mockGlobal();
});

afterAll(() => {
	fetchMock.unmockGlobal();
});

beforeEach(() => {
	fetchMock.removeRoutes();
});

const invitationCode = 'twT95D1SFKBd';
const endpoint = `/invitation/${invitationCode}`;
const acceptEndpoint = `/invitation/${invitationCode}/accept`;
const csrf = { token: 'test-csrf-token' };

const oneDayInMillis = 24 * 60 * 60 * 1000;

function invitationResponse(expiryDate: number) {
	return {
		subscriptionName: 'A-S00974337',
		invitationCode,
		primaryIdentityId: '112809589',
		secondaryUserEmail: 'invitee@example.com',
		secondaryIdentityId: '21841960',
		invitedDate: '2026-07-22',
		expiryDate,
	};
}

describe('verifyInvitation', () => {
	it('returns a valid result with the invitee email for an unexpired invitation', async () => {
		fetchMock.get(endpoint, {
			body: invitationResponse(Date.now() + oneDayInMillis),
			headers: { 'Content-Type': 'application/json' },
		});

		const result = await verifyInvitation(invitationCode);

		expect(result).toEqual({
			status: 'valid',
			invitation: {
				invitationCode,
				email: 'invitee@example.com',
			},
		});
	});

	it('maps primaryUserFirstName onto the invitation when the API returns it', async () => {
		fetchMock.get(endpoint, {
			body: {
				...invitationResponse(Date.now() + oneDayInMillis),
				primaryUserFirstName: 'Jontho',
			},
			headers: { 'Content-Type': 'application/json' },
		});

		const result = await verifyInvitation(invitationCode);

		expect(result).toEqual({
			status: 'valid',
			invitation: {
				invitationCode,
				email: 'invitee@example.com',
				inviterFirstName: 'Jontho',
			},
		});
	});

	it('returns expired when the server reports the invitation has expired (410)', async () => {
		fetchMock.get(endpoint, {
			status: 410,
			body: { reason: 'expired' },
			headers: { 'Content-Type': 'application/json' },
		});

		const result = await verifyInvitation(invitationCode);

		expect(result).toEqual({ status: 'expired' });
	});

	it('returns accepted when the invitation has already been accepted (410)', async () => {
		fetchMock.get(endpoint, {
			status: 410,
			body: { reason: 'alreadyAccepted' },
			headers: { 'Content-Type': 'application/json' },
		});

		const result = await verifyInvitation(invitationCode);

		expect(result).toEqual({ status: 'accepted' });
	});

	it('returns invalid when a 410 response has no reason', async () => {
		fetchMock.get(endpoint, {
			status: 410,
			body: 'Invitation has already been accepted',
			headers: { 'Content-Type': 'application/json' },
		});

		const result = await verifyInvitation(invitationCode);

		expect(result).toEqual({ status: 'invalid' });
	});

	it('returns invalid when the invitation does not exist (404)', async () => {
		fetchMock.get(endpoint, { status: 404 });

		const result = await verifyInvitation(invitationCode);

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

		const result = await verifyInvitation(invitationCode);

		expect(result).toEqual({ status: 'invalid' });
	});

	it('returns invalid when the request fails', async () => {
		fetchMock.get(endpoint, { throws: new Error('network failure') });

		const result = await verifyInvitation(invitationCode);

		expect(result).toEqual({ status: 'invalid' });
	});

	it('returns invalid when the response body does not match the invitation shape', async () => {
		fetchMock.get(endpoint, {
			body: { message: 'not an invitation' },
			headers: { 'Content-Type': 'application/json' },
		});

		const result = await verifyInvitation(invitationCode);

		expect(result).toEqual({ status: 'invalid' });
	});
});

describe('acceptInvitation', () => {
	it('returns accepted when the invitation is accepted successfully', async () => {
		fetchMock.post(acceptEndpoint, { status: 200 });

		const result = await acceptInvitation(invitationCode, csrf);

		expect(result).toBe('accepted');
	});

	it('returns wrongUser when the accept request is 400', async () => {
		fetchMock.post(acceptEndpoint, { status: 400 });

		const result = await acceptInvitation(invitationCode, csrf);

		expect(result).toBe('wrongUser');
	});

	it('returns failed when the accept request is not ok', async () => {
		fetchMock.post(acceptEndpoint, { status: 500 });

		const result = await acceptInvitation(invitationCode, csrf);

		expect(result).toBe('failed');
	});

	it('returns failed when the request fails', async () => {
		fetchMock.post(acceptEndpoint, { throws: new Error('network failure') });

		const result = await acceptInvitation(invitationCode, csrf);

		expect(result).toBe('failed');
	});
});

describe('isInvitationUnavailable', () => {
	const validVerification = {
		status: 'valid' as const,
		invitation: { invitationCode, email: 'invitee@example.com' },
	};

	it('returns true when there is no invitation code', () => {
		expect(isInvitationUnavailable(undefined, undefined, 'accept')).toBe(true);
	});

	it('returns false while verification is still loading', () => {
		expect(isInvitationUnavailable(invitationCode, undefined, 'accept')).toBe(
			false,
		);
	});

	it('returns true for invalid and expired invitations', () => {
		expect(
			isInvitationUnavailable(invitationCode, { status: 'invalid' }, 'accept'),
		).toBe(true);
		expect(
			isInvitationUnavailable(invitationCode, { status: 'expired' }, 'reject'),
		).toBe(true);
	});

	it('returns true when rejecting an already accepted invitation', () => {
		expect(
			isInvitationUnavailable(invitationCode, { status: 'accepted' }, 'reject'),
		).toBe(true);
	});

	it('returns false when accepting an already accepted invitation', () => {
		expect(
			isInvitationUnavailable(invitationCode, { status: 'accepted' }, 'accept'),
		).toBe(false);
	});

	it('returns false for a valid invitation in either mode', () => {
		expect(
			isInvitationUnavailable(invitationCode, validVerification, 'accept'),
		).toBe(false);
		expect(
			isInvitationUnavailable(invitationCode, validVerification, 'reject'),
		).toBe(false);
	});
});

describe('declineInvitation', () => {
	it('returns true when the invitation is declined successfully', async () => {
		fetchMock.delete(endpoint, { status: 204 });

		const result = await declineInvitation(invitationCode, csrf);

		expect(result).toBe(true);
	});

	it('returns false when the decline request is not ok', async () => {
		fetchMock.delete(endpoint, { status: 404 });

		const result = await declineInvitation(invitationCode, csrf);

		expect(result).toBe(false);
	});

	it('returns false when the request fails', async () => {
		fetchMock.delete(endpoint, { throws: new Error('network failure') });

		const result = await declineInvitation(invitationCode, csrf);

		expect(result).toBe(false);
	});
});
