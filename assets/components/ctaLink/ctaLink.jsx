// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type PropTypes = {
  text: string,
  url: string,
};


// ----- Component ----- //

export default function CtaLink(props: PropTypes) {

  return (
    <a className="component-cta-link" href={props.url}>
      {props.text}
    </a>
  );

}
