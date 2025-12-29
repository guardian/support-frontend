import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source/foundations';

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
	${from.phablet} {
		width: 500px;
	}
`;
