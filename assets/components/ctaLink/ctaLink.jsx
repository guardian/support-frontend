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

export default function CtaLink(props: PropTypes) {

  return (
    <a className="component-cta-link" href={props.url}>
      <span>{props.text}</span>
      <Svg svgName="arrow-right-straight" />
    </a>
  );

}
