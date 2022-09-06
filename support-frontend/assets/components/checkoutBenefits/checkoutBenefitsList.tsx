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
} from '@guardian/source-react-components';
import GridImage from 'components/gridImage/gridImage';
import type { CheckListData } from './checkoutBenefitsContainer';

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
	font-weight: bold;
`;

const button = css`
	width: 100%;
	justify-content: space-around;
	margin: ${space[5]}px 0;
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
		display: block;
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
		margin-left: ${showBenefitsMessaging ? '53px' : '49px'};
		margin-top: -${space[4]}px;
	}

	${from.tablet} {
		margin-left: ${showBenefitsMessaging ? '28px' : `${space[5]}px`};
	}

	${from.desktop} {
		margin-left: ${showBenefitsMessaging ? '60px' : '47px'};
	}

	${from.leftCol} {
		margin-left: 35px;
	}
`;

const checkListIcon = css`
	vertical-align: top;
	padding-right: 10px;
	padding-top: 2px;
	line-height: 0;

	${from.desktop} {
		padding-right: ${space[3]}px;
	}

	svg {
		fill: ${brand[500]};
	}
`;

const checkListText = css`
	display: inline-block;

	& p {
		line-height: 1.35;
	}
`;

// const greyedOut = css`
// 	color: ${neutral[60]};

// 	svg {
// 		fill: ${neutral[60]};
// 	}
// `;

const table = css`
	padding-top: ${space[4]}px;
	margin-bottom: 28px;
	max-width: 390px;

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

// const boldText = css`
// 	font-weight: bold;
// `;

type PropTypes = {
	titleCopy: string;
	btnCopy: string;
	showBenefitsMessaging: boolean;
	paragraph: string;
	desktopGridId: string;
	checkListData: CheckListData[];
	handleBtnClick: () => void;
};

function CheckoutBenefitsList({
	titleCopy,
	btnCopy,
	showBenefitsMessaging,
	paragraph,
	desktopGridId,
	checkListData,
	handleBtnClick,
}: PropTypes): JSX.Element {
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
								// countryGroupId === 'UnitedStates'
								// ? 'benefitsPackshotBulletsDesktopUS'
								// : 'benefitsPackshotBulletsDesktopUK'
								desktopGridId
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
				{checkListData.map((item) => (
					<tr>
						<td css={[checkListIcon, item.maybeGreyedOut]}>{item.icon}</td>
						<td css={[checkListText, item.maybeGreyedOut]}>{item.text}</td>
					</tr>
				))}
			</table>
		</div>
	);
}

export default CheckoutBenefitsList;
