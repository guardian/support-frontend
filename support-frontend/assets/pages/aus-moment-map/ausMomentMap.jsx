// @flow

// ----- Imports ----- //
import React from 'react'
import { motion } from 'framer-motion';
import { renderPage } from 'helpers/render';
import './ausMomentMap.scss';
import { Header } from 'pages/aus-moment-map/components/header';
import { Map } from 'pages/aus-moment-map/components/map';
import { SocialLinks } from 'pages/aus-moment-map/components/social-links';
import { Testimonials } from 'pages/aus-moment-map/components/testimonials';

// ----- Render ----- //
const AusMomentMap = () => {
  return (
    <div>
      <Header />
      <div className="main">
        <div className="left">
          <Map />
          <p className="map-caption">Tap the map to read messages from supporters</p>
        </div>
          <div className="right">
          <Testimonials />
        </div>
      </div>
      <SocialLinks />
    </div>
  )
};

renderPage(AusMomentMap(), 'aus-moment-map');

export { AusMomentMap };
