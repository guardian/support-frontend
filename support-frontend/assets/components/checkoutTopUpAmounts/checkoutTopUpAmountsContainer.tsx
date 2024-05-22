import { currencies } from 'helpers/internationalisation/currency';
import { setSelectedAmount } from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	getUserSelectedAmount,
	getUserSelectedAmountBeforeAmendment,
} from 'helpers/redux/checkout/product/selectors/selectedAmount';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { getLowerBenefitsThreshold } from 'helpers/supporterPlus/benefitsThreshold';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { CheckoutTopUpAmountsProps } from './checkoutTopUpAmounts';

type CheckoutTopUpAmountsContainerProps = {
	renderCheckoutTopUpAmounts: (props: CheckoutTopUpAmountsProps) => JSX.Element;
};

export function CheckoutTopUpAmountsContainer({
	renderCheckoutTopUpAmounts,
}: CheckoutTopUpAmountsContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { currencyId, countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const selectedAmount = useContributionsSelector(getUserSelectedAmount);
	const amountBeforeAmendments = useContributionsSelector(
		getUserSelectedAmountBeforeAmendment,
	);
	const contributionType = useContributionsSelector(getContributionType);
	const currencySymbol = currencies[currencyId].glyph;

	const isAboveThreshold =
		contributionType !== 'ONE_OFF' &&
		amountBeforeAmendments >=
			useContributionsSelector((state) =>
				getLowerBenefitsThreshold(state, contributionType),
			);

	const timePeriods = {
		ONE_OFF: 'one-off',
		MONTHLY: 'month',
		ANNUAL: 'year',
	};

	const timePeriod = timePeriods[contributionType];

	const handleAmountUpdate = (updateAmountBy: number, index: number) => {
		dispatch(
			setSelectedAmount({
				contributionType: contributionType,
				amount: `${selectedAmount + updateAmountBy}`,
			}),
		);
		console.log('TEST trackComponentClick-checkoutTopUAmountsContainer');
		trackComponentClick(
			`contribution-topup-amount-${
				updateAmountBy > 0 ? 'select' : 'deselect'
			}-${countryGroupId}-${contributionType}-option${index}`,
		);
	};

	const amounts = Array.from(
		{ length: 5 },
		(_, amountIndex) => amountIndex + 1,
	);

	return renderCheckoutTopUpAmounts({
		currencySymbol,
		timePeriod,
		amounts,
		handleAmountUpdate,
		isAboveThreshold,
	});
}
