import { css } from '@emotion/react';
import { brandAlt } from '@guardian/source/foundations';
import { gu_cta_height } from '../header/headerStyles';

export const buttonOpen = css`
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	height: ${gu_cta_height}px;
	width: ${gu_cta_height}px;
	margin: 0;
	padding: 0;
	background: ${brandAlt[400]};
	border-radius: 100%;
	border: 0;
	cursor: pointer;
	position: relative;
	> svg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}
`;
