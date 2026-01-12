import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	headlineLight20,
	palette,
	space,
} from '@guardian/source/foundations';
import { gu_v_spacing } from 'stylesheets/emotion/layout';

const payPalErrorMaxWidth = 600;
export const pageSectionBodyOverrides = css`
	padding-bottom: ${space[12]}px;
	${from.desktop} {
		padding-left: ${space[6]}px;
		padding-bottom: ${space[14]}px;
	}
`;
export const payPalErrorHeader = css`
	color: ${palette.neutral[7]};
	${headlineBold24}
	line-height: 150%;
	${from.desktop} {
		font-size: 42px;
	}
`;
export const payPalErrorCopy = css`
	color: ${palette.neutral[7]};
	margin: ${gu_v_spacing}px 0;
	${headlineLight20}
	line-height: 1.5;
	padding-bottom: ${space[5]}px;
	${from.desktop} {
		font-size: 28px;
		padding-bottom: ${space[9]}px;
		width: ${payPalErrorMaxWidth}px;
	}
`;
