// @flow

// ----- Imports ----- //

import React from 'react';

import CtaCircle from 'components/ctaCircle/ctaCircle';
import InfoText from 'components/infoText/infoText';
import SimpleHeading from 'components/simpleHeading/simpleHeading';


// ----- Types ----- //

type PropTypes = {
  heading: string,
  infoText: string,
  ctaText: string,
  ctaLink: string,
  modifierClass: ?string,
};


// ----- Component ----- //

const WayOfSupport = (props: PropTypes) => {

  let className = 'ways-of-support__way';

  if (props.modifierClass) {
    className = `${className} ${className}--${props.modifierClass}`;
  }

  return (
    <div className={className}>
      <img src="http://placehold.it/300x170" alt="Example" />
      <SimpleHeading heading={props.heading} />
      <InfoText text={props.infoText} />
      <CtaCircle text={props.ctaText} url={props.ctaLink} />
    </div>
  );
};


// ----- Proptypes ----- //

WayOfSupport.defaultProps = {
  infoText: '',
  modifierClass: '',
};


// ----- Exports ----- //

export default WayOfSupport;
