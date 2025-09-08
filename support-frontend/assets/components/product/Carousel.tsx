import {
	SvgChevronLeftSingle,
	SvgChevronRightSingle,
} from '@guardian/source/react-components';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
	carouselContainer,
	carouselItem,
	carouselWrapper,
	nextButton,
	prevButton,
	showNavButton,
} from './CarouselStyles';

export default function Carousel({ items }: { items: ReactNode[] }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	const updateScrollButtons = () => {
		const container = containerRef.current;
		if (!container) {
			return;
		}

		setCanScrollPrev(container.scrollLeft > 0);
		setCanScrollNext(
			container.scrollLeft + container.clientWidth < container.scrollWidth - 1,
		);
	};

	const scrollByWidth = (direction: 'next' | 'prev') => {
		const container = containerRef.current;
		if (!container) {
			return;
		}
		const scrollAmount = container.clientWidth * 0.3;
		container.scrollBy({
			left: direction === 'next' ? scrollAmount : -scrollAmount,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		updateScrollButtons();
		const container = containerRef.current;
		if (!container) {
			return;
		}

		container.addEventListener('scroll', updateScrollButtons);
		window.addEventListener('resize', updateScrollButtons);

		return () => {
			container.removeEventListener('scroll', updateScrollButtons);
			window.removeEventListener('resize', updateScrollButtons);
		};
	}, []);

	useEffect(
		function resetScroll() {
			const container = containerRef.current;
			if (!container) {
				return;
			}

			container.scrollTo({ left: 0, behavior: 'instant' });
			updateScrollButtons();
		},
		[items],
	);

	return (
		<div css={carouselWrapper}>
			<button
				css={[prevButton, canScrollPrev && showNavButton]}
				onClick={() => scrollByWidth('prev')}
			>
				<SvgChevronLeftSingle size="small" />
			</button>
			<div css={carouselContainer} ref={containerRef}>
				{items.map((item) => (
					<div css={carouselItem}>{item}</div>
				))}
			</div>
			<button
				css={[nextButton, canScrollNext && showNavButton]}
				onClick={() => scrollByWidth('next')}
			>
				<SvgChevronRightSingle size="small" />
			</button>
		</div>
	);
}
