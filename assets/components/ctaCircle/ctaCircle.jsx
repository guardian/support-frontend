// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';


// ----- Types ----- //

type PropTypes = {
  text: string,
  url: string,
  modifierClass: ?string,
};


// ----- Component ----- //


const CtaCircle = (props: PropTypes) => {
  let className = 'component-cta-circle';

  if (props.modifierClass) {
    className = `${className} ${className}--${props.modifierClass}`;
  }
  return (
    <a className={className} href={props.url}>
      <button><Svg svgName="arrow-right-straight" /></button>
      <span>{props.text}</span>
    </a>
  );
};


CtaCircle.defaultProps = {
  modifierClass: '',
};


// ----- Exports ----- //

export default CtaCircle;
