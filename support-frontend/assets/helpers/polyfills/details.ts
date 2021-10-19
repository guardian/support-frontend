const isDetailsSupported: boolean = ('open' in document.createElement('details'));

function toggleDetailsState(details: Element) {
  if (details.hasAttribute('open')) {
    details.removeAttribute('open');
  } else {
    details.setAttribute('open', 'open');
  }
}

function handleEvent(event: UIEvent) {
  let targetNode: Element = (event.target as any);

  while (targetNode.nodeName.toLowerCase() !== 'summary' && targetNode !== document && targetNode.parentElement) {
    targetNode = targetNode.parentElement;
  }

  if (targetNode.nodeName.toLowerCase() === 'summary' && targetNode.parentElement && targetNode.parentElement.nodeName.toLowerCase() === 'details') {
    toggleDetailsState(targetNode.parentElement);
  }
}

function polyfillDetails() {
  document.addEventListener('click', handleEvent, true);
  document.addEventListener('keypress', (event: KeyboardEvent) => {
    if (event.key && (event.key === ' ' || event.key === 'Enter')) {
      handleEvent(event);
    } else if (event.keyCode === 0x20 || event.keyCode === 0x0D) {
      handleEvent(event);
    }
  }, true);
}

export { isDetailsSupported, polyfillDetails };