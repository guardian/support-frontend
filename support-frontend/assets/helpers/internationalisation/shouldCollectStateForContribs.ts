import type { ContributionType } from 'helpers/contributions';
import type { IsoCountry } from './country';

export function shouldCollectStateForContributions(
	countryId: IsoCountry,
	contributionType: ContributionType,
): boolean {
	if (contributionType === 'ONE_OFF') return false;
	if (countryId === 'US' || countryId === 'CA' || countryId === 'AU') {
		return true;
	}
	return false;
}
