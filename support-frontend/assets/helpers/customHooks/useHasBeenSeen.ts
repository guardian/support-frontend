import libDebounce from 'lodash.debounce';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';

const useHasBeenSeen = (
	options: IntersectionObserverInit & {
		debounce?: boolean;
	},
): [boolean, Dispatch<SetStateAction<HTMLElement | null>>] => {
	const [hasBeenSeen, setHasBeenSeen] = useState<boolean>(false);
	const [elementToObserve, setElementToObserve] = useState<HTMLElement | null>(
		null,
	);
	const observer = useRef<IntersectionObserver | null>(null);

	// Enabling debouncing ensures the target element intersects for at least
	// 200ms before the callback is executed
	const intersectionFn: IntersectionObserverCallback = ([entry]) => {
		if (entry.isIntersecting) {
			setHasBeenSeen(true);
		}
	};

	const intersectionCallback = options.debounce
		? libDebounce(intersectionFn, 200)
		: intersectionFn;
	useEffect(() => {
		if (observer.current) {
			observer.current.disconnect();
		}

		observer.current = new window.IntersectionObserver(
			intersectionCallback,
			options,
		);
		const { current: currentObserver } = observer;

		if (elementToObserve) {
			currentObserver.observe(elementToObserve);
		}

		return () => currentObserver.disconnect();
	}, [elementToObserve, options, intersectionCallback]);
	return [hasBeenSeen, setElementToObserve];
};

export { useHasBeenSeen };
