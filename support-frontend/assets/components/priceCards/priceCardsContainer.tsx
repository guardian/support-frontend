import type { OtherAmountProps } from 'components/otherAmount/otherAmount';
import type { ContributionType } from 'helpers/contributions';
import {
	setOtherAmount,
	setOtherAmountBeforeAmendment,
	setSelectedAmount,
	setSelectedAmountBeforeAmendment,
} from 'helpers/redux/checkout/product/actions';
import { getSelectedAmount } from 'helpers/redux/checkout/product/selectors/productType';
import { getMinimumContributionAmount } from 'helpers/redux/commonState/selectors';
import { getOtherAmountErrors } from 'helpers/redux/selectors/formValidation/otherAmountValidation';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import type { PriceCardPaymentInterval } from './priceCard';
import type { PriceCardsProps } from './priceCards';

type PriceCardsRenderProps = PriceCardsProps & OtherAmountProps;

type PriceCardsContainerProps = {
	frequency: ContributionType;
	renderPriceCards: (props: PriceCardsRenderProps) => JSX.Element;
};

const contributionTypeToPaymentInterval: Partial<
	Record<ContributionType, PriceCardPaymentInterval>
> = {
	MONTHLY: 'month',
	ANNUAL: 'year',
};

export function PriceCardsContainer({
	frequency,
	renderPriceCards,
}: PriceCardsContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();
	const currency = useContributionsSelector(
		(state) => state.common.internationalisation.currencyId,
	);
	const { amounts } = useContributionsSelector((state) => state.common);
	const { amountsCardData } = amounts;
	const { selectedAmounts, otherAmounts } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);
	const minAmount = useContributionsSelector(getMinimumContributionAmount());
	const {
		amounts: frequencyAmounts,
		defaultAmount,
		hideChooseYourAmount,
	} = amountsCardData[frequency];
	const selectedAmount = getSelectedAmount(
		selectedAmounts,
		frequency,
		defaultAmount,
	).toString();
	const otherAmountErrors = useContributionsSelector(getOtherAmountErrors);

	const otherAmount = otherAmounts[frequency].amount ?? '';

	function onAmountChange(newAmount: string) {
		dispatch(
			setSelectedAmount({
				contributionType: frequency,
				amount: newAmount,
			}),
		);
		dispatch(
			setSelectedAmountBeforeAmendment({
				contributionType: frequency,
				amount: newAmount,
			}),
		);
	}

	function onOtherAmountChange(newAmount: string) {
		dispatch(
			setOtherAmount({
				contributionType: frequency,
				amount: newAmount,
			}),
		);
		dispatch(
			setOtherAmountBeforeAmendment({
				contributionType: frequency,
				amount: newAmount,
			}),
		);
	}

	return renderPriceCards({
		currency,
		amounts: frequencyAmounts.map((amount) => amount.toString()),
		selectedAmount,
		otherAmount,
		paymentInterval: contributionTypeToPaymentInterval[frequency],
		minAmount,
		onAmountChange,
		onOtherAmountChange,
		hideChooseYourAmount,
		errors: otherAmountErrors,
	});
}
