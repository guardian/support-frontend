// @flow

import ReactDOM from 'react-dom';
import { logException } from 'helpers/logger';

const getElement = (id: string): ?HTMLElement => document.getElementById(id);

const getElementOrBody = (id: ?string): HTMLElement => {
  let element;
  if (id) {
    element = getElement(id);
  }
  if (!element) {
    element = document.querySelector('.gu-render-to');
  }
  if (!element) {
    element = ((document.body: any): HTMLElement);
  }
  return element;
};

const renderError = (e: Error, id: ?string) => {
  fetch(window.guardian.settings.metricUrl, { mode: 'no-cors' }); // ignore result, fire and forget

  const element = getElementOrBody(id);

  logException(`Fatal error rendering page: ${id || ''}. Error message: ${e.message}. Stack trace: ${e.stack ? e.stack : 'none'}`);
  import('pages/error/components/errorPage').then(({ default: ErrorPage }) => {
    if (element) {
      ReactDOM.render(ErrorPage({
        headings: ['Sorry - we seem', 'to be having a', 'problem completing', 'your request'],
        copy: 'Please try again. If the problem persists,',
        reportLink: true,
      }), element);
    }
  });

};

const renderPage = (content: Object, id: string, callBack?: () => void) => {
  const element = getElement(id);

  if (element) {
    delete element.dataset.notHydrated;
    try {
      ReactDOM.render(content, element, callBack);
    } catch (e) {
      renderError(e, id);
    }
  } else {
    fetch(window.guardian.settings.metricUrl, { mode: 'no-cors' }); // ignore result, fire and forget
    logException(`Fatal error trying to render a page. id:${id}`);
  }
};

export { renderPage, renderError };
