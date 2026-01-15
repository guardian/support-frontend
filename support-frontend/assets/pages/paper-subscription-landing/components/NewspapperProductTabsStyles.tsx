import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source/foundations';

export const cardsContainer = css`
	display: flex;
	flex-direction: column;
	background-color: ${palette.brand[400]};
	padding: 0 ${space[3]}px ${space[6]}px;
	gap: ${space[4]}px;
	${from.tablet} {
		padding: 0 ${space[5]}px ${space[6]}px;
	}
`;
