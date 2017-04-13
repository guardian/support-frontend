// ----- Imports ----- //

import React from 'react';

import CtaCircle from 'components/ctaCircle/ctaCircle';
import InfoText from 'components/infoText/infoText';
import SimpleHeading from 'components/simpleHeading/simpleHeading';


// ----- Component ----- //

const WayOfSupport = props => {

  let className = 'ways-of-support__way';

  if (props.modifierClass) {
    className = `${className} ${className}--${props.modifierClass}`;
  }

  return (
    <div className={className}>
      <img src="http://placehold.it/300x170"/>
      <SimpleHeading heading={props.heading}/>
      <InfoText text={props.infoText}/>
      <CtaCircle text={props.ctaText} url={props.ctaLink}/>
    </div>
  );
}


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
