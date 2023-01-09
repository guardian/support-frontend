import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { getThresholdPrice } from './benefitsThreshold';
import { isOneOff } from './isContributionRecurring';

export function shouldShowSupporterPlusMessaging(
	contributionType: ContributionType,
	selectedAmounts: SelectedAmounts,
	otherAmounts: OtherAmounts,
	countryGroupId: CountryGroupId,
): boolean {
	if (isOneOff(contributionType)) {
		return false;
	}

	const benefitsThreshold = getThresholdPrice(countryGroupId, contributionType);

	if (selectedAmounts[contributionType] === 'other') {
		const otherAmount = otherAmounts[contributionType].amount;
		return otherAmount ? parseInt(otherAmount) >= benefitsThreshold : false;
	}

	return selectedAmounts[contributionType] >= benefitsThreshold;
}
