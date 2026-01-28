import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { logException } from 'helpers/utilities/logger';
import { isSafari } from 'helpers/utilities/userAgent';

// Without this the build-time pre-rendering breaks, because fetch is undefined when running with node
const safeFetch = (url: string, opts?: Record<string, string>) => {
	if (typeof fetch !== 'undefined') {
		void fetch(url, opts);
	}
};

const logRenderingException = (e: Error): void => {
	safeFetch(window.guardian.settings.metricUrl, {
		mode: 'no-cors',
	}); // ignore result, fire and forget

	logException(
		`Fatal error rendering page: ${window.location.pathname}. Error message: ${
			e.message
		}. Stack trace: ${e.stack ?? 'none'}`,
	);
};

const renderError = (e: Error): void => {
	// We fallback to the body here as the error should always render
	const element = document.querySelector('.gu-render-to') ?? document.body;
	logRenderingException(e);

	void import(
		/* webpackChunkName: "errorPage" */ 'pages/error/components/errorPage'
	).then(({ default: ErrorPage }) => {
		render(
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
	});
};

const renderPage = (
	content: React.ReactElement<React.DOMAttributes<Element>>,
): void => {
	const element: HTMLElement | null = document.querySelector('.gu-render-to');

	if (element) {
		delete element.dataset.notHydrated;

		try {
			if (process.env.NODE_ENV === 'development' && !isSafari) {
				// @ts-expect-error - Not sure why it's not finding typedefs for Preact
				void import(/* webpackChunkName: "preactDebug" */ 'preact/debug');
				void import(
					/* webpackChunkName: "axeCoreReact" */ '@axe-core/react'
				).then((axe) => {
					console.log('Loading react-axe for accessibility analysis');
					void axe.default(React, ReactDOM, 1000);
					render(content, element);
				});
			} else {
				render(content, element);
			}
		} catch (e) {
			renderError(e as Error);
		}
	} else {
		logRenderingException(new Error('Could not find gu-render-to element'));
	}
};

export { renderPage };
