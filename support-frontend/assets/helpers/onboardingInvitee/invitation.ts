export interface OnboardingInviteeInvitation {
	invitationId: string;
	email: string;
	inviterFirstName: string;
	benefits: string[];
}

const DEFAULT_BENEFITS = [
	'Unlimited access to the premium Guardian app',
	'Unlimited access to the Guardian Feast app',
	"Digital access to the Guardian's 200-year newspaper archive",
	'Daily digital Guardian newspaper',
	'Guardian Weekly e-magazine',
	'The Long Read e-magazine',
	'Far fewer asks for support',
	'Ad-free reading on all your devices',
	'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
];

const DEFAULT_MOCK: Omit<OnboardingInviteeInvitation, 'invitationId'> = {
	email: 'sam.taylor@gmail.com',
	inviterFirstName: 'Emma',
	benefits: DEFAULT_BENEFITS,
};

export function resolveInvitation(
	invitationId: string,
): OnboardingInviteeInvitation {
	return {
		invitationId,
		...DEFAULT_MOCK,
	};
}
