// ----- Imports ----- //

import React from 'react';
import SVG from 'components/svg/svg';

// ----- Component ----- //

const CtaCircle = props => (
  <a className="component-cta-circle" href={props.url}>
    <button><SVG svgName="arrow-right-straight" /></button>
    <span>{props.text}</span>
  </a>
);

// ----- Proptypes ----- //

CtaCircle.propTypes = {
  text: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired,
};

// ----- Exports ----- //

export default CtaCircle;
