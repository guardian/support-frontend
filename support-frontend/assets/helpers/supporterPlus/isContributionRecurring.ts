import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';

export function isOneOff(
	contributionType: ContributionType,
): contributionType is 'ONE_OFF' {
	return contributionType === 'ONE_OFF';
}

export function isRecurring(
	contributionType: ContributionType,
): contributionType is RegularContributionType {
	return contributionType !== 'ONE_OFF';
}
