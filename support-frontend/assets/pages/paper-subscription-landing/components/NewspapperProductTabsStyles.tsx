import { css } from '@emotion/react';
import { from, palette, space, textSans15 } from '@guardian/source/foundations';

export const cardsContainer = css`
	display: flex;
	flex-direction: column;
	background-color: ${palette.brand[400]};
	padding: 0 ${space[6]}px ${space[6]}px;
	gap: ${space[4]}px;
`;

export const productInfoWrapper = css`
	${textSans15}
	display: flex;
	align-items: flex-start;
	gap: ${space[1]}px;
	padding: 0 ${space[5]}px ${space[5]}px;
	color: ${palette.neutral[100]};
	background-color: ${palette.brand[400]};
	border-bottom: 1px solid ${palette.brand[600]};

	svg {
		flex-shrink: 0;
		fill: ${palette.neutral[100]};
	}

	a {
		color: ${palette.neutral[100]};
	}

	p {
		padding-top: ${space[1]}px;
	}

	${from.tablet} {
		padding: ${space[8]}px ${space[6]}px ${space[6]}px;
		background-color: unset;
		border-bottom: none;
		svg {
			fill: ${palette.brand[400]};
		}

		a,
		p {
			color: ${palette.neutral[7]};
		}
	}

	${from.desktop} {
		padding: ${space[4]}px 0 ${space[8]}px;
	}
`;
