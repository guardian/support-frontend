import { css } from '@emotion/react';
import { palette, space, textSans12 } from '@guardian/source/foundations';

export const guarantee = css`
	${textSans12}
	color: ${palette.neutral[46]};
	margin-bottom: ${space[1]}px;
	a {
		color: ${palette.neutral[46]};
	}
`;

export const guaranteeList = css`
	overflow: hidden;
	list-style-type: disc;
	padding-left: ${space[4]}px;
	padding-top: ${space[2]}px;
	visibility: collapse;
	max-height: 0px;
	transition: max-height 0.25s ease-in-out;
`;

export const guaranteeListOpen = css`
	visibility: visible;
	max-height: 100vh;
`;

export const guaranteeListOpenLink = css`
	background: none;
	outline: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	text-decoration: underline;
	cursor: pointer;
`;
