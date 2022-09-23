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

type CheckoutBenefitsListContainerProps = {
	renderBenefitsList: (props: CheckoutBenefitsListProps) => JSX.Element;
};

const getSvgIcon = (showBenefitsMessaging: boolean) =>
	showBenefitsMessaging ? (
		<SvgTickRound isAnnouncedByScreenReader size="small" />
	) : (
		<SvgCrossRound isAnnouncedByScreenReader size="small" />
	);

export const checkListData = (
	showBenefitsMessaging: boolean,
): CheckListData[] => {
	return [
		{
			icon: <SvgTickRound isAnnouncedByScreenReader size="small" />,
			text: (
				<p>
					<span css={boldText}>Uninterrupted reading. </span> No more yellow
					banners
				</p>
			),
			maybeGreyedOut: null,
		},
		{
			icon: <SvgTickRound isAnnouncedByScreenReader size="small" />,
			text: (
				<p>
					<span css={boldText}>Supporter newsletter. </span>Giving you editorial
					insight on the week’s top stories
				</p>
			),
			maybeGreyedOut: null,
		},
		{
			icon: getSvgIcon(showBenefitsMessaging),
			text: (
				<p>
					<span css={boldText}>Ad-free. </span>On any device when signed in
				</p>
			),
			maybeGreyedOut: showBenefitsMessaging ? null : greyedOut,
		},
		{
			icon: getSvgIcon(showBenefitsMessaging),
			text: (
				<p>
					<span css={boldText}>Unlimited app access. </span>For the best mobile
					experience
				</p>
			),
			maybeGreyedOut: showBenefitsMessaging ? null : greyedOut,
		},
	];
};

function getBenefitsListTitle(
	priceString: string,
	contributionType: ContributionType,
) {
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
	const showBenefitsMessaging = thresholdPrice <= selectedAmount;

	return renderBenefitsList({
		title: getBenefitsListTitle(thresholdPriceWithCurrency, contributionType),
		checkListData: checkListData(showBenefitsMessaging),
	});
}
