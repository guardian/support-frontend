import React from 'react';
import ReactDOM from 'react-dom';
import { logException } from 'helpers/utilities/logger';
import { isSafari } from 'helpers/utilities/userAgent';

// Without this the build-time pre-rendering breaks, because fetch is undefined when running with node
const safeFetch = (url: string, opts) => {
	if (typeof fetch !== 'undefined') {
		fetch(url, opts);
	}
};

const getElement = (id: string): HTMLElement | null | undefined =>
	document.getElementById(id);

const getElementOrBody = (id: string | null | undefined): HTMLElement => {
	let element;

	if (id) {
		element = getElement(id);
	}

	if (!element) {
		element = document.querySelector('.gu-render-to');
	}

	if (!element) {
		element = document.body as any as HTMLElement;
	}

	return element;
};

const renderError = (e: Error, id: string | null | undefined) => {
	safeFetch(window.guardian.settings.metricUrl, {
		mode: 'no-cors',
	}); // ignore result, fire and forget

	const element = getElementOrBody(id);
	logException(
		`Fatal error rendering page: ${id || ''}. Error message: ${
			e.message
		}. Stack trace: ${e.stack ? e.stack : 'none'}`,
	);
	import('pages/error/components/errorPage').then(({ default: ErrorPage }) => {
		if (element) {
			ReactDOM.render(
				ErrorPage({
					headings: [
						'Sorry - we seem',
						'to be having a',
						'problem completing',
						'your request',
					],
					copy: 'Please try again. If the problem persists,',
					reportLink: true,
				}),
				element,
			);
		}
	});
};

const renderPage = (
	content: Record<string, any>,
	id: string,
	callBack?: () => void,
) => {
	const element = getElement(id);

	if (element) {
		delete element.dataset.notHydrated;

		try {
			if (process.env.NODE_ENV === 'DEV' && !isSafari) {
				import('preact/debug');
				import('@axe-core/react').then((axe) => {
					console.log('Loading react-axe for accessibility analysis');
					axe.default(React, ReactDOM, 1000);
					ReactDOM.render(content, element, callBack);
				});
			} else {
				ReactDOM.render(content, element, callBack);
			}
		} catch (e) {
			renderError(e, id);
		}
	} else {
		safeFetch(window.guardian.settings.metricUrl, {
			mode: 'no-cors',
		}); // ignore result, fire and forget

		logException(`Fatal error trying to render a page. id:${id}`);
	}
};

export { renderPage, renderError };
