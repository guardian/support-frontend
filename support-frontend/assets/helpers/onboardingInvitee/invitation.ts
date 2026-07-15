export interface OnboardingInviteeInvitation {
	invitationId: string;
	email: string;
	inviterFirstName: string;
}

export type InvitationStatus = 'valid' | 'expired' | 'invalid';

export interface VerifyInvitationResult {
	status: InvitationStatus;
	invitation?: OnboardingInviteeInvitation;
}

const DEFAULT_MOCK: Omit<OnboardingInviteeInvitation, 'invitationId'> = {
	email: 'jonathan.ruda@gmail.com',
	inviterFirstName: 'Jontho',
};

// Mocked invitation-verification endpoint. The real implementation will call
// the BFF; for now we resolve asynchronously and derive the status from the
// invitationId so the different branches can be exercised while testing:
//   - id containing "expired" -> expired
//   - id containing "invalid" -> invalid
//   - anything else           -> valid
export async function verifyInvitation(
	invitationId: string,
): Promise<VerifyInvitationResult> {
	await Promise.resolve();

	if (invitationId.includes('expired')) {
		return { status: 'expired' };
	}

	if (invitationId.includes('invalid')) {
		return { status: 'invalid' };
	}

	return {
		status: 'valid',
		invitation: {
			invitationId,
			...DEFAULT_MOCK,
		},
	};
}
