import type { ContributionType } from 'helpers/contributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';

// Used when sending data to Quantum Metric from Contributions Checkout
function getContributionCartValueData(contributionsState: ContributionsState): {
	contributionAmount: string | number | null;
	contributionType: ContributionType;
	contributionCurrency: IsoCurrency;
} {
	const pageState = contributionsState.page;
	const selectedAmounts = pageState.checkoutForm.product.selectedAmounts;
	const contributionType = getContributionType(contributionsState);
	const selectedAmount = selectedAmounts[contributionType];
	const contributionAmount =
		selectedAmount === 'other'
			? pageState.checkoutForm.product.otherAmounts[contributionType].amount
			: selectedAmount;
	const contributionCurrency = pageState.checkoutForm.product.currency;

	return {
		contributionAmount,
		contributionType,
		contributionCurrency,
	};
}

export { getContributionCartValueData };
