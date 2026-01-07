import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	headlineLight17,
	textEgyptian17,
	textSans15,
	until,
} from '@guardian/source/foundations';
import { gu_v_spacing } from 'stylesheets/emotion/layout';

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

export const component_text = css`
	// typography.gu-fontset-body
	${textEgyptian17}
	font-size: 24px;
	overflow-wrap: break-word;
	margin-top: ${gu_v_spacing / -1}px;
	> *:not(:first-child) {
		margin-top: ${gu_v_spacing}px;
	}
`;

export const component_text__large = css`
	// typography.gu-fontset-heading
	${headlineLight17}
	font-size: 18px;
	${from.tablet} {
		// typography.gu-fontset-body-large
		font-size: 22px;
	}
	margin-top: ${gu_v_spacing}px;
	line-height: 115%;
`;

export const component_text__sans = css`
	// typography.gu-fontset-body-sans
	${textSans15}
	font-size: 16px;
	margin-top: ${gu_v_spacing}px;
`;
