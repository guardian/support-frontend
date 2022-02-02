import { ResizeObserver } from '@juggle/resize-observer';
import { useEffect } from 'react';
import useDimensions from 'react-cool-dimensions';

// ---- Types ---- //

type Observe<T extends HTMLElement> = (element?: T | null) => void;

// ---- Hook ---- //

// This hook is used to trigger a side effect when the height of an
// HTML element changes. It returns an `Observe` function, which can
// be passed to the `ref` property of an HTML element.

export function useOnHeightChangeEffect<T extends HTMLElement>(
	onChange: (height: number) => void,
): Observe<T> {
	const { observe, height } = useDimensions<T>({
		useBorderBoxSize: true,
		polyfill: ResizeObserver,
	});

	useEffect(() => {
		onChange(height);
	}, [height]);

	return observe;
}
