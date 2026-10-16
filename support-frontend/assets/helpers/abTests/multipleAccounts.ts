type Participations = Record<string, string | undefined>;

/*  Below is a list of required multiple account participation tests  
    Each test currently has variants Control / V1 / V2
        threeTierLanding page: Control variant displays multipleAccountsBenefit
        checkout: All variants displays multipleAccountsBenefit
        onboarding (secondary user journeys): All variants hide multipleAccountsBenefit */
const multipleAccountsTestNames = [
	'MULTIPLE_ACCOUNTS',
	'MULTIPLE_ACCOUNTS_UK',
	'MULTIPLE_ACCOUNTS_US',
	'MULTIPLE_ACCOUNTS_AU',
];
export const multipleAccountBenefitCopy = 'Three extra accounts to share';

export const getMultipleAccountsTestVariantParticipation = (
	participations: Participations,
	variant: string,
): string | undefined => {
	return multipleAccountsTestNames.find(
		(testName) => participations[testName] === variant,
	)
		? variant
		: undefined;
};
