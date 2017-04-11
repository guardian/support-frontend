// ----- Imports ----- //

import React from 'react';

// ----- Component ----- //

const CtaLink = props => (
  <a className="component-cta-circle" href={props.url}>
    {props.text}
  </a>
);

// ----- Proptypes ----- //

CtaLink.propTypes = {
  text: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired,
};

// ----- Exports ----- //

export default CtaLink;
