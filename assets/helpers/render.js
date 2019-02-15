// @flow

import ReactDOM from 'react-dom';
import { logException } from 'helpers/logger';

const renderPage = (content: Object, id: string, callBack?: () => void) => {
  const element: ?Element = document.getElementById(id);

  if (element) {
    try {
      ReactDOM.render(content, element, callBack);
    } catch {
      logException(`Fatal error rendering a page. id:${id}`);
      import('pages/error/components/errorPage').then(({ default: ErrorPage }) => {
        ReactDOM.render(ErrorPage({
          headings: ['Sorry - we seem', 'to be having a', 'problem completing', 'your request'],
          copy: 'Please try again. If the problem persists,',
          reportLink: true,
        }), element, callBack);
      });
    }
  } else {
    logException(`Fatal error trying to render a page. id:${id}`);
  }
};

export { renderPage };
