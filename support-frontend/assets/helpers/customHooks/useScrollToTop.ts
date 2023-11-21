import { useEffect } from 'react';

export function useScrollToTop(): void {
	useEffect(() => {
		requestAnimationFrame(() => {
			window.scrollTo(0, 0);
		});
	}, []);
}
