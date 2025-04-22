import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';

export function isRecurring(
	contributionType: ContributionType,
): contributionType is RegularContributionType {
	return contributionType !== 'ONE_OFF';
}
