import { useCallback, useState } from 'react';

export function useAutoFocus<T extends HTMLElement | null>(): (
	node: T | null,
) => void {
	const [ref, setRef] = useState<T | null>(null);
	const refCallback = useCallback((node: T | null) => {
		if (ref) return;
		if (node) {
			node.focus();
		}
		setRef(node);
	}, []);

	return refCallback;
}
