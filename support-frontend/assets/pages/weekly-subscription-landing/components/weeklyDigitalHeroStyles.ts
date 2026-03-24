import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSansBold17,
	until,
} from '@guardian/source/foundations';

export const pageTitleOverrides = css`
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
			width: calc(100% - 64px);
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

export const weeklyDigitalHeroOverrides = css`
	${until.tablet} {
		section {
			padding: ${space[3]}px ${space[3]}px ${space[6]}px;
		}
		a {
			width: 100%;
		}
	}
	${from.desktop} {
		width: calc(100% - 64px);
		div {
			& div:nth-child(2) {
				${from.desktop} {
					align-self: center;
				}
			}
		}
	}
`;
