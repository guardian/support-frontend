// @flow

// ----- Imports ----- //
import React from 'react';
import { renderPage } from 'helpers/render';
import './ausMomentMap.scss';
import { Header } from 'pages/aus-moment-map/components/header';
import { Map } from 'pages/aus-moment-map/components/map';

// ----- Render ----- //

const content = (
  <div>
    <Header />
    <Map />
  </div>
);

renderPage(content, 'aus-moment-map');

export { content };
