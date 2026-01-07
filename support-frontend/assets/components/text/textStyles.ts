import { css } from '@emotion/react';
import {
	// brandAlt,
	from,
	headlineBold24,
	headlineLight17,
	palette,
	textEgyptian17,
	textSans20,
	until,
} from '@guardian/source/foundations';
import { gu_h_spacing, gu_v_spacing } from 'stylesheets/emotion/layout';

export const component_text = css`
	// typography.gu-fontset-body
	${textEgyptian17}
	font-size: 24px;
	overflow-wrap: break-word;
	margin-top: ${gu_v_spacing / -1}px;
	> *:not(:first-child) {
		margin-top: ${gu_v_spacing}px;
	}
	a {
		color: inherit;
	}
	code {
		font-family: monospace;
		background: ${palette.neutral[93]};
		color: ${palette.neutral[7]};
		padding: (${gu_v_spacing * 0.25}) px (${gu_h_spacing * 0.25}) px;
	}
`;

export const component_text__heading = css`
	// typography.gu-fontset-heading
	${headlineBold24}
	${until.tablet} {
		font-size: 22px;
	}
	margin: ${gu_v_spacing}px 0;
	p {
		margin-top: ${gu_v_spacing / -2}px;
	}
`;

// export const component_text__callout = css`
// 	// typography.gu-fontset-heading
// 	${headlineBold24}
// 	font-size: 26px;
// 	${from.tablet} {
// 		font-size: 28px;
// 	}
// 	& > strong {
// 		padding: 0 ${gu_h_spacing * 0.25}px;
// 		background-color: ${brandAlt[400]};
// 		color: ${palette.neutral[7]};
// 	}
// `;

export const component_text__large = css`
	// typography.gu-fontset-heading
	${headlineLight17}
	font-size: 18px;
	${from.tablet} {
		// typography.gu-fontset-body-large
		font-size: 26px;
	}
	margin-top: ${gu_v_spacing}px;
`;

export const component_text__sans = css`
	// typography.gu-fontset-body-sans
	${textSans20}
	font-size: 22px;
	margin-top: ${gu_v_spacing}px;
`;

// export const component_text__paddingTop = css`
// 	padding-top: (${gu_v_spacing}px);
// `;
