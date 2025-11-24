import { css } from '@emotion/react';
import { from, neutral, textSans15 } from '@guardian/source/foundations';

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

export const component_header_checkout__row = css`
	//@include gu-fontset-body-sans;
	// TODO : Conversion Pending
	${textSans15}
	font-size: 16px;
	font-weight: 600;

	width: 100%;
	color: ${neutral[100]};

	padding: 12px;
	border-top: 1px solid #506991;

	${from.desktop} {
		display: none;
	}

	${from.tablet} {
		display: none;
	}
`;

export const testUserBanner = css`
	background-color: red;
	width: 100%;
`;

export const padlockContainer = css`
	margin-right: ${20 / 3}px;
	display: inline-block;
	margin-top: 2px;
`;

export const component_header_topnav_logo_graun = css`
	float: right;
	height: 100%;
	flex: 0 1 auto;
`;
