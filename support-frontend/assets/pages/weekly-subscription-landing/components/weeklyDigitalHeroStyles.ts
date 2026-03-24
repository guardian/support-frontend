import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSansBold17,
} from '@guardian/source/foundations';

export const pageTitleSpacing = css`
	${from.tablet} {
		padding-bottom: ${space[8]}px;
	}
	p {
		${from.desktop} {
			max-width: 100%;
		}
	}
	div {
		${from.desktop} {
			h1 {
				padding-left: 0px;
			}
		}
	}
`;

export const roundelStyles = css`
	${textSansBold17}
`;
export const roundelPromotionStyles = css`
	background-color: ${palette.lifestyle[400]};
	color: ${palette.neutral[100]};
`;
