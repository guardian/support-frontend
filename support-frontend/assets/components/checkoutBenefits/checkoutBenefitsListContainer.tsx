import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { neutral } from '@guardian/source-foundations';
import { SvgCrossRound, SvgTickRound } from '@guardian/source-react-components';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { getThresholdPrice } from 'pages/contributions-landing/components/DigiSubBenefits/helpers';
import CheckoutBenefitsList from './checkoutBenefitsList';

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
	showBenefitsMessaging: boolean;
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

export function CheckoutBenefitsListContainer({
	showBenefitsMessaging,
}: CheckoutBenefitsListContainerProps): JSX.Element {
	const contributionType = useContributionsSelector(getContributionType);
	const { countryGroupId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const thresholdPrice =
		getThresholdPrice(countryGroupId, contributionType) ?? '';
	const thresholdPriceWithCurrency = simpleFormatAmount(
		currencies[currencyId],
		thresholdPrice,
	);
	const billingPeriod = contributionType == 'MONTHLY' ? 'month' : 'year';

	const title = `For ${thresholdPriceWithCurrency} per ${billingPeriod}, you’ll unlock`;

	return (
		<CheckoutBenefitsList
			title={title}
			checkListData={checkListData(showBenefitsMessaging)}
		/>
	);
}
