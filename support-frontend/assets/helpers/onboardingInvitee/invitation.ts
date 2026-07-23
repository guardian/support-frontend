export interface OnboardingInviteeInvitation {
	invitationId: string;
	email: string;
	inviterFirstName?: string;
}

type InvitationStatus = 'valid' | 'expired' | 'invalid';

export interface VerifyInvitationResult {
	status: InvitationStatus;
	invitation?: OnboardingInviteeInvitation;
}

interface InvitationResponse {
	invitation: {
		subscriptionName: string;
		invitationCode: string;
		primaryIdentityId: string;
		secondaryUserEmail: string;
		secondaryIdentityId: string;
		invitedDate: string;
		expiryDate: number;
	};
}

// Verifies an invitation via the Play server, which proxies the multiple-account
// API and attaches the API key server side. A 404 means the code doesn't exist
// and a 400 means it has been cancelled; both (along with any unexpected
// failure) are surfaced as 'invalid'. Expiry is derived from the expiryDate
// epoch-millis in the response.
export async function verifyInvitation(
	invitationId: string,
): Promise<VerifyInvitationResult> {
	try {
		const response = await fetch(
			`/api/invitation/${encodeURIComponent(invitationId)}`,
		);

		if (!response.ok) {
			return { status: 'invalid' };
		}

		const { invitation } = (await response.json()) as InvitationResponse;

		if (invitation.expiryDate <= Date.now()) {
			return { status: 'expired' };
		}

		return {
			status: 'valid',
			invitation: {
				invitationId,
				email: invitation.secondaryUserEmail,
			},
		};
	} catch {
		return { status: 'invalid' };
	}
}
