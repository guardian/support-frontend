import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { neutral } from '@guardian/source-foundations';
import { SvgCrossRound, SvgTickRound } from '@guardian/source-react-components';
import type { ContributionType } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
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
) {
	if (Number.isNaN(selectedAmount)) {
		return 'Contribute more than $$AMOUNT to unlock benefits';
	}
	const billingPeriod = contributionType == 'MONTHLY' ? 'month' : 'year';
	return `For ${priceString} per ${billingPeriod}, you’ll unlock`;
}

export function CheckoutBenefitsListContainer({
	renderBenefitsList,
}: CheckoutBenefitsListContainerProps): JSX.Element | null {
	const contributionType = useContributionsSelector(getContributionType);
	if (contributionType === 'ONE_OFF') {
		return null;
	}

	const { countryGroupId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const selectedAmount = useContributionsSelector(getUserSelectedAmount);

	const thresholdPrice =
		getThresholdPrice(countryGroupId, contributionType) ?? 1;
	const thresholdPriceWithCurrency = simpleFormatAmount(
		currencies[currencyId],
		selectedAmount,
	);
	const higherTier = thresholdPrice <= selectedAmount;
	// TODO: What is the minimum threshold for unlocking the basic benefits?
	const lowerTier = selectedAmount > 0;

	return renderBenefitsList({
		title: getBenefitsListTitle(
			thresholdPriceWithCurrency,
			contributionType,
			selectedAmount,
		),
		checkListData: checkListData({
			lowerTier,
			higherTier,
		}),
	});
}
