import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { neutral } from '@guardian/source-foundations';
import { SvgTickRound } from '@guardian/source-react-components';
import type { ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect, glyph } from 'helpers/internationalisation/currency';
import type { AmountChange } from 'helpers/redux/checkout/product/state';
import { getThresholdPrice } from 'pages/contributions-landing/components/DigiSubBenefits/helpers';
import CheckoutBenefitsList from './checkoutBenefitsList';
import { SvgCrossRound } from './svgCrossRound';

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

type PropTypes = {
	countryGroupId: CountryGroupId;
	showBenefitsMessaging: boolean;
	contributionType: ContributionType;
	setSelectedAmount: (amountChange: AmountChange) => void;
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
	countryGroupId,
	contributionType,
}: PropTypes): JSX.Element {
	const currencyGlyph = glyph(detect(countryGroupId));
	const thresholdPrice =
		getThresholdPrice(countryGroupId, contributionType) ?? '';
	const billingPeriod = contributionType == 'MONTHLY' ? 'month' : 'year';

	const title = `For ${currencyGlyph}${thresholdPrice} per ${billingPeriod}, you’ll unlock`;

	return (
		<CheckoutBenefitsList
			title={title}
			checkListData={checkListData(showBenefitsMessaging)}
		/>
	);
}

export default CheckoutBenefitsListContainer;
