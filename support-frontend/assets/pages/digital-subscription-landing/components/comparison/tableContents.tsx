import { css } from '@emotion/react';
import {
	background,
	border,
	brandAltBackground,
	from,
	space,
	textSans,
} from '@guardian/source-foundations';
import { SvgCheckmark } from '@guardian/source-react-components';
import './comparisonTable';
import { SvgAdFree } from 'components/icons/adFree';
import { SvgEditionsIcon, SvgLiveAppIcon } from 'components/icons/appsIcon';
import { SvgCrosswords } from 'components/icons/crosswords';
import { SvgFreeTrial } from 'components/icons/freeTrial';
import { SvgNews } from 'components/icons/news';
import { SvgOffline } from 'components/icons/offlineReading';
import { SvgPadlock } from 'components/icons/padlock';
import type { Option } from 'helpers/types/option';
import type { TableRow } from './comparisonTable';

const iconSizeMobile = 28;
const iconSizeDesktop = 34;
const titleRowHeight = 30;
const borderStyle = `${border.primary} 1px solid`;
const comparisonTableYellow = '#FFFACC';
const iconContainer = css`
	display: inline-flex;
	align-self: center;
	height: ${iconSizeMobile}px;
	width: ${iconSizeMobile}px;
	margin-right: ${space[3]}px;
	svg {
		height: ${iconSizeMobile}px;
		width: ${iconSizeMobile}px;
	}

	${from.phablet} {
		height: ${iconSizeDesktop}px;
		width: ${iconSizeDesktop}px;

		svg {
			height: ${iconSizeDesktop}px;
			width: ${iconSizeDesktop}px;
		}
	}
`;
const bold = css`
	font-weight: bold;
`;
const borderBottomNone = css`
	border-bottom: none;
`;
const finalRowStyle = css`
	background-color: ${comparisonTableYellow};
	border: ${borderStyle};
	padding: ${space[3]}px;
`;
const indicators = css`
	padding: ${space[4]}px 0;
	height: 58px;

	svg {
		display: block;
		margin: 0 auto;
	}
`;
const checkmark = css`
	svg {
		max-width: 25px;
	}
`;
const padlock = css`
	border-left: ${borderStyle};
`;
const columnTitle = css`
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding: 3px;
	height: ${titleRowHeight}px;
	${textSans.xsmall({
		fontWeight: 'bold',
	})}

	${from.mobileLandscape} {
		${textSans.small({
			fontWeight: 'bold',
		})}
	}
`;
const yellowBackground = css`
	background: ${brandAltBackground.primary};
`;
const greyBackground = css`
	background: ${background.secondary};
`;
const titleRowStyle = css`
	height: ${titleRowHeight}px;
`;
const hideOnVerySmall = css`
	display: none;

	${from.mobileMedium} {
		display: inline-block;
	}
`;
const borderLeft = css`
	border-left: ${borderStyle};
`;

function Padlock() {
	return (
		<div aria-label="Not included" css={[indicators, padlock, greyBackground]}>
			<SvgPadlock />
		</div>
	);
}

function Checkmark(props: { borderLeft?: Option<string> }) {
	const checkMarkStyles = props.borderLeft
		? [indicators, checkmark, yellowBackground, props.borderLeft]
		: [indicators, checkmark, yellowBackground];
	return (
		<div aria-label="Included" css={checkMarkStyles}>
			<SvgCheckmark />
		</div>
	);
}

Checkmark.defaultProps = {
	borderLeft: null,
};
export const tableContent: TableRow[] = [
	{
		icon: (
			<div css={iconContainer}>
				<SvgNews />
			</div>
		),
		description: "Access to the Guardian's quality, open journalism",
		ariaLabel: "Access to the Guardian's quality, open journalism",
		free: <Checkmark borderLeft={borderLeft} />,
		paid: <Checkmark />,
	},
	{
		icon: (
			<div css={iconContainer}>
				<SvgAdFree />
			</div>
		),
		description: 'Ad-free reading on all your devices',
		ariaLabel: 'Ad-free reading on all your devices',
		free: <Padlock />,
		paid: <Checkmark />,
	},
	{
		icon: (
			<div css={iconContainer}>
				<SvgEditionsIcon />
			</div>
		),
		description: (
			<>
				The Editions app with <span css={hideOnVerySmall}>unique</span> digital
				supplements
			</>
		),
		ariaLabel: 'The Editions app with unique digital supplements',
		free: <Padlock />,
		paid: <Checkmark />,
	},
	{
		icon: (
			<div css={iconContainer}>
				<SvgLiveAppIcon />
			</div>
		),
		description: (
			<>
				The Guardian app with premium features;{' '}
				<span css={hideOnVerySmall}>Live and Discover</span>
			</>
		),
		ariaLabel: 'The Guardian app with premium features, Live and Discover',
		free: <Padlock />,
		paid: <Checkmark />,
	},
	{
		icon: (
			<div css={iconContainer}>
				<SvgOffline />
			</div>
		),
		description: 'Offline reading in both your apps',
		ariaLabel: 'Offline reading in both your apps',
		free: <Padlock />,
		paid: <Checkmark />,
	},
	{
		icon: (
			<div css={iconContainer}>
				<SvgCrosswords />
			</div>
		),
		description: 'Play interactive crosswords',
		ariaLabel: 'Play interactive crosswords',
		free: <Padlock />,
		paid: <Checkmark />,
		cssOverrides: borderBottomNone,
	},
];
export const titleRow = {
	icon: null,
	description: null,
	free: <div css={[indicators, columnTitle, greyBackground]}>Free</div>,
	paid: <div css={[indicators, columnTitle, yellowBackground]}>Paid</div>,
	cssOverrides: [titleRowStyle, borderBottomNone],
};
export const finalRow = {
	icon: (
		<div css={iconContainer}>
			<SvgFreeTrial />
		</div>
	),
	description: (
		<>
			Plus a <span css={bold}>14 day free trial</span>
		</>
	),
	free: null,
	paid: null,
	cssOverrides: finalRowStyle,
};
