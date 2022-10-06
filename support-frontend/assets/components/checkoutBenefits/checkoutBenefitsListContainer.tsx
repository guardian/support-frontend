import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { neutral } from '@guardian/source-foundations';
import { SvgCrossRound, SvgTickRound } from '@guardian/source-react-components';
import type { ContributionType } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import { setSelectedAmount } from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { getMinimumContributionAmount } from 'helpers/redux/commonState/selectors';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { getThresholdPrice } from 'pages/contributions-landing/components/DigiSubBenefits/helpers';
import type { CheckoutBenefitsListProps } from './checkoutBenefitsList';

const greyedOut = css`
	color: ${neutral[60]};

	svg {
		fill: ${neutral[60]};
	}
`;

const boldText = css`
	font-weight: bold;
`;

export type CheckListData = {
	icon: JSX.Element;
	text?: JSX.Element;
	maybeGreyedOut: null | SerializedStyles;
};

type TierUnlocks = {
	lowerTier: boolean;
	higherTier: boolean;
};

type CheckoutBenefitsListContainerProps = {
	renderBenefitsList: (props: CheckoutBenefitsListProps) => JSX.Element;
};

const getSvgIcon = (isUnlocked: boolean) =>
	isUnlocked ? (
		<SvgTickRound isAnnouncedByScreenReader size="small" />
	) : (
		<SvgCrossRound isAnnouncedByScreenReader size="small" />
	);

export const checkListData = ({
	lowerTier,
	higherTier,
}: TierUnlocks): CheckListData[] => {
	return [
		{
			icon: getSvgIcon(lowerTier),
			text: (
				<p>
					<span css={boldText}>Uninterrupted reading. </span> No more yellow
					banners
				</p>
			),
			maybeGreyedOut: lowerTier ? null : greyedOut,
		},
		{
			icon: getSvgIcon(lowerTier),
			text: (
				<p>
					<span css={boldText}>Supporter newsletter. </span>Giving you editorial
					insight on the week’s top stories
				</p>
			),
			maybeGreyedOut: lowerTier ? null : greyedOut,
		},
		{
			icon: getSvgIcon(higherTier),
			text: (
				<p>
					<span css={boldText}>Ad-free. </span>On any device when signed in
				</p>
			),
			maybeGreyedOut: higherTier ? null : greyedOut,
		},
		{
			icon: getSvgIcon(higherTier),
			text: (
				<p>
					<span css={boldText}>Unlimited app access. </span>For the best mobile
					experience
				</p>
			),
			maybeGreyedOut: higherTier ? null : greyedOut,
		},
	];
};

function getBenefitsListTitle(
	priceString: string,
	contributionType: ContributionType,
	selectedAmount: number,
	minimumAmountPriceString: string,
) {
	const billingPeriod = contributionType === 'MONTHLY' ? 'month' : 'year';
	if (Number.isNaN(selectedAmount)) {
		return `Contribute more than ${minimumAmountPriceString} per ${billingPeriod} to unlock benefits`;
	}
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
	if (contributionType === 'ONE_OFF') {
		return null;
	}

	const { countryGroupId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const selectedAmount = useContributionsSelector(getUserSelectedAmount);
	const minimumContributionAmount = useContributionsSelector(
		getMinimumContributionAmount,
	);

	const currency = currencies[currencyId];

	const thresholdPrice =
		getThresholdPrice(countryGroupId, contributionType) ?? 1;
	const thresholdPriceWithCurrency = simpleFormatAmount(
		currency,
		thresholdPrice,
	);
	const userSelectedAmountWithCurrency = simpleFormatAmount(
		currency,
		selectedAmount,
	);
	const higherTier = selectedAmount >= thresholdPrice;
	const lowerTier = selectedAmount > minimumContributionAmount;

	function handleButtonClick() {
		// return;
		dispatch(
			setSelectedAmount({
				contributionType,
				amount: thresholdPrice.toString(),
			}),
		);
	}

	return renderBenefitsList({
		title: getBenefitsListTitle(
			userSelectedAmountWithCurrency,
			contributionType,
			selectedAmount,
			simpleFormatAmount(currencies[currencyId], minimumContributionAmount),
		),
		checkListData: checkListData({
			lowerTier,
			higherTier,
		}),
		buttonCopy: getbuttonCopy(
			higherTier,
			thresholdPriceWithCurrency,
			selectedAmount,
		),
		handleButtonClick,
	});
}
