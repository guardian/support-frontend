import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { neutral } from '@guardian/source-foundations';
import { SvgCheckmark, SvgCross } from '@guardian/source-react-components';
import type { ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect, glyph } from 'helpers/internationalisation/currency';
import type { AmountChange } from 'helpers/redux/checkout/product/state';
import {
	getBtnThresholdCopy,
	getThresholdPrice,
} from 'pages/contributions-landing/components/DigiSubBenefits/helpers';
import { useLiveFeedBackContext } from 'pages/contributions-landing/components/DigiSubBenefits/LiveFeedBackProvider';
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

type PropTypes = {
	countryGroupId: CountryGroupId;
	showBenefitsMessaging: boolean;
	contributionType: ContributionType;
	setSelectedAmount: (amountChange: AmountChange) => void;
};

const getSvgIcon = (showBenefitsMessaging: boolean) =>
	showBenefitsMessaging ? (
		<SvgCheckmark size="xsmall" />
	) : (
		<SvgCross size="xsmall" />
	);

const getNewsletterCopy = (countryGroupId: CountryGroupId) => {
	switch (countryGroupId) {
		case 'GBPCountries':
		case 'EURCountries':
		case 'International':
		case 'NZDCountries':
		case 'Canada':
			return (
				<p>
					<span css={boldText}>Weekly newsletter</span> from a senior editor
					giving you the inside track on the week's top stories
				</p>
			);
		case 'AUDCountries':
			return (
				<p>
					<span css={boldText}>
						Regular email updates from the Guardian Australia newsroom
					</span>{' '}
					providing an inside look on the biggest stories of the moment
				</p>
			);
		case 'UnitedStates':
			return (
				<p>
					<span css={boldText}>Newsletter from a senior editor,</span> giving
					you the inside track on the week's top stories
				</p>
			);
		default:
			return;
	}
};

export const checkListData = (
	countryGroupId: CountryGroupId,
	showBenefitsMessaging: boolean,
): CheckListData[] => {
	return [
		{
			icon: <SvgCheckmark size="xsmall" />,
			text: getNewsletterCopy(countryGroupId),
			maybeGreyedOut: null,
		},
		{
			icon: getSvgIcon(showBenefitsMessaging),
			text: (
				<p>
					Premium access to{' '}
					<span css={boldText}>our award-winning news app,</span> for the best
					mobile experience
				</p>
			),
			maybeGreyedOut: showBenefitsMessaging ? null : greyedOut,
		},
		{
			icon: getSvgIcon(showBenefitsMessaging),
			text: (
				<p>
					<span css={boldText}>Ad-free reading</span> on all your devices
				</p>
			),
			maybeGreyedOut: showBenefitsMessaging ? null : greyedOut,
		},
	];
};

export function BenefitsBulletPoints({
	showBenefitsMessaging,
	countryGroupId,
	contributionType,
	setSelectedAmount,
}: PropTypes): JSX.Element {
	const currencyGlyph = glyph(detect(countryGroupId));
	const thresholdPrice =
		getThresholdPrice(countryGroupId, contributionType) ?? '';

	const titleCopy = showBenefitsMessaging
		? "You've unlocked exclusive extras"
		: 'Get more from your support';

	const billingPeriod = contributionType == 'MONTHLY' ? 'month' : 'year';
	const paragraph = showBenefitsMessaging
		? `Thank you for choosing to give ${currencyGlyph}${thresholdPrice} or more each ${billingPeriod}.`
		: `Unlock exclusive extras when you give a little more each ${billingPeriod}.`;

	const btnCopy = getBtnThresholdCopy(countryGroupId, contributionType);

	const desktopGridId =
		countryGroupId === 'UnitedStates'
			? 'benefitsPackshotBulletsDesktopUS'
			: 'benefitsPackshotBulletsDesktopUK';

	const setShowLiveFeedBack = useLiveFeedBackContext()?.setShowLiveFeedBack;

	function handleBtnClick() {
		if (thresholdPrice) {
			setSelectedAmount({
				amount: thresholdPrice.toString(),
				contributionType,
			});
			setShowLiveFeedBack?.(true);
		}
	}

	return (
		<CheckoutBenefitsList
			handleBtnClick={handleBtnClick}
			titleCopy={titleCopy}
			btnCopy={btnCopy}
			paragraph={paragraph}
			checkListData={checkListData(countryGroupId, showBenefitsMessaging)}
			showBenefitsMessaging={showBenefitsMessaging}
			desktopGridId={desktopGridId}
		/>
	);
}

export default BenefitsBulletPoints;
