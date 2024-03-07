import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getThresholdPrice } from './benefitsThreshold';
import { isOneOff } from './isContributionRecurring';

export function shouldShowSupporterPlusMessaging(
	contributionType: ContributionType,
	selectedAmounts: SelectedAmounts,
	otherAmounts: OtherAmounts,
	countryGroupId: CountryGroupId,
	promotion?: Promotion,
): boolean {
	if (isOneOff(contributionType)) {
		return false;
	}

	const benefitsThreshold = getThresholdPrice(
		countryGroupId,
		contributionType,
		promotion,
	);

	const selectedAmount = selectedAmounts[contributionType];

	if (selectedAmount === 'other') {
		const otherAmount = otherAmounts[contributionType].amount;
		return otherAmount ? parseInt(otherAmount) >= benefitsThreshold : false;
	}

	return selectedAmount >= benefitsThreshold;
}
