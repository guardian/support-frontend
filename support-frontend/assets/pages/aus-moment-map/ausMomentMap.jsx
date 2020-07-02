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
import {Testimonials} from "./components/testimonials";

// ----- Custom hooks ----- //

const useTestimonials = () => {
  const [testimonials, setTestimonials] = React.useState<TestimonialsCollection>(null);
  const testimonialsEndpoint = 'https://interactive.guim.co.uk/docsdata/18tKS4fsHcEo__gdAwp3UySA3-FVje72_adHBZBhWjXE.json';

  React.useEffect(() => {
    fetch(testimonialsEndpoint)
      .then(response => response.json())
      .then(data => data.sheets)
      .then(testimonialsData => setTestimonials(testimonialsData));
  }, []);

  return testimonials;
};

const useWindowWidth = () => {
  function getWindowWidth() {
    return window.innerWidth;
  }

  const [windowWidth, setWindowWidth] = React.useState(getWindowWidth);

  React.useEffect(() => {
    function handleResize() {
      setWindowWidth(getWindowWidth());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
}

// ----- Render ----- //
const AusMomentMap = () => {
  const [selectedTerritory, setSelectedTerritory] = React.useState(null);
  const testimonials = useTestimonials();
  const windowWidth = useWindowWidth();
  const breakpoints = {
    mobile: 320,
    mobileMedium: 375,
    mobileLandscape: 480,
    phablet: 660,
    tablet: 740,
    desktop: 980,
    leftCol: 1140,
    wide: 1300
  }
  const windowWidthIsGreaterThan = (breakpoint) => {
    return windowWidth >= breakpoints[breakpoint]
  }
  const windowWidthIsLessThan = (breakpoint) => {
    return windowWidth < breakpoints[breakpoint]
  }

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
    if (windowWidthIsGreaterThan('desktop')) {
      testimonialsControls.start(variant);
      mapControls.start(variant);
      blurbControls.start(variant);
    }
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
            <Testimonials testimonialsCollection={testimonials} selectedTerritory={selectedTerritory} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

renderPage(<AusMomentMap />, 'aus-moment-map');

export { AusMomentMap };
