// @flow

import ReactDOM from 'react-dom';
import { logException } from 'helpers/logger';

const renderPage = (content: Object, id: string) => {
  const element: ?Element = document.getElementById(id);

  if (element) {
    ReactDOM.render(content, element);
  } else {
    logException(`Fatal error trying to render a page. id:${id}`);
  }
};

export {
  renderPage,
};
