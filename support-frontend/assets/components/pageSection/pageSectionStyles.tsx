import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	palette,
	space,
} from '@guardian/source/foundations';
import { gu_span, gu_v_spacing } from 'stylesheets/emotion/layout';

export const sectionStyles = css`
	/* previously .component-page-section__content extended .gu-content-margin */
	box-sizing: border-box;
	padding: 0 ${space[3]}px;

	${from.mobileLandscape} {
		max-width: ${gu_span(6)}px;
		margin: 0 auto;
		padding: 0 ${space[5]}px;
	}

	${from.phablet} {
		max-width: ${gu_span(9)}px;
	}

	${from.tablet} {
		max-width: ${gu_span(10)}px;
	}

	${from.desktop} {
		max-width: ${gu_span(12)}px;
		padding: 0 ${space[5]}px 0 ${space[10]}px;
	}

	${from.leftCol} {
		max-width: ${gu_span(14)}px;
		padding: 0 ${space[8]}px;
	}

	${from.wide} {
		max-width: ${gu_span(16)}px;
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
			top: -${space[3]}px;
			right: ${space[4]}px;
		}
	}
`;

export const bodyStyles = css`
	box-sizing: border-box;

	.component-text {
		margin: ${gu_v_spacing * 3}px 0;
	}

	${from.desktop} {
		display: inline-block;
		width: 80%;
	}
`;
