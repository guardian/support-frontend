import { css } from '@emotion/react';

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

export const testUserBanner = css`
	background-color: red;
	width: 100%;
`;

export const component_header_topnav_logo_graun = css`
	float: right;
	height: 100%;
	flex: 0 1 auto;
`;
