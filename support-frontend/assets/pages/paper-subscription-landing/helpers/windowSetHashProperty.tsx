export function windowSetHashProperty(replace: string) {
	if (
		typeof window !== 'undefined' &&
		typeof window.history.replaceState === 'function'
	) {
		try {
			window.history.replaceState({}, '', `#${replace}`);
		} catch (e) {
			// fail silently for older browsers
		}
	}
}
