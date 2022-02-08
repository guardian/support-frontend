import { css } from '@emotion/react';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { border, brandAlt, neutral } from '@guardian/src-foundations/palette';
import { headline } from '@guardian/src-foundations/typography';

export const tabList = css`
	display: flex;
	align-items: flex-end;
	justify-content: flex-start;
`;
export const tabButton = css`
	background-color: ${neutral[100]};
	${headline.xxxsmall({
		fontWeight: 'bold',
	})}
	position: relative;
	display: block;
	text-decoration: none;
	appearance: none;
	width: 100%;
	height: ${space[12]}px;
	text-align: left;
	color: ${neutral[7]};
	padding: ${space[2]}px ${space[3]}px;
	border: 1px solid ${border.secondary};
	border-bottom: none;
	box-shadow: inset 0 ${space[1]}px 0 0 ${brandAlt[400]};
	transition: box-shadow 0.2s;
	cursor: pointer;

	${from.phablet} {
		${headline.xxsmall({
			fontWeight: 'bold',
		})}
		width: 210px;
	}

	&[aria-selected='false'] {
		background-color: ${neutral[97]};
		box-shadow: none;
		&:hover {
			box-shadow: inset 0 ${space[1]}px 0 0 ${neutral[86]};
		}
	}

	/* Pseudo-element that covers the tab panel top border for the active tab */
	&[aria-selected='true']::after {
		position: absolute;
		z-index: 2;
		bottom: -1px;
		right: 0;
		left: 0;
		height: 1px;
		background: inherit;
		content: '';
	}
`;
export const tabPanel = css`
	position: relative;
	padding: ${space[2]}px;
	border: 1px solid ${border.secondary};
`;
