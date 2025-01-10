import { useCallback } from 'react';

/**
 * A hook that returns a ref which will move focus to its node on first render
 */
export function useAutoFocus<T extends HTMLElement | null>(): (
	node: T | null,
) => void {
	// This provides a 'callback ref'
	// cf https://tkdodo.eu/blog/avoiding-use-effect-with-callback-refs
	const refCallback = useCallback((node: T | null) => {
		node?.focus();
	}, []);

	return refCallback;
}
