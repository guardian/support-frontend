// @flow

// ----- Imports ----- //
// $FlowIgnore
import * as React from 'preact/compat';
import { motion } from 'framer-motion';
import { renderPage } from 'helpers/render';
import './ausMomentMap.scss';
import { Header } from 'pages/aus-moment-map/components/header';
import { Map } from 'pages/aus-moment-map/components/map';
import { Blurb } from 'pages/aus-moment-map/components/blurb';
import { CloseButton } from 'pages/aus-moment-map/components/closeButton';
import { type TestimonialsCollection } from 'pages/aus-moment-map/types/testimonials';
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
  'NSW',
  'ACT',
  'NT',
  'QLD',
  'SA',
  'TAS',
  'VIC',
  'WA',
];

// ----- Render ----- //
const AusMomentMap = () => {
  const [selectedTerritory, setSelectedTerritory] = React.useState(null);
  const [shouldScrollIntoView, setShouldScrollIntoView] = React.useState(false);
  const testimonials = useTestimonials();
  const { windowWidthIsGreaterThan } = useWindowWidth();

  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedTerritory(null);
      }

      // TODO - hint
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        if (selectedTerritory) {
          const index = (territories.indexOf(selectedTerritory) + 1) % territories.length;
          setSelectedTerritory(territories[index]);
        } else {
          setSelectedTerritory(territories[0]);
        }
        setShouldScrollIntoView(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedTerritory]);

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

  const animationVariant = () =>
    ((windowWidthIsGreaterThan('desktop') && selectedTerritory) ? 'active' : 'initial');

  return (
    <div className="map-page">
      <Header />
      <div className="main">
        <motion.div
          className="left"
          variants={mapVariants}
          animate={animationVariant()}
          initial="initial"
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
          <motion.div
            className="left-padded-inner"
            transition={{ type: 'tween', duration: 0.2 }}
            animate={animationVariant()}
            initial="initial"
            variants={blurbVariants}
          >
            <Blurb slim />
          </motion.div>
        </motion.div>
        <div className="right">
          <Blurb slim={false} />
          <motion.div
            className="testimonials-overlay"
            animate={animationVariant()}
            initial="initial"
            variants={testimonialsVariants}
            transition={{ type: 'tween', duration: 0.2 }}
            positionTransition
          >
            <CloseButton onClick={() => setSelectedTerritory(null)} />
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
