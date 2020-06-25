// @flow
import { renderToString } from 'react-dom/server';
import { content as showcase } from 'pages/showcase/showcase';
import { AusMomentMap } from 'pages/aus-moment-map/ausMomentMap';
import { EmptyContributionsLandingPage } from 'pages/contributions-landing/EmptyContributionsLandingPage';

const render = content => renderToString(content);

export const pages = [
  {
    filename: 'showcase.html',
    html: render(showcase),
  },
  {
    filename: 'contributions-landing.html',
    html: render(EmptyContributionsLandingPage()),
  },
  {
    filename: 'aus-moment-map.html',
    html: render(AusMomentMap()),
  },
];
