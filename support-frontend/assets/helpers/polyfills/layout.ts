type ElementResizer = {
	stopListening: () => void;
};

/*
Mini wrapper for ResizeObserver while
it's not polyfilled in pf.io
*/
const onElementResize = (
	elements: Element[],
	onResize: (arg0: Element[]) => void,
): ElementResizer => {
	const observer = window.ResizeObserver
		? new window.ResizeObserver(() => {
				onResize(elements);
		  })
		: null;

	if (observer) {
		elements.forEach((el) => {
			observer.observe(el);
		});
	} else {
		window.addEventListener('resize', () => onResize(elements));
		onResize(elements);
	}

	return {
		stopListening: () => {
			if (observer) {
				observer.disconnect();
			} else {
				window.removeEventListener('resize', onResize);
			}
		},
	};
};

export type { ElementResizer };
export { onElementResize };
