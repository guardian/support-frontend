import { css } from '@emotion/react';
import {
	brandAlt,
	from,
	neutral,
	palette,
	space,
	textSansBold17,
} from '@guardian/source/foundations';

export const tabList = css`
	display: flex;
	align-items: flex-end;
	justify-content: flex-start;
	margin-top: ${space[5]}px;
`;
export const tabButton = css`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${palette.brand[400]};
	${textSansBold17};
	text-decoration: none;
	width: 100%;
	height: 80px;
	text-align: left;
	color: ${palette.neutral[100]};
	box-shadow: inset 0 ${space[2]}px 0 0 ${brandAlt[400]};
	transition: box-shadow 0.2s;
	border-bottom: none;
	cursor: pointer;

	${from.phablet} {
		width: 200px;
	}

	&[aria-selected='false'] {
		background-color: ${neutral[100]};
		color: ${palette.brand[100]};
		box-shadow: none;
		&:hover {
			box-shadow: inset 0 ${space[2]}px 0 0 ${brandAlt[400]};
		}
	}
`;
export const tabPanel = css`
	background-color: ${palette.brand[400]};
	color: ${palette.neutral[100]};
	padding: ${space[2]}px;
`;
