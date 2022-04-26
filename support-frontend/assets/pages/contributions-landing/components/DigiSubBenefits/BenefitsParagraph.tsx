import { css, ThemeProvider } from '@emotion/react';
import {
	brandAlt,
	from,
	headline,
	neutral,
	space,
	textSans,
} from '@guardian/source-foundations';
import {
	Button,
	buttonThemeReaderRevenueBrand,
} from '@guardian/source-react-components';
import GridImage from 'components/gridImage/gridImage';
import type { ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { getBtnThresholdCopy, getThresholdPrice } from './helpers';
import { useLiveFeedBackContext } from './LiveFeedBackProvider';

const container = css`
	border: 1px solid ${neutral[86]};
	margin: ${space[5]}px 0 ${space[3]}px;
	padding: 0 ${space[4]}px;

	${from.desktop} {
		// margin-top: ${space[6]}px;
		padding: 0 28px;
	}
`;

const title = css`
	${headline.xxsmall({ fontWeight: 'bold', lineHeight: 'regular' })};
	margin: ${space[3]}px 0 6px;
`;

const body = (unlockedBenefits: boolean) => css`
	${textSans.medium({ lineHeight: 'regular' })};
	font-size: 17px;
	margin-bottom: ${unlockedBenefits ? `${space[5]}px` : '0'};
`;

const highlighted = css`
	background-color: ${brandAlt[400]};
`;

const button = css`
	width: 100%;
	justify-content: space-around;
	margin: ${space[6]}px 0 32px;
`;

const imgContainer = css`
	margin-top: -${space[3]}px;
	border-bottom: 1px solid ${neutral[86]};

	& img {
		width: 60%;
		height: auto;
		display: block;
		margin: auto;
	}
`;

type PropTypes = {
	countryGroupId: CountryGroupId;
	showBenefitsMessaging: boolean;
	contributionType: ContributionType;
	setSelectedAmount: (
		amount: number | 'other',
		contributionType: ContributionType,
	) => void;
};

function BenefitsParagraph({
	showBenefitsMessaging,
	countryGroupId,
	contributionType,
	setSelectedAmount,
}: PropTypes): JSX.Element {
	const titleCopy = showBenefitsMessaging
		? "You've unlocked the full Guardian experience"
		: 'Get the full Guardian experience';

	const paragraph = showBenefitsMessaging ? (
		<p css={body(showBenefitsMessaging)}>
			<span css={highlighted}>
				To thank you for your generosity, we'll give you a number of exclusive
				extras.
			</span>{' '}
			Hear from senior editors on the biggest stories of the week, enjoy ad-free
			reading, and access our award-winning news app.
		</p>
	) : (
		<p css={body(showBenefitsMessaging)}>
			If you can, please consider giving a little more each month. To thank you
			for your generosity, we'll unlock exclusive extras — hear from senior
			editors on the biggest stories of the week, enjoy ad-free reading, and
			access our award-winning news app.
		</p>
	);

	const btnCopy = getBtnThresholdCopy(countryGroupId, contributionType);

	const setShowLiveFeedBack = useLiveFeedBackContext()?.setShowLiveFeedBack;

	const thresholdPrice =
		getThresholdPrice(countryGroupId, contributionType) ?? '';

	function handleBtnClick() {
		if (thresholdPrice) {
			setSelectedAmount(thresholdPrice, contributionType);
			setShowLiveFeedBack?.(true);
		}
	}

	return (
		<div css={container}>
			<div css={imgContainer}>
				<GridImage
					classModifiers={['']}
					gridId={
						countryGroupId === 'UnitedStates'
							? 'benefitsPackshotParaMobAndDesktopUS'
							: 'benefitsPackshotParaMobAndDesktopUK'
					}
					srcSizes={[500, 140]}
					sizes="(min-width: 1140px) 100%,
                  500px"
					imgType="png"
				/>
			</div>
			<h3 css={title}>{titleCopy}</h3>
			{paragraph}
			{!showBenefitsMessaging && (
				<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
					<Button
						iconSide="left"
						priority="primary"
						size="default"
						css={button}
						onClick={handleBtnClick}
					>
						{btnCopy}
					</Button>
				</ThemeProvider>
			)}
		</div>
	);
}

export default BenefitsParagraph;
