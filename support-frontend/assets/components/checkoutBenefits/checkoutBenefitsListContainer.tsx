import type { ContributionType } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import { setSelectedAmount } from 'helpers/redux/checkout/product/actions';
import { hideBenefitsListFromState } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
import {
	getContributionType,
	getMinimumContributionAmount,
} from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { getThresholdPrice } from 'helpers/supporterPlus/benefitsThreshold';
import { isOneOff } from 'helpers/supporterPlus/isContributionRecurring';
import type { CheckoutBenefitsListProps } from './checkoutBenefitsList';
import { checkListData } from './checkoutBenefitsListData';

type CheckoutBenefitsListContainerProps = {
	renderBenefitsList: (props: CheckoutBenefitsListProps) => JSX.Element;
};

function getBenefitsListTitle(
	priceString: string,
	contributionType: ContributionType,
) {
	const billingPeriod = contributionType === 'MONTHLY' ? 'month' : 'year';
	return `For ${priceString} per ${billingPeriod}, you’ll unlock`;
}

const getbuttonCopy = (
	higherTier: boolean,
	thresholdPriceWithCurrency: string,
	selectedAmount: number,
) =>
	higherTier || Number.isNaN(selectedAmount)
		? null
		: `Switch to ${thresholdPriceWithCurrency} to unlock all extras`;

export function CheckoutBenefitsListContainer({
	renderBenefitsList,
}: CheckoutBenefitsListContainerProps): JSX.Element | null {
	const dispatch = useContributionsDispatch();

	const contributionType = useContributionsSelector(getContributionType);
	const benefitsListIsHidden = useContributionsSelector(
		hideBenefitsListFromState,
	);

	if (benefitsListIsHidden || isOneOff(contributionType)) {
		return null;
	}

	const { currencyId, countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const selectedAmount = useContributionsSelector(getUserSelectedAmount);
	const minimumContributionAmount = useContributionsSelector(
		getMinimumContributionAmount(),
	);

	const currency = currencies[currencyId];

	const thresholdPrice = useContributionsSelector((state) =>
		getThresholdPrice(contributionType, state),
	);
	const thresholdPriceWithCurrency = simpleFormatAmount(
		currency,
		thresholdPrice,
	);
	const userSelectedAmountWithCurrency = simpleFormatAmount(
		currency,
		+parseFloat(selectedAmount.toFixed(2)),
	);

	const higherTier = thresholdPrice <= selectedAmount;
	const displayBenefits =
		!Number.isNaN(selectedAmount) &&
		selectedAmount >= minimumContributionAmount;

	function handleButtonClick() {
		dispatch(
			setSelectedAmount({
				contributionType,
				amount: thresholdPrice.toString(),
			}),
		);
	}

	if (!displayBenefits) {
		return null;
	}

	return renderBenefitsList({
		title: getBenefitsListTitle(
			userSelectedAmountWithCurrency,
			contributionType,
		),
		checkListData: checkListData({
			higherTier,
			countryGroupId,
		}),
		buttonCopy: getbuttonCopy(
			higherTier,
			thresholdPriceWithCurrency,
			selectedAmount,
		),
		handleButtonClick,
	});
}
