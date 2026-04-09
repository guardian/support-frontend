import { css } from '@emotion/react';
import { from, space, until } from '@guardian/source/foundations';

export const containerStyles = (direction: 'reverse' | 'default') => css`
	display: flex;
	justify-content: center;
	flex-direction: column-reverse;
	width: 100%;

	${from.tablet} {
		flex-direction: ${direction === 'reverse' ? 'row-reverse' : 'row'};
	}
`;

export const contentSlotStyles = css`
	padding: ${space[3]}px ${space[5]}px ${space[10]}px;

	// all links in the content slot should be full width to make them easier to click on mobile
	${until.tablet} {
		a {
			width: 100%;
		}
	}
`;

export const imageSlotStyles = (imagePosition: 'float' | 'bottom') => css`
	display: flex;
	justify-content: center;
	align-items: ${imagePosition === 'bottom' ? 'flex-end' : 'center'};
	flex-shrink: 0;

	picture {
		display: flex;
	}

	${until.tablet} {
		background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1) 80%);
	}

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
