import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { getPromotionOrUndefined } from 'helpers/productPrice/promotions';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
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

	const billingPeriod = (contributionType[0] +
		contributionType.slice(1).toLowerCase()) as BillingPeriod;
	const promotion = useContributionsSelector((state) =>
		getPromotionOrUndefined(
			state.page.checkoutForm.product.productPrices,
			state.common.internationalisation.countryId,
			billingPeriod,
		),
	);
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
