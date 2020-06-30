// @flow

// ----- Imports ----- //
import React from 'react'
import { motion, useAnimation } from 'framer-motion';
import { renderPage } from 'helpers/render';
import './ausMomentMap.scss';
import { Header } from 'pages/aus-moment-map/components/header';
import { Map } from 'pages/aus-moment-map/components/map';
import { SocialLinks } from 'pages/aus-moment-map/components/social-links';
import { Testimonials } from 'pages/aus-moment-map/components/testimonials';

// ----- Render ----- //
const AusMomentMap = () => {
  const mapControls = useAnimation()
  const runAnimation = () => {
    mapControls.start({width: '40%'})
  }

  const handleClick = (e) => {
    const elementClassList = e.target.classList
    elementClassList.contains('map') || elementClassList.contains('label') ? runAnimation() : null
  }

  return (
    <div onClick={handleClick}>
      <Header />
      <div className="main">
        <motion.div className="left" animate={mapControls} positionTransition>
          <Map />
          <p className="map-caption">Tap the map to read messages from supporters</p>
        </motion.div>
        <div className="right">
          <Testimonials />
          <SocialLinks />
        </div>
      </div>
    </div>
  )
};

renderPage(<AusMomentMap />, 'aus-moment-map');

export { AusMomentMap };
