import { useEffect, useState } from 'react';

export function useIsWideScreen(breakpoint = 740): boolean {
	const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);

	const [isWide, setIsWide] = useState(() =>
		typeof window !== 'undefined' ? mediaQuery.matches : false,
	);

	useEffect(() => {
		const handler = (event: MediaQueryListEvent) => {
			setIsWide(event.matches);
		};

		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	}, [breakpoint]);

	return isWide;
}
