import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';

export const hero = (direction: 'row-reverse' | undefined) => css`
	position: relative;
	display: flex;
	flex-direction: column-reverse;
	justify-content: space-between;
	border: none;
	width: 100%;

	${from.tablet} {
		flex-direction: ${direction === 'row-reverse' ? 'row-reverse' : 'row'};
	}
`;

export const contentStyles = css`
	padding: ${space[3]}px ${space[5]}px ${space[10]}px;
`;

export const ImageStyles = css`
	align-self: flex-end;
	flex-shrink: 0;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	width: 100%;

	${from.tablet} {
		width: 45%;
	}

	${from.desktop} {
		width: 40%;
	}

	& img {
		max-width: 100%;
	}
`;
