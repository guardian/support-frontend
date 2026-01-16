import { css } from '@emotion/react';
import {
	breakpoints,
	from,
	headlineBold20,
	headlineBold24,
	neutral,
	space,
	textEgyptian15,
} from '@guardian/source/foundations';
import { gu_h_spacing, gu_v_spacing } from 'stylesheets/emotion/layout';

export const gu_content_margin = (
	paddingVertical: number,
	marginVertical: number,
) => css`
	box-sizing: border-box;
	padding: ${paddingVertical}px ${gu_h_spacing * 0.5}px;

	${from.mobileLandscape} {
		width: ${breakpoints.mobileLandscape}px;
		margin: ${marginVertical}px auto;
		padding: ${paddingVertical}px ${gu_h_spacing}px;
	}

	${from.phablet} {
		width: ${breakpoints.phablet}px;
		margin: ${marginVertical}px auto;
		padding: ${paddingVertical}px auto;
	}

	${from.tablet} {
		width: ${breakpoints.tablet}px;
		padding: ${paddingVertical}px ${gu_h_spacing}px;
	}

	${from.desktop} {
		width: ${breakpoints.desktop}px;
		padding: ${paddingVertical}px ${gu_h_spacing}px ${paddingVertical}px
			${gu_h_spacing * 2}px;
	}

	${from.leftCol} {
		width: ${breakpoints.leftCol}px;
		padding: ${paddingVertical}px ${gu_h_spacing * 1.5}px;
	}

	${from.wide} {
		width: ${breakpoints.wide}px;
	}
`;

export const container = css`
	background-color: ${neutral[93]};
	flex: 1 0 auto;
	${textEgyptian15};
	font-size: ${space[4]}px;
	line-height: 1.5;
`;

export const unsupported_browser__introduction_text = css`
	background-color: #e9e939;
	/* padding-top: 5px;
	padding-bottom: 5px;
	margin-top: 5px;
	margin-bottom: 5px; */
`;

export const unsupported_browser__why_support = css`
	padding-bottom: ${gu_v_spacing * 2}px;
`;

export const unsupported_browser__why_support_heading = css`
	${headlineBold24};
	line-height: 1.5;
	padding: ${gu_v_spacing}px 0 0;
`;

export const unsupported_browser__why_support_subheading = css`
	${headlineBold20};
	line-height: 1.5;
	padding: ${gu_v_spacing}px 0;
`;

export const unsupported_browser__why_support_copy = css`
	${from.desktop} {
		width: 60%;
	}
`;
