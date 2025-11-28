import { css } from '@emotion/react';
import { brand, from, space } from '@guardian/source/foundations';

export const brandPastel = '#506991';
export const gu_cta_height = 42;
export const gu_v_spacing = 12;
export const gu_h_spacing = 20;
const gu_col_width = 60;

export function gu_span(columns: number): number {
	return columns * gu_col_width + gu_h_spacing * (columns - 1);
}

export const headerContainer = css`
	display: flex;
	align-items: center;
	justify-content: stretch;
	overflow: hidden;
	background-color: ${brand[400]};
`;

export const headerTestUserBanner = css`
	width: 100%;
	background-color: red;
`;

export const headerWrapper = css`
	flex: 1 1 auto;
	position: relative;
	width: 100%;
	margin: auto;
	padding: 0 10px;

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
	nav {
		flex: 1 1 auto;
	}
`;

export const headerLinksContainerROW = css`
	nav {
		${from.tablet} {
			position: absolute;
			bottom: 0;
			left: ${space[3]}px;
			right: ${gu_span(5)}px;
		}
	}
`;

export const headerLinksContainerGBP = css`
	nav {
		${from.leftCol} {
			position: absolute;
			bottom: 0;
			left: ${space[3]}px;
			right: ${gu_span(5)}px;
		}
	}
`;
