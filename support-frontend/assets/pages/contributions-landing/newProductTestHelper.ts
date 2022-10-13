import { getAmount } from '../../helpers/contributions';
import { getContributionType } from '../../helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from '../../helpers/redux/contributionsStore';
import { getThresholdPrice } from './components/DigiSubBenefits/helpers';

export function isSupporterPlusPurchase(state: ContributionsState): boolean {
	const contributionType = getContributionType(state);

	const thresholdPrice = getThresholdPrice(
		state.common.internationalisation.countryGroupId,
		contributionType,
	);
	const amount = getAmount(
		state.page.checkoutForm.product.selectedAmounts,
		state.page.checkoutForm.product.otherAmounts,
		contributionType,
	);
	const amountIsHighEnough = !!(thresholdPrice && amount >= thresholdPrice);
	return (
		state.common.abParticipations.newProduct == 'variant' && amountIsHighEnough
	);
}
