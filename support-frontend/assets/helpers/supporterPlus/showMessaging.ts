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
	const selectedAmount = selectedAmounts[contributionType];

	if (selectedAmount === 'other') {
		const otherAmount = otherAmounts[contributionType].amount;
		return otherAmount ? parseInt(otherAmount) >= benefitsThreshold : false;
	}

	return selectedAmount >= benefitsThreshold;
}
