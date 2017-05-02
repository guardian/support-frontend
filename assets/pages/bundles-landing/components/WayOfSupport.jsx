// @flow

// ----- Imports ----- //

import React from 'react';

import CtaCircle from 'components/ctaCircle/ctaCircle';
import InfoText from 'components/infoText/infoText';

// ----- Types ----- //

type PropTypes = {
  heading: string,
  infoText: string,
  ctaText: string,
  ctaLink: string,
  modifierClass: ?string,
  ctaModifierClass: ?string,
};


// ----- Component ----- //

const WayOfSupport = (props: PropTypes) => {

  const className = 'way-of-support';
  let rootClassName = className;

  if (props.modifierClass) {
    rootClassName = `${className} ${className}--${props.modifierClass}`;
  }

  return (
    <div className={rootClassName}>
      <img src="https://placehold.it/300x170" alt="Example" />
      <h1 className={`${className}__heading`}>{ props.heading }</h1>
      <InfoText text={props.infoText} />
      <CtaCircle text={props.ctaText} modifierClass={props.ctaModifierClass} url={props.ctaLink} />
    </div>
  );
};


// ----- Proptypes ----- //

WayOfSupport.defaultProps = {
  infoText: '',
  modifierClass: '',
  ctaModifierClass: '',
};


// ----- Exports ----- //

export default WayOfSupport;
