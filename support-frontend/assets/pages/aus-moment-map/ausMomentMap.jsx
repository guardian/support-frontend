// @flow

// ----- Imports ----- //
import React from 'react';
import { renderPage } from 'helpers/render';
import './ausMomentMap.scss';
import { Header } from 'pages/aus-moment-map/components/header';
import { Map } from 'pages/aus-moment-map/components/map';
import { SocialLinks } from 'pages/aus-moment-map/components/footer';

// ----- Render ----- //

const content = (
  <div>
    <Header />
    <div className="main">
      <div className="left">
        <Map />
        <p className="map-caption">Tap the map to read messages from supporters</p>
      </div>
      <div className="right">
        <h2 className="blurb">Hear from Guardian supporters across Australia</h2>
        <p className="blurb">
          Our supporters are doing something powerful. As our readership grows, more people are supporting Guardian
          journalism than ever before. But what drives this support? We asked readers across every state to share their
          reasons with us – and here is a selection. You can become a supporter this winter and add to the conversation.
        </p>
        <p className="supporters-total">123,895</p>
        <p className="supporters-total-caption">Total supporters in Australia</p>
      </div>
    </div>
    <SocialLinks />
  </div>
);

renderPage(content, 'aus-moment-map');

export { content };
