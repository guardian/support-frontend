// @flow

// ----- Imports ----- //
import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { renderPage } from 'helpers/render';
import './ausMomentMap.scss';
import { Header } from 'pages/aus-moment-map/components/header';
import { Map } from 'pages/aus-moment-map/components/map';
import { Blurb } from 'pages/aus-moment-map/components/blurb';
import { CloseButton } from 'pages/aus-moment-map/components/closeButton';
import { TestimonialsCollection } from 'pages/aus-moment-map/types/testimonials';
import { TestimonialsContainer } from './components/testimonialsContainer';
import { useWindowWidth } from './hooks/useWindowWidth';

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

const territories = [
  'ACT',
  'NSW',
  'NT',
  'QLD',
  'SA',
  'TAS',
  'VIC',
  'WA'
];

// ----- Render ----- //
const AusMomentMap = () => {
  const [selectedTerritory, setSelectedTerritory] = React.useState(null);
  const [shouldScrollIntoView, setShouldScrollIntoView] = React.useState(false);
  const testimonials = useTestimonials();
  // $FlowIgnore
  const { windowWidthIsGreaterThan, windowWidthIsLessThan } = useWindowWidth();

  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        resetToInitial()
      }

      // TODO - hint
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        if (selectedTerritory) {
          const index = (territories.indexOf(selectedTerritory) + 1) % territories.length;
          setSelectedTerritory(territories[index]);
        } else {
          setSelectedTerritory(territories[0])
        }
        setShouldScrollIntoView(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedTerritory]);

  const mapControls = useAnimation();
  const testimonialsControls = useAnimation();
  const blurbControls = useAnimation();

  const mapVariants = {
    initial: { width: '55%' },
    active: { width: '40%' },
  };

  const testimonialsVariants = {
    initial: { x: '59vw' },
    active: { x: '-59vw' },
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

    if (isPartOfMap) {
      runAnimation('active');
    }
  };

  return (
    // $FlowIgnore - keyup event is handled in an effect hook
    <div className="map-page" onClick={handleClick}>
      <Header />
      <div className="main">
        <motion.div
          className="left"
          animate={mapControls}
          variants={mapVariants}
          transition={{ type: 'tween', duration: 0.2 }}
          positionTransition
        >
          <Map
            selectedTerritory={selectedTerritory}
            setSelectedTerritory={(territory) => {
              setSelectedTerritory(territory);
              setShouldScrollIntoView(true);
            }}
          />
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
            <CloseButton onClick={resetToInitial} />
            <TestimonialsContainer
              testimonialsCollection={testimonials}
              selectedTerritory={selectedTerritory}
              shouldScrollIntoView={shouldScrollIntoView}
              setSelectedTerritory={(territory) => {
                setSelectedTerritory(territory);
                setShouldScrollIntoView(false);
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

renderPage(<AusMomentMap />, 'aus-moment-map');

export { AusMomentMap };
