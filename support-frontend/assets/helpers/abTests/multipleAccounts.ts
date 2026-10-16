type Participations = Record<string, string | undefined>;

/*  Below is a list of required multiple account participation tests  
    Each test currently has variants Control / V1 / V2
        threeTierLanding page: Control variant displays multipleAccountsBenefit
        checkout: All variants displays multipleAccountsBenefit
        onboarding (secondary user journeys): All variants hide multipleAccountsBenefit */
const multipleAccountsParticipants = [
	'MULTIPLE_ACCOUNTS',
	'MULTIPLE_ACCOUNTS_UK',
	'MULTIPLE_ACCOUNTS_US',
	'MULTIPLE_ACCOUNTS_AU',
];
export const multipleAccountsBenefit = 'Three extra accounts to share';

const verifyParticipation = (
	participations: Participations,
	participationKey: string,
	variant: string,
): boolean => {
	return participations[participationKey] === variant;
};

export const verifyMultipleAccountsParticipation = (
	participations: Participations,
	variant: string,
): string | undefined => {
	return multipleAccountsParticipants.find((participantKey) =>
		verifyParticipation(participations, participantKey, variant),
	)
		? variant
		: undefined;
};
