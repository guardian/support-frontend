// @flow

import ReactDOM from 'react-dom';

const renderPage = (content: Object, id: string) => {
  const element: ?Element = document.getElementById(id);

  if (element) {
    ReactDOM.render(content, element);
  }
};

export {
  renderPage,
};
