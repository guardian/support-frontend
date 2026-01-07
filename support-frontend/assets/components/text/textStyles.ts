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

export const titleHeading = css`
	${headlineBold24}
	${until.tablet} {
		font-size: 22px;
	}
	margin: ${gu_v_spacing}px 0;
	p {
		margin-top: ${gu_v_spacing / -2}px;
	}
`;

export const textContainer = css`
	${textEgyptian17}
	font-size: 24px;
	overflow-wrap: break-word;
	margin-top: ${gu_v_spacing / -1}px;
	> *:not(:first-child) {
		margin-top: ${gu_v_spacing}px;
	}
`;

export const largeParagraphStyle = css`
	${headlineLight17}
	font-size: 18px;
	${from.tablet} {
		font-size: 22px;
	}
	margin-top: ${gu_v_spacing}px;
	line-height: 120%;
`;

export const sansParagraphStyle = css`
	${textSans15}
	font-size: 16px;
	margin-top: ${gu_v_spacing}px;
`;
