import { useCallback } from 'react';

// This provides a 'callback ref' to consistently auto-focus on any node once it's mounted
// cf https://tkdodo.eu/blog/avoiding-use-effect-with-callback-refs
export function useAutoFocus<T extends HTMLElement | null>(): (
	node: T | null,
) => void {
	const refCallback = useCallback((node: T | null) => {
		node?.focus();
	}, []);

	return refCallback;
}
