import { css } from '@emotion/react';
import { brand, from } from '@guardian/source/foundations';

function gu_span(columns: number): string {
	const gu_col_width = 60;
	const gu_h_spacing = 20;
	return `${columns * gu_col_width + gu_h_spacing * (columns - 1)}px`;
}

export const topNavContainer = css`
	display: flex;
	justify-content: space-between;
`;

export const utilityContainer = css`
	padding-top: 6px;
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
		padding-right: gu-span(1) + $gu-h-spacing;
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

export const component_header__row = css`
	display: flex;
	width: 100%;
	// TODO : Conversion Pending
	& > .component-header-topnav {
		flex: 1 1 auto;
	}
	// TODO : Conversion Pending
	& > .component-header-links {
		flex: 1 1 auto;
	}
`;

export const testUserBanner = css`
	background-color: red;
	width: 100%;
`;

// export const component_header = css`
// 	background-color: ${brand[400]};
// 	display: flex;
// 	align-items: center;
// 	justify-content: stretch;
// 	overflow: hidden;
// 	* {
// 		box-sizing: content-box;
// 	}
// `;
