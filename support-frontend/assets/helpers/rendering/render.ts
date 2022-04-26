import React from 'react';
import ReactDOM from 'react-dom';
import { logException } from 'helpers/utilities/logger';
import { isSafari } from 'helpers/utilities/userAgent';

// Without this the build-time pre-rendering breaks, because fetch is undefined when running with node
const safeFetch = (url: string, opts?: Record<string, string>) => {
	if (typeof fetch !== 'undefined') {
		void fetch(url, opts);
	}
};

const getElement = (id: string): HTMLElement | null =>
	document.getElementById(id);

const getElementOrBody = (id?: string | null): HTMLElement => {
	if (id) {
		return getElement(id) ?? getElementOrBody();
	}
	return document.querySelector('.gu-render-to') ?? document.body;
};

const renderError = (e: Error, id?: string | null): void => {
	safeFetch(window.guardian.settings.metricUrl, {
		mode: 'no-cors',
	}); // ignore result, fire and forget

	const element = getElementOrBody(id);
	logException(
		`Fatal error rendering page: ${id ?? ''}. Error message: ${
			e.message
		}. Stack trace: ${e.stack ? e.stack : 'none'}`,
	);
	void import('pages/error/components/errorPage').then(
		({ default: ErrorPage }) => {
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
		},
	);
};

const renderPage = (
	content: React.DOMElement<React.DOMAttributes<Element>, Element>,
	id: string,
	callBack?: () => void,
): void => {
	const element = getElement(id);

	if (element) {
		delete element.dataset.notHydrated;

		try {
			if (process.env.NODE_ENV === 'development' && !isSafari) {
				// @ts-expect-error - Not sure why it's not finding typedefs for Preact
				void import('preact/debug');
				void import('@axe-core/react').then((axe) => {
					console.log('Loading react-axe for accessibility analysis');
					void axe.default(React, ReactDOM, 1000);
					ReactDOM.render(content, element, callBack);
				});
			} else {
				ReactDOM.render(content, element, callBack);
			}
		} catch (e) {
			renderError(e as Error, id);
		}
	} else {
		safeFetch(window.guardian.settings.metricUrl, {
			mode: 'no-cors',
		}); // ignore result, fire and forget

		logException(`Fatal error trying to render a page. id:${id}`);
	}
};

export { renderPage, renderError };
