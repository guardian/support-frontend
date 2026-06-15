export interface OnboardingInviteeInvitation {
	invitationId: string;
	email: string;
	inviterFirstName: string;
}

const DEFAULT_MOCK: Omit<OnboardingInviteeInvitation, 'invitationId'> = {
	email: 'jonathan.ruda@gmail.com',
	inviterFirstName: 'Jontho',
};

export function resolveInvitation(
	invitationId: string,
): OnboardingInviteeInvitation {
	return {
		invitationId,
		...DEFAULT_MOCK,
	};
}
