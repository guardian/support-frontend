import { css } from '@emotion/react';
import { brand, neutral, textSans12 } from '@guardian/source/foundations';
import { gu_v_spacing } from 'stylesheets/emotion/layout';

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
