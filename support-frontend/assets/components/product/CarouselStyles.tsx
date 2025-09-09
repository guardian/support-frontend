import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';

export const carouselWrapper = css`
	position: relative;
`;

export const carouselContainer = css`
	display: flex;
	overflow-x: auto;
	scroll-snap-type: x mandatory;
	scroll-padding-left: 56px;
	padding: ${space[8]}px 0 ${space[5]}px;
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

const buttonStyle = css`
	position: absolute;
	top: 0;
	background: ${palette.brand[400]};
	border: none;
	z-index: 1;
	width: 76px;
	height: 100%;
	padding: ${space[1]}px;
	opacity: 0;
	transition: opacity 0.3s ease;

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
	left: -${space[5]}px;
`;

export const showNavButton = css`
	opacity: 1;
	cursor: pointer;
`;

export const nextButton = css`
	${buttonStyle};
	right: -${space[5]}px;
`;
