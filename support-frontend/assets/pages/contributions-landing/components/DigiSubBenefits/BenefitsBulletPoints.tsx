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
import type { ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect, glyph } from 'helpers/internationalisation/currency';
import bullets1 from './bullets1.png';
import bullets2 from './bullets2.png';
import { getBtnThresholdCopy, getThresholdPrice } from './helpers';
import { useLiveFeedBackContext } from './LiveFeedBackProvider';

const container = css`
	border: 1px solid ${neutral[86]};
	margin: ${space[5]}px 0 ${space[3]}px;
	padding: 0 ${space[4]}px;

	${from.desktop} {
		// margin-top: ${space[6]}px;
		padding: 0 ${space[6]}px;
	}
`;

const title = css`
	${headline.xxsmall({ fontWeight: 'bold', lineHeight: 'regular' })};
	margin: ${space[3]}px 0 6px;
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
	margin: ${space[6]}px 0 33px;
`;

const mobileImg = css`
	display: block;
	width: 107px;
	height: auto;
	margin-left: auto;
	margin-right: -16px;

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

	${from.leftCol} {
		display: block;
	}
`;

const imgContainer = css`
	// width: 60%;
	margin-top: -${space[2]}px;
	margin-left: ${space[2]}px;

	${from.mobileMedium} {
		margin-left: 41px;
		margin-top: -${space[4]}px;
	}

	${from.tablet} {
		margin-left: ${space[5]}px;
	}

	${from.desktop} {
		margin-left: 47px;
	}

	${from.leftCol} {
		margin-left: 38px;
	}
`;

const checkmark = css`
	vertical-align: top;
	padding-right: 10px;

	${from.desktop} {
		padding-right: ${space[4]}px;
	}

	svg {
		fill: ${brand[500]};
	}
`;

const table = css`
	padding-top: ${space[4]}px;
	margin-bottom: 28px;
`;

const flexContainer = css`
	display: flex;
	justify-content: space-between;
`;

const hr = css`
	border: none;
	height: 1px;
	background-color: #dcdcdc;
	margin: ${space[6]}px 0;
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
				<div css={imgContainer}>
					<img css={mobileImg} src={bullets1} />
					<img css={desktopImg} src={bullets2} />
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
						<SvgCheckmark size="small" />
					</td>
					<td>
						<p>
							<span css={boldText}>Ad-free reading</span> on all your devices
						</p>
					</td>
				</tr>
				<tr>
					<td css={checkmark}>
						<SvgCheckmark size="small" />
					</td>
					<td>
						<p>
							Premium access to{' '}
							<span css={boldText}>our award-winning news app,</span> for the
							best mobile experience
						</p>
					</td>
				</tr>
				<tr>
					<td css={checkmark}>
						<SvgCheckmark size="small" />
					</td>
					<td>
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
