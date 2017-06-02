// @flow

// ----- Imports ----- //

import React from 'react';

import CtaCircle from 'components/ctaCircle/ctaCircle';
import GridImage from 'components/gridImage/gridImage';

// ----- Types ----- //

type PropTypes = {
  heading: string,
  infoText: string,
  ctaText: string,
  onClick: () => void,
  modifierClass: ?string,
  gridImg: string,
  imgAlt: ?string,
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
      <GridImage
        gridId={props.gridImg}
        srcSizes={[1000, 500, 140]}
        sizes="(max-width: 480px) 100vw, (max-width: 740px) 210px, (max-width: 980px) 220px, 300px"
        altText={props.imgAlt}
      />
      <h1 className={`${className}__heading`}>{props.heading}</h1>
      <p className={`${className}__info-text`}>{props.infoText}</p>
      <CtaCircle text={props.ctaText} modifierClass={props.modifierClass} onClick={props.onClick} />
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
