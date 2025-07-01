import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';

export const carouselWrapper = css`
	position: relative;
`;

export const carouselContainer = css`
	display: flex;
	overflow-x: auto;
	scroll-snap-type: x mandatory;
	scroll-padding-left: 50px;
	padding: ${space[6]}px ${space[6]}px ${space[5]}px;
	gap: ${space[5]}px;
	-webkit-overflow-scrolling: touch;

	&::-webkit-scrollbar {
		display: none;
	}
`;

export const carouselItem = css`
	scroll-snap-align: start;
	display: flex;
`;

export const buttonStyle = css`
	position: absolute;
	top: 0;
	background: ${palette.brand[400]};
	border: none;
	z-index: 1;
	width: 58px;
	height: 100%;
	padding: ${space[1]}px;

	svg {
		background-color: ${palette.neutral[100]};
		border-radius: 50%;
		padding: ${space[1]}px;
		width: 36px;
		height: 36px;
	}
`;

export const prevButton = css`
	${buttonStyle};
	left: -24px;
	opacity: 0;
	transition: opacity 0.3s ease;
`;

export const showNavButton = css`
	opacity: 1;
	cursor: pointer;
`;

export const nextButton = css`
	${buttonStyle};
	right: -24px;
	opacity: 0;
`;
