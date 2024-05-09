import type { OtherAmountProps } from 'components/otherAmount/otherAmount';
import type { ContributionType } from 'helpers/contributions';
import {
	setOtherAmount,
	setOtherAmountBeforeAmendment,
	setSelectedAmount,
	setSelectedAmountBeforeAmendment,
} from 'helpers/redux/checkout/product/actions';
import {
	getMinimumContributionAmount,
	getSelectedAmount,
} from 'helpers/redux/checkout/product/selectors/productType';
import { getOtherAmountErrors } from 'helpers/redux/selectors/formValidation/otherAmountValidation';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { updateAbandonedBasketCookie } from 'helpers/storage/abandonedBasketCookies';
import type { PriceCardPaymentInterval } from './priceCard';
import type { PriceCardsProps } from './priceCards';

type PriceCardsRenderProps = PriceCardsProps & OtherAmountProps;

type PriceCardsContainerProps = {
	paymentFrequency: ContributionType;
	renderPriceCards: (props: PriceCardsRenderProps) => JSX.Element;
};

const contributionTypeToPaymentInterval: Partial<
	Record<ContributionType, PriceCardPaymentInterval>
> = {
	MONTHLY: 'month',
	ANNUAL: 'year',
};

export function PriceCardsContainer({
	paymentFrequency,
	renderPriceCards,
}: PriceCardsContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
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
	} = amountsCardData[paymentFrequency];
	const selectedAmount = getSelectedAmount(
		selectedAmounts,
		paymentFrequency,
		defaultAmount,
	);
	const otherAmountErrors = useContributionsSelector(getOtherAmountErrors);
	const otherAmount = otherAmounts[paymentFrequency].amount ?? '';

	function onAmountChange(newAmount: string) {
		dispatch(
			setSelectedAmount({
				contributionType: paymentFrequency,
				amount: newAmount,
			}),
		);
		dispatch(
			setSelectedAmountBeforeAmendment({
				contributionType: paymentFrequency,
				amount: newAmount,
			}),
		);
		updateAbandonedBasketCookie(newAmount);
	}

	function onOtherAmountChange(newAmount: string) {
		dispatch(
			setOtherAmount({
				contributionType: paymentFrequency,
				amount: newAmount,
			}),
		);
		dispatch(
			setOtherAmountBeforeAmendment({
				contributionType: paymentFrequency,
				amount: newAmount,
			}),
		);
	}

	return renderPriceCards({
		currency: currencyId,
		amounts: frequencyAmounts,
		selectedAmount,
		otherAmount,
		paymentInterval: contributionTypeToPaymentInterval[paymentFrequency],
		minAmount,
		onAmountChange,
		onOtherAmountChange,
		hideChooseYourAmount,
		errors: otherAmountErrors,
	});
}
