import { init as initAbTests } from 'helpers/abTests/abtest';
import type { ContributionType } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import { currencies } from 'helpers/internationalisation/currency';
import {
	setProductType,
	setSelectedAmount,
} from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { getMinimumContributionAmount } from 'helpers/redux/commonState/selectors';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { getThresholdPrice } from 'helpers/supporterPlus/benefitsThreshold';
import { isRecurring } from 'helpers/supporterPlus/isContributionRecurring';
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

	const { countryGroupId, countryId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const abParticipations = initAbTests(
		countryId,
		countryGroupId,
		getSettings(),
	);
	const isControl =
		abParticipations.singleToRecurring === 'control' ||
		!abParticipations.singleToRecurring;

	const selectedAmount = useContributionsSelector(getUserSelectedAmount);
	const minimumContributionAmount = useContributionsSelector(
		getMinimumContributionAmount,
	);

	const currency = currencies[currencyId];

	const thresholdPrice = isRecurring(contributionType)
		? getThresholdPrice(countryGroupId, contributionType)
		: 0;
	const thresholdPriceWithCurrency = simpleFormatAmount(
		currency,
		thresholdPrice,
	);
	const userSelectedAmountWithCurrency = simpleFormatAmount(
		currency,
		selectedAmount,
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

	function onNudgeClick() {
		dispatch(setProductType('MONTHLY'));
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
		}),
		buttonCopy: getbuttonCopy(
			higherTier,
			thresholdPriceWithCurrency,
			selectedAmount,
		),
		contributionType,
		countryGroupId,
		nudgeDisplay: !isControl,
		nudgeTitleCopySection1:
			abParticipations.singleToRecurring === 'variantA'
				? 'Make a bigger impact'
				: 'Consider monthly',
		nudgeTitleCopySection2:
			abParticipations.singleToRecurring === 'variantA'
				? 'Support us every month'
				: 'to sustain us long term',
		handleButtonClick,
		onNudgeClick,
	});
}
