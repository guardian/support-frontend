const isDetailsSupported: boolean = 'open' in document.createElement('details');

function toggleDetailsState(details: Element) {
	if (details.hasAttribute('open')) {
		details.removeAttribute('open');
	} else {
		details.setAttribute('open', 'open');
	}
}

function isNode(element: EventTarget): element is Node {
	return 'nodeName' in element && 'parentElement' in element;
}

function findSummaryNode(maybeSummary: Node): Node {
	let targetNode = maybeSummary;
	while (
		targetNode !== document &&
		targetNode.nodeName.toLowerCase() !== 'summary' &&
		targetNode.parentElement
	) {
		targetNode = targetNode.parentElement;
	}
	return targetNode;
}

function handleEvent(event: UIEvent) {
	if (event.target && isNode(event.target)) {
		const targetNode = findSummaryNode(event.target);

		if (
			targetNode.nodeName.toLowerCase() === 'summary' &&
			targetNode.parentElement &&
			targetNode.parentElement.nodeName.toLowerCase() === 'details'
		) {
			toggleDetailsState(targetNode.parentElement);
		}
	}
}

function polyfillDetails(): void {
	document.addEventListener('click', handleEvent, true);
	document.addEventListener(
		'keypress',
		(event: KeyboardEvent) => {
			if (event.key && (event.key === ' ' || event.key === 'Enter')) {
				handleEvent(event);
			} else if (event.keyCode === 0x20 || event.keyCode === 0x0d) {
				handleEvent(event);
			}
		},
		true,
	);
}

export { isDetailsSupported, polyfillDetails };
