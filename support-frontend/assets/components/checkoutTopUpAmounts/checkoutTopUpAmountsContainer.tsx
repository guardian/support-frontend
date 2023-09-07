import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import type { CheckoutTopUpAmountsProps } from './checkoutTopUpAmounts';

type CheckoutTopUpAmountsContainerProps = {
	renderCheckoutTopUpAmounts: (props: CheckoutTopUpAmountsProps) => JSX.Element;
};

export function CheckoutTopUpAmountsContainer({
	renderCheckoutTopUpAmounts,
}: CheckoutTopUpAmountsContainerProps): JSX.Element {
	const { currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const contributionType = useContributionsSelector(getContributionType);
	const currencyWord = spokenCurrencies[currencyId].singular;
	const currencySymbol = currencies[currencyId].glyph;

	const timePeriods = {
		ONE_OFF: 'one-off',
		MONTHLY: 'month',
		ANNUAL: 'year',
	};

	const timePeriod = timePeriods[contributionType];

	// const selectedAmount = useContributionsSelector(getUserSelectedAmount);

	const amounts = Array.from(
		{ length: 5 },
		(_, amountIndex) => amountIndex + 1,
	);

	return renderCheckoutTopUpAmounts({
		currencyWord,
		currencySymbol,
		timePeriod,
		amounts,
	});
}
