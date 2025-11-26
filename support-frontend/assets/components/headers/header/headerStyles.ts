import { css } from '@emotion/react';
import { brand, from, space } from '@guardian/source/foundations';

function gu_span(columns: number): string {
	const gu_col_width = 60;
	const gu_h_spacing = 20;
	return `${columns * gu_col_width + gu_h_spacing * (columns - 1)}px`;
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
		width: ${gu_span(5)};
		background-color: ${brand[400]};
		float: right;
	}

	${from.wide} {
		padding-right: ${space[18]}px;
	}
`;

export const logoContainerROW = css`
	${from.tablet} {
		border-left: 1px solid #506991;
		z-index: 10;
		position: relative;
	}
`;

export const logoContainerGBP = css`
	${from.leftCol} {
		border-left: 1px solid #506991;
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
			right: ${gu_span(5)};
		}
	}
`;

export const headerContainerGBP = css`
	div > div > nav {
		${from.leftCol} {
			position: absolute;
			bottom: 0;
			left: ${space[3]}px;
			right: ${gu_span(5)};
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
		max-width: ${gu_span(12)};
	}

	${from.leftCol} {
		max-width: ${gu_span(14)};
	}

	${from.wide} {
		max-width: ${gu_span(16)};
	}
`;

export const headerLinksContainer = css`
	display: flex;
	width: 100%;
`;
