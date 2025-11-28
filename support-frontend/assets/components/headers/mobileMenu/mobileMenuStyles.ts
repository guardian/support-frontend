import { css } from '@emotion/react';
import { brand } from '@guardian/source/foundations';
import {
	brandPastel,
	gu_cta_height,
	gu_h_spacing,
	gu_v_spacing,
} from '../header/headerStyles';

export const buttonClose = css`
	position: absolute;
	top: ${gu_cta_height}px;
	right: ${gu_cta_height / -2}px;
`;

export const menuContainer = css`
	background: ${brand[400]};
	min-height: 100vh;
	max-width: 95vw;
	position: relative;
	box-shadow: 3px 0 16px rgba(0, 0, 0, 0.4);
`;

export const menuLinksContainer = css`
	height: 100vh;
	overflow: auto;
	box-sizing: border-box;
	padding: ${gu_v_spacing * 0.5}px 0 ${gu_v_spacing * 2}px;
`;

export const menuUtilityContainer = css`
	margin-left: ${gu_h_spacing * 2.5}px;
	border-top: 1px solid ${brandPastel};
	padding: ${gu_v_spacing * 0.5}px 0;
	margin-top: ${gu_v_spacing}px;
`;
