// @flow

const isDetailsSupported: boolean = ('open' in document.createElement('details'));

function toggleDetailsState(details: HTMLDetailsElement) {
    if (details.hasAttribute('open')) {
        details.removeAttribute('open');
    } else {
        details.setAttribute('open', 'open');
    }
}

function handleEvent(event: UIEvent) {
    var targetNode: Element = (event.target: any);

    while (targetNode.nodeName.toLowerCase() !== 'summary' && targetNode !== document && targetNode.parentElement) {
        targetNode = targetNode.parentElement;
    }
    if (targetNode.nodeName.toLowerCase() === 'summary' && targetNode.parentElement instanceof HTMLDetailsElement) {
        toggleDetailsState(targetNode.parentElement);
    }
}

function polyfillDetails() {
    document.addEventListener('click', handleEvent, true);
    document.addEventListener('keypress', function (event: KeyboardEvent) {
        if (event.key && (event.key === ' ' || event.key === 'Enter')) {
            handleEvent(event);
        }
        else if (event.keyCode === 0x20 || event.keyCode === 0x0D) {
            handleEvent(event);
        }
    }, true);
}

export {
  isDetailsSupported,
  polyfillDetails
};
