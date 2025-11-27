import { css } from '@emotion/react';
import { from, neutral, space } from '@guardian/source/foundations';

export const sectionStyles = css`
	background-color: ${neutral[97]};
	color: ${neutral[7]};
	position: relative;
	overflow: hidden;
	font-weight: bold;
	font-size: 28px;
	line-height: 30px;

	${from.mobileMedium} {
		font-size: 30px;
		line-height: 32px;
	}

	${from.phablet} {
		font-size: 46px;
		line-height: 50px;
	}

	${from.desktop} {
		font-size: 48px;
		line-height: 52px;
	}
`;

export const contentStyles = css`
	padding-top: ${space[9]}px;
	padding-bottom: 220px;

	${from.mobileLandscape} {
		padding-bottom: 170px;
	}

	${from.desktop} {
		padding-bottom: 10%;
	}
`;

export const headingStyles = css`
	${from.desktop} {
		padding-left: ${space[5]}px;
		margin-left: 20%;
	}
`;

export const headingLineStyles = css`
	display: block;
`;
