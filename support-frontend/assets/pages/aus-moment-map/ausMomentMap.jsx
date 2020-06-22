// @flow

// ----- Imports ----- //
import React from 'react';
import { renderPage } from 'helpers/render';
import './ausMomentMap.scss';
import { Header } from 'pages/aus-moment-map/components/header';
import { Map } from 'pages/aus-moment-map/components/map';
import { Footer } from 'pages/aus-moment-map/components/footer';

// ----- Render ----- //

const content = (
  <div>
    <Header />
    <Map />
    <Footer />
  </div>
);

renderPage(content, 'aus-moment-map');

export { content };
