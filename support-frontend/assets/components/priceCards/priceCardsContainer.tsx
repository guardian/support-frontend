import { css } from '@emotion/react';
import { space, until } from '@guardian/source-foundations';
import type { OtherAmountProps } from 'components/otherAmount/otherAmount';
import type { ContributionType, SelectedAmounts } from 'helpers/contributions';
import {
	setOtherAmount,
	setSelectedAmount,
} from 'helpers/redux/checkout/product/actions';
import {
	getMinimumContributionAmount,
	isUserInAbVariant,
} from 'helpers/redux/commonState/selectors';
import { getOtherAmountErrors } from 'helpers/redux/selectors/formValidation/otherAmountValidation';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import type { PriceCardPaymentInterval } from './priceCard';
import type { PriceCardsProps } from './priceCards';

const optimisedLayoutOverrides = css`
	${until.tablet} {
		&:not(:last-child) {
			padding-bottom: ${space[1]}px;
		}
	}
`;

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
	const { selectedAmounts, otherAmounts } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);
	const minAmount = useContributionsSelector(getMinimumContributionAmount);
	const {
		amounts: frequencyAmounts,
		defaultAmount,
		hideChooseYourAmount,
	} = amounts[frequency];
	const selectedAmount = getSelectedAmount(
		selectedAmounts,
		frequency,
		defaultAmount,
	).toString();
	const otherAmountErrors = useContributionsSelector(getOtherAmountErrors);

	const useOptimisedMobileLayout = useContributionsSelector(
		isUserInAbVariant('supporterPlusMobileTest1', 'variant'),
	);

	const otherAmount = otherAmounts[frequency].amount ?? '';

	function onAmountChange(newAmount: string) {
		dispatch(
			setSelectedAmount({
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
		cssOverrides: useOptimisedMobileLayout
			? optimisedLayoutOverrides
			: undefined,
	});
}
