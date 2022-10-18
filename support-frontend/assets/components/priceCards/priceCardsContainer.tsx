import type { ContributionType, SelectedAmounts } from 'helpers/contributions';
import { setSelectedAmount } from 'helpers/redux/checkout/product/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import type { PriceCardPaymentInterval } from './priceCard';
import type { PriceCardsProps } from './priceCards';

type PriceCardsContainerProps = {
	frequency: ContributionType;
	renderPriceCards: (props: PriceCardsProps) => JSX.Element;
};

const contributionTypeToPaymentInterval: Partial<
	Record<ContributionType, PriceCardPaymentInterval>
> = {
	MONTHLY: 'month',
	ANNUAL: 'year',
};

function getSelectedAmount(
	selectedAmounts: SelectedAmounts,
	contributionType: ContributionType,
	defaultAmount: number,
) {
	return selectedAmounts[contributionType] || defaultAmount;
}

export function PriceCardsContainer({
	frequency,
	renderPriceCards,
}: PriceCardsContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();
	const currency = useContributionsSelector(
		(state) => state.common.internationalisation.currencyId,
	);
	const { amounts } = useContributionsSelector((state) => state.common);
	const { selectedAmounts } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);

	const { amounts: frequencyAmounts, defaultAmount } = amounts[frequency];
	const selectedAmount = getSelectedAmount(
		selectedAmounts,
		frequency,
		defaultAmount,
	).toString();

	function onAmountChange(newAmount: string) {
		dispatch(
			setSelectedAmount({
				contributionType: frequency,
				amount: newAmount,
			}),
		);
	}

	return renderPriceCards({
		currency,
		amounts: frequencyAmounts.map((amount) => amount.toString()),
		selectedAmount,
		onAmountChange,
		paymentInterval: contributionTypeToPaymentInterval[frequency],
	});
}
