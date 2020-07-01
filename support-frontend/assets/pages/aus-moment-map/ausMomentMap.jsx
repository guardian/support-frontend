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
import { CloseButton } from 'pages/aus-moment-map/components/closeButton';

// ----- Render ----- //
const AusMomentMap = () => {
  const [selectedTerritory, setSelectedTerritory] = React.useState(null)

  const mapControls = useAnimation()
  const testimonialsControls = useAnimation()

  const mapVariants = {
    initial: {width: '55%'},
    active: {width: '40%'}
  }

  const testimonialsVariants = {
    initial: {x: "57.5vw"},
    active: {x: "-57.5vw"}
  }

  const runAnimation = (variant) => {
    testimonialsControls.start(variant)
    mapControls.start(variant)
  }

  const resetToInitial = () => {
    document.querySelectorAll('.selected').forEach(t => t.classList.remove('selected'));
    runAnimation('initial')
  }

  const handleClick = (e) => {
    const elementClassList = e.target.classList
    const isMap = elementClassList.contains('map') || elementClassList.contains('label')
    const isMain = elementClassList.contains('main')

    if (isMap) {
      runAnimation('active')
    } else if (isMain) {
      resetToInitial()
    }
  }

  const handleCloseButtonClick = () => {
    resetToInitial()
  }

  return (
    <div onClick={handleClick}>
      <Header />
      <div className="main">
        <motion.div
          className="left"
          animate={mapControls}
          variants={mapVariants}
          transition={{type: "tween", duration: .2}}
          positionTransition
        >
          <Map />
          <p className="map-caption">Tap the map to read messages from supporters</p>
        </motion.div>
        <div className="right">
          <Testimonials />
          <SocialLinks />
          <motion.div
            className="testimonials-overlay"
            animate={testimonialsControls}
            variants={testimonialsVariants}
            transition={{type: "tween", duration: .2}}
            positionTransition
          >
            <CloseButton onClick={handleCloseButtonClick}/>
          </motion.div>
        </div>
      </div>
    </div>
  )
};

renderPage(<AusMomentMap />, 'aus-moment-map');

export { AusMomentMap };
