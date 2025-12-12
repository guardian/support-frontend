import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	palette,
	breakpoints as sourceBreakpoints,
	space,
} from '@guardian/source/foundations';
import { gu_h_spacing, gu_v_spacing } from 'stylesheets/emotion/layout';

export const sectionStyles = css`
	box-sizing: border-box;
	padding: 0 ${gu_h_spacing * 0.5}px;

	${from.mobileLandscape} {
		max-width: ${sourceBreakpoints.mobileLandscape}px;
		margin: 0 auto;
		padding: 0 ${gu_h_spacing}px;
	}

	${from.phablet} {
		max-width: ${sourceBreakpoints.phablet}px;
	}

	${from.tablet} {
		max-width: ${sourceBreakpoints.tablet}px;
	}

	${from.desktop} {
		max-width: ${sourceBreakpoints.desktop}px;
		padding: 0 ${gu_h_spacing}px 0 ${gu_h_spacing * 2}px;
	}

	${from.leftCol} {
		max-width: ${sourceBreakpoints.leftCol}px;
		padding: 0 ${gu_h_spacing * 1.5}px;
	}

	${from.wide} {
		max-width: ${sourceBreakpoints.wide}px;
	}
`;

export const headerStyles = css`
	${from.desktop} {
		display: inline-block;
		vertical-align: top;
		width: 20%;
	}
`;

export const headingStyles = css`
	${headlineBold24}
	${from.desktop} {
		position: relative;

		&::after {
			border-right: 1px solid ${palette.neutral[86]};
			content: '';
			display: inline-block;
			height: 36px;
			position: absolute;
			top: 0;
			right: ${space[4]}px;
		}
	}
`;

export const bodyStyles = css`
	box-sizing: border-box;
	padding-top: ${gu_v_spacing}px;
	padding-bottom: ${gu_v_spacing * 3}px;

	${from.desktop} {
		padding-bottom: 0;
		display: inline-block;
		width: 80%;
	}
`;
