import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textEgyptian17,
} from '@guardian/source/foundations';

export const componentQuestionsContactLink = css`
	color: ${palette.neutral[7]};
`;

export const pageSectionBorderTop = css`
	border-top: 1px solid ${palette.neutral[86]};
	padding-bottom: ${space[3]}px;

	${from.desktop} {
		padding-left: ${space[5]}px;
	}
`;

export const componentQuestionsContactDescription = css`
	${textEgyptian17}
	font-size: 16px;
	line-height: 1.5;
	${from.phablet} {
		width: 500px;
	}
`;
