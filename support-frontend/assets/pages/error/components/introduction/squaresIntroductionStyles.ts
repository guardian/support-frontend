import { css } from '@emotion/react';
import {
	from,
	headlineBold28,
	headlineBold34,
	headlineBold42,
	headlineBold50,
	neutral,
	space,
} from '@guardian/source/foundations';

export const sectionStyles = css`
	${headlineBold28}
	background-color: ${neutral[97]};
	color: ${neutral[7]};
	position: relative;
	overflow: hidden;

	${from.mobileMedium} {
		${headlineBold34}
	}

	${from.phablet} {
		${headlineBold42}
	}

	${from.desktop} {
		${headlineBold50}
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
