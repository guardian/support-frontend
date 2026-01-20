import { css } from '@emotion/react';
import { from, palette, space, textSans15 } from '@guardian/source/foundations';

export const promotionContainer = css`
	${textSans15}
	gap: ${space[1]}px;
	padding: 0 ${space[3]}px ${space[5]}px;
	color: ${palette.neutral[100]};
	background-color: ${palette.brand[400]};
	border-bottom: 1px solid ${palette.brand[600]};
	p {
		display: block;
		padding-top: ${space[1]}px;
	}

	${from.tablet} {
		padding: 0 ${space[5]}px ${space[6]}px;
		background-color: unset;
		border-bottom: none;
		p {
			display: inline;
			color: ${palette.neutral[7]};
		}
	}
	${from.desktop} {
		padding: ${space[1]}px 0 ${space[8]}px;
	}
`;
