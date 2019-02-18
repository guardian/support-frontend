// @flow

import ReactDOM from 'react-dom';
import { logException } from 'helpers/logger';

const getElement = (id: string): ?Element => document.getElementById(id);

const getElementOrBody = (id: ?string): Element => {
  let element;
  if (id) {
    element = getElement(id);
  }
  if (!element) {
    element = document.querySelector('.gu-render-to');
  }
  if (!element) {
    element = ((document.body: any): Element);
  }
  return element;
};

const renderError = (id: ?string) => {
  const element = getElementOrBody(id);

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
    try {
      ReactDOM.render(content, element, callBack);
    } catch {
      logException(`Fatal error rendering a page. id:${id}`);
      renderError(id);
    }
  } else {
    logException(`Fatal error trying to render a page. id:${id}`);
  }
};

export { renderPage, renderError };
