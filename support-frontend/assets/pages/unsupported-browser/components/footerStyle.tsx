import { css } from '@emotion/react';
import { brand, from, neutral, textSans12 } from '@guardian/source/foundations';
import { breakpoints } from 'helpers/abTests/models';
import { gu_h_spacing, gu_v_spacing } from 'stylesheets/emotion/layout';

export const gu_content_margin = (paddingVertical: number) => css`
	box-sizing: border-box;
	padding: ${paddingVertical}px ${gu_h_spacing * 0.5}px;

	${from.mobileLandscape} {
		width: ${breakpoints.mobileLandscape}px;
		margin: 0 auto;
		padding: ${paddingVertical}px ${gu_h_spacing}px;
	}

	${from.phablet} {
		width: ${breakpoints.phablet}px;
		margin: 0 auto;
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

export const unsupported_browser__footer = css`
	${textSans12};
	background-color: ${brand[400]};
`;

export const unsupported_browser__footer_copyright = css`
	font-weight: 400;
	display: block;
	padding: 3px 0;
	color: ${neutral[86]};
`;

export const unsupported_browser__footer_legal = css`
	${textSans12};
	margin-top: ${gu_v_spacing}px;
`;

export const unsupported_browser__footer_legal_link = css`
	color: inherit;
`;
export const unsupported_browser__footer_privacy_policy = css`
	text-decoration: none;
	color: ${neutral[86]};
	padding: 5px 0;
	:hover {
		text-decoration: underline;
	}
`;
