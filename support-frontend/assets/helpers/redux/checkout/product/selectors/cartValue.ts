import type { IsoCurrency } from '@modules/internationalisation/currency';
import { type ContributionType, getAmount } from 'helpers/contributions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';

// Used when sending data to Quantum Metric from Contributions Checkout
function getContributionCartValueData(contributionsState: ContributionsState): {
	contributionAmount: string | number | null;
	contributionType: ContributionType;
	contributionCurrency: IsoCurrency;
} {
	const pageState = contributionsState.page;
	const contributionType = getContributionType(contributionsState);
	const { coverTransactionCost, otherAmounts, selectedAmounts } =
		pageState.checkoutForm.product;

	const contributionAmount = getAmount(
		selectedAmounts,
		otherAmounts,
		contributionType,
		coverTransactionCost,
	);

	const contributionCurrency = pageState.checkoutForm.product.currency;

	return {
		contributionAmount,
		contributionType,
		contributionCurrency,
	};
}

export { getContributionCartValueData };
