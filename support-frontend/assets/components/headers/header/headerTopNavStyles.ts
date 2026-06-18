import { css } from '@emotion/react';
import { brand, from, space } from '@guardian/source/foundations';
import { brandPastel, gu_span } from './headerStyles';

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
		float: right;
		width: ${gu_span(5)}px;
		background-color: ${brand[400]};
	}
	${from.wide} {
		padding-right: ${space[18]}px;
	}
`;

export const logoContainerROW = css`
	${from.tablet} {
		position: relative;
		border-left: 1px solid ${brandPastel};
		z-index: 10;
	}
`;

export const logoContainerGBP = css`
	${from.leftCol} {
		position: relative;
		border-left: 1px solid ${brandPastel};
		z-index: 10;
	}
`;
