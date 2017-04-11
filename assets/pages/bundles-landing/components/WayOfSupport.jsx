// ----- Imports ----- //

import React from 'react';

import SimpleHeading from 'components/simpleHeading/simpleHeading';
import InfoText from 'components/infoText/infoText';
import CtaCircle from 'components/ctaCircle/ctaCircle';


// ----- Component ----- //

const WayOfSupport = props => (

  <div className="ways-of-support__way">
    <SimpleHeading heading={props.heading} />
    <InfoText text={props.infoText} />
    <CtaCircle text={props.ctaText} url={props.ctaLink} />
  </div>
);


// ----- Proptypes ----- //

WayOfSupport.defaultProps = {
  infoText: '',
};

WayOfSupport.propTypes = {
  heading: React.PropTypes.string.isRequired,
  infoText: React.PropTypes.string,
  ctaText: React.PropTypes.string.isRequired,
  ctaLink: React.PropTypes.string.isRequired,
};

// ----- Exports ----- //

export default WayOfSupport;
