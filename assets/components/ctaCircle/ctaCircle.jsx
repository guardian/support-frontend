// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';


// ----- Types ----- //

type PropTypes = {
  text: string,
  url: string,
};


// ----- Component ----- //

const CtaCircle = (props: PropTypes) => (
  <a className="component-cta-circle" href={props.url}>
    <button><Svg svgName="arrow-right-straight" /></button>
    <span>{props.text}</span>
  </a>
);


// ----- Exports ----- //

export default CtaCircle;
