import { css } from '@emotion/react';
import { brand, from, space } from '@guardian/source/foundations';

const brandPastel = '#506991';
function gu_span(columns: number): number {
	const gu_col_width = 60;
	const gu_h_spacing = 20;
	return columns * gu_col_width + gu_h_spacing * (columns - 1);
}

export const topNavContainer = css`
	display: flex;
	flex: 1 1 auto;
	justify-content: space-between;
`;

export const utilityContainer = css`
	padding-top: ${space[2]}px;
`;

export const logoLink = css`
	float: right;
	height: 100%;
	flex: 0 1 auto;
`;

export const logoContainer = css`
	${from.tablet} {
		width: ${gu_span(5)}px;
		background-color: ${brand[400]};
		float: right;
	}

	${from.wide} {
		padding-right: ${space[18]}px;
	}
`;

export const logoContainerROW = css`
	${from.tablet} {
		border-left: 1px solid ${brandPastel};
		z-index: 10;
		position: relative;
	}
`;

export const logoContainerGBP = css`
	${from.leftCol} {
		border-left: 1px solid ${brandPastel};
		z-index: 10;
		position: relative;
	}
`;

export const headerContainer = css`
	background-color: ${brand[400]};
	display: flex;
	align-items: center;
	justify-content: stretch;
	overflow: hidden;
	* {
		box-sizing: content-box;
	}
`;

export const headerContainerROW = css`
	div > div > nav {
		${from.tablet} {
			position: absolute;
			bottom: 0;
			left: ${space[3]}px;
			right: ${gu_span(5)}px;
		}
	}
`;

export const headerContainerGBP = css`
	div > div > nav {
		${from.leftCol} {
			position: absolute;
			bottom: 0;
			left: ${space[3]}px;
			right: ${gu_span(5)}px;
		}
	}
`;

export const headerTestUserBanner = css`
	background-color: red;
	width: 100%;
`;

export const headerWrapper = css`
	flex: 1 1 auto;
	margin: auto;
	padding: 0 10px;
	position: relative;
	width: 100%;

	${from.tablet} {
		max-width: ${gu_span(12)}px;
	}

	${from.leftCol} {
		max-width: ${gu_span(14)}px;
	}

	${from.wide} {
		max-width: ${gu_span(16)}px;
	}
`;

export const headerLinksContainer = css`
	display: flex;
	width: 100%;
`;
