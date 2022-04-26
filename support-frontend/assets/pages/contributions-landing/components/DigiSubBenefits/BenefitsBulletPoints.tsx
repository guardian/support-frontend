import { css, ThemeProvider } from '@emotion/react';
import {
	brand,
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
	SvgCheckmark,
} from '@guardian/source-react-components';
import GridImage from 'components/gridImage/gridImage';
import type { ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect, glyph } from 'helpers/internationalisation/currency';
import { getBtnThresholdCopy, getThresholdPrice } from './helpers';
import { useLiveFeedBackContext } from './LiveFeedBackProvider';

const container = css`
	border: 1px solid ${neutral[86]};
	margin: ${space[5]}px 0 ${space[3]}px;
	padding: 0 ${space[4]}px;

	${from.desktop} {
		padding: 0 ${space[6]}px;
	}
`;

const title = css`
	${headline.xxsmall({ fontWeight: 'bold', lineHeight: 'tight' })};
	margin: ${space[3]}px 0 6px;

	${from.tablet} {
		max-width: 185px;
	}
`;

const body = css`
	${textSans.medium({ lineHeight: 'regular' })};
	font-size: 17px;
	margin-bottom: ${space[5]}px;
`;

const highlighted = css`
	background-color: ${brandAlt[400]};
`;

const button = css`
	width: 100%;
	justify-content: space-around;
	margin: ${space[6]}px 0 ${space[5]}px;
	color: ${neutral[7]};
`;

const mobileImg = css`
	display: block;
	width: 107px;
	height: auto;
	margin-left: auto;
	margin-right: -${space[4]}px;

	& img {
		width: 100%;
	}

	${from.desktop} {
		margin-right: -${space[6]}px;
	}

	${from.leftCol} {
		display: none;
	}
`;

const desktopImg = css`
	display: none;
	width: 174px;
	height: auto;
	margin-left: auto;
	margin-right: -${space[6]}px;

	& img {
		width: 100%;
		display: block;
	}

	${from.leftCol} {
		display: block;
	}
`;

const imgContainer = (showBenefitsMessaging: boolean) => css`
	margin-top: -${space[2]}px;
	margin-left: ${space[3]}px;

	${from.mobileMedium} {
		margin-left: ${showBenefitsMessaging ? '58px' : '49px'};
		margin-top: -${space[4]}px;
	}

	${from.tablet} {
		margin-left: ${showBenefitsMessaging ? '28px' : `${space[5]}px`};
	}

	${from.desktop} {
		margin-left: ${showBenefitsMessaging ? '65px' : '47px'};
	}

	${from.leftCol} {
		margin-left: 38px;
	}
`;

const checkmark = css`
	vertical-align: top;
	padding-right: 10px;
	line-height: 0;

	${from.desktop} {
		padding-right: ${space[3]}px;
	}

	svg {
		fill: ${brand[500]};
	}
`;

const checklistItem = css`
	display: inline-block;

	& p {
		line-height: 1.15;
	}
`;

const table = css`
	padding-top: ${space[4]}px;
	margin-bottom: 28px;

	& tr:not(:last-child) {
		border-bottom: 6px solid transparent;
	}

	${from.desktop} {
		& tr:not(:last-child) {
			border-bottom: ${space[2]}px solid transparent;
		}
	}
`;

const flexContainer = css`
	display: flex;
	justify-content: space-between;
`;

const hr = css`
	border: none;
	height: 1px;
	background-color: #dcdcdc;
	margin: ${space[5]}px 0;
`;

const boldText = css`
	font-weight: bold;
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

function BenefitsBulletPoints({
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

	const paragraph = showBenefitsMessaging
		? `Thank you for choosing to give ${currencyGlyph}${thresholdPrice} or more each month.`
		: 'Unlock exclusive extras when you give a little more each month.';

	const btnCopy = getBtnThresholdCopy(countryGroupId, contributionType);

	const setShowLiveFeedBack = useLiveFeedBackContext()?.setShowLiveFeedBack;

	function handleBtnClick() {
		if (thresholdPrice) {
			setSelectedAmount(thresholdPrice, contributionType);
			setShowLiveFeedBack?.(true);
		}
	}

	return (
		<div css={container}>
			<div css={flexContainer}>
				<div>
					<h3 css={title}>{titleCopy}</h3>
					<p>
						<span css={showBenefitsMessaging ? highlighted : body}>
							{paragraph}
						</span>
					</p>
				</div>
				<div css={imgContainer(showBenefitsMessaging)}>
					<div css={mobileImg}>
						<GridImage
							classModifiers={['']}
							gridId={'benefitsPackshotBulletsMobUKUS'}
							srcSizes={[333]}
							sizes="(max-width: 1140px) 100%,
                  333px"
							imgType="png"
						/>
					</div>
					<div css={desktopImg}>
						<GridImage
							classModifiers={['']}
							gridId={
								countryGroupId === 'UnitedStates'
									? 'benefitsPackshotBulletsDesktopUS'
									: 'benefitsPackshotBulletsDesktopUK'
							}
							srcSizes={[500, 140]}
							sizes="(min-width: 1140px) 100%,
                  500px"
							imgType="png"
						/>
					</div>
				</div>
			</div>
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
			{showBenefitsMessaging && <hr css={hr} />}
			<table css={table}>
				<tr>
					<td css={checkmark}>
						<SvgCheckmark size="xsmall" />
					</td>
					<td css={checklistItem}>
						<p>
							<span css={boldText}>Ad-free reading</span> on all your devices
						</p>
					</td>
				</tr>
				<tr>
					<td css={checkmark}>
						<SvgCheckmark size="xsmall" />
					</td>
					<td css={checklistItem}>
						<p>
							Premium access to{' '}
							<span css={boldText}>our award-winning news app,</span> for the
							best mobile experience
						</p>
					</td>
				</tr>
				<tr>
					<td css={checkmark}>
						<SvgCheckmark size="xsmall" />
					</td>
					<td css={checklistItem}>
						<p>
							<span css={boldText}>Weekly newsletter</span> from a senior editor
							giving you the inside track on the week's top stories
						</p>
					</td>
				</tr>
			</table>
		</div>
	);
}

export default BenefitsBulletPoints;
