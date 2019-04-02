// @flow
import ReactDOMServer from 'react-dom/server';
import { content as showcase } from 'pages/showcase/showcase';
import { content as paper } from 'pages/paper-subscription-landing/paperSubscriptionLandingPage';

const render = content => ReactDOMServer.renderToString(content);

export const pages = [
  {
    filename: 'showcase.html',
    html: render(showcase),
  },
  {
    filename: 'paper-subscription-landing.html',
    html: render(paper),
  },
];

