// @flow

// ----- Imports ----- //
import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { renderPage } from 'helpers/render';
import './ausMomentMap.scss';
import { Header } from 'pages/aus-moment-map/components/header';
import { Map } from 'pages/aus-moment-map/components/map';
import { SocialLinks } from 'pages/aus-moment-map/components/social-links';
import { Blurb } from 'pages/aus-moment-map/components/blurb';
import { CloseButton } from 'pages/aus-moment-map/components/closeButton';
import { TestimonialsCollection } from 'pages/aus-moment-map/types/testimonials';
import useTestimonials from 'pages/aus-moment-map/hooks/useTestimonials';

// ----- Render ----- //
const AusMomentMap = () => {
  const [selectedTerritory, setSelectedTerritory] = React.useState(null);
  const testimonials = useTestimonials();

  console.log(testimonials);

  const mapControls = useAnimation();
  const testimonialsControls = useAnimation();
  const blurbControls = useAnimation();

  const mapVariants = {
    initial: { width: '55%' },
    active: { width: '40%' },
  };

  const testimonialsVariants = {
    initial: { x: '58vw' },
    active: { x: '-58vw' },
  };

  const blurbVariants = {
    initial: { display: 'none' },
    active: { display: 'block' },
  };

  const runAnimation = (variant) => {
    testimonialsControls.start(variant);
    mapControls.start(variant);
    blurbControls.start(variant);
  };

  const resetToInitial = () => {
    document.querySelectorAll('.selected').forEach(t => t.classList.remove('selected'));
    runAnimation('initial');
    setSelectedTerritory(null);
  };

  const handleClick = (e) => {
    const elementClassList = e.target.classList;
    const isPartOfMap = elementClassList.contains('map') || elementClassList.contains('label');
    const isWhitespace = elementClassList.contains('main');

    if (isPartOfMap) {
      const selectedTerritory = e.target.getAttribute('data-territory');
      setSelectedTerritory(selectedTerritory);
      runAnimation('active');
    } else if (isWhitespace) {
      resetToInitial();
    }
  };

  const handleCloseButtonClick = () => {
    resetToInitial();
  };

  return (
    <div onClick={handleClick}>
      <Header />
      <div className="main">
        <motion.div
          className="left"
          animate={mapControls}
          variants={mapVariants}
          transition={{ type: 'tween', duration: 0.2 }}
          positionTransition
        >
          <Map />
          <p className="map-caption">Tap the map to read messages from supporters</p>
          <motion.div className="left-padded-inner" animate={blurbControls} variants={blurbVariants}>
            <Blurb slim />
          </motion.div>
        </motion.div>
        <div className="right">
          <Blurb slim={false} />
          <motion.div
            className="testimonials-overlay"
            animate={testimonialsControls}
            variants={testimonialsVariants}
            transition={{ type: 'tween', duration: 0.2 }}
            positionTransition
          >
            <CloseButton onClick={handleCloseButtonClick} />
            <h2 className="blurb">
              <span className="selected-territory">{selectedTerritory}</span>
              <br />
              Why do you support Guardian&nbsp;Australia?
            </h2>
            <div className="testimonials-wrapper" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

renderPage(<AusMomentMap />, 'aus-moment-map');

export { AusMomentMap };
