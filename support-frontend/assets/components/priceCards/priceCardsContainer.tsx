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
import { showThreeTierVariablePrice } from 'pages/supporter-plus-landing/setup/threeTierChecks';
import {
	tierCardsFixed,
	tierCardsVariable,
} from 'pages/supporter-plus-landing/setup/threeTierConfig';
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
	const { countryGroupId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const { amounts } = useContributionsSelector((state) => state.common);
	const { amountsCardData } = amounts;
	const { selectedAmounts, otherAmounts } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);
	const minAmount = useContributionsSelector(getMinimumContributionAmount());

	const inThreeTierVariantVariable = showThreeTierVariablePrice(
		useContributionsSelector((state) => state.common.abParticipations),
	);
	const tierBillingPeriod =
		paymentFrequency === 'ANNUAL' ? 'annual' : 'monthly';
	const tierCards = inThreeTierVariantVariable
		? tierCardsVariable
		: tierCardsFixed;
	const tierCardData = tierCards.tier1.plans[tierBillingPeriod].priceCards;
	const {
		amounts: frequencyAmounts,
		defaultAmount,
		hideChooseYourAmount,
	} = inThreeTierVariantVariable &&
	tierCardData &&
	paymentFrequency !== 'ONE_OFF'
		? tierCardData[countryGroupId]
		: amountsCardData[paymentFrequency];

	const selectedAmount = getSelectedAmount(
		selectedAmounts,
		paymentFrequency,
		defaultAmount,
	).toString();
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
		amounts: frequencyAmounts.map((amount) => amount.toString()),
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
