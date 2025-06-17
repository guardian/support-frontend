import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import {
	SvgChevronLeftSingle,
	SvgChevronRightSingle,
} from '@guardian/source/react-components';
import type { ReactNode} from 'react';
import { useRef } from 'react';

const carouselWrapper = css`
	position: relative;
`;

const carouselContainer = css`
	display: flex;
	overflow-x: auto;
	scroll-snap-type: x mandatory;
	padding: ${space[6]}px ${space[6]}px ${space[5]}px;
	gap: ${space[5]}px;
	-webkit-overflow-scrolling: touch;

	&::-webkit-scrollbar {
		display: none;
	}
`;

const carouselItem = css`
	scroll-snap-align: start;
	display: flex;
`;

const buttonStyle = css`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	background: ${palette.brand[400]};
	border: none;
	cursor: pointer;
	z-index: 1;
	width: 36px;
	height: 36px;
	border-radius: 50%;
	padding: ${space[1]}px;

	svg {
		fill: ${palette.neutral[100]};
	}
`;

const prevButton = css`
	${buttonStyle};
	left: -24px;
`;

const nextButton = css`
	${buttonStyle};
	right: -24px;
`;

export default function Carousel({ items }: { items: ReactNode[] }) {
	const containerRef = useRef<HTMLDivElement>(null);

	const scrollByWidth = (direction: 'next' | 'prev') => {
		if (!containerRef.current) {return;}
		const container = containerRef.current;
		const scrollAmount = container.clientWidth * 0.3;
		container.scrollBy({
			left: direction === 'next' ? scrollAmount : -scrollAmount,
			behavior: 'smooth',
		});
	};

	return (
		<div css={carouselWrapper}>
			<button css={prevButton} onClick={() => scrollByWidth('prev')}>
				<SvgChevronLeftSingle size="small" />
			</button>
			<div css={carouselContainer} ref={containerRef}>
				{items.map((item) => (
					<div css={carouselItem}>{item}</div>
				))}
			</div>
			<button css={nextButton} onClick={() => scrollByWidth('next')}>
				<SvgChevronRightSingle size="small" />
			</button>
		</div>
	);
}
